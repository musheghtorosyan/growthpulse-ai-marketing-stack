-- GrowthPulse AI - assessment schema (Supabase / Postgres)
-- Run from Supabase SQL editor or via migrations.

-- Needed for `gen_random_uuid()`
create extension if not exists pgcrypto;

create table if not exists public.growth_dimensions (
  id bigserial primary key,
  slug text not null unique,
  name text not null,
  description text not null default '',
  weight numeric not null default 1,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.lead_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  marketing_team_size text not null,
  utm jsonb not null default '{}'::jsonb,
  session_id text not null,
  ab_variant text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  event_props jsonb not null default '{}'::jsonb,
  utm jsonb not null default '{}'::jsonb,
  session_id text not null,
  ab_variant text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.ab_assignments (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  ab_variant text not null,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_session_id_idx on public.analytics_events (session_id);
create index if not exists lead_submissions_created_at_idx on public.lead_submissions (created_at desc);

