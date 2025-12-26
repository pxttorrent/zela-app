import { pool } from './server/db';
import fs from 'fs';
import path from 'path';

const runSeed = async () => {
  try {
    const sql = fs.readFileSync(path.join(process.cwd(), 'db', 'seed_full_content.sql'), 'utf8');
    console.log('Seeding full content (Vaccines & Pediatric Missions)...');
    await pool.query(sql);
    console.log('Seed successful!');
  } catch (err) {
    console.error('Seed failed', err);
  } finally {
    await pool.end();
  }
};

runSeed();
