-- =============================================================================
-- PREMAINS INTELLECT LLP: Free Trial / Consultation management
--
-- Tables:    public.profiles, public.consultation_requests
-- Rules:     * one FREE_TRIAL per user for life (database-enforced)
--            * users can only READ their own rows; every write goes through
--              the SECURITY DEFINER function submit_consultation_request()
--            * users can never touch profiles.free_trial_used
-- Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE / DROP POLICY IF EXISTS.
-- =============================================================================

-- ---------------------------------------------------------------- profiles ---
create table if not exists public.profiles (
  id               uuid primary key references auth.users (id) on delete cascade,
  full_name        text,
  email            text,
  phone            text,
  free_trial_used  boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Create a profile automatically whenever someone registers.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, phone)
  values (
    new.id,
    new.email,
    nullif(btrim(new.raw_user_meta_data ->> 'full_name'), ''),
    nullif(btrim(new.raw_user_meta_data ->> 'phone'), '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Back-fill profiles for anyone who registered before this migration.
insert into public.profiles (id, email, full_name, phone)
select u.id, u.email,
       nullif(btrim(u.raw_user_meta_data ->> 'full_name'), ''),
       nullif(btrim(u.raw_user_meta_data ->> 'phone'), '')
from auth.users u
on conflict (id) do nothing;

-- ---------------------------------------------------- consultation_requests ---
create table if not exists public.consultation_requests (
  id                      uuid primary key default gen_random_uuid(),
  user_id                 uuid not null references auth.users (id) on delete cascade,
  request_type            text not null check (request_type in ('FREE_TRIAL', 'CONSULTATION')),
  full_name               text not null,
  email                   text not null,
  phone                   text not null,
  company_name            text not null,
  service_required        text not null,
  business_type           text not null,
  requirements            text not null,
  additional_information  text,
  preferred_date          date,
  created_at              timestamptz not null default now(),
  -- e-mail delivery bookkeeping (the request is saved first, the e-mail second)
  email_status            text not null default 'pending'
                            check (email_status in ('pending', 'sending', 'sent', 'failed')),
  email_attempts          integer not null default 0,
  email_claimed_at        timestamptz,
  email_sent_at           timestamptz,
  email_last_error        text
);

create index if not exists consultation_requests_user_id_idx
  on public.consultation_requests (user_id, created_at desc);
create index if not exists consultation_requests_email_pending_idx
  on public.consultation_requests (created_at)
  where email_status in ('pending', 'failed');

-- THE one-free-trial-per-user rule, enforced by the database itself.
-- Two simultaneous submissions cannot both succeed: the second insert hits this index.
create unique index if not exists consultation_requests_one_free_trial_per_user
  on public.consultation_requests (user_id)
  where request_type = 'FREE_TRIAL';

-- --------------------------------------------------- row level security ------
alter table public.profiles              enable row level security;
alter table public.consultation_requests enable row level security;

drop policy if exists "profiles: read own"  on public.profiles;
create policy "profiles: read own"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()));

drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

drop policy if exists "requests: read own" on public.consultation_requests;
create policy "requests: read own"
  on public.consultation_requests for select to authenticated
  using (user_id = (select auth.uid()));

-- No INSERT / UPDATE / DELETE policies on consultation_requests: with RLS on,
-- that means users cannot write to it directly at all.

-- Privileges: start from nothing, then grant only what is needed.
revoke all on public.profiles              from anon, authenticated;
revoke all on public.consultation_requests from anon, authenticated;

grant select on public.profiles              to authenticated;
grant select on public.consultation_requests to authenticated;
-- Column-level grant: a user may edit ONLY name and phone, never free_trial_used.
grant update (full_name, phone) on public.profiles to authenticated;

-- ------------------------------------------------ atomic submission function --
create or replace function public.submit_consultation_request(
  p_request_type            text,
  p_full_name               text,
  p_phone                   text,
  p_company_name            text,
  p_service_required        text,
  p_business_type           text,
  p_requirements            text,
  p_additional_information  text default null,
  p_preferred_date          date default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid     uuid := auth.uid();
  v_email   text;
  v_used    boolean;
  v_row     public.consultation_requests;
begin
  if v_uid is null then
    raise exception 'NOT_AUTHENTICATED' using errcode = 'P0001';
  end if;

  -- ---- server-side validation (never trust the browser) ----
  if p_request_type is null or p_request_type not in ('FREE_TRIAL', 'CONSULTATION') then
    raise exception 'INVALID_REQUEST_TYPE' using errcode = 'P0001';
  end if;

  p_full_name              := btrim(coalesce(p_full_name, ''));
  p_phone                  := btrim(coalesce(p_phone, ''));
  p_company_name           := btrim(coalesce(p_company_name, ''));
  p_service_required       := btrim(coalesce(p_service_required, ''));
  p_business_type          := btrim(coalesce(p_business_type, ''));
  p_requirements           := btrim(coalesce(p_requirements, ''));
  p_additional_information := nullif(btrim(coalesce(p_additional_information, '')), '');

  if char_length(p_full_name) not between 2 and 120
     or char_length(p_company_name) not between 2 and 160
     or char_length(p_service_required) not between 2 and 160
     or char_length(p_business_type) not between 2 and 120
     or char_length(p_requirements) not between 10 and 4000
     or char_length(coalesce(p_additional_information, '')) > 4000 then
    raise exception 'INVALID_INPUT' using errcode = 'P0001';
  end if;

  if p_phone !~ '^[0-9+()\s\-]{7,20}$' then
    raise exception 'INVALID_PHONE' using errcode = 'P0001';
  end if;

  if p_preferred_date is not null and p_preferred_date < current_date then
    raise exception 'INVALID_DATE' using errcode = 'P0001';
  end if;
  if p_request_type = 'FREE_TRIAL' then
    p_preferred_date := null;   -- the free trial has no preferred date
  end if;

  -- The e-mail always comes from the verified account, not from the form.
  select u.email into v_email from auth.users u where u.id = v_uid;

  -- Make sure a profile row exists, then LOCK it. Concurrent requests from the
  -- same user queue up here, so the check below is race-free.
  insert into public.profiles (id, email) values (v_uid, v_email)
    on conflict (id) do nothing;

  select p.free_trial_used into v_used
    from public.profiles p where p.id = v_uid for update;

  if p_request_type = 'FREE_TRIAL' and v_used then
    raise exception 'FREE_TRIAL_ALREADY_USED' using errcode = 'P0001';
  end if;

  begin
    insert into public.consultation_requests (
      user_id, request_type, full_name, email, phone, company_name,
      service_required, business_type, requirements,
      additional_information, preferred_date
    ) values (
      v_uid, p_request_type, p_full_name, v_email, p_phone, p_company_name,
      p_service_required, p_business_type, p_requirements,
      p_additional_information, p_preferred_date
    )
    returning * into v_row;
  exception when unique_violation then
    -- Belt and braces: the partial unique index is the last line of defence.
    raise exception 'FREE_TRIAL_ALREADY_USED' using errcode = 'P0001';
  end;

  if p_request_type = 'FREE_TRIAL' then
    update public.profiles
       set free_trial_used = true,
           full_name = coalesce(full_name, p_full_name),
           phone     = coalesce(phone, p_phone)
     where id = v_uid;
  else
    update public.profiles
       set full_name = coalesce(full_name, p_full_name),
           phone     = coalesce(phone, p_phone)
     where id = v_uid;
  end if;

  return jsonb_build_object(
    'id', v_row.id,
    'request_type', v_row.request_type,
    'created_at', v_row.created_at
  );
end;
$$;

revoke all on function public.submit_consultation_request(text, text, text, text, text, text, text, text, date)
  from public, anon;
grant execute on function public.submit_consultation_request(text, text, text, text, text, text, text, text, date)
  to authenticated;

-- ------------------------------------- e-mail claim (no duplicate e-mails) ----
-- Called ONLY by the notify-consultation Edge Function (service role).
-- Returns true for exactly one caller per request; a request whose e-mail is
-- already sent, or currently being sent, can't be claimed again.
create or replace function public.claim_request_email(p_id uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_claimed int;
begin
  update public.consultation_requests
     set email_status     = 'sending',
         email_claimed_at = now(),
         email_attempts   = email_attempts + 1
   where id = p_id
     and (
           email_status in ('pending', 'failed')
        or (email_status = 'sending' and email_claimed_at < now() - interval '10 minutes')
     );
  get diagnostics v_claimed = row_count;
  return v_claimed = 1;
end;
$$;

revoke all on function public.claim_request_email(uuid) from public, anon, authenticated;
grant execute on function public.claim_request_email(uuid) to service_role;

-- The Edge Function (service role) records the outcome.
revoke all on function public.set_updated_at() from public, anon, authenticated;
grant all on public.consultation_requests to service_role;
grant all on public.profiles to service_role;
