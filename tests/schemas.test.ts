import { describe, it, expect } from 'vitest';
import { SignupSchema, LoginSchema, BabySchema } from '../server/schemas';

describe('Validation Schemas', () => {
  describe('SignupSchema', () => {
    it('should validate correct signup data', () => {
      const data = { name: 'Test User', email: 'test@example.com', password: 'password123' };
      const result = SignupSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject short password', () => {
      const data = { name: 'Test User', email: 'test@example.com', password: '123' };
      const result = SignupSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('6 caracteres');
      }
    });

    it('should reject invalid email', () => {
      const data = { name: 'Test User', email: 'not-an-email', password: 'password123' };
      const result = SignupSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('LoginSchema', () => {
    it('should validate correct login data', () => {
      const data = { email: 'test@example.com', password: 'password123' };
      const result = LoginSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe('BabySchema', () => {
    it('should validate correct baby data', () => {
      const data = { name: 'Baby Zela', birthDate: '2023-01-01', gender: 'girl' };
      const result = BabySchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject invalid date format', () => {
      const data = { name: 'Baby Zela', birthDate: 'invalid-date', gender: 'boy' };
      const result = BabySchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });
});
