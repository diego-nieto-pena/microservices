import { Request, Response } from 'express';
import { RiskService } from '../services/risk.service';
import { Logger } from '@saga-pattern/shared';

export class RiskController {
  constructor(
    private riskService: RiskService,
    private logger: Logger
  ) {}

  async getRiskProfile(req: Request, res: Response): Promise<void> {
    try {
      const { customerId } = req.params;
      
      const riskProfile = await this.riskService.getRiskProfile(customerId);
      
      if (!riskProfile) {
        res.status(404).json({
          success: false,
          message: 'Risk profile not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Risk profile retrieved successfully',
        data: riskProfile,
      });
    } catch (error: any) {
      this.logger.error('Failed to get risk profile', { 
        customerId: req.params.customerId,
        error: error.message 
      });

      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async updateRiskProfile(req: Request, res: Response): Promise<void> {
    try {
      const { customerId } = req.params;
      const updates = req.body;
      
      const updatedProfile = await this.riskService.updateRiskProfile(customerId, updates);
      
      res.json({
        success: true,
        message: 'Risk profile updated successfully',
        data: updatedProfile,
      });
    } catch (error: any) {
      this.logger.error('Failed to update risk profile', { 
        customerId: req.params.customerId,
        error: error.message 
      });

      if ((error as any).message === 'Risk profile not found') {
        res.status(404).json({
          success: false,
          message: 'Risk profile not found',
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async healthCheck(req: Request, res: Response): Promise<void> {
    res.json({
      success: true,
      message: 'Risk service is healthy',
      timestamp: new Date().toISOString(),
    });
  }
}
