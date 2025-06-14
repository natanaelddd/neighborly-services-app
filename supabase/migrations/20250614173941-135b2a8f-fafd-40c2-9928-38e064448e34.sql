
-- 1. Criação da tabela 'menu_items' no Supabase
create table public.menu_items (
  id serial primary key,
  label text not null,
  path text not null,
  visible boolean not null default true,
  display_order integer not null default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 2. Permitir leitura para qualquer usuário autenticado (pode ajustar políticas depois)
alter table public.menu_items enable row level security;

create policy "Admin pode ver menu" 
  on public.menu_items for select
  using (true);

create policy "Admin pode criar menu" 
  on public.menu_items for insert
  with check (true);

create policy "Admin pode atualizar menu" 
  on public.menu_items for update
  using (true);

create policy "Admin pode remover menu" 
  on public.menu_items for delete
  using (true);
