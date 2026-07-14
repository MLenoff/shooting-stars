-- Run in Shooting Stars Supabase project (SQL Editor)
-- Adds registration_closed override and sessions_override to program_settings table

ALTER TABLE program_settings
  ADD COLUMN IF NOT EXISTS registration_closed boolean DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS sessions_override jsonb DEFAULT NULL;
