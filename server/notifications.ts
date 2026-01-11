import { Router, Request, Response } from 'express';
import { query } from './db.js';
import { authenticate, RequestWithUser } from './middleware.js';

const router = Router();

// Categorias de notificação disponíveis
const NOTIFICATION_CATEGORIES = [
  { code: 'vaccines', label: 'Lembretes de Vacinas', default: true },
  { code: 'challenges', label: 'Missões Diárias', default: true },
  { code: 'milestones', label: 'Marcos de Desenvolvimento', default: true },
  { code: 'trackers', label: 'Lembretes de Rotina', default: false },
  { code: 'tips', label: 'Dicas Personalizadas', default: true },
  { code: 'community', label: 'Atividade da Comunidade', default: false }
];

// GET /notifications/preferences - Obter preferências do usuário
router.get('/preferences', authenticate, async (req: RequestWithUser, res: Response) => {
  try {
    const { rows } = await query(
      'SELECT category, enabled, quiet_hours_start, quiet_hours_end FROM user_notification_prefs WHERE user_id = $1',
      [req.user?.id]
    );

    // Merge com defaults
    const prefs = NOTIFICATION_CATEGORIES.map(cat => {
      const saved = rows.find(r => r.category === cat.code);
      return {
        category: cat.code,
        label: cat.label,
        enabled: saved ? saved.enabled : cat.default,
        quietHoursStart: saved?.quiet_hours_start || '22:00',
        quietHoursEnd: saved?.quiet_hours_end || '07:00'
      };
    });

    res.json(prefs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch preferences' });
  }
});

// PUT /notifications/preferences - Atualizar preferências
router.put('/preferences', authenticate, async (req: RequestWithUser, res: Response) => {
  const { category, enabled, quietHoursStart, quietHoursEnd } = req.body;

  try {
    await query(`
      INSERT INTO user_notification_prefs (user_id, category, enabled, quiet_hours_start, quiet_hours_end)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (user_id, category) DO UPDATE SET
        enabled = EXCLUDED.enabled,
        quiet_hours_start = EXCLUDED.quiet_hours_start,
        quiet_hours_end = EXCLUDED.quiet_hours_end
    `, [req.user?.id, category, enabled, quietHoursStart || '22:00', quietHoursEnd || '07:00']);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

// GET /notifications/upcoming - Próximas notificações agendadas
router.get('/upcoming', authenticate, async (req: RequestWithUser, res: Response) => {
  try {
    const { rows } = await query(`
      SELECT id, type, title, body, scheduled_for as "scheduledFor", metadata
      FROM scheduled_notifications
      WHERE user_id = $1 AND status = 'pending' AND scheduled_for > NOW()
      ORDER BY scheduled_for ASC
      LIMIT 20
    `, [req.user?.id]);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// POST /notifications/schedule - Agendar notificação (interno)
router.post('/schedule', authenticate, async (req: RequestWithUser, res: Response) => {
  const { babyId, type, title, body, scheduledFor, metadata } = req.body;

  try {
    const { rows } = await query(`
      INSERT INTO scheduled_notifications (user_id, baby_id, type, title, body, scheduled_for, metadata)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [req.user?.id, babyId, type, title, body, scheduledFor, metadata ? JSON.stringify(metadata) : null]);

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to schedule notification' });
  }
});

export default router;
