import { Kafka } from 'kafkajs';
import { SagaEvent } from '../types/events';
export declare class KafkaProducer {
    private producer;
    private kafka;
    constructor(kafka: Kafka);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    publishEvent(topic: string, event: SagaEvent): Promise<void>;
    publishEvents(topic: string, events: SagaEvent[]): Promise<void>;
}
//# sourceMappingURL=producer.d.ts.map