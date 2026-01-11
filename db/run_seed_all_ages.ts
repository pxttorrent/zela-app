import fs from 'fs';
import path from 'path';
import { query } from '../server/db';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runSeed() {
  const seedPath = path.join(__dirname, 'seed_all_ages.sql');
  const seedContent = fs.readFileSync(seedPath, 'utf8');

  console.log('Running seed...');
  await query(seedContent);
  console.log('✅ Seed completed successfully');
}

runSeed().catch(console.error);
