import { Kafka } from 'kafkajs';
import { SagaEvent } from '../types/events';
export type EventHandler = (event: SagaEvent) => Promise<void>;
export declare class KafkaConsumer {
    private consumer;
    private kafka;
    private handlers;
    constructor(kafka: Kafka, groupId: string);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    subscribe(topic: string): Promise<void>;
    onEvent(eventType: string, handler: EventHandler): void;
    run(): Promise<void>;
}
//# sourceMappingURL=consumer.d.ts.map