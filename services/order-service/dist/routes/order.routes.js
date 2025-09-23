"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderRoutes = createOrderRoutes;
const express_1 = require("express");
function createOrderRoutes(orderController) {
    const router = (0, express_1.Router)();
    // Health check
    router.get('/health', (req, res) => orderController.healthCheck(req, res));
    // Order routes
    router.post('/', (req, res) => orderController.createOrder(req, res));
    router.get('/:orderId', (req, res) => orderController.getOrderById(req, res));
    router.get('/customer/:customerId', (req, res) => orderController.getOrdersByCustomerId(req, res));
    return router;
}
