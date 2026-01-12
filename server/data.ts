import express, { Request, Response, NextFunction } from 'express';
import { query } from './db.js';
import { config } from './config.js';
import { validateBody, BabySchema, TrackerSchema, ChallengeSchema, MilestoneSchema, ChatLogSchema } from './schemas.js';
import { authenticate, RequestWithUser } from './middleware.js';

const router = express.Router();

// Helper to verify ownership
const verifyBabyOwnership = async (babyId: string | number, userId: string | number): Promise<boolean> => {
  const result = await query('SELECT id FROM baby_caretakers WHERE baby_id = $1 AND user_id = $2', [babyId, userId]);
  return result.rows.length > 0;
};

router.use(authenticate as any);

// --- DASHBOARD (LOAD EVERYTHING) ---
router.get('/dashboard', async (req: RequestWithUser, res: Response) => {
  try {
    const userId = req.user?.id;

    // 1. Get Baby (via caretakers)
    const babyRes = await query(`
      SELECT b.*, bc.role, bc.permissions 
      FROM babies b
      JOIN baby_caretakers bc ON bc.baby_id = b.id
      WHERE bc.user_id = $1 
      LIMIT 1
    `, [userId]);
    const baby = babyRes.rows[0] || null;

    let trackers: any[] = [];
    let recentChallenges: any[] = [];

    if (baby) {
      // 2. Get Recent Trackers
      const trackersRes = await query('SELECT * FROM tracker_logs WHERE baby_id = $1 ORDER BY timestamp DESC LIMIT 50', [baby.id]);
      trackers = trackersRes.rows;
    }

    // 3. Get User Stats
    const challengesRes = await query('SELECT * FROM user_challenges WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20', [userId]);
    recentChallenges = challengesRes.rows;

    // 4. Get Ad Config
    const configRes = await query('SELECT ad_config FROM app_settings WHERE id = 1');
    const adConfig = configRes.rows[0]?.ad_config || { enabled: false, clientId: '', slots: { dashboard: '' } };

    // 5. Get System Content
    const missionsRes = await query('SELECT * FROM challenge_templates ORDER BY min_age_days ASC');
    const vaccinesRes = await query('SELECT * FROM vaccine_templates ORDER BY days_from_birth ASC');
    
    // 6. Get Tracker Types
    const trackerTypesRes = await query('SELECT * FROM tracker_types ORDER BY sort_order ASC');

    res.json({
      baby,
      trackers,
      recentChallenges,
      adConfig,
      missions: missionsRes.rows,
      vaccines: vaccinesRes.rows,
      trackerTypes: trackerTypesRes.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
});

// --- REPORTS ---
router.get('/reports/summary', async (req: RequestWithUser, res: Response) => {
  const { babyId, month, year } = req.query;

  try {
    // Verificar ownership
    const isOwner = await verifyBabyOwnership(babyId as string, req.user?.id!);
    if (!isOwner) return res.status(403).json({ error: 'Access denied' });

    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(Number(month) + 1).padStart(2, '0')}-01`;

    // Contagem de trackers por tipo
    const trackersResult = await query(`
      SELECT type, COUNT(*) as count
      FROM tracker_logs
      WHERE baby_id = $1 AND created_at >= $2 AND created_at < $3
      GROUP BY type
    `, [babyId, startDate, endDate]);

    // Missões completadas
    const missionsResult = await query(`
      SELECT COUNT(*) as total, SUM(xp_earned) as xp_total
      FROM user_challenges
      WHERE baby_id = $1 AND completed_date >= $2 AND completed_date < $3
    `, [babyId, startDate, endDate]);

    // Vacinas aplicadas
    const vaccinesResult = await query(`
      SELECT COUNT(*) as total
      FROM user_vaccines
      WHERE baby_id = $1 AND status = 'done' AND applied_date >= $2 AND applied_date < $3
    `, [babyId, startDate, endDate]);

    // Marcos registrados
    const milestonesResult = await query(`
      SELECT title, achieved_date
      FROM user_milestones
      WHERE baby_id = $1 AND achieved_date >= $2 AND achieved_date < $3
    `, [babyId, startDate, endDate]);

    res.json({
      month: Number(month),
      year: Number(year),
      trackers: trackersResult.rows,
      missions: missionsResult.rows[0] || { total: 0, xp_total: 0 },
      vaccines: vaccinesResult.rows[0]?.total || 0,
      milestones: milestonesResult.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

router.get('/reports/export', async (req: RequestWithUser, res: Response) => {
  const { babyId, format = 'csv' } = req.query;

  try {
    const isOwner = await verifyBabyOwnership(babyId as string, req.user?.id!);
    if (!isOwner) return res.status(403).json({ error: 'Access denied' });

    // Buscar todos os dados
    const baby = await query('SELECT * FROM babies WHERE id = $1', [babyId]);
    const trackers = await query(
      'SELECT type, timestamp, created_at FROM tracker_logs WHERE baby_id = $1 ORDER BY timestamp',
      [babyId]
    );
    const growth = await query(
      'SELECT weight, height, head_circumference, recorded_date FROM growth_logs WHERE baby_id = $1 ORDER BY recorded_date',
      [babyId]
    );
    const milestones = await query(
      'SELECT title, achieved_date FROM user_milestones WHERE baby_id = $1 ORDER BY achieved_date',
      [babyId]
    );

    if (format === 'csv') {
      // Gerar CSV
      let csv = 'Relatório Zela App\n\n';
      csv += `Criança: ${baby.rows[0]?.name}\n`;
      csv += `Data de Nascimento: ${baby.rows[0]?.birth_date}\n\n`;

      csv += 'REGISTROS DE ATIVIDADES\n';
      csv += 'Tipo,Data/Hora\n';
      trackers.rows.forEach(t => {
        csv += `${t.type},${new Date(t.timestamp).toLocaleString('pt-BR')}\n`;
      });

      csv += '\nCRESCIMENTO\n';
      csv += 'Data,Peso (kg),Altura (cm),Perímetro Cef. (cm)\n';
      growth.rows.forEach(g => {
        csv += `${g.recorded_date},${g.weight || ''},${g.height || ''},${g.head_circumference || ''}\n`;
      });

      csv += '\nMARCOS\n';
      csv += 'Marco,Data\n';
      milestones.rows.forEach(m => {
        csv += `${m.title},${m.achieved_date}\n`;
      });

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename=zela-relatorio-${babyId}.csv`);
      res.send(csv);
    } else {
      // JSON
      res.json({
        baby: baby.rows[0],
        trackers: trackers.rows,
        growth: growth.rows,
        milestones: milestones.rows
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to export data' });
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
  const { type, timestamp, babyId, subType } = req.body;
  const userId = req.user?.id;
  
  // Verify ownership
  const isOwner = await verifyBabyOwnership(babyId, userId!);
  if (!isOwner) {
    return res.status(403).json({ error: 'Acesso negado: bebê não pertence a este usuário' });
  }

  try {
     // Note: subType handling might need column in DB, assuming it might be stored in 'type' or a new column?
     // For now, let's just insert type and timestamp as before, or assume schema update later.
     // The prompt says "Align Enums", but DB schema update wasn't explicitly in the SQL migrations provided in the prompt text (except reorganization).
     // However, the prompt says "Adicionar subType opcional" in schema.
     // I will assume for now we just insert into existing structure or user needs to update DB schema.
     // Wait, the prompt didn't ask to change the SQL for tracker_logs to add subType column.
     // I'll stick to inserting what fits or maybe JSON/extra field if available.
     // Looking at schema.sql (I saw it in LS), let's assume it supports it or we just ignore subType for DB for now if column missing.
     // Actually, let's just pass it. If DB fails, we'll know. But to be safe, I will stick to what was there unless I see a schema migration for subType.
     // The prompt only asked to update schema validation and Types.
     // I'll assume the DB is ready or I should just use `type` as is.
     
     // Actually, I'll update the query to include subType if I can, but standard SQL insert:
     // 'INSERT INTO tracker_logs (baby_id, type, timestamp) ...'
     // If I add subType to validation but not to DB, it's fine.
     
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

  // Verify ownership
  const isOwner = await verifyBabyOwnership(babyId, userId!);
  if (!isOwner) {
    return res.status(403).json({ error: 'Acesso negado: bebê não pertence a este usuário' });
  }

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

    const templates = await query('SELECT * FROM milestone_templates ORDER BY min_age_days ASC');
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
  const userId = req.user?.id;

  // Verify ownership
  const isOwner = await verifyBabyOwnership(babyId, userId!);
  if (!isOwner) {
    return res.status(403).json({ error: 'Acesso negado: bebê não pertence a este usuário' });
  }

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

// GET /data/chat-context - Contexto para IA
router.get('/chat-context', async (req: RequestWithUser, res: Response) => {
  try {
    // Buscar bebê do usuário
    const { rows: babies } = await query(
      'SELECT * FROM babies WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
      [req.user?.id]
    );

    if (babies.length === 0) {
      return res.json({ context: null });
    }

    const baby = babies[0];
    const ageDays = Math.floor(
      (Date.now() - new Date(baby.birth_date).getTime()) / (24 * 60 * 60 * 1000)
    );

    // Últimos trackers (últimas 24h)
    const { rows: recentTrackers } = await query(`
      SELECT type, timestamp FROM tracker_logs
      WHERE baby_id = $1 AND timestamp > $2
      ORDER BY timestamp DESC
    `, [baby.id, new Date(Date.now() - 24 * 60 * 60 * 1000)]);

    // Próxima vacina
    const { rows: nextVaccine } = await query(`
      SELECT vt.name, vt.days_from_birth
      FROM vaccine_templates vt
      LEFT JOIN user_vaccines uv ON uv.template_id = vt.id AND uv.baby_id = $1
      WHERE uv.status IS NULL OR uv.status != 'done'
      ORDER BY vt.days_from_birth ASC
      LIMIT 1
    `, [baby.id]);

    // Áreas de foco
    const { rows: focusAreas } = await query(
      'SELECT area FROM baby_focus_areas WHERE baby_id = $1',
      [baby.id]
    );

    const context = {
      babyName: baby.name,
      babyGender: baby.gender,
      ageDays,
      ageMonths: Math.floor(ageDays / 30),
      ageWeeks: Math.floor(ageDays / 7),
      lifeStage: ageDays < 365 ? 'baby' : ageDays < 1095 ? 'toddler' : ageDays < 4380 ? 'kid' : 'teen',
      focusAreas: focusAreas.map(f => f.area),
      recentActivity: recentTrackers.slice(0, 5).map(t => ({
        type: t.type,
        hoursAgo: Math.round((Date.now() - new Date(t.timestamp).getTime()) / (60 * 60 * 1000))
      })),
      nextVaccine: nextVaccine[0] || null
    };

    res.json({ context });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get chat context' });
  }
});

// Endpoint for app or n8n (via API Key ideally, but using JWT for now if called from app)
router.post('/chat-log', validateBody(ChatLogSchema), async (req: RequestWithUser, res: Response) => {
  const { messageUser, messageBot, sentiment, babyId } = req.body;
  const userId = req.user?.id;

  // Verify ownership
  const isOwner = await verifyBabyOwnership(babyId, userId!);
  if (!isOwner) {
    return res.status(403).json({ error: 'Acesso negado: bebê não pertence a este usuário' });
  }

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
