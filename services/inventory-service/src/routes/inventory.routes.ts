import { Router } from 'express';
import { InventoryController } from '../controllers/inventory.controller';

export function createInventoryRoutes(inventoryController: InventoryController): Router {
  const router = Router();

  // Health check
  router.get('/health', (req, res) => inventoryController.healthCheck(req, res));

  // Product routes
  router.get('/products', (req, res) => inventoryController.getAllProducts(req, res));
  router.get('/products/:productId', (req, res) => inventoryController.getProductById(req, res));
  router.post('/products', (req, res) => inventoryController.createProduct(req, res));
  router.put('/products/:productId/stock', (req, res) => inventoryController.updateProductStock(req, res));

  return router;
}
