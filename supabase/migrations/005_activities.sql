create table activities (
  id           uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  lead_id      uuid references leads(id) on delete cascade,
  type         text not null check (type in ('ligacao', 'email', 'reuniao', 'nota')),
  description  text not null,
  author_id    uuid references auth.users(id) on delete set null,
  occurred_at  timestamptz not null default now(),
  created_at   timestamptz not null default now()
);

create index activities_lead_id_idx on activities(lead_id);
create index activities_workspace_id_idx on activities(workspace_id);

alter table activities enable row level security;

create policy "Membros leem atividades do workspace"
  on activities for select
  using (is_workspace_member(workspace_id));

create policy "Membros criam atividades"
  on activities for insert
  with check (is_workspace_member(workspace_id));

create policy "Membros atualizam atividades"
  on activities for update
  using (is_workspace_member(workspace_id));

create policy "Membros excluem atividades"
  on activities for delete
  using (is_workspace_member(workspace_id));
