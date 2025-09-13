import { OrderRepository } from '../models/order';
import { CreateOrderRequest, Order, KAFKA_TOPICS, createEvent } from '@saga-pattern/shared';
import { KafkaProducer } from '@saga-pattern/shared';
import { Logger } from '@saga-pattern/shared';

export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private kafkaProducer: KafkaProducer,
    private logger: Logger
  ) {}

  async createOrder(request: CreateOrderRequest): Promise<Order> {
    this.logger.info('Creating new order', { customerId: request.customerId });
    
    try {
      // Create order in database
      const order = await this.orderRepository.createOrder(request);
      
      // Publish OrderCreated event to start the saga
      const orderCreatedEvent = createEvent('OrderCreated', {
        orderId: order.id,
        customerId: order.customerId,
        items: order.items,
        totalAmount: order.totalAmount,
      });

      await this.kafkaProducer.publishEvent(KAFKA_TOPICS.ORDER_EVENTS, orderCreatedEvent);
      
      this.logger.info('Order created and event published', { 
        orderId: order.id,
        sagaId: orderCreatedEvent.sagaId 
      });

      return order;
    } catch (error) {
      this.logger.error('Failed to create order', { error: error.message });
      throw error;
    }
  }

  async handleRiskApproved(event: any): Promise<void> {
    this.logger.info('Risk approved for order', { orderId: event.data.orderId });
    
    try {
      // Update order status to processing
      await this.orderRepository.updateOrderStatus(event.data.orderId, 'PROCESSING');
      
      this.logger.info('Order status updated to processing', { orderId: event.data.orderId });
    } catch (error) {
      this.logger.error('Failed to update order status', { 
        orderId: event.data.orderId,
        error: error.message 
      });
      throw error;
    }
  }

  async handleRiskRejected(event: any): Promise<void> {
    this.logger.info('Risk rejected for order', { orderId: event.data.orderId });
    
    try {
      // Update order status to cancelled
      await this.orderRepository.updateOrderStatus(event.data.orderId, 'CANCELLED');
      
      // Publish OrderCancelled event
      const orderCancelledEvent = createEvent('OrderCancelled', {
        orderId: event.data.orderId,
        customerId: event.data.customerId,
        reason: event.data.reason,
      }, event.sagaId, event.correlationId);

      await this.kafkaProducer.publishEvent(KAFKA_TOPICS.ORDER_EVENTS, orderCancelledEvent);
      
      this.logger.info('Order cancelled due to risk rejection', { orderId: event.data.orderId });
    } catch (error) {
      this.logger.error('Failed to cancel order', { 
        orderId: event.data.orderId,
        error: error.message 
      });
      throw error;
    }
  }

  async handleInventoryReserved(event: any): Promise<void> {
    this.logger.info('Inventory reserved for order', { orderId: event.data.orderId });
    
    // Order status remains PROCESSING, waiting for payment
    this.logger.info('Order ready for payment processing', { orderId: event.data.orderId });
  }

  async handleInventoryInsufficient(event: any): Promise<void> {
    this.logger.info('Insufficient inventory for order', { orderId: event.data.orderId });
    
    try {
      // Update order status to cancelled
      await this.orderRepository.updateOrderStatus(event.data.orderId, 'CANCELLED');
      
      // Publish OrderCancelled event
      const orderCancelledEvent = createEvent('OrderCancelled', {
        orderId: event.data.orderId,
        customerId: event.data.customerId,
        reason: 'Insufficient inventory',
      }, event.sagaId, event.correlationId);

      await this.kafkaProducer.publishEvent(KAFKA_TOPICS.ORDER_EVENTS, orderCancelledEvent);
      
      this.logger.info('Order cancelled due to insufficient inventory', { orderId: event.data.orderId });
    } catch (error) {
      this.logger.error('Failed to cancel order', { 
        orderId: event.data.orderId,
        error: error.message 
      });
      throw error;
    }
  }

  async handlePaymentProcessed(event: any): Promise<void> {
    this.logger.info('Payment processed for order', { orderId: event.data.orderId });
    
    try {
      // Update order status to completed
      await this.orderRepository.updateOrderStatus(event.data.orderId, 'COMPLETED');
      
      // Publish OrderCompleted event
      const orderCompletedEvent = createEvent('OrderCompleted', {
        orderId: event.data.orderId,
        customerId: event.data.customerId,
        totalAmount: event.data.amount,
      }, event.sagaId, event.correlationId);

      await this.kafkaProducer.publishEvent(KAFKA_TOPICS.ORDER_EVENTS, orderCompletedEvent);
      
      this.logger.info('Order completed successfully', { orderId: event.data.orderId });
    } catch (error) {
      this.logger.error('Failed to complete order', { 
        orderId: event.data.orderId,
        error: error.message 
      });
      throw error;
    }
  }

  async handlePaymentFailed(event: any): Promise<void> {
    this.logger.info('Payment failed for order', { orderId: event.data.orderId });
    
    try {
      // Update order status to failed
      await this.orderRepository.updateOrderStatus(event.data.orderId, 'FAILED');
      
      // Publish OrderCancelled event to trigger compensating actions
      const orderCancelledEvent = createEvent('OrderCancelled', {
        orderId: event.data.orderId,
        customerId: event.data.customerId,
        reason: event.data.reason,
      }, event.sagaId, event.correlationId);

      await this.kafkaProducer.publishEvent(KAFKA_TOPICS.ORDER_EVENTS, orderCancelledEvent);
      
      this.logger.info('Order cancelled due to payment failure', { orderId: event.data.orderId });
    } catch (error) {
      this.logger.error('Failed to cancel order', { 
        orderId: event.data.orderId,
        error: error.message 
      });
      throw error;
    }
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    return this.orderRepository.getOrderById(orderId);
  }

  async getOrdersByCustomerId(customerId: string): Promise<Order[]> {
    return this.orderRepository.getOrdersByCustomerId(customerId);
  }
}
