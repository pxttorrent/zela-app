import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction && !process.env.JWT_SECRET) {
  throw new Error('❌ FATAL: JWT_SECRET não definido em produção!');
}

if (isProduction && !process.env.DATABASE_URL) {
  throw new Error('❌ FATAL: DATABASE_URL não definido em produção!');
}

export const config = {
  jwtSecret: process.env.JWT_SECRET || 'dev-only-secret-do-not-use-in-prod',
  isProduction,
  databaseUrl: process.env.DATABASE_URL,
  jwtExpiresIn: '7d',
};
