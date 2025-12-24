import express from 'express';
import { query } from './db.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'zela-secret-dev-key';

// Middleware to check auth
const authenticate = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

router.use(authenticate);

// --- TRACKERS ---
router.post('/trackers', async (req: any, res) => {
  const { type, timestamp } = req.body;
  // In a real app, we would get baby_id from query/user relation
  // For now, assuming user has one baby, or just logging for the user
  try {
     // Mock Implementation or Real Insert
     await query('INSERT INTO tracker_logs (type, timestamp) VALUES ($1, $2)', [type, new Date(timestamp)]);
     res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save tracker' });
  }
});

router.get('/trackers', async (req: any, res) => {
  try {
    const result = await query('SELECT * FROM tracker_logs ORDER BY timestamp DESC LIMIT 50');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trackers' });
  }
});

// --- CHALLENGES ---
router.post('/challenges', async (req: any, res) => {
  const { challengeId, xp } = req.body;
  try {
    await query('INSERT INTO user_challenges (template_id, xp_awarded, completed_at) VALUES ($1, $2, NOW())', [challengeId, xp]);
    // Also update user points
    await query('UPDATE users SET points = points + $1 WHERE id = $2', [xp, req.user.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to complete challenge' });
  }
});

export default router;
