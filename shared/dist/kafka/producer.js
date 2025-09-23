"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaProducer = void 0;
class KafkaProducer {
    producer;
    kafka;
    constructor(kafka) {
        this.kafka = kafka;
        this.producer = kafka.producer();
    }
    async connect() {
        await this.producer.connect();
    }
    async disconnect() {
        await this.producer.disconnect();
    }
    async publishEvent(topic, event) {
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
        }
        catch (error) {
            console.error(`Failed to publish event to topic ${topic}:`, error);
            throw error;
        }
    }
    async publishEvents(topic, events) {
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
        }
        catch (error) {
            console.error(`Failed to publish events to topic ${topic}:`, error);
            throw error;
        }
    }
}
exports.KafkaProducer = KafkaProducer;
//# sourceMappingURL=producer.js.map