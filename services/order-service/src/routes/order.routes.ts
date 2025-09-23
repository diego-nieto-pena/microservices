import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';

export function createOrderRoutes(orderController: OrderController): Router {
  const router = Router();

  // Health check
  router.get('/health', (req: any, res: any) => orderController.healthCheck(req, res));

  // Order routes
  router.post('/', (req: any, res: any) => orderController.createOrder(req, res));
  router.get('/:orderId', (req: any, res: any) => orderController.getOrderById(req, res));
  router.get('/customer/:customerId', (req: any, res: any) => orderController.getOrdersByCustomerId(req, res));

  return router;
}
