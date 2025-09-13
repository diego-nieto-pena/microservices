import { Pool } from 'pg';
import { InventoryReservation } from '@saga-pattern/shared';
import { v4 as uuidv4 } from 'uuid';

export class InventoryReservationRepository {
  constructor(private db: Pool) {}

  async createReservation(reservation: Omit<InventoryReservation, 'id' | 'reservedAt'>): Promise<InventoryReservation> {
    const reservationId = uuidv4();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes from now
    
    const query = `
      INSERT INTO inventory_reservations (
        id, order_id, product_id, quantity, reserved_at, expires_at, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [
      reservationId,
      reservation.orderId,
      reservation.productId,
      reservation.quantity,
      now,
      expiresAt,
      'ACTIVE',
    ];

    const result = await this.db.query(query, values);
    return this.mapRowToReservation(result.rows[0]);
  }

  async getReservationsByOrderId(orderId: string): Promise<InventoryReservation[]> {
    const query = 'SELECT * FROM inventory_reservations WHERE order_id = $1 ORDER BY reserved_at DESC';
    const result = await this.db.query(query, [orderId]);
    
    return result.rows.map(row => this.mapRowToReservation(row));
  }

  async releaseReservationsByOrderId(orderId: string): Promise<void> {
    const query = `
      UPDATE inventory_reservations 
      SET status = 'RELEASED', updated_at = $1 
      WHERE order_id = $2 AND status = 'ACTIVE'
    `;

    await this.db.query(query, [new Date(), orderId]);
  }

  async getActiveReservationsByProductId(productId: string): Promise<InventoryReservation[]> {
    const query = `
      SELECT * FROM inventory_reservations 
      WHERE product_id = $1 AND status = 'ACTIVE' AND expires_at > NOW()
      ORDER BY reserved_at DESC
    `;
    const result = await this.db.query(query, [productId]);
    
    return result.rows.map(row => this.mapRowToReservation(row));
  }

  async cleanupExpiredReservations(): Promise<void> {
    const query = `
      UPDATE inventory_reservations 
      SET status = 'EXPIRED', updated_at = $1 
      WHERE status = 'ACTIVE' AND expires_at <= NOW()
    `;

    await this.db.query(query, [new Date()]);
  }

  private mapRowToReservation(row: any): InventoryReservation {
    return {
      id: row.id,
      orderId: row.order_id,
      productId: row.product_id,
      quantity: row.quantity,
      reservedAt: new Date(row.reserved_at),
      expiresAt: new Date(row.expires_at),
      status: row.status,
    };
  }
}
