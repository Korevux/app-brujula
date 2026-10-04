-- Brújula Interior: tabla de sincronización.
-- Pegar completo en Supabase → SQL Editor → New query → Run.
-- Guarda un único documento JSON por persona con todos sus datos de la app.

create table if not exists public.user_state (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  state      jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.user_state enable row level security;

-- Cada persona solo puede ver, crear, actualizar y borrar su propia fila.
drop policy if exists "leer mis datos" on public.user_state;
create policy "leer mis datos" on public.user_state
  for select using (auth.uid() = user_id);

drop policy if exists "crear mis datos" on public.user_state;
create policy "crear mis datos" on public.user_state
  for insert with check (auth.uid() = user_id);

drop policy if exists "actualizar mis datos" on public.user_state;
create policy "actualizar mis datos" on public.user_state
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "borrar mis datos" on public.user_state;
create policy "borrar mis datos" on public.user_state
  for delete using (auth.uid() = user_id);
