import { SagaEvent } from '../types/events';
export declare class EventBuilder {
    private event;
    constructor();
    static create(): EventBuilder;
    withEventType(eventType: string): EventBuilder;
    withSagaId(sagaId: string): EventBuilder;
    withCorrelationId(correlationId: string): EventBuilder;
    withData(data: Record<string, any>): EventBuilder;
    build(): SagaEvent;
}
export declare function createEvent(eventType: string, data: Record<string, any>, sagaId?: string, correlationId?: string): SagaEvent;
//# sourceMappingURL=event-builder.d.ts.map