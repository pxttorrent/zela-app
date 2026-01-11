import { query } from '../../server/db.js';

export async function up() {
  // Tabela de convites para parceiros
  await query(`
    CREATE TABLE IF NOT EXISTS partner_invites (
      id SERIAL PRIMARY KEY,
      inviter_id UUID REFERENCES users(id) ON DELETE CASCADE,
      baby_id UUID REFERENCES babies(id) ON DELETE CASCADE,
      invitee_email TEXT NOT NULL,
      invite_code TEXT UNIQUE NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      accepted_at TIMESTAMPTZ
    );
  `);

  // Tabela de relacionamento bebê <-> múltiplos cuidadores
  await query(`
    CREATE TABLE IF NOT EXISTS baby_caretakers (
      id SERIAL PRIMARY KEY,
      baby_id UUID REFERENCES babies(id) ON DELETE CASCADE,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      role TEXT DEFAULT 'parent',
      permissions TEXT[] DEFAULT '{view,edit,track}',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(baby_id, user_id)
    );
  `);

  // Migrar dados existentes (dono original do bebê)
  await query(`
    INSERT INTO baby_caretakers (baby_id, user_id, role, permissions)
    SELECT id, user_id, 'owner', '{view,edit,track,delete,invite}'
    FROM babies
    ON CONFLICT (baby_id, user_id) DO NOTHING;
  `);

  console.log('✅ Migration 008_partner completed');
}

export default up;
