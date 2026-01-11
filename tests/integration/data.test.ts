import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../server/app';
import { pool } from '../../server/db';

describe('Data Routes', () => {
  const testUser = {
    name: 'Data Test User',
    email: `data-test-${Date.now()}@test.com`,
    password: 'test123456'
  };
  let token: string;
  let userId: string;
  let babyId: string;
  let challengeTemplateId: number;

  beforeAll(async () => {
    // 1. Create User & Get Token
    const signupRes = await request(app)
      .post('/api/auth/signup')
      .send(testUser);
    
    token = signupRes.body.token;
    userId = signupRes.body.user.id;

    // 2. Insert a Challenge Template for testing
    const templateRes = await pool.query(
      `INSERT INTO challenge_templates (category, min_age_weeks, max_age_weeks, title, description, xp_base) 
       VALUES ('motor', 0, 12, 'Tummy Time', 'Place baby on tummy', 10) 
       RETURNING id`
    );
    challengeTemplateId = templateRes.rows[0].id;
  });

  afterAll(async () => {
    // Cleanup
    if (userId) {
      await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    }
    if (challengeTemplateId) {
      await pool.query('DELETE FROM challenge_templates WHERE id = $1', [challengeTemplateId]);
    }
  });

  describe('POST /api/data/baby', () => {
    it('should create a new baby profile', async () => {
      const babyData = {
        name: 'Test Baby',
        birthDate: '2023-01-01',
        gender: 'boy',
        focusAreas: ['sleep', 'feeding']
      };

      const res = await request(app)
        .post('/api/data/baby')
        .set('Authorization', `Bearer ${token}`)
        .send(babyData);

      expect(res.status).toBe(200);
      expect(res.body.name).toBe(babyData.name);
      expect(res.body.id).toBeDefined();
      babyId = res.body.id;
    });

    it('should update existing baby profile', async () => {
      const updateData = {
        name: 'Updated Baby Name',
        birthDate: '2023-01-01',
        gender: 'boy',
        focusAreas: ['motor']
      };

      const res = await request(app)
        .post('/api/data/baby')
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.name).toBe(updateData.name);
      expect(res.body.id).toBe(babyId); // Should be same ID
    });
  });

  describe('GET /api/data/dashboard', () => {
    it('should return dashboard data', async () => {
      const res = await request(app)
        .get('/api/data/dashboard')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.baby).toBeDefined();
      expect(res.body.baby.id).toBe(babyId);
      expect(res.body.trackers).toBeInstanceOf(Array);
      expect(res.body.missions).toBeInstanceOf(Array);
    });
  });

  describe('POST /api/data/trackers', () => {
    it('should add a tracker log', async () => {
      const trackerData = {
        babyId,
        type: 'sleep',
        timestamp: Date.now()
      };

      const res = await request(app)
        .post('/api/data/trackers')
        .set('Authorization', `Bearer ${token}`)
        .send(trackerData);

      expect(res.status).toBe(200);
      expect(res.body.type).toBe(trackerData.type);
    });
  });

  describe('POST /api/data/challenges', () => {
    it('should complete a challenge', async () => {
      const challengeData = {
        babyId,
        challengeId: challengeTemplateId,
        xp: 50
      };

      const res = await request(app)
        .post('/api/data/challenges')
        .set('Authorization', `Bearer ${token}`)
        .send(challengeData);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify points updated
      const userRes = await pool.query('SELECT points FROM users WHERE id = $1', [userId]);
      expect(userRes.rows[0].points).toBeGreaterThan(0);
    });
  });

  describe('GET /api/data/milestones', () => {
    it('should return milestones', async () => {
      const res = await request(app)
        .get('/api/data/milestones')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.templates).toBeInstanceOf(Array);
      expect(res.body.achieved).toBeInstanceOf(Array);
    });
  });
});
