import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';
import { CreateOrderRequestSchema } from '@saga-pattern/shared';
import { Logger } from '@saga-pattern/shared';

export class OrderController {
  constructor(
    private orderService: OrderService,
    private logger: Logger
  ) {}

  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = CreateOrderRequestSchema.parse(req.body);
      
      const order = await this.orderService.createOrder(validatedData);
      
      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: order,
      });
    } catch (error) {
      this.logger.error('Failed to create order', { error: error.message });
      
      if (error.name === 'ZodError') {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.errors,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.params;
      
      const order = await this.orderService.getOrderById(orderId);
      
      if (!order) {
        res.status(404).json({
          success: false,
          message: 'Order not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Order retrieved successfully',
        data: order,
      });
    } catch (error) {
      this.logger.error('Failed to get order', { 
        orderId: req.params.orderId,
        error: error.message 
      });

      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async getOrdersByCustomerId(req: Request, res: Response): Promise<void> {
    try {
      const { customerId } = req.params;
      
      const orders = await this.orderService.getOrdersByCustomerId(customerId);
      
      res.json({
        success: true,
        message: 'Orders retrieved successfully',
        data: orders,
      });
    } catch (error) {
      this.logger.error('Failed to get orders by customer', { 
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
      message: 'Order service is healthy',
      timestamp: new Date().toISOString(),
    });
  }
}
