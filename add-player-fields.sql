alter table session_packs
  add column if not exists player_name text,
  add column if not exists player_age text,
  add column if not exists player_level text,
  add column if not exists phone text;
