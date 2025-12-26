import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';

// Mock dotenv to prevent loading .env file
vi.mock('dotenv', () => ({
  default: {
    config: vi.fn(),
  },
}));

// Important: Mock Env BEFORE importing app to ensure db.ts initializes with empty DATABASE_URL
vi.stubEnv('DATABASE_URL', '');

import app from '../../server/app';

describe('Auth API Integration', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Integration User',
        email: 'int@test.com',
        password: 'password123'
      });
    
    expect(res.status).toBe(201);
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.email).toBe('int@test.com');
    expect(res.body.token).toBeDefined();
  });

  it('should login with created user', async () => {
    // Create user
    await request(app).post('/api/auth/signup').send({
      name: 'Login User',
      email: 'login@test.com',
      password: 'password123'
    });

    // Login
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'login@test.com',
        password: 'password123'
      });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('login@test.com');
  });

  it('should reject invalid email via Zod validation', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Bad Email',
        email: 'not-an-email',
        password: 'password123'
      });
    
    expect(res.status).toBe(400);
    // The exact message depends on Zod schema message
    expect(res.body.error).toBeDefined(); 
  });

  it('should prevent duplicate email signup', async () => {
    // First signup
    await request(app).post('/api/auth/signup').send({
      name: 'Dupe User',
      email: 'dupe@test.com',
      password: 'password123'
    });

    // Second signup
    const res = await request(app).post('/api/auth/signup').send({
      name: 'Dupe User 2',
      email: 'dupe@test.com',
      password: 'password123'
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Email already exists');
  });
});
