  -- ============================================================
  -- WasteTrack — Supabase Database Schema
  -- Run this in: Supabase Dashboard → SQL Editor → New Query
  -- ============================================================

  -- 1. PROFILES (extends Supabase auth.users)
  create table if not exists public.profiles (
    id              uuid primary key references auth.users(id) on delete cascade,
    name            text not null,
    email           text not null,
    city            text not null default 'Rabat',
    points          integer not null default 0,
    total_deposits  integer not null default 0,
    created_at      timestamptz not null default now()
  );

  -- Enable Row Level Security
  alter table public.profiles enable row level security;

  -- Policies: users can read/update their own profile
  create policy "Users can view own profile"
    on public.profiles for select using (auth.uid() = id);

  create policy "Users can update own profile"
    on public.profiles for update using (auth.uid() = id);

  -- Service role can do everything (for backend)
  create policy "Service role full access on profiles"
    on public.profiles for all using (true) with check (true);


  -- 2. DEPOSITS
  create table if not exists public.deposits (
    id            uuid primary key default gen_random_uuid(),
    user_id       uuid not null references public.profiles(id) on delete cascade,
    bin_id        integer,
    waste_type    text not null check (waste_type in ('Plastic', 'Glass', 'Paper', 'Organic')),
    confidence    float not null default 0.9,
    points_earned integer not null default 0,
    photo_url     text,
    verified      boolean not null default true,
    created_at    timestamptz not null default now()
  );

  alter table public.deposits enable row level security;

  create policy "Users can view own deposits"
    on public.deposits for select using (auth.uid() = user_id);

  create policy "Service role full access on deposits"
    on public.deposits for all using (true) with check (true);

  -- Index for fast user history queries
  create index if not exists deposits_user_id_idx on public.deposits(user_id, created_at desc);


  -- 3. LEADERBOARD VIEW (optional — makes queries faster)
  create or replace view public.leaderboard as
    select
      id,
      name,
      city,
      points,
      total_deposits,
      row_number() over (order by points desc) as rank
    from public.profiles
    order by points desc;
