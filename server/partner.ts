import { Router, Response } from 'express';
import { query } from './db.js';
import { authenticate, RequestWithUser } from './middleware.js';
import crypto from 'crypto';

const router = Router();

// POST /partner/invite - Convidar parceiro
router.post('/invite', authenticate, async (req: RequestWithUser, res: Response) => {
  const { email, babyId } = req.body;

  try {
    // Verificar se usuário é owner do bebê
    const { rows: caretakers } = await query(
      `SELECT * FROM baby_caretakers WHERE baby_id = $1 AND user_id = $2 AND 'invite' = ANY(permissions)`,
      [babyId, req.user?.id]
    );
    if (caretakers.length === 0) {
      return res.status(403).json({ error: 'Sem permissão para convidar' });
    }

    // Verificar se já existe convite pendente
    const { rows: existing } = await query(
      `SELECT * FROM partner_invites WHERE baby_id = $1 AND invitee_email = $2 AND status = 'pending'`,
      [babyId, email]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Convite já enviado para este email' });
    }

    // Gerar código único
    const inviteCode = crypto.randomBytes(16).toString('hex');

    // Criar convite
    const { rows } = await query(`
      INSERT INTO partner_invites (inviter_id, baby_id, invitee_email, invite_code)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [req.user?.id, babyId, email, inviteCode]);

    // TODO: Enviar email com link de convite
    // await sendEmail(email, 'Convite Zela', `Use o código: ${inviteCode}`);

    res.json({ 
      success: true, 
      inviteCode,
      message: 'Convite criado. Compartilhe o código com seu parceiro.' 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send invite' });
  }
});

// POST /partner/accept - Aceitar convite
router.post('/accept', authenticate, async (req: RequestWithUser, res: Response) => {
  const { inviteCode } = req.body;

  try {
    // Buscar convite
    const { rows: invites } = await query(
      `SELECT * FROM partner_invites WHERE invite_code = $1 AND status = 'pending'`,
      [inviteCode]
    );
    if (invites.length === 0) {
      return res.status(404).json({ error: 'Convite não encontrado ou já usado' });
    }

    const invite = invites[0];

    // Adicionar como caretaker
    await query(`
      INSERT INTO baby_caretakers (baby_id, user_id, role, permissions)
      VALUES ($1, $2, 'partner', '{view,edit,track}')
      ON CONFLICT (baby_id, user_id) DO NOTHING
    `, [invite.baby_id, req.user?.id]);

    // Atualizar status do convite
    await query(`
      UPDATE partner_invites SET status = 'accepted', accepted_at = NOW()
      WHERE id = $1
    `, [invite.id]);

    res.json({ success: true, message: 'Você agora tem acesso ao perfil!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to accept invite' });
  }
});

// GET /partner/caretakers/:babyId - Listar cuidadores
router.get('/caretakers/:babyId', authenticate, async (req: RequestWithUser, res: Response) => {
  const { babyId } = req.params;

  try {
    const { rows } = await query(`
      SELECT bc.*, u.name, u.email
      FROM baby_caretakers bc
      JOIN users u ON u.id = bc.user_id
      WHERE bc.baby_id = $1
    `, [babyId]);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch caretakers' });
  }
});

// DELETE /partner/caretakers/:babyId/:userId - Remover cuidador
router.delete('/caretakers/:babyId/:userId', authenticate, async (req: RequestWithUser, res: Response) => {
  const { babyId, userId } = req.params;

  try {
    // Verificar permissão (owner pode remover)
    const { rows: permission } = await query(
      `SELECT * FROM baby_caretakers WHERE baby_id = $1 AND user_id = $2 AND role = 'owner'`,
      [babyId, req.user?.id]
    );
    if (permission.length === 0) {
      return res.status(403).json({ error: 'Apenas o dono pode remover cuidadores' });
    }

    // Não permitir remover a si mesmo se for owner
    if (String(req.user?.id) === userId) {
        return res.status(400).json({ error: 'Você não pode remover a si mesmo' });
    }

    await query('DELETE FROM baby_caretakers WHERE baby_id = $1 AND user_id = $2', [babyId, userId]);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove caretaker' });
  }
});

export default router;
