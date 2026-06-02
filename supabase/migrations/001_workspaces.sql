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
