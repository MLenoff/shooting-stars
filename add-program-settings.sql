create table if not exists program_settings (
  id text primary key,
  price numeric,
  dates text,
  times text,
  description text,
  active boolean,
  updated_at timestamptz not null default now()
);

alter table program_settings enable row level security;

create policy "Service role full access"
  on program_settings for all
  using (true)
  with check (true);
