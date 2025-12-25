
CREATE TABLE IF NOT EXISTS app_settings (
  id integer PRIMARY KEY DEFAULT 1,
  ad_config jsonb DEFAULT '{"enabled": true, "clientId": "", "slots": {"dashboard": ""}}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

CREATE TABLE IF NOT EXISTS push_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  audience text NOT NULL,
  sent_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id)
);

-- Insert default settings if not exists
INSERT INTO app_settings (id) VALUES (1) ON CONFLICT DO NOTHING;

-- Add admin flag to users if not exists (simplifying admin check)
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;
