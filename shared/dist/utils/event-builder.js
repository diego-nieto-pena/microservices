"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventBuilder = void 0;
exports.createEvent = createEvent;
const uuid_1 = require("uuid");
class EventBuilder {
    event = {};
    constructor() {
        this.event.eventId = (0, uuid_1.v4)();
        this.event.timestamp = new Date();
        this.event.sagaId = (0, uuid_1.v4)();
        this.event.correlationId = (0, uuid_1.v4)();
    }
    static create() {
        return new EventBuilder();
    }
    withEventType(eventType) {
        this.event.eventType = eventType;
        return this;
    }
    withSagaId(sagaId) {
        this.event.sagaId = sagaId;
        return this;
    }
    withCorrelationId(correlationId) {
        this.event.correlationId = correlationId;
        return this;
    }
    withData(data) {
        this.event.data = data;
        return this;
    }
    build() {
        if (!this.event.eventType) {
            throw new Error('Event type is required');
        }
        if (!this.event.data) {
            throw new Error('Event data is required');
        }
        return this.event;
    }
}
exports.EventBuilder = EventBuilder;
function createEvent(eventType, data, sagaId, correlationId) {
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
//# sourceMappingURL=event-builder.js.map