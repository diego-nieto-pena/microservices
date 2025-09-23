import { ProductRepository } from '../models/product';
import { InventoryReservationRepository } from '../models/inventory-reservation';
import { KAFKA_TOPICS, createEvent } from '@saga-pattern/shared';
import { KafkaProducer } from '@saga-pattern/shared';
import { Logger } from '@saga-pattern/shared';

export class InventoryService {
  constructor(
    private productRepository: ProductRepository,
    private inventoryReservationRepository: InventoryReservationRepository,
    private kafkaProducer: KafkaProducer,
    private logger: Logger
  ) {}

  async reserveInventory(orderId: string, items: Array<{ productId: string; quantity: number }>): Promise<void> {
    this.logger.info('Reserving inventory for order', { orderId, items });
    
    try {
      const reservations = [];
      const insufficientItems = [];

      // Check availability and reserve inventory for each item
      for (const item of items) {
        const product = await this.productRepository.getProductById(item.productId);
        
        if (!product) {
          this.logger.warn('Product not found', { productId: item.productId });
          insufficientItems.push({
            productId: item.productId,
            requestedQuantity: item.quantity,
            availableQuantity: 0,
          });
          continue;
        }

        if (product.availableQuantity < item.quantity) {
          this.logger.warn('Insufficient inventory', { 
            productId: item.productId,
            requested: item.quantity,
            available: product.availableQuantity 
          });
          insufficientItems.push({
            productId: item.productId,
            requestedQuantity: item.quantity,
            availableQuantity: product.availableQuantity,
          });
          continue;
        }

        // Reserve the inventory
        const reserved = await this.productRepository.reserveInventory(item.productId, item.quantity);
        
        if (!reserved) {
          this.logger.warn('Failed to reserve inventory', { productId: item.productId });
          insufficientItems.push({
            productId: item.productId,
            requestedQuantity: item.quantity,
            availableQuantity: product.availableQuantity,
          });
          continue;
        }

        // Create reservation record
        const reservation = await this.inventoryReservationRepository.createReservation({
          orderId,
          productId: item.productId,
          quantity: item.quantity,
        // repository will set status/expiresAt/reservedAt; include status to satisfy type
        status: 'ACTIVE',
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      } as any);

        reservations.push({
          productId: item.productId,
          quantity: item.quantity,
          reservedAt: reservation.reservedAt,
        });
      }

      if (insufficientItems.length > 0) {
        // Release any successful reservations
        for (const reservation of reservations) {
          await this.productRepository.releaseInventory(reservation.productId, reservation.quantity);
        }

        // Publish InventoryInsufficient event
        const inventoryInsufficientEvent = createEvent('InventoryInsufficient', {
          orderId,
          items: insufficientItems,
        });

        await this.kafkaProducer.publishEvent(KAFKA_TOPICS.INVENTORY_EVENTS, inventoryInsufficientEvent);
        
        this.logger.info('Inventory insufficient for order', { orderId, insufficientItems });
        return;
      }

      // Publish InventoryReserved event
      const inventoryReservedEvent = createEvent('InventoryReserved', {
        orderId,
        items: reservations,
      });

      await this.kafkaProducer.publishEvent(KAFKA_TOPICS.INVENTORY_EVENTS, inventoryReservedEvent);
      
      this.logger.info('Inventory reserved successfully for order', { orderId, reservations });
    } catch (error: any) {
      this.logger.error('Failed to reserve inventory', { 
        orderId, 
        error: error.message 
      });
      
      // Publish InventoryInsufficient event on error
      const inventoryInsufficientEvent = createEvent('InventoryInsufficient', {
        orderId,
        items: items.map(item => ({
          productId: item.productId,
          requestedQuantity: item.quantity,
          availableQuantity: 0,
        })),
      });

      await this.kafkaProducer.publishEvent(KAFKA_TOPICS.INVENTORY_EVENTS, inventoryInsufficientEvent);
    }
  }

  async handleOrderCancelled(event: any): Promise<void> {
    this.logger.info('Handling order cancellation for inventory service', { 
      orderId: event.data.orderId 
    });
    
    try {
      // Get all reservations for this order
      const reservations = await this.inventoryReservationRepository.getReservationsByOrderId(event.data.orderId);
      
      // Release inventory for each reservation
      for (const reservation of reservations) {
        if (reservation.status === 'ACTIVE') {
          await this.productRepository.releaseInventory(reservation.productId, reservation.quantity);
        }
      }

      // Mark reservations as released
      await this.inventoryReservationRepository.releaseReservationsByOrderId(event.data.orderId);

      // Publish InventoryReleased event
      const inventoryReleasedEvent = createEvent('InventoryReleased', {
        orderId: event.data.orderId,
        items: reservations.map(r => ({
          productId: r.productId,
          quantity: r.quantity,
          releasedAt: new Date(),
        })),
      }, event.sagaId, event.correlationId);

      await this.kafkaProducer.publishEvent(KAFKA_TOPICS.INVENTORY_EVENTS, inventoryReleasedEvent);
      
      this.logger.info('Inventory released for cancelled order', { 
        orderId: event.data.orderId,
        reservations: reservations.length 
      });
    } catch (error: any) {
      this.logger.error('Failed to release inventory for cancelled order', { 
        orderId: event.data.orderId,
        error: error.message 
      });
    }
  }

  async getProductById(productId: string) {
    return this.productRepository.getProductById(productId);
  }

  async getAllProducts() {
    return this.productRepository.getAllProducts();
  }

  async updateProductStock(productId: string, stockQuantity: number) {
    return this.productRepository.updateProductStock(productId, stockQuantity);
  }

  async createProduct(product: Omit<any, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.productRepository.createProduct(product);
  }
}
