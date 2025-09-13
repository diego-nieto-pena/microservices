import { KafkaConsumer, EventHandler } from '@saga-pattern/shared';
import { OrderService } from '../services/order.service';
import { Logger } from '@saga-pattern/shared';

export class OrderEventHandler {
  constructor(
    private orderService: OrderService,
    private logger: Logger
  ) {}

  setupEventHandlers(consumer: KafkaConsumer): void {
    // Risk events
    consumer.onEvent('RiskApproved', this.handleRiskApproved.bind(this));
    consumer.onEvent('RiskRejected', this.handleRiskRejected.bind(this));

    // Inventory events
    consumer.onEvent('InventoryReserved', this.handleInventoryReserved.bind(this));
    consumer.onEvent('InventoryInsufficient', this.handleInventoryInsufficient.bind(this));

    // Payment events
    consumer.onEvent('PaymentProcessed', this.handlePaymentProcessed.bind(this));
    consumer.onEvent('PaymentFailed', this.handlePaymentFailed.bind(this));
  }

  private async handleRiskApproved(event: any): Promise<void> {
    this.logger.info('Handling RiskApproved event', { 
      orderId: event.data.orderId,
      sagaId: event.sagaId 
    });
    
    await this.orderService.handleRiskApproved(event);
  }

  private async handleRiskRejected(event: any): Promise<void> {
    this.logger.info('Handling RiskRejected event', { 
      orderId: event.data.orderId,
      sagaId: event.sagaId 
    });
    
    await this.orderService.handleRiskRejected(event);
  }

  private async handleInventoryReserved(event: any): Promise<void> {
    this.logger.info('Handling InventoryReserved event', { 
      orderId: event.data.orderId,
      sagaId: event.sagaId 
    });
    
    await this.orderService.handleInventoryReserved(event);
  }

  private async handleInventoryInsufficient(event: any): Promise<void> {
    this.logger.info('Handling InventoryInsufficient event', { 
      orderId: event.data.orderId,
      sagaId: event.sagaId 
    });
    
    await this.orderService.handleInventoryInsufficient(event);
  }

  private async handlePaymentProcessed(event: any): Promise<void> {
    this.logger.info('Handling PaymentProcessed event', { 
      orderId: event.data.orderId,
      sagaId: event.sagaId 
    });
    
    await this.orderService.handlePaymentProcessed(event);
  }

  private async handlePaymentFailed(event: any): Promise<void> {
    this.logger.info('Handling PaymentFailed event', { 
      orderId: event.data.orderId,
      sagaId: event.sagaId 
    });
    
    await this.orderService.handlePaymentFailed(event);
  }
}
