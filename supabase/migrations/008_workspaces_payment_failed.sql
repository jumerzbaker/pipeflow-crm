alter table workspaces
  add column if not exists payment_failed boolean not null default false;
