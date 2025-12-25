
import { Router } from 'express';
import { query } from './db';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'zela-secret-dev-key';

// Middleware: Verify Token & Check Admin
const adminAuth = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;

    // Check if user is admin (Hardcoded super-admin or DB flag)
    const { rows } = await query('SELECT email, is_admin FROM users WHERE id = $1', [decoded.id]);
    
    if (rows.length > 0 && (rows[0].email === 'admin@zela.com' || rows[0].is_admin)) {
      next();
    } else {
      res.status(403).json({ error: 'Forbidden: Admin access only' });
    }
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

router.use(adminAuth);

// --- USERS ---
router.get('/users', async (req, res) => {
  try {
    const { rows } = await query(`
      SELECT id, name, email, points, streak, created_at, ads_opt_in 
      FROM users 
      ORDER BY created_at DESC 
      LIMIT 100
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// --- VACCINES ---
router.get('/vaccines', async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM vaccine_templates ORDER BY days_from_birth ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch vaccines' });
  }
});

router.post('/vaccines', async (req, res) => {
  const { name, daysFromBirth, description } = req.body;
  try {
    const { rows } = await query(
      'INSERT INTO vaccine_templates (name, days_from_birth, description) VALUES ($1, $2, $3) RETURNING *',
      [name, daysFromBirth, description]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create vaccine' });
  }
});

router.delete('/vaccines/:id', async (req, res) => {
  try {
    await query('DELETE FROM vaccine_templates WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete vaccine' });
  }
});

// --- MISSIONS (CHALLENGES) ---
router.get('/missions', async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM challenge_templates ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch missions' });
  }
});

router.post('/missions', async (req, res) => {
  const { title, description, category, minAgeWeeks, maxAgeWeeks, xpReward } = req.body;
  try {
    const { rows } = await query(
      'INSERT INTO challenge_templates (title, description, category, min_age_weeks, max_age_weeks, xp_base) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, category, minAgeWeeks, maxAgeWeeks || 100, xpReward || 10]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create mission' });
  }
});

router.delete('/missions/:id', async (req, res) => {
  try {
    await query('DELETE FROM challenge_templates WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete mission' });
  }
});

// --- ADS ---
router.get('/ads', async (req, res) => {
  try {
    const { rows } = await query('SELECT ad_config FROM app_settings WHERE id = 1');
    res.json(rows[0]?.ad_config || { enabled: true, clientId: '', slots: { dashboard: '' } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ad config' });
  }
});

router.post('/ads', async (req, res) => {
  const config = req.body;
  try {
    const { rows } = await query(
      'UPDATE app_settings SET ad_config = $1, updated_at = now() WHERE id = 1 RETURNING ad_config',
      [JSON.stringify(config)]
    );
    res.json(rows[0].ad_config);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update ad config' });
  }
});

// --- PUSH NOTIFICATIONS ---
router.get('/push', async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM push_history ORDER BY sent_at DESC LIMIT 50');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch push history' });
  }
});

router.post('/push', async (req, res) => {
  const { title, body, audience } = req.body;
  try {
    // In a real app, here we would trigger the VAPID/FCM sending logic
    // For now, we just log it as "sent"
    const { rows } = await query(
      'INSERT INTO push_history (title, body, audience, created_by) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, body, audience, (req as any).user.id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send push' });
  }
});

export default router;
