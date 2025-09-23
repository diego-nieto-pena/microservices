"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaConsumer = void 0;
const events_1 = require("../types/events");
class KafkaConsumer {
    consumer;
    kafka;
    handlers = new Map();
    constructor(kafka, groupId) {
        this.kafka = kafka;
        this.consumer = kafka.consumer({ groupId });
    }
    async connect() {
        await this.consumer.connect();
    }
    async disconnect() {
        await this.consumer.disconnect();
    }
    subscribe(topic) {
        return this.consumer.subscribe({ topic, fromBeginning: false });
    }
    onEvent(eventType, handler) {
        if (!this.handlers.has(eventType)) {
            this.handlers.set(eventType, []);
        }
        this.handlers.get(eventType).push(handler);
    }
    async run() {
        await this.consumer.run({
            eachMessage: async (payload) => {
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
                    const eventSchema = events_1.AllEventSchemas.find(schema => schema.shape.eventType.value === eventType);
                    if (!eventSchema) {
                        console.warn(`Unknown event type: ${eventType}`);
                        return;
                    }
                    const validatedEvent = eventSchema.parse(eventData);
                    const handlers = this.handlers.get(eventType) || [];
                    // Execute all handlers for this event type
                    await Promise.all(handlers.map(handler => handler(validatedEvent).catch(error => {
                        console.error(`Error handling event ${eventType}:`, error);
                    })));
                }
                catch (error) {
                    console.error('Error processing message:', error);
                }
            },
        });
    }
}
exports.KafkaConsumer = KafkaConsumer;
//# sourceMappingURL=consumer.js.map