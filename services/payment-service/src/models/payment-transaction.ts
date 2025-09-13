import { Pool } from 'pg';
import { PaymentTransaction } from '@saga-pattern/shared';
import { v4 as uuidv4 } from 'uuid';

export class PaymentTransactionRepository {
  constructor(private db: Pool) {}

  async createTransaction(transaction: Omit<PaymentTransaction, 'id' | 'createdAt'>): Promise<PaymentTransaction> {
    const transactionId = uuidv4();
    const now = new Date();
    
    const query = `
      INSERT INTO payment_transactions (
        id, order_id, customer_id, amount, payment_method_id, 
        status, transaction_id, processed_at, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      transactionId,
      transaction.orderId,
      transaction.customerId,
      transaction.amount,
      transaction.paymentMethodId,
      transaction.status,
      transaction.transactionId || null,
      transaction.processedAt || null,
      now,
    ];

    const result = await this.db.query(query, values);
    return this.mapRowToTransaction(result.rows[0]);
  }

  async getTransactionById(transactionId: string): Promise<PaymentTransaction | null> {
    const query = 'SELECT * FROM payment_transactions WHERE id = $1';
    const result = await this.db.query(query, [transactionId]);
    
    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToTransaction(result.rows[0]);
  }

  async getTransactionsByOrderId(orderId: string): Promise<PaymentTransaction[]> {
    const query = 'SELECT * FROM payment_transactions WHERE order_id = $1 ORDER BY created_at DESC';
    const result = await this.db.query(query, [orderId]);
    
    return result.rows.map(row => this.mapRowToTransaction(row));
  }

  async updateTransactionStatus(transactionId: string, status: string, externalTransactionId?: string): Promise<PaymentTransaction | null> {
    const query = `
      UPDATE payment_transactions 
      SET status = $1, transaction_id = COALESCE($2, transaction_id), 
          processed_at = CASE WHEN $1 = 'COMPLETED' THEN $3 ELSE processed_at END,
          updated_at = $3
      WHERE id = $4 
      RETURNING *
    `;

    const result = await this.db.query(query, [status, externalTransactionId, new Date(), transactionId]);
    
    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToTransaction(result.rows[0]);
  }

  async getTransactionsByCustomerId(customerId: string): Promise<PaymentTransaction[]> {
    const query = 'SELECT * FROM payment_transactions WHERE customer_id = $1 ORDER BY created_at DESC';
    const result = await this.db.query(query, [customerId]);
    
    return result.rows.map(row => this.mapRowToTransaction(row));
  }

  private mapRowToTransaction(row: any): PaymentTransaction {
    return {
      id: row.id,
      orderId: row.order_id,
      customerId: row.customer_id,
      amount: parseFloat(row.amount),
      paymentMethodId: row.payment_method_id,
      status: row.status,
      transactionId: row.transaction_id,
      processedAt: row.processed_at ? new Date(row.processed_at) : undefined,
      createdAt: new Date(row.created_at),
    };
  }
}
