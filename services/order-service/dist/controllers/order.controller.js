"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const shared_1 = require("@saga-pattern/shared");
class OrderController {
    orderService;
    logger;
    constructor(orderService, logger) {
        this.orderService = orderService;
        this.logger = logger;
    }
    async createOrder(req, res) {
        try {
            const validatedData = shared_1.CreateOrderRequestSchema.parse(req.body);
            const order = await this.orderService.createOrder(validatedData);
            res.status(201).json({
                success: true,
                message: 'Order created successfully',
                data: order,
            });
        }
        catch (error) {
            this.logger.error('Failed to create order', { error: error instanceof Error ? error.message : String(error) });
            if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
                res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: error.errors,
                });
                return;
            }
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }
    async getOrderById(req, res) {
        try {
            const { orderId } = req.params;
            const order = await this.orderService.getOrderById(orderId);
            if (!order) {
                res.status(404).json({
                    success: false,
                    message: 'Order not found',
                });
                return;
            }
            res.json({
                success: true,
                message: 'Order retrieved successfully',
                data: order,
            });
        }
        catch (error) {
            this.logger.error('Failed to get order', {
                orderId: req.params.orderId,
                error: error instanceof Error ? error.message : String(error)
            });
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }
    async getOrdersByCustomerId(req, res) {
        try {
            const { customerId } = req.params;
            const orders = await this.orderService.getOrdersByCustomerId(customerId);
            res.json({
                success: true,
                message: 'Orders retrieved successfully',
                data: orders,
            });
        }
        catch (error) {
            this.logger.error('Failed to get orders by customer', {
                customerId: req.params.customerId,
                error: error instanceof Error ? error.message : String(error)
            });
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }
    async healthCheck(req, res) {
        res.json({
            success: true,
            message: 'Order service is healthy',
            timestamp: new Date().toISOString(),
        });
    }
}
exports.OrderController = OrderController;
