
import { pool } from './server/db';
import fs from 'fs';
import path from 'path';

const runMigration = async () => {
  try {
    const sql = fs.readFileSync(path.join(process.cwd(), 'db', 'migration_expansion.sql'), 'utf8');
    console.log('Applying Expansion SQL schema migration...');
    await pool.query(sql);
    console.log('Expansion migration successful!');
  } catch (err) {
    console.error('Migration failed', err);
  } finally {
    await pool.end();
  }
};

runMigration();
