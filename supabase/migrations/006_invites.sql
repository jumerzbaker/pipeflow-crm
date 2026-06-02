create table workspace_invites (
  id           uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  email        text not null,
  token        text not null unique default encode(gen_random_bytes(32), 'hex'),
  role         text not null default 'member' check (role in ('admin', 'member')),
  expires_at   timestamptz not null default (now() + interval '7 days'),
  accepted_at  timestamptz,
  created_at   timestamptz not null default now()
);

create index invites_token_idx on workspace_invites(token);
create index invites_workspace_id_idx on workspace_invites(workspace_id);

alter table workspace_invites enable row level security;

create policy "Admin lê convites do workspace"
  on workspace_invites for select
  using (
    workspace_id in (
      select workspace_id from workspace_members
      where user_id = auth.uid() and role = 'admin'
    )
  );

create policy "Admin cria convites"
  on workspace_invites for insert
  with check (
    workspace_id in (
      select workspace_id from workspace_members
      where user_id = auth.uid() and role = 'admin'
    )
  );

create policy "Admin atualiza convites"
  on workspace_invites for update
  using (
    workspace_id in (
      select workspace_id from workspace_members
      where user_id = auth.uid() and role = 'admin'
    )
  );
