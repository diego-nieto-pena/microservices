import { KafkaConsumer, EventHandler } from '@saga-pattern/shared';
import { PaymentService } from '../services/payment.service';
import { Logger } from '@saga-pattern/shared';

export class PaymentEventHandler {
  constructor(
    private paymentService: PaymentService,
    private logger: Logger
  ) {}

  setupEventHandlers(consumer: KafkaConsumer): void {
    // Inventory events
    consumer.onEvent('InventoryReserved', this.handleInventoryReserved.bind(this));
    consumer.onEvent('InventoryInsufficient', this.handleInventoryInsufficient.bind(this));

    // Order events
    consumer.onEvent('OrderCancelled', this.handleOrderCancelled.bind(this));
  }

  private async handleInventoryReserved(event: any): Promise<void> {
    this.logger.info('Handling InventoryReserved event', { 
      orderId: event.data.orderId,
      sagaId: event.sagaId 
    });
    
    // Extract payment information from the original order event
    // In a real implementation, you might need to fetch this from the order service
    // For this example, we'll use default values
    const customerId = event.data.customerId || 'customer-1'; // Default customer
    const amount = event.data.totalAmount || 100; // Default amount
    const paymentMethodId = event.data.paymentMethodId || 'pm-default'; // Default payment method
    
    await this.paymentService.processPayment(
      event.data.orderId,
      customerId,
      amount,
      paymentMethodId
    );
  }

  private async handleInventoryInsufficient(event: any): Promise<void> {
    this.logger.info('Handling InventoryInsufficient event', { 
      orderId: event.data.orderId,
      sagaId: event.sagaId 
    });
    
    // Inventory was insufficient, so we don't need to process payment
    this.logger.info('Inventory insufficient, no payment processing needed', { 
      orderId: event.data.orderId 
    });
  }

  private async handleOrderCancelled(event: any): Promise<void> {
    this.logger.info('Handling OrderCancelled event', { 
      orderId: event.data.orderId,
      sagaId: event.sagaId 
    });
    
    await this.paymentService.handleOrderCancelled(event);
  }
}
