create table deals (
  id           uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  lead_id      uuid references leads(id) on delete set null,
  title        text not null,
  value        numeric(12, 2) not null default 0,
  stage        text not null default 'novo_lead' check (stage in ('novo_lead', 'contato_realizado', 'proposta_enviada', 'negociacao', 'fechado_ganho', 'fechado_perdido')),
  owner_id     uuid references auth.users(id) on delete set null,
  due_date     date,
  position     integer not null default 0,
  created_at   timestamptz not null default now()
);

create index deals_workspace_id_idx on deals(workspace_id);
create index deals_stage_idx on deals(workspace_id, stage);

alter table deals enable row level security;

create policy "Membros leem deals do workspace"
  on deals for select
  using (is_workspace_member(workspace_id));

create policy "Membros criam deals"
  on deals for insert
  with check (is_workspace_member(workspace_id));

create policy "Membros atualizam deals"
  on deals for update
  using (is_workspace_member(workspace_id));

create policy "Membros excluem deals"
  on deals for delete
  using (is_workspace_member(workspace_id));
