-- Migration: Expansion 0-18 years & AI Chat

-- 1. Chat Logs for AI Pediatrician
CREATE TABLE IF NOT EXISTS chat_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  baby_id uuid REFERENCES babies(id) ON DELETE SET NULL,
  message_user text NOT NULL,
  message_bot text NOT NULL,
  sentiment text, -- 'positive', 'neutral', 'negative', 'emergency'
  topics text[], -- ['fever', 'vaccine', 'sleep']
  created_at timestamptz DEFAULT now()
);

-- 2. Milestones (Marcos de Desenvolvimento)
CREATE TABLE IF NOT EXISTS milestone_templates (
  id serial PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL, -- 'motor', 'fala', 'social', 'cognitivo'
  expected_age_months integer NOT NULL, -- Idade esperada em meses
  alert_age_months integer -- Idade de alerta (red flag) se não atingir
);

CREATE TABLE IF NOT EXISTS user_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  baby_id uuid NOT NULL REFERENCES babies(id) ON DELETE CASCADE,
  template_id integer NOT NULL REFERENCES milestone_templates(id),
  achieved_at date,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- 3. Expand Challenge Templates for older kids
ALTER TABLE challenge_templates 
ADD COLUMN IF NOT EXISTS min_age_years integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS max_age_years integer DEFAULT 0;

-- 4. Medical Documents (Exams, Prescriptions)
CREATE TABLE IF NOT EXISTS medical_docs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  baby_id uuid NOT NULL REFERENCES babies(id) ON DELETE CASCADE,
  title text NOT NULL,
  file_url text NOT NULL,
  doc_type text NOT NULL, -- 'exam', 'prescription', 'vaccine_card'
  doctor_name text,
  event_date date,
  created_at timestamptz DEFAULT now()
);

-- 5. Seed Initial Milestones (Example)
INSERT INTO milestone_templates (title, description, category, expected_age_months, alert_age_months) VALUES
('Sorriso Social', 'Sorri em resposta ao sorriso de outra pessoa', 'social', 2, 3),
('Sustentar a Cabeça', 'Mantém a cabeça firme quando sentado', 'motor', 4, 5),
('Sentar sem apoio', 'Senta sozinho sem cair', 'motor', 6, 9),
('Primeira Palavra', 'Diz mama ou papa com sentido', 'fala', 12, 15),
('Andar sozinho', 'Dá passos sem apoio', 'motor', 12, 18),
('Desfralde Diurno', 'Pede para ir ao banheiro durante o dia', 'social', 30, 42);
