-- Add focus_areas to babies table
ALTER TABLE babies ADD COLUMN IF NOT EXISTS focus_areas text[];
