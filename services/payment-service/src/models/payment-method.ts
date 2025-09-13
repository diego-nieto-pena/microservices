import { Pool } from 'pg';
import { PaymentMethod } from '@saga-pattern/shared';
import { v4 as uuidv4 } from 'uuid';

export class PaymentMethodRepository {
  constructor(private db: Pool) {}

  async createPaymentMethod(paymentMethod: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod> {
    const paymentMethodId = uuidv4();
    
    const query = `
      INSERT INTO payment_methods (
        id, customer_id, type, last_four_digits, expiry_month, 
        expiry_year, is_default
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [
      paymentMethodId,
      paymentMethod.customerId,
      paymentMethod.type,
      paymentMethod.lastFourDigits,
      paymentMethod.expiryMonth,
      paymentMethod.expiryYear,
      paymentMethod.isDefault,
    ];

    const result = await this.db.query(query, values);
    return this.mapRowToPaymentMethod(result.rows[0]);
  }

  async getPaymentMethodById(paymentMethodId: string): Promise<PaymentMethod | null> {
    const query = 'SELECT * FROM payment_methods WHERE id = $1';
    const result = await this.db.query(query, [paymentMethodId]);
    
    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToPaymentMethod(result.rows[0]);
  }

  async getPaymentMethodsByCustomerId(customerId: string): Promise<PaymentMethod[]> {
    const query = 'SELECT * FROM payment_methods WHERE customer_id = $1 ORDER BY is_default DESC, created_at DESC';
    const result = await this.db.query(query, [customerId]);
    
    return result.rows.map(row => this.mapRowToPaymentMethod(row));
  }

  async getDefaultPaymentMethod(customerId: string): Promise<PaymentMethod | null> {
    const query = 'SELECT * FROM payment_methods WHERE customer_id = $1 AND is_default = true LIMIT 1';
    const result = await this.db.query(query, [customerId]);
    
    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToPaymentMethod(result.rows[0]);
  }

  async setDefaultPaymentMethod(customerId: string, paymentMethodId: string): Promise<void> {
    // First, unset all default payment methods for this customer
    await this.db.query(
      'UPDATE payment_methods SET is_default = false WHERE customer_id = $1',
      [customerId]
    );

    // Then set the specified payment method as default
    await this.db.query(
      'UPDATE payment_methods SET is_default = true WHERE id = $1 AND customer_id = $2',
      [paymentMethodId, customerId]
    );
  }

  private mapRowToPaymentMethod(row: any): PaymentMethod {
    return {
      id: row.id,
      customerId: row.customer_id,
      type: row.type,
      lastFourDigits: row.last_four_digits,
      expiryMonth: row.expiry_month,
      expiryYear: row.expiry_year,
      isDefault: row.is_default,
    };
  }
}
