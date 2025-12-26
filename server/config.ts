import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

export const config = {
  jwtSecret: process.env.JWT_SECRET || 'zela-secret-dev-key',
  isProduction,
  databaseUrl: process.env.DATABASE_URL,
};

if (isProduction && config.jwtSecret === 'zela-secret-dev-key') {
  console.warn('⚠️ WARNING: Running in production with default JWT secret. Set JWT_SECRET environment variable.');
}
