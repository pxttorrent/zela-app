
import { pool } from './server/db';
import fs from 'fs';
import path from 'path';

const runMigration = async () => {
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'db', 'migration_admin.sql'), 'utf8');
    console.log('Applying migration...');
    await pool.query(sql);
    console.log('Migration successful');
  } catch (err) {
    console.error('Migration failed', err);
  } finally {
    await pool.end();
  }
};

runMigration();
