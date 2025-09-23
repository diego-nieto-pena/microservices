"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const shared_1 = require("@saga-pattern/shared");
class OrderService {
    orderRepository;
    kafkaProducer;
    logger;
    constructor(orderRepository, kafkaProducer, logger) {
        this.orderRepository = orderRepository;
        this.kafkaProducer = kafkaProducer;
        this.logger = logger;
    }
    async createOrder(request) {
        this.logger.info('Creating new order', { customerId: request.customerId });
        try {
            // Create order in database
            const order = await this.orderRepository.createOrder(request);
            // Publish OrderCreated event to start the saga
            const orderCreatedEvent = (0, shared_1.createEvent)('OrderCreated', {
                orderId: order.id,
                customerId: order.customerId,
                items: order.items,
                totalAmount: order.totalAmount,
            });
            await this.kafkaProducer.publishEvent(shared_1.KAFKA_TOPICS.ORDER_EVENTS, orderCreatedEvent);
            this.logger.info('Order created and event published', {
                orderId: order.id,
                sagaId: orderCreatedEvent.sagaId
            });
            return order;
        }
        catch (error) {
            this.logger.error('Failed to create order', { error: error instanceof Error ? error.message : String(error) });
            throw error;
        }
    }
    async handleRiskApproved(event) {
        this.logger.info('Risk approved for order', { orderId: event.data.orderId });
        try {
            // Update order status to processing
            await this.orderRepository.updateOrderStatus(event.data.orderId, 'PROCESSING');
            this.logger.info('Order status updated to processing', { orderId: event.data.orderId });
        }
        catch (error) {
            this.logger.error('Failed to update order status', {
                orderId: event.data.orderId,
                error: error instanceof Error ? error.message : String(error)
            });
            throw error;
        }
    }
    async handleRiskRejected(event) {
        this.logger.info('Risk rejected for order', { orderId: event.data.orderId });
        try {
            // Update order status to cancelled
            await this.orderRepository.updateOrderStatus(event.data.orderId, 'CANCELLED');
            // Publish OrderCancelled event
            const orderCancelledEvent = (0, shared_1.createEvent)('OrderCancelled', {
                orderId: event.data.orderId,
                customerId: event.data.customerId,
                reason: event.data.reason,
            }, event.sagaId, event.correlationId);
            await this.kafkaProducer.publishEvent(shared_1.KAFKA_TOPICS.ORDER_EVENTS, orderCancelledEvent);
            this.logger.info('Order cancelled due to risk rejection', { orderId: event.data.orderId });
        }
        catch (error) {
            this.logger.error('Failed to cancel order', {
                orderId: event.data.orderId,
                error: error instanceof Error ? error.message : String(error)
            });
            throw error;
        }
    }
    async handleInventoryReserved(event) {
        this.logger.info('Inventory reserved for order', { orderId: event.data.orderId });
        // Order status remains PROCESSING, waiting for payment
        this.logger.info('Order ready for payment processing', { orderId: event.data.orderId });
    }
    async handleInventoryInsufficient(event) {
        this.logger.info('Insufficient inventory for order', { orderId: event.data.orderId });
        try {
            // Update order status to cancelled
            await this.orderRepository.updateOrderStatus(event.data.orderId, 'CANCELLED');
            // Publish OrderCancelled event
            const orderCancelledEvent = (0, shared_1.createEvent)('OrderCancelled', {
                orderId: event.data.orderId,
                customerId: event.data.customerId,
                reason: 'Insufficient inventory',
            }, event.sagaId, event.correlationId);
            await this.kafkaProducer.publishEvent(shared_1.KAFKA_TOPICS.ORDER_EVENTS, orderCancelledEvent);
            this.logger.info('Order cancelled due to insufficient inventory', { orderId: event.data.orderId });
        }
        catch (error) {
            this.logger.error('Failed to cancel order', {
                orderId: event.data.orderId,
                error: error instanceof Error ? error.message : String(error)
            });
            throw error;
        }
    }
    async handlePaymentProcessed(event) {
        this.logger.info('Payment processed for order', { orderId: event.data.orderId });
        try {
            // Update order status to completed
            await this.orderRepository.updateOrderStatus(event.data.orderId, 'COMPLETED');
            // Publish OrderCompleted event
            const orderCompletedEvent = (0, shared_1.createEvent)('OrderCompleted', {
                orderId: event.data.orderId,
                customerId: event.data.customerId,
                totalAmount: event.data.amount,
            }, event.sagaId, event.correlationId);
            await this.kafkaProducer.publishEvent(shared_1.KAFKA_TOPICS.ORDER_EVENTS, orderCompletedEvent);
            this.logger.info('Order completed successfully', { orderId: event.data.orderId });
        }
        catch (error) {
            this.logger.error('Failed to complete order', {
                orderId: event.data.orderId,
                error: error instanceof Error ? error.message : String(error)
            });
            throw error;
        }
    }
    async handlePaymentFailed(event) {
        this.logger.info('Payment failed for order', { orderId: event.data.orderId });
        try {
            // Update order status to failed
            await this.orderRepository.updateOrderStatus(event.data.orderId, 'FAILED');
            // Publish OrderCancelled event to trigger compensating actions
            const orderCancelledEvent = (0, shared_1.createEvent)('OrderCancelled', {
                orderId: event.data.orderId,
                customerId: event.data.customerId,
                reason: event.data.reason,
            }, event.sagaId, event.correlationId);
            await this.kafkaProducer.publishEvent(shared_1.KAFKA_TOPICS.ORDER_EVENTS, orderCancelledEvent);
            this.logger.info('Order cancelled due to payment failure', { orderId: event.data.orderId });
        }
        catch (error) {
            this.logger.error('Failed to cancel order', {
                orderId: event.data.orderId,
                error: error instanceof Error ? error.message : String(error)
            });
            throw error;
        }
    }
    async getOrderById(orderId) {
        return this.orderRepository.getOrderById(orderId);
    }
    async getOrdersByCustomerId(customerId) {
        return this.orderRepository.getOrdersByCustomerId(customerId);
    }
}
exports.OrderService = OrderService;
