create table if not exists public.todos (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) between 1 and 80),
  description text not null default '' check (char_length(description) <= 500),
  status text not null default 'active' check (status in ('active', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.todos enable row level security;

grant select, insert, update, delete on table public.todos to anon, authenticated;
grant all privileges on table public.todos to service_role;

create policy "Public demo todos are readable"
on public.todos for select to anon, authenticated using (true);

create policy "Public demo todos are insertable"
on public.todos for insert to anon, authenticated with check (true);

create policy "Public demo todos are updateable"
on public.todos for update to anon, authenticated using (true) with check (true);

create policy "Public demo todos are deletable"
on public.todos for delete to anon, authenticated using (true);

comment on table public.todos is 'Public demo todo data. Replace public policies with per-user policies when Auth is added.';
