import { z } from 'zod';

// Order Domain Types
export const OrderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().positive(),
  price: z.number().positive(),
});

export const OrderSchema = z.object({
  id: z.string().uuid(),
  customerId: z.string(),
  items: z.array(OrderItemSchema),
  totalAmount: z.number().positive(),
  status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'FAILED']),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateOrderRequestSchema = z.object({
  customerId: z.string(),
  items: z.array(OrderItemSchema),
});

// Risk Domain Types
export const CustomerRiskProfileSchema = z.object({
  customerId: z.string(),
  creditScore: z.number().min(300).max(850),
  monthlyIncome: z.number().positive(),
  currentDebt: z.number().min(0),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  maxOrderAmount: z.number().positive(),
  lastUpdated: z.date(),
});

export const RiskAssessmentRequestSchema = z.object({
  orderId: z.string().uuid(),
  customerId: z.string(),
  amount: z.number().positive(),
});

// Inventory Domain Types
export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  price: z.number().positive(),
  stockQuantity: z.number().min(0),
  reservedQuantity: z.number().min(0),
  availableQuantity: z.number().min(0),
  category: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const InventoryReservationSchema = z.object({
  id: z.string().uuid(),
  orderId: z.string().uuid(),
  productId: z.string(),
  quantity: z.number().positive(),
  reservedAt: z.date(),
  expiresAt: z.date(),
  status: z.enum(['ACTIVE', 'RELEASED', 'EXPIRED']),
});

export const ReserveInventoryRequestSchema = z.object({
  orderId: z.string().uuid(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().positive(),
  })),
});

// Payment Domain Types
export const PaymentMethodSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  type: z.enum(['CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER']),
  lastFourDigits: z.string().length(4),
  expiryMonth: z.number().min(1).max(12),
  expiryYear: z.number().min(new Date().getFullYear()),
  isDefault: z.boolean(),
});

export const PaymentTransactionSchema = z.object({
  id: z.string().uuid(),
  orderId: z.string().uuid(),
  customerId: z.string(),
  amount: z.number().positive(),
  paymentMethodId: z.string(),
  status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED']),
  transactionId: z.string().optional(),
  processedAt: z.date().optional(),
  createdAt: z.date(),
});

export const ProcessPaymentRequestSchema = z.object({
  orderId: z.string().uuid(),
  customerId: z.string(),
  amount: z.number().positive(),
  paymentMethodId: z.string(),
});

// Type exports
export type OrderItem = z.infer<typeof OrderItemSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type CreateOrderRequest = z.infer<typeof CreateOrderRequestSchema>;

export type CustomerRiskProfile = z.infer<typeof CustomerRiskProfileSchema>;
export type RiskAssessmentRequest = z.infer<typeof RiskAssessmentRequestSchema>;

export type Product = z.infer<typeof ProductSchema>;
export type InventoryReservation = z.infer<typeof InventoryReservationSchema>;
export type ReserveInventoryRequest = z.infer<typeof ReserveInventoryRequestSchema>;

export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
export type PaymentTransaction = z.infer<typeof PaymentTransactionSchema>;
export type ProcessPaymentRequest = z.infer<typeof ProcessPaymentRequestSchema>;
