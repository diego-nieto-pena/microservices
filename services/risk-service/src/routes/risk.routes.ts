import { Router } from 'express';
import { RiskController } from '../controllers/risk.controller';

export function createRiskRoutes(riskController: RiskController): Router {
  const router = Router();

  // Health check
  router.get('/health', (req, res) => riskController.healthCheck(req, res));

  // Risk profile routes
  router.get('/profile/:customerId', (req, res) => riskController.getRiskProfile(req, res));
  router.put('/profile/:customerId', (req, res) => riskController.updateRiskProfile(req, res));

  return router;
}
