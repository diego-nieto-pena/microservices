import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { SagaEvent, AllEventSchemas } from '../types/events';

export type EventHandler = (event: SagaEvent) => Promise<void>;

export class KafkaConsumer {
  private consumer: Consumer;
  private kafka: Kafka;
  private handlers: Map<string, EventHandler[]> = new Map();

  constructor(kafka: Kafka, groupId: string) {
    this.kafka = kafka;
    this.consumer = kafka.consumer({ groupId });
  }

  async connect(): Promise<void> {
    await this.consumer.connect();
  }

  async disconnect(): Promise<void> {
    await this.consumer.disconnect();
  }

  subscribe(topic: string): Promise<void> {
    return this.consumer.subscribe({ topic, fromBeginning: false });
  }

  onEvent(eventType: string, handler: EventHandler): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)!.push(handler);
  }

  async run(): Promise<void> {
    await this.consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        try {
          const message = payload.message;
          if (!message.value) {
            console.warn('Received message with no value');
            return;
          }

          const eventData = JSON.parse(message.value.toString());
          const eventType = message.headers?.eventType?.toString();

          if (!eventType) {
            console.warn('Received message with no event type');
            return;
          }

          // Validate event against schemas
          const eventSchema = AllEventSchemas.find(schema => 
            schema.shape.eventType.value === eventType
          );

          if (!eventSchema) {
            console.warn(`Unknown event type: ${eventType}`);
            return;
          }

          const validatedEvent = eventSchema.parse(eventData);
          const handlers = this.handlers.get(eventType) || [];

          // Execute all handlers for this event type
          await Promise.all(
            handlers.map(handler => 
              handler(validatedEvent).catch(error => {
                console.error(`Error handling event ${eventType}:`, error);
              })
            )
          );
        } catch (error) {
          console.error('Error processing message:', error);
        }
      },
    });
  }
}
