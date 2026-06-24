-- Run this once in your Supabase project's SQL editor.
-- Creates the single table this app reads/writes: one JSON blob per row,
-- with id = 1 always being "the" campaign database.

create table if not exists campaign_db (
  id         bigint primary key,
  data       jsonb not null,
  updated_at timestamptz default now()
);

-- Allow the anon key to read and write. This app has no auth layer —
-- anyone with the URL can edit data. Fine for a private DM/player group
-- sharing a link; do not use this table design for anything public-facing
-- without adding row-level security and real auth.
alter table campaign_db enable row level security;

create policy "Allow anon read" on campaign_db
  for select using (true);

create policy "Allow anon write" on campaign_db
  for insert with check (true);

create policy "Allow anon update" on campaign_db
  for update using (true);
