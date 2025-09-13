import { v4 as uuidv4 } from 'uuid';
import { BaseEvent, SagaEvent } from '../types/events';

export class EventBuilder {
  private event: Partial<BaseEvent> = {};

  constructor() {
    this.event.eventId = uuidv4();
    this.event.timestamp = new Date();
    this.event.sagaId = uuidv4();
    this.event.correlationId = uuidv4();
  }

  static create(): EventBuilder {
    return new EventBuilder();
  }

  withEventType(eventType: string): EventBuilder {
    this.event.eventType = eventType;
    return this;
  }

  withSagaId(sagaId: string): EventBuilder {
    this.event.sagaId = sagaId;
    return this;
  }

  withCorrelationId(correlationId: string): EventBuilder {
    this.event.correlationId = correlationId;
    return this;
  }

  withData(data: Record<string, any>): EventBuilder {
    this.event.data = data;
    return this;
  }

  build(): SagaEvent {
    if (!this.event.eventType) {
      throw new Error('Event type is required');
    }
    if (!this.event.data) {
      throw new Error('Event data is required');
    }

    return this.event as SagaEvent;
  }
}

export function createEvent(
  eventType: string,
  data: Record<string, any>,
  sagaId?: string,
  correlationId?: string
): SagaEvent {
  const builder = EventBuilder.create()
    .withEventType(eventType)
    .withData(data);

  if (sagaId) {
    builder.withSagaId(sagaId);
  }

  if (correlationId) {
    builder.withCorrelationId(correlationId);
  }

  return builder.build();
}
