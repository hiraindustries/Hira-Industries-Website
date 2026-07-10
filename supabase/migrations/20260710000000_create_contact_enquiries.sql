create extension if not exists pgcrypto;

create table if not exists public.contact_enquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text null,
  enquiry_type text not null,
  message text not null,
  source text not null default 'website_contact_form',
  status text not null default 'new',
  user_agent text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.contact_enquiries
  drop constraint if exists contact_enquiries_status_check,
  add constraint contact_enquiries_status_check
    check (status in ('new', 'read', 'contacted', 'archived'));

create index if not exists contact_enquiries_created_at_idx
  on public.contact_enquiries(created_at desc);

create index if not exists contact_enquiries_status_created_at_idx
  on public.contact_enquiries(status, created_at desc);

create or replace function public.set_catalogue_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists contact_enquiries_set_updated_at
  on public.contact_enquiries;

create trigger contact_enquiries_set_updated_at
before update on public.contact_enquiries
for each row execute function public.set_catalogue_updated_at();

alter table public.contact_enquiries enable row level security;

revoke all on table public.contact_enquiries from anon, authenticated;

grant all on table public.contact_enquiries to service_role;

comment on table public.contact_enquiries is
  'Website contact form lead records. Public clients cannot read or write directly.';
