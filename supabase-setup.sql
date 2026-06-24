create table session_packs (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  name text not null,
  program_id text not null,
  program_name text not null,
  sessions_total integer not null,
  sessions_used integer not null default 0,
  purchase_date date not null default current_date,
  created_at timestamptz not null default now()
);

-- Allow public read by email (for parent lookup)
alter table session_packs enable row level security;

create policy "Parents can view their own packs"
  on session_packs for select
  using (true);

create policy "Service role can insert"
  on session_packs for insert
  with check (true);

create policy "Service role can update"
  on session_packs for update
  using (true);
