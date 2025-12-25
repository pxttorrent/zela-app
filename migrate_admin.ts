
import { pool } from './server/db';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const runMigration = async () => {
  try {
    // 1. Run SQL Migration
    const sql = fs.readFileSync(path.join(process.cwd(), 'db', 'migration_admin.sql'), 'utf8');
    console.log('Applying SQL schema migration...');
    await pool.query(sql);
    console.log('SQL migration successful');

    // 2. Create/Update Admin User
    console.log('Checking Admin User...');
    const adminEmail = 'admin@zela.com';
    const adminPassword = 'admin'; // Default password
    
    // Check if admin exists
    const userRes = await pool.query('SELECT * FROM users WHERE email = $1', [adminEmail]);
    
    if (userRes.rows.length === 0) {
      console.log('Admin user not found. Creating...');
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await pool.query(
        'INSERT INTO users (name, email, password_hash, is_admin, points, streak) VALUES ($1, $2, $3, $4, 9999, 100)',
        ['Super Admin', adminEmail, hashedPassword, true]
      );
      console.log(`Admin user created: ${adminEmail} / ${adminPassword}`);
    } else {
      console.log('Admin user exists. Updating permissions...');
      await pool.query('UPDATE users SET is_admin = true WHERE email = $1', [adminEmail]);
      console.log('Admin permissions updated.');
    }

  } catch (err) {
    console.error('Migration failed', err);
  } finally {
    await pool.end();
  }
};

runMigration();
