-- Fresh database: creates shelters, mood_entries, user_shelter_access, RPCs, and RLS.
-- Assumes these objects do not exist yet.

create table public.shelters (
  id uuid primary key default gen_random_uuid(),
  name text,
  access_code text not null unique
);

create table public.mood_entries (
  id uuid primary key default gen_random_uuid(),
  shelter_id uuid not null references public.shelters (id) on delete cascade,
  mood_level int not null,
  created_at timestamptz not null default now(),
  constraint mood_entries_mood_level_range check (mood_level between 1 and 5)
);

create table public.user_shelter_access (
  user_id uuid not null references auth.users (id) on delete cascade,
  shelter_id uuid not null references public.shelters (id) on delete cascade,
  primary key (user_id, shelter_id)
);

create index mood_entries_shelter_created_at_idx
  on public.mood_entries (shelter_id, created_at desc);

-- Kiosk: confirm code before keeping device on this shelter.
create or replace function public.validate_kiosk_access(p_access_code text)
returns table (shelter_id uuid, shelter_name text)
language sql
security definer
set search_path = public
stable
as $$
  select id, name from public.shelters where access_code = p_access_code;
$$;

revoke all on function public.validate_kiosk_access(text) from public;
grant execute on function public.validate_kiosk_access(text) to anon, authenticated;

-- Kiosk: insert one check-in; resolves shelter from code inside the DB.
create or replace function public.submit_mood_checkin(p_access_code text, p_mood_level int)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  sid uuid;
  new_id uuid;
begin
  if p_mood_level is null or p_mood_level < 1 or p_mood_level > 5 then
    raise exception 'mood_level must be between 1 and 5';
  end if;
  select id into sid from public.shelters where access_code = p_access_code;
  if sid is null then
    raise exception 'invalid access code';
  end if;
  insert into public.mood_entries (shelter_id, mood_level)
  values (sid, p_mood_level)
  returning id into new_id;
  return new_id;
end;
$$;

revoke all on function public.submit_mood_checkin(text, int) from public;
grant execute on function public.submit_mood_checkin(text, int) to anon, authenticated;

-- Staff: tie the signed-in user to a shelter after they enter the correct code.
create or replace function public.claim_shelter_access(p_access_code text)
returns table (shelter_id uuid, shelter_name text)
language plpgsql
security definer
set search_path = public
as $$
declare
  sid uuid;
  sname text;
  uid uuid;
begin
  uid := auth.uid();
  if uid is null then
    raise exception 'not authenticated';
  end if;
  select s.id, s.name into sid, sname
  from public.shelters s
  where s.access_code = p_access_code;
  if sid is null then
    raise exception 'invalid access code';
  end if;
  insert into public.user_shelter_access (user_id, shelter_id)
  values (uid, sid)
  on conflict (user_id, shelter_id) do nothing;
  return query select sid, sname;
end;
$$;

revoke all on function public.claim_shelter_access(text) from public;
grant execute on function public.claim_shelter_access(text) to authenticated;

alter table public.shelters enable row level security;
alter table public.mood_entries enable row level security;
alter table public.user_shelter_access enable row level security;

create policy "Staff read shelters they unlocked"
  on public.shelters
  for select
  to authenticated
  using (
    id in (
      select shelter_id from public.user_shelter_access
      where user_id = auth.uid()
    )
  );

create policy "Staff read their shelter access rows"
  on public.user_shelter_access
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "Staff read mood entries for unlocked shelters"
  on public.mood_entries
  for select
  to authenticated
  using (
    shelter_id in (
      select shelter_id from public.user_shelter_access
      where user_id = auth.uid()
    )
  );
