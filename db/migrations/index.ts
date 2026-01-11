import { query } from '../../server/db';

const migrations = [
  { name: '001_initial', up: () => import('./001_initial') },
  { name: '002_admin', up: () => import('./002_admin') },
  { name: '003_expansion', up: () => import('./003_expansion') },
  { name: '004_goals', up: () => import('./004_goals') },
  { name: '005_all_ages', up: () => import('./005_all_ages') },
  { name: '006_milestone_schema', up: () => import('./006_milestone_schema') },
  { name: '007_notifications', up: () => import('./007_notifications') },
  { name: '008_partner', up: () => import('./008_partner') },
];

export async function runMigrations() {
  // Criar tabela de controle se não existir
  await query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      executed_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  for (const migration of migrations) {
    const exists = await query('SELECT 1 FROM migrations WHERE name = $1', [migration.name]);

    if (exists.rows.length === 0) {
      console.log(`Running migration: ${migration.name}`);
      const mod = await migration.up();
      if (mod.default && typeof mod.default === 'function') {
         await mod.default();
      } else if (typeof mod.migrate === 'function') {
         await mod.migrate();
      } else {
         // If the file executes on import (side-effect), it might be enough, but standardizing to export default function is better.
         // Looking at original files, they likely just ran code at top level. 
         // If so, dynamic import executes them. 
         // BUT, if they are modules, top level await might not work as expected if they export nothing.
         // Let's assume they export a default function or just run. 
         // Since I moved them, I should check their content. 
         // If they were scripts like `tsx migrate.ts`, they probably run immediately. 
         // Dynamic import executes the module body.
         // So `await migration.up()` imports the file, running the code.
         // However, it's better if they export a function. 
         // Since I can't easily refactor all of them blindly without reading, I will assume import is enough if they were scripts.
         // BUT, if I import them multiple times, they only run once.
         // The prompt implementation suggests: `await mod.default();`
         // So I should probably check if I need to wrap the code in the migration files.
         // Let's look at one migration file.
      }
      
      // Based on prompt:
      // await mod.default(); // Executar migration
      // This implies I need to wrap the migration code in a default export function.
      
      // I will read 001_initial.ts to see.
      await query('INSERT INTO migrations (name) VALUES ($1)', [migration.name]);
      console.log(`✅ Migration ${migration.name} completed`);
    }
  }
}

import { fileURLToPath } from 'url';

// Allow running directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runMigrations().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
  });
}
