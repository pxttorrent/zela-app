import fs from 'fs';
import path from 'path';
import { pool } from './server/db.js';

const schemaPath = path.join(process.cwd(), 'db', 'schema.sql');

async function migrate() {
  console.log('🚀 Starting migration...');
  try {
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split commands (simple approach)
    const commands = schema
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0);

    for (const command of commands) {
      console.log(`Executing: ${command.substring(0, 50)}...`);
      await pool.query(command);
    }
    
    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

migrate();
