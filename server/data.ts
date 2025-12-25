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

// --- DASHBOARD (LOAD EVERYTHING) ---
router.get('/dashboard', async (req: any, res) => {
  try {
    const userId = req.user.id;

    // 1. Get Baby
    const babyRes = await query('SELECT * FROM babies WHERE user_id = $1 LIMIT 1', [userId]);
    const baby = babyRes.rows[0] || null;

    let trackers: any[] = [];
    let recentChallenges: any[] = [];

    if (baby) {
      // 2. Get Recent Trackers
      const trackersRes = await query('SELECT * FROM tracker_logs WHERE baby_id = $1 ORDER BY timestamp DESC LIMIT 50', [baby.id]);
      trackers = trackersRes.rows;
    }

    // 3. Get User Stats (Points, Streak is in users table, but we might want challenge history)
    const challengesRes = await query('SELECT * FROM user_challenges WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20', [userId]);
    recentChallenges = challengesRes.rows;

    // 4. Get Ad Config
    const configRes = await query('SELECT ad_config FROM app_settings WHERE id = 1');
    const adConfig = configRes.rows[0]?.ad_config || { enabled: false, clientId: '', slots: { dashboard: '' } };

    res.json({
      baby,
      trackers,
      recentChallenges,
      adConfig
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
});

// --- BABY ---
router.post('/baby', async (req: any, res) => {
  const { name, birthDate, gender } = req.body;
  const userId = req.user.id;

  try {
    // Check if baby exists
    const check = await query('SELECT id FROM babies WHERE user_id = $1', [userId]);
    if (check.rows.length > 0) {
      // Update existing
      const result = await query(
        'UPDATE babies SET name = $1, birth_date = $2, gender = $3 WHERE user_id = $4 RETURNING *',
        [name, birthDate, gender, userId]
      );
      return res.json(result.rows[0]);
    } else {
      // Create new
      const result = await query(
        'INSERT INTO babies (user_id, name, birth_date, gender) VALUES ($1, $2, $3, $4) RETURNING *',
        [userId, name, birthDate, gender]
      );
      return res.json(result.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save baby' });
  }
});

// --- TRACKERS ---
router.post('/trackers', async (req: any, res) => {
  const { type, timestamp, babyId } = req.body;
  if (!babyId) return res.status(400).json({ error: 'Baby ID required' });

  try {
     const result = await query(
       'INSERT INTO tracker_logs (baby_id, type, timestamp) VALUES ($1, $2, $3) RETURNING *', 
       [babyId, type, new Date(timestamp)]
     );
     res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save tracker' });
  }
});

// --- CHALLENGES ---
router.post('/challenges', async (req: any, res) => {
  const { challengeId, xp, babyId } = req.body; // challengeId here is template_id
  const userId = req.user.id;

  try {
    // Insert Challenge Log
    // Note: Schema expects template_id as integer, ensure frontend sends it right or adjust schema/logic
    // For MVP, we might be sending a string ID from frontend mock, let's assume we fix frontend to match schema or use a mapping.
    // Assuming schema is: template_id integer. Frontend uses numeric IDs in the mock data.
    
    // We need a baby_id for user_challenges table according to schema?
    // Schema: user_id, baby_id, template_id...
    
    if (!babyId) return res.status(400).json({ error: 'Baby ID required' });

    await query(
      'INSERT INTO user_challenges (user_id, baby_id, template_id, xp_awarded, completed_at, status) VALUES ($1, $2, $3, $4, NOW(), $5)', 
      [userId, babyId, challengeId, xp, 'completed']
    );

    // Update User Points
    await query('UPDATE users SET points = points + $1 WHERE id = $2', [xp, userId]);
    
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to complete challenge' });
  }
});

export default router;
