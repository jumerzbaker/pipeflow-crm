create table workspace_members (
  workspace_id  uuid not null references workspaces(id) on delete cascade,
  user_id       uuid not null references auth.users(id) on delete cascade,
  role          text not null default 'member' check (role in ('admin', 'member')),
  invited_at    timestamptz,
  joined_at     timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

alter table workspace_members enable row level security;

-- Helper: verifica se o usuário autenticado é membro de um workspace
create or replace function is_workspace_member(ws_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from workspace_members
    where workspace_id = ws_id and user_id = auth.uid()
  );
$$;

-- RLS em workspace_members: usa is_workspace_member() (SECURITY DEFINER) para evitar recursão infinita
create policy "Membros leem membros do próprio workspace"
  on workspace_members for select
  using (is_workspace_member(workspace_id));

create policy "Usuário insere a si mesmo"
  on workspace_members for insert
  with check (user_id = auth.uid());

create policy "Admin gerencia membros"
  on workspace_members for update
  using (
    workspace_id in (
      select workspace_id from workspace_members
      where user_id = auth.uid() and role = 'admin'
    )
  );

create policy "Admin remove membros"
  on workspace_members for delete
  using (
    workspace_id in (
      select workspace_id from workspace_members
      where user_id = auth.uid() and role = 'admin'
    )
  );

-- RLS em workspaces (agora que workspace_members existe)
create policy "Membros leem seu workspace"
  on workspaces for select
  using (is_workspace_member(id));

create policy "Admin atualiza workspace"
  on workspaces for update
  using (
    id in (
      select workspace_id from workspace_members
      where user_id = auth.uid() and role = 'admin'
    )
  );
