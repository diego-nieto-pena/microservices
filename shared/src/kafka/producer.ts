import { Kafka, Producer } from 'kafkajs';
import { SagaEvent } from '../types/events';

export class KafkaProducer {
  private producer: Producer;
  private kafka: Kafka;

  constructor(kafka: Kafka) {
    this.kafka = kafka;
    this.producer = kafka.producer();
  }

  async connect(): Promise<void> {
    await this.producer.connect();
  }

  async disconnect(): Promise<void> {
    await this.producer.disconnect();
  }

  async publishEvent(topic: string, event: SagaEvent): Promise<void> {
    try {
      await this.producer.send({
        topic,
        messages: [
          {
            key: event.sagaId,
            value: JSON.stringify(event),
            headers: {
              eventType: event.eventType,
              sagaId: event.sagaId,
              correlationId: event.correlationId,
            },
          },
        ],
      });
    } catch (error) {
      console.error(`Failed to publish event to topic ${topic}:`, error);
      throw error;
    }
  }

  async publishEvents(topic: string, events: SagaEvent[]): Promise<void> {
    try {
      await this.producer.send({
        topic,
        messages: events.map(event => ({
          key: event.sagaId,
          value: JSON.stringify(event),
          headers: {
            eventType: event.eventType,
            sagaId: event.sagaId,
            correlationId: event.correlationId,
          },
        })),
      });
    } catch (error) {
      console.error(`Failed to publish events to topic ${topic}:`, error);
      throw error;
    }
  }
}
