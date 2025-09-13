import { Request, Response } from 'express';
import { InventoryService } from '../services/inventory.service';
import { Logger } from '@saga-pattern/shared';

export class InventoryController {
  constructor(
    private inventoryService: InventoryService,
    private logger: Logger
  ) {}

  async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const { productId } = req.params;
      
      const product = await this.inventoryService.getProductById(productId);
      
      if (!product) {
        res.status(404).json({
          success: false,
          message: 'Product not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Product retrieved successfully',
        data: product,
      });
    } catch (error) {
      this.logger.error('Failed to get product', { 
        productId: req.params.productId,
        error: error.message 
      });

      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await this.inventoryService.getAllProducts();
      
      res.json({
        success: true,
        message: 'Products retrieved successfully',
        data: products,
      });
    } catch (error) {
      this.logger.error('Failed to get products', { error: error.message });

      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async updateProductStock(req: Request, res: Response): Promise<void> {
    try {
      const { productId } = req.params;
      const { stockQuantity } = req.body;
      
      if (typeof stockQuantity !== 'number' || stockQuantity < 0) {
        res.status(400).json({
          success: false,
          message: 'Invalid stock quantity',
        });
        return;
      }

      const product = await this.inventoryService.updateProductStock(productId, stockQuantity);
      
      if (!product) {
        res.status(404).json({
          success: false,
          message: 'Product not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Product stock updated successfully',
        data: product,
      });
    } catch (error) {
      this.logger.error('Failed to update product stock', { 
        productId: req.params.productId,
        error: error.message 
      });

      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const productData = req.body;
      
      const product = await this.inventoryService.createProduct(productData);
      
      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product,
      });
    } catch (error) {
      this.logger.error('Failed to create product', { error: error.message });

      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async healthCheck(req: Request, res: Response): Promise<void> {
    res.json({
      success: true,
      message: 'Inventory service is healthy',
      timestamp: new Date().toISOString(),
    });
  }
}
