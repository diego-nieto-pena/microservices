import pool from '../config/database';
import fs from 'fs';
import path from 'path';

export async function initializeDatabase(): Promise<void> {
  try {
    // Read and execute migration files
    const migrationDir = path.join(__dirname, 'migrations');
    const migrationFiles = fs.readdirSync(migrationDir).sort();
    
    for (const file of migrationFiles) {
      if (file.endsWith('.sql')) {
        const migrationPath = path.join(migrationDir, file);
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
        
        console.log(`Executing migration: ${file}`);
        await pool.query(migrationSQL);
        console.log(`Migration ${file} completed successfully`);
      }
    }
    
    console.log('Database initialization completed');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}
