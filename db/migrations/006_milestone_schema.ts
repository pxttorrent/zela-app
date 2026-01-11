import { query } from '../../server/db';

export async function up() {
  await query(`
    ALTER TABLE milestone_templates 
    ADD COLUMN IF NOT EXISTS min_age_days INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS max_age_days INTEGER DEFAULT 36500,
    ADD COLUMN IF NOT EXISTS life_stage TEXT DEFAULT 'baby';
  `);
}

export default up;
