create table leads (
  id           uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  name         text not null,
  email        text,
  phone        text,
  company      text,
  role         text,
  status       text not null default 'novo' check (status in ('novo', 'contatado', 'proposta', 'negociacao', 'ganho', 'perdido')),
  owner_id     uuid references auth.users(id) on delete set null,
  notes        text,
  created_at   timestamptz not null default now()
);

create index leads_workspace_id_idx on leads(workspace_id);
create index leads_status_idx on leads(workspace_id, status);

alter table leads enable row level security;

create policy "Membros leem leads do workspace"
  on leads for select
  using (is_workspace_member(workspace_id));

create policy "Membros criam leads"
  on leads for insert
  with check (is_workspace_member(workspace_id));

create policy "Membros atualizam leads"
  on leads for update
  using (is_workspace_member(workspace_id));

create policy "Membros excluem leads"
  on leads for delete
  using (is_workspace_member(workspace_id));
