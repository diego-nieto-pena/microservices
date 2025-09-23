import { z } from 'zod';
export declare const OrderItemSchema: z.ZodObject<{
    productId: z.ZodString;
    quantity: z.ZodNumber;
    price: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    productId: string;
    quantity: number;
    price: number;
}, {
    productId: string;
    quantity: number;
    price: number;
}>;
export declare const OrderSchema: z.ZodObject<{
    id: z.ZodString;
    customerId: z.ZodString;
    items: z.ZodArray<z.ZodObject<{
        productId: z.ZodString;
        quantity: z.ZodNumber;
        price: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        productId: string;
        quantity: number;
        price: number;
    }, {
        productId: string;
        quantity: number;
        price: number;
    }>, "many">;
    totalAmount: z.ZodNumber;
    status: z.ZodEnum<["PENDING", "PROCESSING", "COMPLETED", "CANCELLED", "FAILED"]>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    status: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED" | "FAILED";
    customerId: string;
    items: {
        productId: string;
        quantity: number;
        price: number;
    }[];
    totalAmount: number;
    id: string;
    createdAt: Date;
    updatedAt: Date;
}, {
    status: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED" | "FAILED";
    customerId: string;
    items: {
        productId: string;
        quantity: number;
        price: number;
    }[];
    totalAmount: number;
    id: string;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const CreateOrderRequestSchema: z.ZodObject<{
    customerId: z.ZodString;
    items: z.ZodArray<z.ZodObject<{
        productId: z.ZodString;
        quantity: z.ZodNumber;
        price: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        productId: string;
        quantity: number;
        price: number;
    }, {
        productId: string;
        quantity: number;
        price: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    customerId: string;
    items: {
        productId: string;
        quantity: number;
        price: number;
    }[];
}, {
    customerId: string;
    items: {
        productId: string;
        quantity: number;
        price: number;
    }[];
}>;
export declare const CustomerRiskProfileSchema: z.ZodObject<{
    customerId: z.ZodString;
    creditScore: z.ZodNumber;
    monthlyIncome: z.ZodNumber;
    currentDebt: z.ZodNumber;
    riskLevel: z.ZodEnum<["LOW", "MEDIUM", "HIGH"]>;
    maxOrderAmount: z.ZodNumber;
    lastUpdated: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    customerId: string;
    creditScore: number;
    monthlyIncome: number;
    currentDebt: number;
    riskLevel: "LOW" | "MEDIUM" | "HIGH";
    maxOrderAmount: number;
    lastUpdated: Date;
}, {
    customerId: string;
    creditScore: number;
    monthlyIncome: number;
    currentDebt: number;
    riskLevel: "LOW" | "MEDIUM" | "HIGH";
    maxOrderAmount: number;
    lastUpdated: Date;
}>;
export declare const RiskAssessmentRequestSchema: z.ZodObject<{
    orderId: z.ZodString;
    customerId: z.ZodString;
    amount: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    orderId: string;
    customerId: string;
    amount: number;
}, {
    orderId: string;
    customerId: string;
    amount: number;
}>;
export declare const ProductSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    price: z.ZodNumber;
    stockQuantity: z.ZodNumber;
    reservedQuantity: z.ZodNumber;
    availableQuantity: z.ZodNumber;
    category: z.ZodString;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    price: number;
    availableQuantity: number;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    stockQuantity: number;
    reservedQuantity: number;
    category: string;
    description?: string | undefined;
}, {
    price: number;
    availableQuantity: number;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    stockQuantity: number;
    reservedQuantity: number;
    category: string;
    description?: string | undefined;
}>;
export declare const InventoryReservationSchema: z.ZodObject<{
    id: z.ZodString;
    orderId: z.ZodString;
    productId: z.ZodString;
    quantity: z.ZodNumber;
    reservedAt: z.ZodDate;
    expiresAt: z.ZodDate;
    status: z.ZodEnum<["ACTIVE", "RELEASED", "EXPIRED"]>;
}, "strip", z.ZodTypeAny, {
    status: "ACTIVE" | "RELEASED" | "EXPIRED";
    orderId: string;
    productId: string;
    quantity: number;
    reservedAt: Date;
    id: string;
    expiresAt: Date;
}, {
    status: "ACTIVE" | "RELEASED" | "EXPIRED";
    orderId: string;
    productId: string;
    quantity: number;
    reservedAt: Date;
    id: string;
    expiresAt: Date;
}>;
export declare const ReserveInventoryRequestSchema: z.ZodObject<{
    orderId: z.ZodString;
    items: z.ZodArray<z.ZodObject<{
        productId: z.ZodString;
        quantity: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        productId: string;
        quantity: number;
    }, {
        productId: string;
        quantity: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    orderId: string;
    items: {
        productId: string;
        quantity: number;
    }[];
}, {
    orderId: string;
    items: {
        productId: string;
        quantity: number;
    }[];
}>;
export declare const PaymentMethodSchema: z.ZodObject<{
    id: z.ZodString;
    customerId: z.ZodString;
    type: z.ZodEnum<["CREDIT_CARD", "DEBIT_CARD", "BANK_TRANSFER"]>;
    lastFourDigits: z.ZodString;
    expiryMonth: z.ZodNumber;
    expiryYear: z.ZodNumber;
    isDefault: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    type: "CREDIT_CARD" | "DEBIT_CARD" | "BANK_TRANSFER";
    customerId: string;
    id: string;
    lastFourDigits: string;
    expiryMonth: number;
    expiryYear: number;
    isDefault: boolean;
}, {
    type: "CREDIT_CARD" | "DEBIT_CARD" | "BANK_TRANSFER";
    customerId: string;
    id: string;
    lastFourDigits: string;
    expiryMonth: number;
    expiryYear: number;
    isDefault: boolean;
}>;
export declare const PaymentTransactionSchema: z.ZodObject<{
    id: z.ZodString;
    orderId: z.ZodString;
    customerId: z.ZodString;
    amount: z.ZodNumber;
    paymentMethodId: z.ZodString;
    status: z.ZodEnum<["PENDING", "PROCESSING", "COMPLETED", "FAILED", "REFUNDED"]>;
    transactionId: z.ZodOptional<z.ZodString>;
    processedAt: z.ZodOptional<z.ZodDate>;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "REFUNDED";
    orderId: string;
    customerId: string;
    amount: number;
    id: string;
    createdAt: Date;
    paymentMethodId: string;
    transactionId?: string | undefined;
    processedAt?: Date | undefined;
}, {
    status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "REFUNDED";
    orderId: string;
    customerId: string;
    amount: number;
    id: string;
    createdAt: Date;
    paymentMethodId: string;
    transactionId?: string | undefined;
    processedAt?: Date | undefined;
}>;
export declare const ProcessPaymentRequestSchema: z.ZodObject<{
    orderId: z.ZodString;
    customerId: z.ZodString;
    amount: z.ZodNumber;
    paymentMethodId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    orderId: string;
    customerId: string;
    amount: number;
    paymentMethodId: string;
}, {
    orderId: string;
    customerId: string;
    amount: number;
    paymentMethodId: string;
}>;
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
//# sourceMappingURL=domain.d.ts.map