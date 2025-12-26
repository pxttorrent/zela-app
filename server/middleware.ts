import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[ErrorHandler]', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

// Rate Limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Muitas requisições, tente novamente mais tarde.' }
});

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit login attempts
  message: { error: 'Muitas tentativas de login, tente novamente em 1 hora.' }
});
