import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export async function initDB(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS routine_completions (
        id SERIAL PRIMARY KEY,
        task_key VARCHAR(100) NOT NULL,
        completed_date DATE NOT NULL DEFAULT CURRENT_DATE,
        completed_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(task_key, completed_date)
      );

      CREATE TABLE IF NOT EXISTS roadmap_completions (
        id SERIAL PRIMARY KEY,
        phase INT NOT NULL,
        topic_index INT NOT NULL,
        completed_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(phase, topic_index)
      );

      CREATE INDEX IF NOT EXISTS idx_routine_date ON routine_completions(completed_date);
      CREATE INDEX IF NOT EXISTS idx_roadmap_phase ON roadmap_completions(phase);
    `);
    console.log('✓ Database tables ready');
  } finally {
    client.release();
  }
}
