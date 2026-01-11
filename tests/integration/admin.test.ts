import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../server/app';
import { pool } from '../../server/db';

describe('Admin Routes', () => {
  const normalUser = {
    name: 'Normal User',
    email: `normal-${Date.now()}@test.com`,
    password: 'test123456'
  };
  const adminUser = {
    name: 'Admin User',
    email: `admin-${Date.now()}@test.com`,
    password: 'test123456'
  };
  let normalToken: string;
  let adminToken: string;
  let adminId: string;
  let normalId: string;
  let createdVaccineId: number;

  beforeAll(async () => {
    // 1. Create Normal User
    const normalRes = await request(app)
      .post('/api/auth/signup')
      .send(normalUser);
    normalToken = normalRes.body.token;
    normalId = normalRes.body.user.id;

    // 2. Create Admin User (Signup then Update DB)
    const adminRes = await request(app)
      .post('/api/auth/signup')
      .send(adminUser);
    adminToken = adminRes.body.token;
    adminId = adminRes.body.user.id;

    // Promote to Admin
    await pool.query('UPDATE users SET is_admin = true WHERE id = $1', [adminId]);
  });

  afterAll(async () => {
    // Cleanup
    if (normalId) await pool.query('DELETE FROM users WHERE id = $1', [normalId]);
    if (adminId) await pool.query('DELETE FROM users WHERE id = $1', [adminId]);
  });

  describe('GET /api/admin/users', () => {
    it('should deny access to normal users', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${normalToken}`);

      expect(res.status).toBe(403);
    });

    it('should allow access to admin users', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('Vaccine Management', () => {
    it('should create a new vaccine', async () => {
      const vaccineData = {
        name: 'Test Vaccine',
        daysFromBirth: 30,
        description: 'Test Description'
      };

      const res = await request(app)
        .post('/api/admin/vaccines')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(vaccineData);

      expect(res.status).toBe(200);
      expect(res.body.name).toBe(vaccineData.name);
      expect(res.body.id).toBeDefined();
      createdVaccineId = res.body.id;
    });

    it('should list vaccines', async () => {
      const res = await request(app)
        .get('/api/admin/vaccines')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      const found = res.body.find((v: any) => v.id === createdVaccineId);
      expect(found).toBeDefined();
    });

    it('should delete a vaccine', async () => {
      const res = await request(app)
        .delete(`/api/admin/vaccines/${createdVaccineId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      
      // Verify deletion
      const checkRes = await pool.query('SELECT * FROM vaccine_templates WHERE id = $1', [createdVaccineId]);
      expect(checkRes.rows.length).toBe(0);
    });
  });

  describe('GET /api/admin/missions', () => {
    it('should list missions', async () => {
      const res = await request(app)
        .get('/api/admin/missions')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});
