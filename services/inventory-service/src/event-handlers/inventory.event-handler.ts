import { KafkaConsumer, EventHandler } from '@saga-pattern/shared';
import { InventoryService } from '../services/inventory.service';
import { Logger } from '@saga-pattern/shared';

export class InventoryEventHandler {
  constructor(
    private inventoryService: InventoryService,
    private logger: Logger
  ) {}

  setupEventHandlers(consumer: KafkaConsumer): void {
    // Risk events
    consumer.onEvent('RiskApproved', this.handleRiskApproved.bind(this));
    consumer.onEvent('RiskRejected', this.handleRiskRejected.bind(this));

    // Order events
    consumer.onEvent('OrderCancelled', this.handleOrderCancelled.bind(this));
  }

  private async handleRiskApproved(event: any): Promise<void> {
    this.logger.info('Handling RiskApproved event', { 
      orderId: event.data.orderId,
      sagaId: event.sagaId 
    });
    
    // Extract items from the original order event
    // In a real implementation, you might need to fetch this from the order service
    // For this example, we'll assume the items are passed in the risk event
    const items = event.data.items || [];
    
    if (items.length > 0) {
      await this.inventoryService.reserveInventory(event.data.orderId, items);
    } else {
      this.logger.warn('No items found in RiskApproved event', { 
        orderId: event.data.orderId 
      });
    }
  }

  private async handleRiskRejected(event: any): Promise<void> {
    this.logger.info('Handling RiskRejected event', { 
      orderId: event.data.orderId,
      sagaId: event.sagaId 
    });
    
    // Risk was rejected, so we don't need to reserve inventory
    this.logger.info('Risk rejected, no inventory reservation needed', { 
      orderId: event.data.orderId 
    });
  }

  private async handleOrderCancelled(event: any): Promise<void> {
    this.logger.info('Handling OrderCancelled event', { 
      orderId: event.data.orderId,
      sagaId: event.sagaId 
    });
    
    await this.inventoryService.handleOrderCancelled(event);
  }
}
