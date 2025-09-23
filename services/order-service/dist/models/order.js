"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRepository = void 0;
const uuid_1 = require("uuid");
class OrderRepository {
    db;
    constructor(db) {
        this.db = db;
    }
    async createOrder(request) {
        const orderId = (0, uuid_1.v4)();
        const now = new Date();
        const totalAmount = request.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const query = `
      INSERT INTO orders (id, customer_id, items, total_amount, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
        const values = [
            orderId,
            request.customerId,
            JSON.stringify(request.items),
            totalAmount,
            'PENDING',
            now,
            now,
        ];
        const result = await this.db.query(query, values);
        return this.mapRowToOrder(result.rows[0]);
    }
    async getOrderById(orderId) {
        const query = 'SELECT * FROM orders WHERE id = $1';
        const result = await this.db.query(query, [orderId]);
        if (result.rows.length === 0) {
            return null;
        }
        return this.mapRowToOrder(result.rows[0]);
    }
    async updateOrderStatus(orderId, status) {
        const query = `
      UPDATE orders 
      SET status = $1, updated_at = $2 
      WHERE id = $3 
      RETURNING *
    `;
        const result = await this.db.query(query, [status, new Date(), orderId]);
        if (result.rows.length === 0) {
            return null;
        }
        return this.mapRowToOrder(result.rows[0]);
    }
    async getOrdersByCustomerId(customerId) {
        const query = 'SELECT * FROM orders WHERE customer_id = $1 ORDER BY created_at DESC';
        const result = await this.db.query(query, [customerId]);
        return result.rows.map(row => this.mapRowToOrder(row));
    }
    mapRowToOrder(row) {
        return {
            id: row.id,
            customerId: row.customer_id,
            items: JSON.parse(row.items),
            totalAmount: parseFloat(row.total_amount),
            status: row.status,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at),
        };
    }
}
exports.OrderRepository = OrderRepository;
