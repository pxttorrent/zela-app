import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../server/app';

describe('Payment Routes', () => {
  describe('POST /api/payment/create-checkout-session', () => {
    it('should return a mock checkout url', async () => {
      const res = await request(app)
        .post('/api/payment/create-checkout-session')
        .send({ planId: 'plan-123' });

      expect(res.status).toBe(200);
      expect(res.body.url).toBeDefined();
      expect(res.body.url).toContain('stripe.com');
    });
  });

  describe('POST /api/payment/webhook', () => {
    it('should acknowledge webhook receipt', async () => {
      const res = await request(app)
        .post('/api/payment/webhook')
        .send({ type: 'payment_intent.succeeded' });

      expect(res.status).toBe(200);
      expect(res.body.received).toBe(true);
    });
  });
});
