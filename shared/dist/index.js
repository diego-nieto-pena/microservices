"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAYMENT_STATUS = exports.RISK_LEVELS = exports.ORDER_STATUS = exports.SAGA_STATES = exports.KAFKA_TOPICS = void 0;
// Types
__exportStar(require("./types/events"), exports);
__exportStar(require("./types/domain"), exports);
// Utils
__exportStar(require("./utils/event-builder"), exports);
__exportStar(require("./utils/logger"), exports);
// Kafka
__exportStar(require("./kafka/producer"), exports);
__exportStar(require("./kafka/consumer"), exports);
// Constants
exports.KAFKA_TOPICS = {
    ORDER_EVENTS: 'order-events',
    RISK_EVENTS: 'risk-events',
    INVENTORY_EVENTS: 'inventory-events',
    PAYMENT_EVENTS: 'payment-events',
};
exports.SAGA_STATES = {
    PENDING: 'PENDING',
    PROCESSING: 'PROCESSING',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
    FAILED: 'FAILED',
};
exports.ORDER_STATUS = {
    PENDING: 'PENDING',
    PROCESSING: 'PROCESSING',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
    FAILED: 'FAILED',
};
exports.RISK_LEVELS = {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
};
exports.PAYMENT_STATUS = {
    PENDING: 'PENDING',
    PROCESSING: 'PROCESSING',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED',
    REFUNDED: 'REFUNDED',
};
//# sourceMappingURL=index.js.map