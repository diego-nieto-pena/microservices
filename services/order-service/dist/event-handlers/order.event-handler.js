"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderEventHandler = void 0;
class OrderEventHandler {
    orderService;
    logger;
    constructor(orderService, logger) {
        this.orderService = orderService;
        this.logger = logger;
    }
    setupEventHandlers(consumer) {
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
    async handleRiskApproved(event) {
        this.logger.info('Handling RiskApproved event', {
            orderId: event.data.orderId,
            sagaId: event.sagaId
        });
        await this.orderService.handleRiskApproved(event);
    }
    async handleRiskRejected(event) {
        this.logger.info('Handling RiskRejected event', {
            orderId: event.data.orderId,
            sagaId: event.sagaId
        });
        await this.orderService.handleRiskRejected(event);
    }
    async handleInventoryReserved(event) {
        this.logger.info('Handling InventoryReserved event', {
            orderId: event.data.orderId,
            sagaId: event.sagaId
        });
        await this.orderService.handleInventoryReserved(event);
    }
    async handleInventoryInsufficient(event) {
        this.logger.info('Handling InventoryInsufficient event', {
            orderId: event.data.orderId,
            sagaId: event.sagaId
        });
        await this.orderService.handleInventoryInsufficient(event);
    }
    async handlePaymentProcessed(event) {
        this.logger.info('Handling PaymentProcessed event', {
            orderId: event.data.orderId,
            sagaId: event.sagaId
        });
        await this.orderService.handlePaymentProcessed(event);
    }
    async handlePaymentFailed(event) {
        this.logger.info('Handling PaymentFailed event', {
            orderId: event.data.orderId,
            sagaId: event.sagaId
        });
        await this.orderService.handlePaymentFailed(event);
    }
}
exports.OrderEventHandler = OrderEventHandler;
