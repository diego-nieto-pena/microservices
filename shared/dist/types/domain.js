"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessPaymentRequestSchema = exports.PaymentTransactionSchema = exports.PaymentMethodSchema = exports.ReserveInventoryRequestSchema = exports.InventoryReservationSchema = exports.ProductSchema = exports.RiskAssessmentRequestSchema = exports.CustomerRiskProfileSchema = exports.CreateOrderRequestSchema = exports.OrderSchema = exports.OrderItemSchema = void 0;
const zod_1 = require("zod");
// Order Domain Types
exports.OrderItemSchema = zod_1.z.object({
    productId: zod_1.z.string(),
    quantity: zod_1.z.number().positive(),
    price: zod_1.z.number().positive(),
});
exports.OrderSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    customerId: zod_1.z.string(),
    items: zod_1.z.array(exports.OrderItemSchema),
    totalAmount: zod_1.z.number().positive(),
    status: zod_1.z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'FAILED']),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
exports.CreateOrderRequestSchema = zod_1.z.object({
    customerId: zod_1.z.string(),
    items: zod_1.z.array(exports.OrderItemSchema),
});
// Risk Domain Types
exports.CustomerRiskProfileSchema = zod_1.z.object({
    customerId: zod_1.z.string(),
    creditScore: zod_1.z.number().min(300).max(850),
    monthlyIncome: zod_1.z.number().positive(),
    currentDebt: zod_1.z.number().min(0),
    riskLevel: zod_1.z.enum(['LOW', 'MEDIUM', 'HIGH']),
    maxOrderAmount: zod_1.z.number().positive(),
    lastUpdated: zod_1.z.date(),
});
exports.RiskAssessmentRequestSchema = zod_1.z.object({
    orderId: zod_1.z.string().uuid(),
    customerId: zod_1.z.string(),
    amount: zod_1.z.number().positive(),
});
// Inventory Domain Types
exports.ProductSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    price: zod_1.z.number().positive(),
    stockQuantity: zod_1.z.number().min(0),
    reservedQuantity: zod_1.z.number().min(0),
    availableQuantity: zod_1.z.number().min(0),
    category: zod_1.z.string(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
exports.InventoryReservationSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    orderId: zod_1.z.string().uuid(),
    productId: zod_1.z.string(),
    quantity: zod_1.z.number().positive(),
    reservedAt: zod_1.z.date(),
    expiresAt: zod_1.z.date(),
    status: zod_1.z.enum(['ACTIVE', 'RELEASED', 'EXPIRED']),
});
exports.ReserveInventoryRequestSchema = zod_1.z.object({
    orderId: zod_1.z.string().uuid(),
    items: zod_1.z.array(zod_1.z.object({
        productId: zod_1.z.string(),
        quantity: zod_1.z.number().positive(),
    })),
});
// Payment Domain Types
exports.PaymentMethodSchema = zod_1.z.object({
    id: zod_1.z.string(),
    customerId: zod_1.z.string(),
    type: zod_1.z.enum(['CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER']),
    lastFourDigits: zod_1.z.string().length(4),
    expiryMonth: zod_1.z.number().min(1).max(12),
    expiryYear: zod_1.z.number().min(new Date().getFullYear()),
    isDefault: zod_1.z.boolean(),
});
exports.PaymentTransactionSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    orderId: zod_1.z.string().uuid(),
    customerId: zod_1.z.string(),
    amount: zod_1.z.number().positive(),
    paymentMethodId: zod_1.z.string(),
    status: zod_1.z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED']),
    transactionId: zod_1.z.string().optional(),
    processedAt: zod_1.z.date().optional(),
    createdAt: zod_1.z.date(),
});
exports.ProcessPaymentRequestSchema = zod_1.z.object({
    orderId: zod_1.z.string().uuid(),
    customerId: zod_1.z.string(),
    amount: zod_1.z.number().positive(),
    paymentMethodId: zod_1.z.string(),
});
//# sourceMappingURL=domain.js.map