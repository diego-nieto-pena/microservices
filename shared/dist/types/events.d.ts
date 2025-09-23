import { z } from 'zod';
export declare const BaseEventSchema: z.ZodObject<{
    eventId: z.ZodString;
    eventType: z.ZodString;
    timestamp: z.ZodDate;
    sagaId: z.ZodString;
    correlationId: z.ZodString;
    data: z.ZodRecord<z.ZodString, z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    eventId: string;
    eventType: string;
    timestamp: Date;
    sagaId: string;
    correlationId: string;
    data: Record<string, any>;
}, {
    eventId: string;
    eventType: string;
    timestamp: Date;
    sagaId: string;
    correlationId: string;
    data: Record<string, any>;
}>;
export type BaseEvent = z.infer<typeof BaseEventSchema>;
export declare const OrderCreatedEventSchema: z.ZodObject<{
    eventId: z.ZodString;
    timestamp: z.ZodDate;
    sagaId: z.ZodString;
    correlationId: z.ZodString;
} & {
    eventType: z.ZodLiteral<"OrderCreated">;
    data: z.ZodObject<{
        orderId: z.ZodString;
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
    }, "strip", z.ZodTypeAny, {
        orderId: string;
        customerId: string;
        items: {
            productId: string;
            quantity: number;
            price: number;
        }[];
        totalAmount: number;
    }, {
        orderId: string;
        customerId: string;
        items: {
            productId: string;
            quantity: number;
            price: number;
        }[];
        totalAmount: number;
    }>;
}, "strip", z.ZodTypeAny, {
    eventId: string;
    eventType: "OrderCreated";
    timestamp: Date;
    sagaId: string;
    correlationId: string;
    data: {
        orderId: string;
        customerId: string;
        items: {
            productId: string;
            quantity: number;
            price: number;
        }[];
        totalAmount: number;
    };
}, {
    eventId: string;
    eventType: "OrderCreated";
    timestamp: Date;
    sagaId: string;
    correlationId: string;
    data: {
        orderId: string;
        customerId: string;
        items: {
            productId: string;
            quantity: number;
            price: number;
        }[];
        totalAmount: number;
    };
}>;
export declare const OrderCompletedEventSchema: z.ZodObject<{
    eventId: z.ZodString;
    timestamp: z.ZodDate;
    sagaId: z.ZodString;
    correlationId: z.ZodString;
} & {
    eventType: z.ZodLiteral<"OrderCompleted">;
    data: z.ZodObject<{
        orderId: z.ZodString;
        customerId: z.ZodString;
        totalAmount: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        orderId: string;
        customerId: string;
        totalAmount: number;
    }, {
        orderId: string;
        customerId: string;
        totalAmount: number;
    }>;
}, "strip", z.ZodTypeAny, {
    eventId: string;
    eventType: "OrderCompleted";
    timestamp: Date;
    sagaId: string;
    correlationId: string;
    data: {
        orderId: string;
        customerId: string;
        totalAmount: number;
    };
}, {
    eventId: string;
    eventType: "OrderCompleted";
    timestamp: Date;
    sagaId: string;
    correlationId: string;
    data: {
        orderId: string;
        customerId: string;
        totalAmount: number;
    };
}>;
export declare const OrderCancelledEventSchema: z.ZodObject<{
    eventId: z.ZodString;
    timestamp: z.ZodDate;
    sagaId: z.ZodString;
    correlationId: z.ZodString;
} & {
    eventType: z.ZodLiteral<"OrderCancelled">;
    data: z.ZodObject<{
        orderId: z.ZodString;
        customerId: z.ZodString;
        reason: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        orderId: string;
        customerId: string;
        reason: string;
    }, {
        orderId: string;
        customerId: string;
        reason: string;
    }>;
}, "strip", z.ZodTypeAny, {
    eventId: string;
    eventType: "OrderCancelled";
    timestamp: Date;
    sagaId: string;
    correlationId: string;
    data: {
        orderId: string;
        customerId: string;
        reason: string;
    };
}, {
    eventId: string;
    eventType: "OrderCancelled";
    timestamp: Date;
    sagaId: string;
    correlationId: string;
    data: {
        orderId: string;
        customerId: string;
        reason: string;
    };
}>;
export declare const RiskApprovedEventSchema: z.ZodObject<{
    eventId: z.ZodString;
    timestamp: z.ZodDate;
    sagaId: z.ZodString;
    correlationId: z.ZodString;
} & {
    eventType: z.ZodLiteral<"RiskApproved">;
    data: z.ZodObject<{
        orderId: z.ZodString;
        customerId: z.ZodString;
        creditScore: z.ZodNumber;
        approvedAmount: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        orderId: string;
        customerId: string;
        creditScore: number;
        approvedAmount: number;
    }, {
        orderId: string;
        customerId: string;
        creditScore: number;
        approvedAmount: number;
    }>;
}, "strip", z.ZodTypeAny, {
    eventId: string;
    eventType: "RiskApproved";
    timestamp: Date;
    sagaId: string;
    correlationId: string;
    data: {
        orderId: string;
        customerId: string;
        creditScore: number;
        approvedAmount: number;
    };
}, {
    eventId: string;
    eventType: "RiskApproved";
    timestamp: Date;
    sagaId: string;
    correlationId: string;
    data: {
        orderId: string;
        customerId: string;
        creditScore: number;
        approvedAmount: number;
    };
}>;
export declare const RiskRejectedEventSchema: z.ZodObject<{
    eventId: z.ZodString;
    timestamp: z.ZodDate;
    sagaId: z.ZodString;
    correlationId: z.ZodString;
} & {
    eventType: z.ZodLiteral<"RiskRejected">;
    data: z.ZodObject<{
        orderId: z.ZodString;
        customerId: z.ZodString;
        reason: z.ZodString;
        creditScore: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        orderId: string;
        customerId: string;
        reason: string;
        creditScore: number;
    }, {
        orderId: string;
        customerId: string;
        reason: string;
        creditScore: number;
    }>;
}, "strip", z.ZodTypeAny, {
    eventId: string;
    eventType: "RiskRejected";
    timestamp: Date;
    sagaId: string;
    correlationId: string;
    data: {
        orderId: string;
        customerId: string;
        reason: string;
        creditScore: number;
    };
}, {
    eventId: string;
    eventType: "RiskRejected";
    timestamp: Date;
    sagaId: string;
    correlationId: string;
    data: {
        orderId: string;
        customerId: string;
        reason: string;
        creditScore: number;
    };
}>;
export declare const InventoryReservedEventSchema: z.ZodObject<{
    eventId: z.ZodString;
    timestamp: z.ZodDate;
    sagaId: z.ZodString;
    correlationId: z.ZodString;
} & {
    eventType: z.ZodLiteral<"InventoryReserved">;
    data: z.ZodObject<{
        orderId: z.ZodString;
        items: z.ZodArray<z.ZodObject<{
            productId: z.ZodString;
            quantity: z.ZodNumber;
            reservedAt: z.ZodDate;
        }, "strip", z.ZodTypeAny, {
            productId: string;
            quantity: number;
            reservedAt: Date;
        }, {
            productId: string;
            quantity: number;
            reservedAt: Date;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        orderId: string;
        items: {
            productId: string;
            quantity: number;
            reservedAt: Date;
        }[];
    }, {
        orderId: string;
        items: {
            productId: string;
            quantity: number;
            reservedAt: Date;
        }[];
    }>;
}, "strip", z.ZodTypeAny, {
    eventId: string;
    eventType: "InventoryReserved";
    timestamp: Date;
    sagaId: string;
    correlationId: string;
    data: {
        orderId: string;
        items: {
            productId: string;
            quantity: number;
            reservedAt: Date;
        }[];
    };
}, {
    eventId: string;
    eventType: "InventoryReserved";
    timestamp: Date;
    sagaId: string;
    correlationId: string;
    data: {
        orderId: string;
        items: {
            productId: string;
            quantity: number;
            reservedAt: Date;
        }[];
    };
}>;
export declare const InventoryReleasedEventSchema: z.ZodObject<{
    eventId: z.ZodString;
    timestamp: z.ZodDate;
    sagaId: z.ZodString;
    correlationId: z.ZodString;
} & {
    eventType: z.ZodLiteral<"InventoryReleased">;
    data: z.ZodObject<{
        orderId: z.ZodString;
        items: z.ZodArray<z.ZodObject<{
            productId: z.ZodString;
            quantity: z.ZodNumber;
            releasedAt: z.ZodDate;
        }, "strip", z.ZodTypeAny, {
            productId: string;
            quantity: number;
            releasedAt: Date;
        }, {
            productId: string;
            quantity: number;
            releasedAt: Date;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        orderId: string;
        items: {
            productId: string;
            quantity: number;
            releasedAt: Date;
        }[];
    }, {
        orderId: string;
        items: {
            productId: string;
            quantity: number;
            releasedAt: Date;
        }[];
    }>;
}, "strip", z.ZodTypeAny, {
    eventId: string;
    eventType: "InventoryReleased";
    timestamp: Date;
    sagaId: string;
    correlationId: string;
    data: {
        orderId: string;
        items: {
            productId: string;
            quantity: number;
            releasedAt: Date;
        }[];
    };
}, {
    eventId: string;
    eventType: "InventoryReleased";
    timestamp: Date;
    sagaId: string;
    correlationId: string;
    data: {
        orderId: string;
        items: {
            productId: string;
            quantity: number;
            releasedAt: Date;
        }[];
    };
}>;
export declare const InventoryInsufficientEventSchema: z.ZodObject<{
    eventId: z.ZodString;
    timestamp: z.ZodDate;
    sagaId: z.ZodString;
    correlationId: z.ZodString;
} & {
    eventType: z.ZodLiteral<"InventoryInsufficient">;
    data: z.ZodObject<{
        orderId: z.ZodString;
        items: z.ZodArray<z.ZodObject<{
            productId: z.ZodString;
            requestedQuantity: z.ZodNumber;
            availableQuantity: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            productId: string;
            requestedQuantity: number;
            availableQuantity: number;
        }, {
            productId: string;
            requestedQuantity: number;
            availableQuantity: number;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        orderId: string;
        items: {
            productId: string;
            requestedQuantity: number;
            availableQuantity: number;
        }[];
    }, {
        orderId: string;
        items: {
            productId: string;
            requestedQuantity: number;
            availableQuantity: number;
        }[];
    }>;
}, "strip", z.ZodTypeAny, {
    eventId: string;
    eventType: "InventoryInsufficient";
    timestamp: Date;
    sagaId: string;
    correlationId: string;
    data: {
        orderId: string;
        items: {
            productId: string;
            requestedQuantity: number;
            availableQuantity: number;
        }[];
    };
}, {
    eventId: string;
    eventType: "InventoryInsufficient";
    timestamp: Date;
    sagaId: string;
    correlationId: string;
    data: {
        orderId: string;
        items: {
            productId: string;
            requestedQuantity: number;
            availableQuantity: number;
        }[];
    };
}>;
export declare const PaymentProcessedEventSchema: z.ZodObject<{
    eventId: z.ZodString;
    timestamp: z.ZodDate;
    sagaId: z.ZodString;
    correlationId: z.ZodString;
} & {
    eventType: z.ZodLiteral<"PaymentProcessed">;
    data: z.ZodObject<{
        orderId: z.ZodString;
        customerId: z.ZodString;
        amount: z.ZodNumber;
        paymentMethod: z.ZodString;
        transactionId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        orderId: string;
        customerId: string;
        amount: number;
        paymentMethod: string;
        transactionId: string;
    }, {
        orderId: string;
        customerId: string;
        amount: number;
        paymentMethod: string;
        transactionId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    eventId: string;
    eventType: "PaymentProcessed";
    timestamp: Date;
    sagaId: string;
    correlationId: string;
    data: {
        orderId: string;
        customerId: string;
        amount: number;
        paymentMethod: string;
        transactionId: string;
    };
}, {
    eventId: string;
    eventType: "PaymentProcessed";
    timestamp: Date;
    sagaId: string;
    correlationId: string;
    data: {
        orderId: string;
        customerId: string;
        amount: number;
        paymentMethod: string;
        transactionId: string;
    };
}>;
export declare const PaymentFailedEventSchema: z.ZodObject<{
    eventId: z.ZodString;
    timestamp: z.ZodDate;
    sagaId: z.ZodString;
    correlationId: z.ZodString;
} & {
    eventType: z.ZodLiteral<"PaymentFailed">;
    data: z.ZodObject<{
        orderId: z.ZodString;
        customerId: z.ZodString;
        amount: z.ZodNumber;
        reason: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        orderId: string;
        customerId: string;
        reason: string;
        amount: number;
    }, {
        orderId: string;
        customerId: string;
        reason: string;
        amount: number;
    }>;
}, "strip", z.ZodTypeAny, {
    eventId: string;
    eventType: "PaymentFailed";
    timestamp: Date;
    sagaId: string;
    correlationId: string;
    data: {
        orderId: string;
        customerId: string;
        reason: string;
        amount: number;
    };
}, {
    eventId: string;
    eventType: "PaymentFailed";
    timestamp: Date;
    sagaId: string;
    correlationId: string;
    data: {
        orderId: string;
        customerId: string;
        reason: string;
        amount: number;
    };
}>;
export declare const PaymentRefundedEventSchema: z.ZodObject<{
    eventId: z.ZodString;
    timestamp: z.ZodDate;
    sagaId: z.ZodString;
    correlationId: z.ZodString;
} & {
    eventType: z.ZodLiteral<"PaymentRefunded">;
    data: z.ZodObject<{
        orderId: z.ZodString;
        customerId: z.ZodString;
        amount: z.ZodNumber;
        transactionId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        orderId: string;
        customerId: string;
        amount: number;
        transactionId: string;
    }, {
        orderId: string;
        customerId: string;
        amount: number;
        transactionId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    eventId: string;
    eventType: "PaymentRefunded";
    timestamp: Date;
    sagaId: string;
    correlationId: string;
    data: {
        orderId: string;
        customerId: string;
        amount: number;
        transactionId: string;
    };
}, {
    eventId: string;
    eventType: "PaymentRefunded";
    timestamp: Date;
    sagaId: string;
    correlationId: string;
    data: {
        orderId: string;
        customerId: string;
        amount: number;
        transactionId: string;
    };
}>;
export declare const AllEventSchemas: readonly [z.ZodObject<{
    eventId: z.ZodString;
    timestamp: z.ZodDate;
    sagaId: z.ZodString;
    correlationId: z.ZodString;
} & {
    eventType: z.ZodLiteral<"OrderCreated">;
    data: z.ZodObject<{
        orderId: z.ZodString;
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
    }, "strip", z.ZodTypeAny, {
        orderId: string;
        customerId: string;
        items: {
            productId: string;
            quantity: number;
            price: number;
        }[];
        totalAmount: number;
    }, {
        orderId: string;
        customerId: string;
        items: {
            productId: string;
            quantity: number;
            price: number;
        }[];
        totalAmount: number;
    }>;
}, "strip", z.ZodTypeAny, {
    eventId: string;
    eventType: "OrderCreated";
    timestamp: Date;
    sagaId: string;
    correlationId: string;
    data: {
        orderId: string;
        customerId: string;
        items: {
            productId: string;
            quantity: number;
            price: number;
        }[];
        totalAmount: number;
    };
}, {
    eventId: string;
    eventType: "OrderCreated";
    timestamp: Date;
    sagaId: string;
    correlationId: string;
    data: {
        orderId: string;
        customerId: string;
        items: {
            productId: string;
            quantity: number;
            price: number;
        }[];
        totalAmount: number;
    };
}>, z.ZodObject<{
    eventId: z.ZodString;
    timestamp: z.ZodDate;
    sagaId: z.ZodString;
    correlationId: z.ZodString;
} & {
    eventType: z.ZodLiteral<"OrderCompleted">;
    data: z.ZodObject<{
        orderId: z.ZodString;
        customerId: z.ZodString;
        totalAmount: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        orderId: string;
        customerId: string;
        totalAmount: number;
    }, {
        orderId: string;
        customerId: string;
        totalAmount: number;
    }>;
}, "strip", z.ZodTypeAny, {
    eventId: string;
    eventType: "OrderCompleted";
    timestamp: Date;
    sagaId: string;
    correlationId: string;
    data: {
        orderId: string;
        customerId: string;
        totalAmount: number;
    };
}, {
    eventId: string;
    eventType: "OrderCompleted";
    timestamp: Date;
    sagaId: string;
    correlationId: string;
    data: {
        orderId: string;
        customerId: string;
        totalAmount: number;
    };
}>, z.ZodObject<{
    eventId: z.ZodString;
    timestamp: z.ZodDate;
    sagaId: z.ZodString;
    correlationId: z.ZodString;
} & {
    eventType: z.ZodLiteral<"OrderCancelled">;
    data: z.ZodObject<{
        orderId: z.ZodString;
        customerId: z.ZodString;
        reason: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        orderId: string;
        customerId: string;
        reason: string;
    }, {
        orderId: string;
        customerId: string;
        reason: string;
    }>;
}, "strip", z.ZodTypeAny, {
    eventId: string;
    eventType: "OrderCancelled";
    timestamp: Date;
    sagaId: string;
    correlationId: string;
    data: {
        orderId: string;
        customerId: string;
        reason: string;
    };
}, {
    eventId: string;
    eventType: "OrderCancelled";
    timestamp: Date;
    sagaId: string;
    correlationId: string;
    data: {
        orderId: string;
        customerId: string;
        reason: string;
    };
}>, z.ZodObject<{
    eventId: z.ZodString;
    timestamp: z.ZodDate;
    sagaId: z.ZodString;
    correlationId: z.ZodString;
} & {
    eventType: z.ZodLiteral<"RiskApproved">;
    data: z.ZodObject<{
        orderId: z.ZodString;
        customerId: z.ZodString;
        creditScore: z.ZodNumber;
        approvedAmount: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        orderId: string;
        customerId: string;
        creditScore: number;
        approvedAmount: number;
    }, {
        orderId: string;
        customerId: string;
        creditScore: number;
        approvedAmount: number;
    }>;
}, "strip", z.ZodTypeAny, {
    eventId: string;
    eventType: "RiskApproved";
    timestamp: Date;
    sagaId: string;
    correlationId: string;
    data: {
        orderId: string;
        customerId: string;
        creditScore: number;
        approvedAmount: number;
    };
}, {
    eventId: string;
    eventType: "RiskApproved";
    timestamp: Date;
    sagaId: string;
    correlationId: string;
    data: {
        orderId: string;
        customerId: string;
        creditScore: number;
        approvedAmount: number;
    };
}>, z.ZodObject<{
    eventId: z.ZodString;
    timestamp: z.ZodDate;
    sagaId: z.ZodString;
    correlationId: z.ZodString;
} & {
    eventType: z.ZodLiteral<"RiskRejected">;
    data: z.ZodObject<{
        orderId: z.ZodString;
        customerId: z.ZodString;
        reason: z.ZodString;
        creditScore: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        orderId: string;
        customerId: string;
        reason: string;
        creditScore: number;
    }, {
        orderId: string;
        customerId: string;
        reason: string;
        creditScore: number;
    }>;
}, "strip", z.ZodTypeAny, {
    eventId: string;
    eventType: "RiskRejected";
    timestamp: Date;
    sagaId: string;
    correlationId: string;
    data: {
        orderId: string;
        customerId: string;
        reason: string;
        creditScore: number;
    };
}, {
    eventId: string;
    eventType: "RiskRejected";
    timestamp: Date;
    sagaId: string;
    correlationId: string;
    data: {
        orderId: string;
        customerId: string;
        reason: string;
        creditScore: number;
    };
}>, z.ZodObject<{
    eventId: z.ZodString;
    timestamp: z.ZodDate;
    sagaId: z.ZodString;
    correlationId: z.ZodString;
} & {
    eventType: z.ZodLiteral<"InventoryReserved">;
    data: z.ZodObject<{
        orderId: z.ZodString;
        items: z.ZodArray<z.ZodObject<{
            productId: z.ZodString;
            quantity: z.ZodNumber;
            reservedAt: z.ZodDate;
        }, "strip", z.ZodTypeAny, {
            productId: string;
            quantity: number;
            reservedAt: Date;
        }, {
            productId: string;
            quantity: number;
            reservedAt: Date;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        orderId: string;
        items: {
            productId: string;
            quantity: number;
            reservedAt: Date;
        }[];
    }, {
        orderId: string;
        items: {
            productId: string;
            quantity: number;
            reservedAt: Date;
        }[];
    }>;
}, "strip", z.ZodTypeAny, {
    eventId: string;
    eventType: "InventoryReserved";
    timestamp: Date;
    sagaId: string;
    correlationId: string;
    data: {
        orderId: string;
        items: {
            productId: string;
            quantity: number;
            reservedAt: Date;
        }[];
    };
}, {
    eventId: string;
    eventType: "InventoryReserved";
    timestamp: Date;
    sagaId: string;
    correlationId: string;
    data: {
        orderId: string;
        items: {
            productId: string;
            quantity: number;
            reservedAt: Date;
        }[];
    };
}>, z.ZodObject<{
    eventId: z.ZodString;
    timestamp: z.ZodDate;
    sagaId: z.ZodString;
    correlationId: z.ZodString;
} & {
    eventType: z.ZodLiteral<"InventoryReleased">;
    data: z.ZodObject<{
        orderId: z.ZodString;
        items: z.ZodArray<z.ZodObject<{
            productId: z.ZodString;
            quantity: z.ZodNumber;
            releasedAt: z.ZodDate;
        }, "strip", z.ZodTypeAny, {
            productId: string;
            quantity: number;
            releasedAt: Date;
        }, {
            productId: string;
            quantity: number;
            releasedAt: Date;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        orderId: string;
        items: {
            productId: string;
            quantity: number;
            releasedAt: Date;
        }[];
    }, {
        orderId: string;
        items: {
            productId: string;
            quantity: number;
            releasedAt: Date;
        }[];
    }>;
}, "strip", z.ZodTypeAny, {
    eventId: string;
    eventType: "InventoryReleased";
    timestamp: Date;
    sagaId: string;
    correlationId: string;
    data: {
        orderId: string;
        items: {
            productId: string;
            quantity: number;
            releasedAt: Date;
        }[];
    };
}, {
    eventId: string;
    eventType: "InventoryReleased";
    timestamp: Date;
    sagaId: string;
    correlationId: string;
    data: {
        orderId: string;
        items: {
            productId: string;
            quantity: number;
            releasedAt: Date;
        }[];
    };
}>, z.ZodObject<{
    eventId: z.ZodString;
    timestamp: z.ZodDate;
    sagaId: z.ZodString;
    correlationId: z.ZodString;
} & {
    eventType: z.ZodLiteral<"InventoryInsufficient">;
    data: z.ZodObject<{
        orderId: z.ZodString;
        items: z.ZodArray<z.ZodObject<{
            productId: z.ZodString;
            requestedQuantity: z.ZodNumber;
            availableQuantity: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            productId: string;
            requestedQuantity: number;
            availableQuantity: number;
        }, {
            productId: string;
            requestedQuantity: number;
            availableQuantity: number;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        orderId: string;
        items: {
            productId: string;
            requestedQuantity: number;
            availableQuantity: number;
        }[];
    }, {
        orderId: string;
        items: {
            productId: string;
            requestedQuantity: number;
            availableQuantity: number;
        }[];
    }>;
}, "strip", z.ZodTypeAny, {
    eventId: string;
    eventType: "InventoryInsufficient";
    timestamp: Date;
    sagaId: string;
    correlationId: string;
    data: {
        orderId: string;
        items: {
            productId: string;
            requestedQuantity: number;
            availableQuantity: number;
        }[];
    };
}, {
    eventId: string;
    eventType: "InventoryInsufficient";
    timestamp: Date;
    sagaId: string;
    correlationId: string;
    data: {
        orderId: string;
        items: {
            productId: string;
            requestedQuantity: number;
            availableQuantity: number;
        }[];
    };
}>, z.ZodObject<{
    eventId: z.ZodString;
    timestamp: z.ZodDate;
    sagaId: z.ZodString;
    correlationId: z.ZodString;
} & {
    eventType: z.ZodLiteral<"PaymentProcessed">;
    data: z.ZodObject<{
        orderId: z.ZodString;
        customerId: z.ZodString;
        amount: z.ZodNumber;
        paymentMethod: z.ZodString;
        transactionId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        orderId: string;
        customerId: string;
        amount: number;
        paymentMethod: string;
        transactionId: string;
    }, {
        orderId: string;
        customerId: string;
        amount: number;
        paymentMethod: string;
        transactionId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    eventId: string;
    eventType: "PaymentProcessed";
    timestamp: Date;
    sagaId: string;
    correlationId: string;
    data: {
        orderId: string;
        customerId: string;
        amount: number;
        paymentMethod: string;
        transactionId: string;
    };
}, {
    eventId: string;
    eventType: "PaymentProcessed";
    timestamp: Date;
    sagaId: string;
    correlationId: string;
    data: {
        orderId: string;
        customerId: string;
        amount: number;
        paymentMethod: string;
        transactionId: string;
    };
}>, z.ZodObject<{
    eventId: z.ZodString;
    timestamp: z.ZodDate;
    sagaId: z.ZodString;
    correlationId: z.ZodString;
} & {
    eventType: z.ZodLiteral<"PaymentFailed">;
    data: z.ZodObject<{
        orderId: z.ZodString;
        customerId: z.ZodString;
        amount: z.ZodNumber;
        reason: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        orderId: string;
        customerId: string;
        reason: string;
        amount: number;
    }, {
        orderId: string;
        customerId: string;
        reason: string;
        amount: number;
    }>;
}, "strip", z.ZodTypeAny, {
    eventId: string;
    eventType: "PaymentFailed";
    timestamp: Date;
    sagaId: string;
    correlationId: string;
    data: {
        orderId: string;
        customerId: string;
        reason: string;
        amount: number;
    };
}, {
    eventId: string;
    eventType: "PaymentFailed";
    timestamp: Date;
    sagaId: string;
    correlationId: string;
    data: {
        orderId: string;
        customerId: string;
        reason: string;
        amount: number;
    };
}>, z.ZodObject<{
    eventId: z.ZodString;
    timestamp: z.ZodDate;
    sagaId: z.ZodString;
    correlationId: z.ZodString;
} & {
    eventType: z.ZodLiteral<"PaymentRefunded">;
    data: z.ZodObject<{
        orderId: z.ZodString;
        customerId: z.ZodString;
        amount: z.ZodNumber;
        transactionId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        orderId: string;
        customerId: string;
        amount: number;
        transactionId: string;
    }, {
        orderId: string;
        customerId: string;
        amount: number;
        transactionId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    eventId: string;
    eventType: "PaymentRefunded";
    timestamp: Date;
    sagaId: string;
    correlationId: string;
    data: {
        orderId: string;
        customerId: string;
        amount: number;
        transactionId: string;
    };
}, {
    eventId: string;
    eventType: "PaymentRefunded";
    timestamp: Date;
    sagaId: string;
    correlationId: string;
    data: {
        orderId: string;
        customerId: string;
        amount: number;
        transactionId: string;
    };
}>];
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
export type SagaEvent = OrderCreatedEvent | OrderCompletedEvent | OrderCancelledEvent | RiskApprovedEvent | RiskRejectedEvent | InventoryReservedEvent | InventoryReleasedEvent | InventoryInsufficientEvent | PaymentProcessedEvent | PaymentFailedEvent | PaymentRefundedEvent;
//# sourceMappingURL=events.d.ts.map