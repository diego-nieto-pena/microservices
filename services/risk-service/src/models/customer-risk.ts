import { Pool } from 'pg';
import { CustomerRiskProfile } from '@saga-pattern/shared';
import { v4 as uuidv4 } from 'uuid';

export class CustomerRiskRepository {
  constructor(private db: Pool) {}

  async createOrUpdateRiskProfile(profile: Omit<CustomerRiskProfile, 'lastUpdated'>): Promise<CustomerRiskProfile> {
    const now = new Date();
    
    const query = `
      INSERT INTO customer_risk_profiles (
        customer_id, credit_score, monthly_income, current_debt, 
        risk_level, max_order_amount, last_updated
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (customer_id) 
      DO UPDATE SET
        credit_score = EXCLUDED.credit_score,
        monthly_income = EXCLUDED.monthly_income,
        current_debt = EXCLUDED.current_debt,
        risk_level = EXCLUDED.risk_level,
        max_order_amount = EXCLUDED.max_order_amount,
        last_updated = EXCLUDED.last_updated
      RETURNING *
    `;

    const values = [
      profile.customerId,
      profile.creditScore,
      profile.monthlyIncome,
      profile.currentDebt,
      profile.riskLevel,
      profile.maxOrderAmount,
      now,
    ];

    const result = await this.db.query(query, values);
    return this.mapRowToRiskProfile(result.rows[0]);
  }

  async getRiskProfileByCustomerId(customerId: string): Promise<CustomerRiskProfile | null> {
    const query = 'SELECT * FROM customer_risk_profiles WHERE customer_id = $1';
    const result = await this.db.query(query, [customerId]);
    
    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToRiskProfile(result.rows[0]);
  }

  async updateMaxOrderAmount(customerId: string, newMaxAmount: number): Promise<CustomerRiskProfile | null> {
    const query = `
      UPDATE customer_risk_profiles 
      SET max_order_amount = $1, last_updated = $2 
      WHERE customer_id = $3 
      RETURNING *
    `;

    const result = await this.db.query(query, [newMaxAmount, new Date(), customerId]);
    
    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToRiskProfile(result.rows[0]);
  }

  private mapRowToRiskProfile(row: any): CustomerRiskProfile {
    return {
      customerId: row.customer_id,
      creditScore: row.credit_score,
      monthlyIncome: parseFloat(row.monthly_income),
      currentDebt: parseFloat(row.current_debt),
      riskLevel: row.risk_level,
      maxOrderAmount: parseFloat(row.max_order_amount),
      lastUpdated: new Date(row.last_updated),
    };
  }
}
