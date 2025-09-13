import { KafkaConsumer, EventHandler } from '@saga-pattern/shared';
import { RiskService } from '../services/risk.service';
import { Logger } from '@saga-pattern/shared';

export class RiskEventHandler {
  constructor(
    private riskService: RiskService,
    private logger: Logger
  ) {}

  setupEventHandlers(consumer: KafkaConsumer): void {
    // Order events
    consumer.onEvent('OrderCreated', this.handleOrderCreated.bind(this));
    consumer.onEvent('OrderCancelled', this.handleOrderCancelled.bind(this));
  }

  private async handleOrderCreated(event: any): Promise<void> {
    this.logger.info('Handling OrderCreated event', { 
      orderId: event.data.orderId,
      sagaId: event.sagaId 
    });
    
    await this.riskService.assessRisk(
      event.data.orderId,
      event.data.customerId,
      event.data.totalAmount
    );
  }

  private async handleOrderCancelled(event: any): Promise<void> {
    this.logger.info('Handling OrderCancelled event', { 
      orderId: event.data.orderId,
      sagaId: event.sagaId 
    });
    
    await this.riskService.handleOrderCancelled(event);
  }
}
