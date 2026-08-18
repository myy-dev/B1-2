alter table public.todos
  add column if not exists user_id uuid references auth.users(id) on delete cascade default auth.uid();

alter table public.todos
  alter column user_id set not null;

create index if not exists todos_user_id_idx on public.todos using btree (user_id);

drop policy if exists "Public demo todos are readable" on public.todos;
drop policy if exists "Public demo todos are insertable" on public.todos;
drop policy if exists "Public demo todos are updateable" on public.todos;
drop policy if exists "Public demo todos are deletable" on public.todos;

revoke all privileges on table public.todos from anon;
grant select, insert, update, delete on table public.todos to authenticated;
grant select, insert, update, delete on table public.todos to service_role;

create policy "Users can read their own todos"
on public.todos for select to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can insert their own todos"
on public.todos for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their own todos"
on public.todos for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their own todos"
on public.todos for delete to authenticated
using ((select auth.uid()) = user_id);

comment on table public.todos is 'Per-user todo data protected by Supabase Auth and owner-scoped RLS.';
comment on column public.todos.user_id is 'Owner from auth.users; defaults to the authenticated user.';
