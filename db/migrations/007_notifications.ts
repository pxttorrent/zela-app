import { query } from '../../server/db.js';

export async function up() {
  // Tabela de preferências de notificação por usuário
  await query(`
    CREATE TABLE IF NOT EXISTS user_notification_prefs (
      id SERIAL PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      category TEXT NOT NULL,
      enabled BOOLEAN DEFAULT true,
      quiet_hours_start TIME DEFAULT '22:00',
      quiet_hours_end TIME DEFAULT '07:00',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, category)
    );
  `);

  // Tabela de notificações agendadas
  await query(`
    CREATE TABLE IF NOT EXISTS scheduled_notifications (
      id SERIAL PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      baby_id UUID REFERENCES babies(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      scheduled_for TIMESTAMPTZ NOT NULL,
      sent_at TIMESTAMPTZ,
      status TEXT DEFAULT 'pending',
      metadata JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // Índices
  await query(`CREATE INDEX IF NOT EXISTS idx_scheduled_notif_user ON scheduled_notifications(user_id, status);`);
  await query(`CREATE INDEX IF NOT EXISTS idx_scheduled_notif_time ON scheduled_notifications(scheduled_for) WHERE status = 'pending';`);

  console.log('✅ Migration 007_notifications completed');
}

export default up;
