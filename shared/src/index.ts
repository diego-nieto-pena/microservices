// Types
export * from './types/events';
export * from './types/domain';

// Utils
export * from './utils/event-builder';
export * from './utils/logger';

// Kafka
export * from './kafka/producer';
export * from './kafka/consumer';

// Constants
export const KAFKA_TOPICS = {
  ORDER_EVENTS: 'order-events',
  RISK_EVENTS: 'risk-events',
  INVENTORY_EVENTS: 'inventory-events',
  PAYMENT_EVENTS: 'payment-events',
} as const;

export const SAGA_STATES = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  FAILED: 'FAILED',
} as const;

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  FAILED: 'FAILED',
} as const;

export const RISK_LEVELS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
} as const;
