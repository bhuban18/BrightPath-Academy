-- ==============================================================================
-- BrightPath Academy — Supabase Database Migration & Security Schema
-- ==============================================================================
-- Instructions:
-- 1. Open your Supabase Dashboard: https://supabase.com
-- 2. Select your project and navigate to the "SQL Editor" in the left sidebar.
-- 3. Click "New Query", paste this entire script, and click "Run".
-- ==============================================================================

-- 1. Create the registrations table
create table if not exists public.registrations (
    id uuid primary key default gen_random_uuid(),
    student_name text not null,
    email text not null,
    phone text not null,
    course text not null,
    batch_preference text not null,
    message text,
    status text not null default 'New',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
-- This ensures that unauthenticated public users cannot inspect other students' records!
alter table public.registrations enable row level security;

-- 3. Policy: Anyone (public website visitors) can INSERT a registration
-- This allows prospective students/parents to submit the form without needing an account.
create policy "Allow public visitors to insert registrations"
on public.registrations
for insert
to anon, authenticated
with check (true);

-- 4. Policy: Only authenticated administrators can SELECT (view) registrations
-- Public visitors are strictly blocked from reading or downloading registration records.
create policy "Allow authenticated admins to read registrations"
on public.registrations
for select
to authenticated
using (true);

-- 5. Policy: Only authenticated administrators can UPDATE registrations (e.g. mark as Contacted/Enrolled)
create policy "Allow authenticated admins to update registrations"
on public.registrations
for update
to authenticated
using (true)
with check (true);

-- 6. Policy: Only authenticated administrators can DELETE registrations
create policy "Allow authenticated admins to delete registrations"
on public.registrations
for delete
to authenticated
using (true);

-- 7. Performance Indexes for faster searching and filtering in the Admin Dashboard
create index if not exists idx_registrations_created_at on public.registrations (created_at desc);
create index if not exists idx_registrations_status on public.registrations (status);
create index if not exists idx_registrations_course on public.registrations (course);
