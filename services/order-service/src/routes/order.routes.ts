import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';

export function createOrderRoutes(orderController: OrderController): Router {
  const router = Router();

  // Health check
  router.get('/health', (req, res) => orderController.healthCheck(req, res));

  // Order routes
  router.post('/', (req, res) => orderController.createOrder(req, res));
  router.get('/:orderId', (req, res) => orderController.getOrderById(req, res));
  router.get('/customer/:customerId', (req, res) => orderController.getOrdersByCustomerId(req, res));

  return router;
}
