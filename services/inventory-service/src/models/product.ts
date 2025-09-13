import { Pool } from 'pg';
import { Product } from '@saga-pattern/shared';
import { v4 as uuidv4 } from 'uuid';

export class ProductRepository {
  constructor(private db: Pool) {}

  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const productId = uuidv4();
    const now = new Date();
    
    const query = `
      INSERT INTO products (
        id, name, description, price, stock_quantity, reserved_quantity, 
        available_quantity, category, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const values = [
      productId,
      product.name,
      product.description || null,
      product.price,
      product.stockQuantity,
      product.reservedQuantity,
      product.availableQuantity,
      product.category,
      now,
      now,
    ];

    const result = await this.db.query(query, values);
    return this.mapRowToProduct(result.rows[0]);
  }

  async getProductById(productId: string): Promise<Product | null> {
    const query = 'SELECT * FROM products WHERE id = $1';
    const result = await this.db.query(query, [productId]);
    
    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToProduct(result.rows[0]);
  }

  async getAllProducts(): Promise<Product[]> {
    const query = 'SELECT * FROM products ORDER BY created_at DESC';
    const result = await this.db.query(query);
    
    return result.rows.map(row => this.mapRowToProduct(row));
  }

  async updateProductStock(productId: string, stockQuantity: number): Promise<Product | null> {
    const query = `
      UPDATE products 
      SET stock_quantity = $1, available_quantity = $1 - reserved_quantity, updated_at = $2 
      WHERE id = $3 
      RETURNING *
    `;

    const result = await this.db.query(query, [stockQuantity, new Date(), productId]);
    
    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToProduct(result.rows[0]);
  }

  async reserveInventory(productId: string, quantity: number): Promise<boolean> {
    const query = `
      UPDATE products 
      SET reserved_quantity = reserved_quantity + $1, 
          available_quantity = stock_quantity - (reserved_quantity + $1),
          updated_at = $2 
      WHERE id = $3 AND available_quantity >= $1
      RETURNING *
    `;

    const result = await this.db.query(query, [quantity, new Date(), productId]);
    return result.rows.length > 0;
  }

  async releaseInventory(productId: string, quantity: number): Promise<boolean> {
    const query = `
      UPDATE products 
      SET reserved_quantity = GREATEST(0, reserved_quantity - $1), 
          available_quantity = stock_quantity - GREATEST(0, reserved_quantity - $1),
          updated_at = $2 
      WHERE id = $3
      RETURNING *
    `;

    const result = await this.db.query(query, [quantity, new Date(), productId]);
    return result.rows.length > 0;
  }

  private mapRowToProduct(row: any): Product {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      price: parseFloat(row.price),
      stockQuantity: row.stock_quantity,
      reservedQuantity: row.reserved_quantity,
      availableQuantity: row.available_quantity,
      category: row.category,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }
}
