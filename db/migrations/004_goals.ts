import { pool } from '../../server/db';
import fs from 'fs';
import path from 'path';

export default async function up() {
  try {
    const sql = fs.readFileSync(path.join(process.cwd(), 'db', 'migration_goals.sql'), 'utf8');
    console.log('Applying Goals migration...');
    await pool.query(sql);
    console.log('Goals migration successful!');
  } catch (err) {
    console.error('Migration failed', err);
    throw err;
  }
}
