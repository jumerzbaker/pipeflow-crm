create table workspaces (
  id                   uuid primary key default gen_random_uuid(),
  name                 text not null,
  slug                 text not null unique,
  plan                 text not null default 'free' check (plan in ('free', 'pro')),
  stripe_customer_id   text,
  stripe_subscription_id text,
  created_at           timestamptz not null default now()
);

alter table workspaces enable row level security;

-- Policies
create policy "Membros leem seu workspace"
  on workspaces for select
  using (is_workspace_member(id));

-- TO authenticated removido: auth.uid() IS NOT NULL é a guarda real,
-- funciona independente da role que o PostgREST atribui ao JWT
create policy "Usuário autenticado cria workspace"
  on workspaces for insert
  with check (auth.uid() is not null);

create policy "Admin atualiza workspace"
  on workspaces for update
  using (id in (
    select workspace_id from workspace_members
    where user_id = auth.uid() and role = 'admin'
  ));
