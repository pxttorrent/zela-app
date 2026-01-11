import { query } from '../../server/db.js';

export async function up() {
  // 1. Adicionar coluna life_stage na tabela babies (calculado no backend, mas útil para cache)
  await query(`
    ALTER TABLE babies 
    ADD COLUMN IF NOT EXISTS life_stage TEXT DEFAULT 'baby';
  `);

  // 2. Modificar challenge_templates para suportar anos
  await query(`
    ALTER TABLE challenge_templates 
    ADD COLUMN IF NOT EXISTS min_age_days INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS max_age_days INTEGER DEFAULT 6570,
    ADD COLUMN IF NOT EXISTS life_stage TEXT DEFAULT 'baby';
  `);

  // 3. Migrar dados existentes (semanas -> dias)
  await query(`
    UPDATE challenge_templates 
    SET min_age_days = min_age_weeks * 7,
        max_age_days = max_age_weeks * 7
    WHERE min_age_days IS NULL OR min_age_days = 0;
  `);

  // 4. Criar tabela de trackers por faixa etária
  await query(`
    CREATE TABLE IF NOT EXISTS tracker_types (
      id SERIAL PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      label TEXT NOT NULL,
      icon TEXT NOT NULL,
      life_stages TEXT[] NOT NULL DEFAULT '{baby}',
      sort_order INTEGER DEFAULT 0
    );
  `);

  // 5. Criar tabela de categorias de desafios expandida
  await query(`
    CREATE TABLE IF NOT EXISTS challenge_categories (
      id SERIAL PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      label TEXT NOT NULL,
      icon TEXT NOT NULL,
      life_stages TEXT[] NOT NULL DEFAULT '{baby,toddler,kid,teen}'
    );
  `);

  // 6. Criar tabela de marcos de desenvolvimento por idade
  await query(`
    CREATE TABLE IF NOT EXISTS milestone_templates (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      min_age_days INTEGER NOT NULL,
      max_age_days INTEGER NOT NULL,
      life_stage TEXT NOT NULL
    );
  `);

  // 7. Adicionar vacinas de adolescentes
  await query(`
    INSERT INTO vaccine_templates (name, days_from_birth, description) VALUES
    ('HPV (1ª dose)', 3285, 'Papilomavírus humano - meninas e meninos de 9 anos.'),
    ('HPV (2ª dose)', 3467, 'Segunda dose 6 meses após a primeira.'),
    ('Meningocócica ACWY', 4015, 'Reforço aos 11 anos.'),
    ('dT (Reforço)', 5475, 'Difteria e Tétano - reforço aos 15 anos.')
    ON CONFLICT DO NOTHING;
  `);

  console.log('✅ Migration 005_all_ages completed');
}

export async function down() {
  await query(`ALTER TABLE babies DROP COLUMN IF EXISTS life_stage;`);
  await query(`ALTER TABLE challenge_templates DROP COLUMN IF EXISTS min_age_days;`);
  await query(`ALTER TABLE challenge_templates DROP COLUMN IF EXISTS max_age_days;`);
  await query(`ALTER TABLE challenge_templates DROP COLUMN IF EXISTS life_stage;`);
  await query(`DROP TABLE IF EXISTS tracker_types;`);
  await query(`DROP TABLE IF EXISTS challenge_categories;`);
  await query(`DROP TABLE IF EXISTS milestone_templates;`);
}

export default up;
