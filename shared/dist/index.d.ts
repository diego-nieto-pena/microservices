export * from './types/events';
export * from './types/domain';
export * from './utils/event-builder';
export * from './utils/logger';
export * from './kafka/producer';
export * from './kafka/consumer';
export declare const KAFKA_TOPICS: {
    readonly ORDER_EVENTS: "order-events";
    readonly RISK_EVENTS: "risk-events";
    readonly INVENTORY_EVENTS: "inventory-events";
    readonly PAYMENT_EVENTS: "payment-events";
};
export declare const SAGA_STATES: {
    readonly PENDING: "PENDING";
    readonly PROCESSING: "PROCESSING";
    readonly COMPLETED: "COMPLETED";
    readonly CANCELLED: "CANCELLED";
    readonly FAILED: "FAILED";
};
export declare const ORDER_STATUS: {
    readonly PENDING: "PENDING";
    readonly PROCESSING: "PROCESSING";
    readonly COMPLETED: "COMPLETED";
    readonly CANCELLED: "CANCELLED";
    readonly FAILED: "FAILED";
};
export declare const RISK_LEVELS: {
    readonly LOW: "LOW";
    readonly MEDIUM: "MEDIUM";
    readonly HIGH: "HIGH";
};
export declare const PAYMENT_STATUS: {
    readonly PENDING: "PENDING";
    readonly PROCESSING: "PROCESSING";
    readonly COMPLETED: "COMPLETED";
    readonly FAILED: "FAILED";
    readonly REFUNDED: "REFUNDED";
};
//# sourceMappingURL=index.d.ts.map