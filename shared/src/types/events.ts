import { z } from 'zod';

// Base Event Schema
export const BaseEventSchema = z.object({
  eventId: z.string().uuid(),
  eventType: z.string(),
  timestamp: z.date(),
  sagaId: z.string().uuid(),
  correlationId: z.string().uuid(),
  data: z.record(z.any()),
});

export type BaseEvent = z.infer<typeof BaseEventSchema>;

// Order Events
export const OrderCreatedEventSchema = BaseEventSchema.extend({
  eventType: z.literal('OrderCreated'),
  data: z.object({
    orderId: z.string().uuid(),
    customerId: z.string(),
    items: z.array(z.object({
      productId: z.string(),
      quantity: z.number().positive(),
      price: z.number().positive(),
    })),
    totalAmount: z.number().positive(),
  }),
});

export const OrderCompletedEventSchema = BaseEventSchema.extend({
  eventType: z.literal('OrderCompleted'),
  data: z.object({
    orderId: z.string().uuid(),
    customerId: z.string(),
    totalAmount: z.number().positive(),
  }),
});

export const OrderCancelledEventSchema = BaseEventSchema.extend({
  eventType: z.literal('OrderCancelled'),
  data: z.object({
    orderId: z.string().uuid(),
    customerId: z.string(),
    reason: z.string(),
  }),
});

// Risk Events
export const RiskApprovedEventSchema = BaseEventSchema.extend({
  eventType: z.literal('RiskApproved'),
  data: z.object({
    orderId: z.string().uuid(),
    customerId: z.string(),
    creditScore: z.number(),
    approvedAmount: z.number().positive(),
  }),
});

export const RiskRejectedEventSchema = BaseEventSchema.extend({
  eventType: z.literal('RiskRejected'),
  data: z.object({
    orderId: z.string().uuid(),
    customerId: z.string(),
    reason: z.string(),
    creditScore: z.number(),
  }),
});

// Inventory Events
export const InventoryReservedEventSchema = BaseEventSchema.extend({
  eventType: z.literal('InventoryReserved'),
  data: z.object({
    orderId: z.string().uuid(),
    items: z.array(z.object({
      productId: z.string(),
      quantity: z.number().positive(),
      reservedAt: z.date(),
    })),
  }),
});

export const InventoryReleasedEventSchema = BaseEventSchema.extend({
  eventType: z.literal('InventoryReleased'),
  data: z.object({
    orderId: z.string().uuid(),
    items: z.array(z.object({
      productId: z.string(),
      quantity: z.number().positive(),
      releasedAt: z.date(),
    })),
  }),
});

export const InventoryInsufficientEventSchema = BaseEventSchema.extend({
  eventType: z.literal('InventoryInsufficient'),
  data: z.object({
    orderId: z.string().uuid(),
    items: z.array(z.object({
      productId: z.string(),
      requestedQuantity: z.number().positive(),
      availableQuantity: z.number(),
    })),
  }),
});

// Payment Events
export const PaymentProcessedEventSchema = BaseEventSchema.extend({
  eventType: z.literal('PaymentProcessed'),
  data: z.object({
    orderId: z.string().uuid(),
    customerId: z.string(),
    amount: z.number().positive(),
    paymentMethod: z.string(),
    transactionId: z.string(),
  }),
});

export const PaymentFailedEventSchema = BaseEventSchema.extend({
  eventType: z.literal('PaymentFailed'),
  data: z.object({
    orderId: z.string().uuid(),
    customerId: z.string(),
    amount: z.number().positive(),
    reason: z.string(),
  }),
});

export const PaymentRefundedEventSchema = BaseEventSchema.extend({
  eventType: z.literal('PaymentRefunded'),
  data: z.object({
    orderId: z.string().uuid(),
    customerId: z.string(),
    amount: z.number().positive(),
    transactionId: z.string(),
  }),
});

// Union type for all events
export const AllEventSchemas = [
  OrderCreatedEventSchema,
  OrderCompletedEventSchema,
  OrderCancelledEventSchema,
  RiskApprovedEventSchema,
  RiskRejectedEventSchema,
  InventoryReservedEventSchema,
  InventoryReleasedEventSchema,
  InventoryInsufficientEventSchema,
  PaymentProcessedEventSchema,
  PaymentFailedEventSchema,
  PaymentRefundedEventSchema,
] as const;

export type OrderCreatedEvent = z.infer<typeof OrderCreatedEventSchema>;
export type OrderCompletedEvent = z.infer<typeof OrderCompletedEventSchema>;
export type OrderCancelledEvent = z.infer<typeof OrderCancelledEventSchema>;
export type RiskApprovedEvent = z.infer<typeof RiskApprovedEventSchema>;
export type RiskRejectedEvent = z.infer<typeof RiskRejectedEventSchema>;
export type InventoryReservedEvent = z.infer<typeof InventoryReservedEventSchema>;
export type InventoryReleasedEvent = z.infer<typeof InventoryReleasedEventSchema>;
export type InventoryInsufficientEvent = z.infer<typeof InventoryInsufficientEventSchema>;
export type PaymentProcessedEvent = z.infer<typeof PaymentProcessedEventSchema>;
export type PaymentFailedEvent = z.infer<typeof PaymentFailedEventSchema>;
export type PaymentRefundedEvent = z.infer<typeof PaymentRefundedEventSchema>;

export type SagaEvent = 
  | OrderCreatedEvent
  | OrderCompletedEvent
  | OrderCancelledEvent
  | RiskApprovedEvent
  | RiskRejectedEvent
  | InventoryReservedEvent
  | InventoryReleasedEvent
  | InventoryInsufficientEvent
  | PaymentProcessedEvent
  | PaymentFailedEvent
  | PaymentRefundedEvent;
