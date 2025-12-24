import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

export const pool = new Pool({
  connectionString: connectionString,
  ssl: connectionString && connectionString.includes('neon.tech') ? { rejectUnauthorized: false } : undefined,
});

// Mock Store for Local Dev without DB
const mockUsers: any[] = [];

export const query = async (text: string, params: any[] = []) => {
  if (!connectionString) {
    console.warn('⚠️ No DATABASE_URL. Using In-Memory Mock for:', text);

    // MOCK: Signup / Create User
    if (text.includes('INSERT INTO users')) {
      const newUser = { 
        id: 'mock-user-' + Date.now(), 
        name: params[0], 
        email: params[1], 
        password_hash: params[2],
        created_at: new Date().toISOString(),
        ads_opt_in: true,
        points: 0,
        streak: 0
      };
      mockUsers.push(newUser);
      return { rows: [newUser], rowCount: 1 };
    }

    // MOCK: Select User (Login or Check existence)
    if (text.includes('SELECT') && text.includes('users')) {
      // By ID (GetMe)
      if (text.includes('id = $1')) {
         const user = mockUsers.find(u => u.id === params[0]);
         return { rows: user ? [user] : [], rowCount: user ? 1 : 0 };
      }
      // By Email (Login / Signup Check)
      if (text.includes('email = $1')) {
         const user = mockUsers.find(u => u.email === params[0]);
         return { rows: user ? [user] : [], rowCount: user ? 1 : 0 };
      }
    }

    return { rows: [] };
  }

  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (err) {
    console.error('Query Error', err);
    throw err;
  }
};
