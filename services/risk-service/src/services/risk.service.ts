import { CustomerRiskRepository } from '../models/customer-risk';
import { KAFKA_TOPICS, createEvent, RISK_LEVELS } from '@saga-pattern/shared';
import { KafkaProducer } from '@saga-pattern/shared';
import { Logger } from '@saga-pattern/shared';

export class RiskService {
  constructor(
    private customerRiskRepository: CustomerRiskRepository,
    private kafkaProducer: KafkaProducer,
    private logger: Logger
  ) {}

  async assessRisk(orderId: string, customerId: string, amount: number): Promise<void> {
    this.logger.info('Assessing risk for order', { orderId, customerId, amount });
    
    try {
      // Get customer risk profile
      let riskProfile = await this.customerRiskRepository.getRiskProfileByCustomerId(customerId);
      
      // If no profile exists, create a default one
      if (!riskProfile) {
        riskProfile = await this.createDefaultRiskProfile(customerId);
      }

      // Perform risk assessment
      const assessment = this.performRiskAssessment(riskProfile, amount);
      
      if (assessment.approved) {
        // Publish RiskApproved event
        const riskApprovedEvent = createEvent('RiskApproved', {
          orderId,
          customerId,
          creditScore: riskProfile.creditScore,
          approvedAmount: amount,
        });

        await this.kafkaProducer.publishEvent(KAFKA_TOPICS.RISK_EVENTS, riskApprovedEvent);
        
        this.logger.info('Risk approved for order', { 
          orderId, 
          customerId, 
          creditScore: riskProfile.creditScore 
        });
      } else {
        // Publish RiskRejected event
        const riskRejectedEvent = createEvent('RiskRejected', {
          orderId,
          customerId,
          reason: assessment.reason,
          creditScore: riskProfile.creditScore,
        });

        await this.kafkaProducer.publishEvent(KAFKA_TOPICS.RISK_EVENTS, riskRejectedEvent);
        
        this.logger.info('Risk rejected for order', { 
          orderId, 
          customerId, 
          reason: assessment.reason 
        });
      }
    } catch (error) {
      this.logger.error('Failed to assess risk', { 
        orderId, 
        customerId, 
        error: error.message 
      });
      
      // Publish RiskRejected event on error
      const riskRejectedEvent = createEvent('RiskRejected', {
        orderId,
        customerId,
        reason: 'Risk assessment failed due to system error',
        creditScore: 0,
      });

      await this.kafkaProducer.publishEvent(KAFKA_TOPICS.RISK_EVENTS, riskRejectedEvent);
    }
  }

  async handleOrderCancelled(event: any): Promise<void> {
    this.logger.info('Handling order cancellation for risk service', { 
      orderId: event.data.orderId 
    });
    
    // Risk service doesn't need to take any compensating action
    // as it only performs assessments and doesn't modify state
    this.logger.info('Order cancellation processed by risk service', { 
      orderId: event.data.orderId 
    });
  }

  private async createDefaultRiskProfile(customerId: string) {
    // Create a default risk profile with moderate risk
    const defaultProfile = {
      customerId,
      creditScore: 650, // Moderate credit score
      monthlyIncome: 5000, // $5000 monthly income
      currentDebt: 1000, // $1000 current debt
      riskLevel: RISK_LEVELS.MEDIUM,
      maxOrderAmount: 1000, // $1000 max order amount
    };

    return this.customerRiskRepository.createOrUpdateRiskProfile(defaultProfile);
  }

  private performRiskAssessment(profile: any, amount: number): { approved: boolean; reason?: string } {
    // Check if amount exceeds max order amount
    if (amount > profile.maxOrderAmount) {
      return {
        approved: false,
        reason: `Order amount $${amount} exceeds maximum allowed amount $${profile.maxOrderAmount}`,
      };
    }

    // Check credit score thresholds
    if (profile.creditScore < 500) {
      return {
        approved: false,
        reason: `Credit score ${profile.creditScore} is too low (minimum 500 required)`,
      };
    }

    // Check debt-to-income ratio
    const debtToIncomeRatio = profile.currentDebt / profile.monthlyIncome;
    if (debtToIncomeRatio > 0.4) {
      return {
        approved: false,
        reason: `Debt-to-income ratio ${(debtToIncomeRatio * 100).toFixed(1)}% is too high (maximum 40% allowed)`,
      };
    }

    // Check risk level specific rules
    switch (profile.riskLevel) {
      case RISK_LEVELS.HIGH:
        if (amount > 500) {
          return {
            approved: false,
            reason: 'High-risk customer cannot place orders over $500',
          };
        }
        break;
      case RISK_LEVELS.MEDIUM:
        if (amount > 1000) {
          return {
            approved: false,
            reason: 'Medium-risk customer cannot place orders over $1000',
          };
        }
        break;
      case RISK_LEVELS.LOW:
        // Low-risk customers have higher limits
        if (amount > 5000) {
          return {
            approved: false,
            reason: 'Order amount exceeds maximum limit for low-risk customers',
          };
        }
        break;
    }

    return { approved: true };
  }

  async getRiskProfile(customerId: string) {
    return this.customerRiskRepository.getRiskProfileByCustomerId(customerId);
  }

  async updateRiskProfile(customerId: string, updates: Partial<any>) {
    const existingProfile = await this.customerRiskRepository.getRiskProfileByCustomerId(customerId);
    
    if (!existingProfile) {
      throw new Error('Risk profile not found');
    }

    const updatedProfile = { ...existingProfile, ...updates };
    return this.customerRiskRepository.createOrUpdateRiskProfile(updatedProfile);
  }
}
