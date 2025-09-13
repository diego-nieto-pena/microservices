import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';

export function createPaymentRoutes(paymentController: PaymentController): Router {
  const router = Router();

  // Health check
  router.get('/health', (req, res) => paymentController.healthCheck(req, res));

  // Transaction routes
  router.get('/transactions/:transactionId', (req, res) => paymentController.getTransactionById(req, res));
  router.get('/transactions/order/:orderId', (req, res) => paymentController.getTransactionsByOrderId(req, res));
  router.get('/transactions/customer/:customerId', (req, res) => paymentController.getTransactionsByCustomerId(req, res));

  // Payment method routes
  router.get('/methods/:customerId', (req, res) => paymentController.getPaymentMethodsByCustomerId(req, res));
  router.post('/methods', (req, res) => paymentController.createPaymentMethod(req, res));

  return router;
}
