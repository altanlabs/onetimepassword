import { Pool } from 'pg';

let pool: Pool | null = null;

export async function initDatabase() {
  if (!pool) {
    pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT || '5432'),
    });

    // Create tables if they don't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS secure_messages (
        id SERIAL PRIMARY KEY,
        encrypted_content TEXT NOT NULL,
        access_token VARCHAR(255) UNIQUE NOT NULL,
        is_password BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_access_token ON secure_messages(access_token);
    `);
  }
}

export async function getDatabase() {
  if (!pool) {
    await initDatabase();
  }
  return pool!;
}

export async function closeDatabase() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}