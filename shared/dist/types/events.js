"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllEventSchemas = exports.PaymentRefundedEventSchema = exports.PaymentFailedEventSchema = exports.PaymentProcessedEventSchema = exports.InventoryInsufficientEventSchema = exports.InventoryReleasedEventSchema = exports.InventoryReservedEventSchema = exports.RiskRejectedEventSchema = exports.RiskApprovedEventSchema = exports.OrderCancelledEventSchema = exports.OrderCompletedEventSchema = exports.OrderCreatedEventSchema = exports.BaseEventSchema = void 0;
const zod_1 = require("zod");
// Base Event Schema
exports.BaseEventSchema = zod_1.z.object({
    eventId: zod_1.z.string().uuid(),
    eventType: zod_1.z.string(),
    timestamp: zod_1.z.coerce.date(), // Corrected: Coerce string to Date
    sagaId: zod_1.z.string().uuid(),
    correlationId: zod_1.z.string().uuid(),
    data: zod_1.z.record(zod_1.z.any()),
});
// Order Events
exports.OrderCreatedEventSchema = exports.BaseEventSchema.extend({
    eventType: zod_1.z.literal('OrderCreated'),
    data: zod_1.z.object({
        orderId: zod_1.z.string().uuid(),
        customerId: zod_1.z.string(),
        items: zod_1.z.array(zod_1.z.object({
            productId: zod_1.z.string(),
            quantity: zod_1.z.number().positive(),
            price: zod_1.z.number().positive(),
        })),
        totalAmount: zod_1.z.number().positive(),
    }),
});
exports.OrderCompletedEventSchema = exports.BaseEventSchema.extend({
    eventType: zod_1.z.literal('OrderCompleted'),
    data: zod_1.z.object({
        orderId: zod_1.z.string().uuid(),
        customerId: zod_1.z.string(),
        totalAmount: zod_1.z.number().positive(),
    }),
});
exports.OrderCancelledEventSchema = exports.BaseEventSchema.extend({
    eventType: zod_1.z.literal('OrderCancelled'),
    data: zod_1.z.object({
        orderId: zod_1.z.string().uuid(),
        customerId: zod_1.z.string(),
        reason: zod_1.z.string(),
    }),
});
// Risk Events
exports.RiskApprovedEventSchema = exports.BaseEventSchema.extend({
    eventType: zod_1.z.literal('RiskApproved'),
    data: zod_1.z.object({
        orderId: zod_1.z.string().uuid(),
        customerId: zod_1.z.string(),
        creditScore: zod_1.z.number(),
        approvedAmount: zod_1.z.number().positive(),
    }),
});
exports.RiskRejectedEventSchema = exports.BaseEventSchema.extend({
    eventType: zod_1.z.literal('RiskRejected'),
    data: zod_1.z.object({
        orderId: zod_1.z.string().uuid(),
        customerId: zod_1.z.string(),
        reason: zod_1.z.string(),
        creditScore: zod_1.z.number(),
    }),
});
// Inventory Events
exports.InventoryReservedEventSchema = exports.BaseEventSchema.extend({
    eventType: zod_1.z.literal('InventoryReserved'),
    data: zod_1.z.object({
        orderId: zod_1.z.string().uuid(),
        items: zod_1.z.array(zod_1.z.object({
            productId: zod_1.z.string(),
            quantity: zod_1.z.number().positive(),
            reservedAt: zod_1.z.coerce.date(), // Corrected: Coerce string to Date
        })),
    }),
});
exports.InventoryReleasedEventSchema = exports.BaseEventSchema.extend({
    eventType: zod_1.z.literal('InventoryReleased'),
    data: zod_1.z.object({
        orderId: zod_1.z.string().uuid(),
        items: zod_1.z.array(zod_1.z.object({
            productId: zod_1.z.string(),
            quantity: zod_1.z.number().positive(),
            releasedAt: zod_1.z.coerce.date(), // Corrected: Coerce string to Date
        })),
    }),
});
exports.InventoryInsufficientEventSchema = exports.BaseEventSchema.extend({
    eventType: zod_1.z.literal('InventoryInsufficient'),
    data: zod_1.z.object({
        orderId: zod_1.z.string().uuid(),
        items: zod_1.z.array(zod_1.z.object({
            productId: zod_1.z.string(),
            requestedQuantity: zod_1.z.number().positive(),
            availableQuantity: zod_1.z.number(),
        })),
    }),
});
// Payment Events
exports.PaymentProcessedEventSchema = exports.BaseEventSchema.extend({
    eventType: zod_1.z.literal('PaymentProcessed'),
    data: zod_1.z.object({
        orderId: zod_1.z.string().uuid(),
        customerId: zod_1.z.string(),
        amount: zod_1.z.number().positive(),
        paymentMethod: zod_1.z.string(),
        transactionId: zod_1.z.string(),
    }),
});
exports.PaymentFailedEventSchema = exports.BaseEventSchema.extend({
    eventType: zod_1.z.literal('PaymentFailed'),
    data: zod_1.z.object({
        orderId: zod_1.z.string().uuid(),
        customerId: zod_1.z.string(),
        amount: zod_1.z.number().positive(),
        reason: zod_1.z.string(),
    }),
});
exports.PaymentRefundedEventSchema = exports.BaseEventSchema.extend({
    eventType: zod_1.z.literal('PaymentRefunded'),
    data: zod_1.z.object({
        orderId: zod_1.z.string().uuid(),
        customerId: zod_1.z.string(),
        amount: zod_1.z.number().positive(),
        transactionId: zod_1.z.string(),
    }),
});
// Union type for all events
exports.AllEventSchemas = [
    exports.OrderCreatedEventSchema,
    exports.OrderCompletedEventSchema,
    exports.OrderCancelledEventSchema,
    exports.RiskApprovedEventSchema,
    exports.RiskRejectedEventSchema,
    exports.InventoryReservedEventSchema,
    exports.InventoryReleasedEventSchema,
    exports.InventoryInsufficientEventSchema,
    exports.PaymentProcessedEventSchema,
    exports.PaymentFailedEventSchema,
    exports.PaymentRefundedEventSchema,
];
//# sourceMappingURL=events.js.map