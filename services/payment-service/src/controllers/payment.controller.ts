import { Request, Response } from 'express';
import { PaymentService } from '../services/payment.service';
import { Logger } from '@saga-pattern/shared';

export class PaymentController {
  constructor(
    private paymentService: PaymentService,
    private logger: Logger
  ) {}

  async getTransactionById(req: Request, res: Response): Promise<void> {
    try {
      const { transactionId } = req.params;
      
      const transaction = await this.paymentService.getTransactionById(transactionId);
      
      if (!transaction) {
        res.status(404).json({
          success: false,
          message: 'Transaction not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Transaction retrieved successfully',
        data: transaction,
      });
    } catch (error) {
      this.logger.error('Failed to get transaction', { 
        transactionId: req.params.transactionId,
        error: error.message 
      });

      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async getTransactionsByOrderId(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.params;
      
      const transactions = await this.paymentService.getTransactionsByOrderId(orderId);
      
      res.json({
        success: true,
        message: 'Transactions retrieved successfully',
        data: transactions,
      });
    } catch (error) {
      this.logger.error('Failed to get transactions by order', { 
        orderId: req.params.orderId,
        error: error.message 
      });

      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async getTransactionsByCustomerId(req: Request, res: Response): Promise<void> {
    try {
      const { customerId } = req.params;
      
      const transactions = await this.paymentService.getTransactionsByCustomerId(customerId);
      
      res.json({
        success: true,
        message: 'Transactions retrieved successfully',
        data: transactions,
      });
    } catch (error) {
      this.logger.error('Failed to get transactions by customer', { 
        customerId: req.params.customerId,
        error: error.message 
      });

      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async createPaymentMethod(req: Request, res: Response): Promise<void> {
    try {
      const paymentMethodData = req.body;
      
      const paymentMethod = await this.paymentService.createPaymentMethod(paymentMethodData);
      
      res.status(201).json({
        success: true,
        message: 'Payment method created successfully',
        data: paymentMethod,
      });
    } catch (error) {
      this.logger.error('Failed to create payment method', { error: error.message });

      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async getPaymentMethodsByCustomerId(req: Request, res: Response): Promise<void> {
    try {
      const { customerId } = req.params;
      
      const paymentMethods = await this.paymentService.getPaymentMethodsByCustomerId(customerId);
      
      res.json({
        success: true,
        message: 'Payment methods retrieved successfully',
        data: paymentMethods,
      });
    } catch (error) {
      this.logger.error('Failed to get payment methods', { 
        customerId: req.params.customerId,
        error: error.message 
      });

      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async healthCheck(req: Request, res: Response): Promise<void> {
    res.json({
      success: true,
      message: 'Payment service is healthy',
      timestamp: new Date().toISOString(),
    });
  }
}
