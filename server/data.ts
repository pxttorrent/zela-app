import express, { Request, Response, NextFunction } from 'express';
import { query } from './db.js';
import jwt from 'jsonwebtoken';
import { config } from './config.js';
import { validateBody, BabySchema, TrackerSchema, ChallengeSchema, MilestoneSchema, ChatLogSchema } from './schemas.js';

const router = express.Router();

// Types
interface UserPayload {
  id: string | number;
  email: string;
}

interface RequestWithUser extends Request {
  user?: UserPayload;
}

// Middleware to check auth
const authenticate = (req: RequestWithUser, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as UserPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

router.use(authenticate as any);

// --- DASHBOARD (LOAD EVERYTHING) ---
router.get('/dashboard', async (req: RequestWithUser, res: Response) => {
  try {
    const userId = req.user?.id;

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

    // 5. Get System Content (Missions & Vaccines)
    // We send this to the frontend so it renders what the admin configured, not hardcoded files
    const missionsRes = await query('SELECT * FROM challenge_templates ORDER BY min_age_weeks ASC');
    const vaccinesRes = await query('SELECT * FROM vaccine_templates ORDER BY days_from_birth ASC');

    res.json({
      baby,
      trackers,
      recentChallenges,
      adConfig,
      missions: missionsRes.rows,
      vaccines: vaccinesRes.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
});

// --- BABY ---
router.post('/baby', validateBody(BabySchema), async (req: RequestWithUser, res: Response) => {
  const { name, birthDate, gender, focusAreas } = req.body;
  const userId = req.user?.id;

  try {
    // Check if baby exists
    const check = await query('SELECT id FROM babies WHERE user_id = $1', [userId]);
    if (check.rows.length > 0) {
      // Update existing
      const result = await query(
        'UPDATE babies SET name = $1, birth_date = $2, gender = $3, focus_areas = $4 WHERE user_id = $5 RETURNING *',
        [name, birthDate, gender, focusAreas || [], userId]
      );
      return res.json(result.rows[0]);
    } else {
      // Create new
      const result = await query(
        'INSERT INTO babies (user_id, name, birth_date, gender, focus_areas) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [userId, name, birthDate, gender, focusAreas || []]
      );
      return res.json(result.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save baby' });
  }
});

// --- TRACKERS ---
router.post('/trackers', validateBody(TrackerSchema), async (req: RequestWithUser, res: Response) => {
  const { type, timestamp, babyId } = req.body;
  // babyId check is done by Zod now, but we might want to verify ownership if babyId comes from body
  
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
router.post('/challenges', validateBody(ChallengeSchema), async (req: RequestWithUser, res: Response) => {
  const { challengeId, xp, babyId } = req.body; // challengeId here is template_id
  const userId = req.user?.id;

  try {
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

// --- MILESTONES ---
router.get('/milestones', async (req: RequestWithUser, res: Response) => {
  const userId = req.user?.id;
  try {
    // Get baby first
    const babyRes = await query('SELECT id FROM babies WHERE user_id = $1 LIMIT 1', [userId]);
    if (babyRes.rows.length === 0) return res.json({ templates: [], achieved: [] });
    const babyId = babyRes.rows[0].id;

    const templates = await query('SELECT * FROM milestone_templates ORDER BY expected_age_months ASC');
    const achieved = await query('SELECT * FROM user_milestones WHERE baby_id = $1', [babyId]);

    res.json({
      templates: templates.rows,
      achieved: achieved.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load milestones' });
  }
});

router.post('/milestones', validateBody(MilestoneSchema), async (req: RequestWithUser, res: Response) => {
  const { templateId, achievedAt, notes, babyId } = req.body;
  try {
    const result = await query(
      'INSERT INTO user_milestones (baby_id, template_id, achieved_at, notes) VALUES ($1, $2, $3, $4) RETURNING *',
      [babyId, templateId, achievedAt, notes]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save milestone' });
  }
});

// --- CHAT LOGS (AI) ---
router.get('/chat-history', async (req: RequestWithUser, res: Response) => {
  const userId = req.user?.id;
  try {
    const logs = await query('SELECT * FROM chat_logs WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50', [userId]);
    res.json(logs.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load chat history' });
  }
});

// Endpoint for app or n8n (via API Key ideally, but using JWT for now if called from app)
router.post('/chat-log', validateBody(ChatLogSchema), async (req: RequestWithUser, res: Response) => {
  const { messageUser, messageBot, sentiment, babyId } = req.body;
  const userId = req.user?.id;

  try {
    await query(
      'INSERT INTO chat_logs (user_id, baby_id, message_user, message_bot, sentiment) VALUES ($1, $2, $3, $4, $5)',
      [userId, babyId, messageUser, messageBot, sentiment]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save chat log' });
  }
});

export default router;
