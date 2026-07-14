-- Hira Industries CRM core.
-- Focused migration for enquiry -> lead -> timeline/follow-up -> customer.
-- This replaces the previously proposed un-applied CRM/CMS foundation migration.

create extension if not exists pgcrypto;

create or replace function public.set_hira_crm_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.admin_profiles (
  user_id uuid primary key,
  email text not null unique,
  display_name text,
  role text not null default 'viewer',
  is_active boolean not null default true,
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint admin_profiles_role_check
    check (role in ('owner', 'admin', 'editor', 'sales', 'viewer')),
  constraint admin_profiles_email_normalized
    check (email = lower(trim(email)))
);

create table if not exists public.crm_companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  business_type text,
  gst_number text,
  phone text,
  email text,
  website text,
  address text,
  city text,
  state text,
  country text,
  primary_customer_id uuid,
  notes text,
  created_by uuid,
  updated_by uuid,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.crm_leads (
  id uuid primary key default gen_random_uuid(),
  source_enquiry_id uuid unique references public.contact_enquiries(id) on delete set null,
  contact_name text not null,
  company_name text,
  phone text,
  whatsapp text,
  email text,
  city text,
  state text,
  country text,
  buyer_type text,
  source text not null default 'admin',
  interested_product_ids uuid[] not null default '{}',
  interested_category_ids uuid[] not null default '{}',
  estimated_quantity text,
  budget_note text,
  delivery_location text,
  original_message text,
  priority text not null default 'normal',
  status text not null default 'new',
  assigned_admin_id uuid,
  assigned_admin_email text,
  follow_up_at timestamptz,
  last_contact_at timestamptz,
  next_action text,
  internal_summary text,
  lost_reason text,
  converted_customer_id uuid,
  created_by uuid,
  updated_by uuid,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint crm_leads_status_check
    check (status in (
      'new',
      'contacted',
      'qualified',
      'catalogue_sent',
      'quote_requested',
      'quote_sent',
      'negotiation',
      'won',
      'lost',
      'spam',
      'archived'
    )),
  constraint crm_leads_priority_check
    check (priority in ('low', 'normal', 'high', 'urgent')),
  constraint crm_leads_email_lowercase
    check (email is null or email = lower(email))
);

create table if not exists public.crm_customers (
  id uuid primary key default gen_random_uuid(),
  contact_name text not null,
  company_id uuid references public.crm_companies(id) on delete set null,
  company_name text,
  phone text,
  whatsapp text,
  email text,
  gst_number text,
  buyer_type text,
  billing_address text,
  shipping_address text,
  city text,
  state text,
  country text,
  source text not null default 'admin',
  notes text,
  status text not null default 'active',
  converted_from_lead_id uuid unique references public.crm_leads(id) on delete set null,
  created_by uuid,
  updated_by uuid,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint crm_customers_status_check
    check (status in ('active', 'inactive', 'archived')),
  constraint crm_customers_email_lowercase
    check (email is null or email = lower(email))
);

alter table public.crm_companies
  drop constraint if exists crm_companies_primary_customer_id_fkey,
  add constraint crm_companies_primary_customer_id_fkey
    foreign key (primary_customer_id)
    references public.crm_customers(id)
    on delete set null;

alter table public.crm_leads
  drop constraint if exists crm_leads_converted_customer_id_fkey,
  add constraint crm_leads_converted_customer_id_fkey
    foreign key (converted_customer_id)
    references public.crm_customers(id)
    on delete set null;

create table if not exists public.crm_lead_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.crm_leads(id) on delete cascade,
  event_type text not null,
  title text not null,
  description text,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid,
  created_at timestamptz not null default now(),
  constraint crm_lead_events_type_check
    check (event_type in (
      'lead_created',
      'enquiry_converted',
      'status_changed',
      'priority_changed',
      'note_added',
      'call_logged',
      'whatsapp_opened',
      'email_logged',
      'catalogue_shared',
      'follow_up_scheduled',
      'follow_up_completed',
      'customer_created',
      'lead_won',
      'lead_lost',
      'lead_archived',
      'lead_restored'
    )),
  constraint crm_lead_events_metadata_object
    check (jsonb_typeof(metadata) = 'object')
);

create table if not exists public.crm_tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  related_entity_type text not null default 'lead',
  related_entity_id uuid,
  lead_id uuid references public.crm_leads(id) on delete set null,
  customer_id uuid references public.crm_customers(id) on delete set null,
  assigned_admin_id uuid,
  assigned_admin_email text,
  due_at timestamptz,
  priority text not null default 'normal',
  status text not null default 'pending',
  completed_at timestamptz,
  created_by uuid,
  updated_by uuid,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint crm_tasks_entity_type_check
    check (related_entity_type in ('lead', 'customer', 'company', 'internal')),
  constraint crm_tasks_status_check
    check (status in ('pending', 'in_progress', 'completed', 'cancelled')),
  constraint crm_tasks_priority_check
    check (priority in ('low', 'normal', 'high', 'urgent')),
  constraint crm_tasks_related_entity_check
    check (
      (related_entity_type = 'lead' and lead_id is not null)
      or (related_entity_type = 'customer' and customer_id is not null)
      or (related_entity_type in ('company', 'internal'))
    )
);

create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid,
  admin_email text,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  entity_display_name text,
  before_summary text,
  after_summary text,
  success boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.contact_enquiries
  add column if not exists priority text not null default 'normal',
  add column if not exists assigned_admin_email text,
  add column if not exists internal_note text,
  add column if not exists follow_up_at timestamptz,
  add column if not exists converted_lead_id uuid references public.crm_leads(id) on delete set null,
  add column if not exists converted_at timestamptz;

alter table public.contact_enquiries
  drop constraint if exists contact_enquiries_status_check,
  add constraint contact_enquiries_status_check
    check (status in ('new', 'read', 'contacted', 'converted', 'spam', 'archived')),
  drop constraint if exists contact_enquiries_priority_check,
  add constraint contact_enquiries_priority_check
    check (priority in ('low', 'normal', 'high', 'urgent'));

create index if not exists contact_enquiries_converted_lead_idx
  on public.contact_enquiries(converted_lead_id)
  where converted_lead_id is not null;

create index if not exists contact_enquiries_follow_up_idx
  on public.contact_enquiries(follow_up_at)
  where follow_up_at is not null;

create index if not exists contact_enquiries_priority_idx
  on public.contact_enquiries(priority, created_at desc);

create index if not exists crm_leads_status_created_idx
  on public.crm_leads(status, created_at desc)
  where deleted_at is null;

create index if not exists crm_leads_priority_idx
  on public.crm_leads(priority, created_at desc)
  where deleted_at is null;

create index if not exists crm_leads_follow_up_idx
  on public.crm_leads(follow_up_at)
  where deleted_at is null;

create index if not exists crm_leads_email_idx
  on public.crm_leads(email)
  where email is not null and deleted_at is null;

create index if not exists crm_leads_phone_idx
  on public.crm_leads(phone)
  where phone is not null and deleted_at is null;

create index if not exists crm_leads_assigned_admin_idx
  on public.crm_leads(assigned_admin_email, created_at desc)
  where deleted_at is null;

create index if not exists crm_lead_events_lead_created_idx
  on public.crm_lead_events(lead_id, created_at desc);

create index if not exists crm_customers_email_idx
  on public.crm_customers(email)
  where email is not null and deleted_at is null;

create index if not exists crm_customers_phone_idx
  on public.crm_customers(phone)
  where phone is not null and deleted_at is null;

create index if not exists crm_customers_company_idx
  on public.crm_customers(company_id)
  where company_id is not null and deleted_at is null;

create index if not exists crm_tasks_due_idx
  on public.crm_tasks(due_at)
  where deleted_at is null;

create index if not exists crm_tasks_status_idx
  on public.crm_tasks(status, due_at)
  where deleted_at is null;

create index if not exists crm_tasks_priority_idx
  on public.crm_tasks(priority, due_at)
  where deleted_at is null;

create index if not exists crm_tasks_assigned_admin_idx
  on public.crm_tasks(assigned_admin_email, due_at)
  where deleted_at is null;

create index if not exists crm_tasks_lead_idx
  on public.crm_tasks(lead_id, due_at)
  where lead_id is not null and deleted_at is null;

create index if not exists crm_tasks_customer_idx
  on public.crm_tasks(customer_id, due_at)
  where customer_id is not null and deleted_at is null;

create index if not exists admin_audit_logs_created_idx
  on public.admin_audit_logs(created_at desc);

create index if not exists admin_audit_logs_entity_idx
  on public.admin_audit_logs(entity_type, entity_id, created_at desc);

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'admin_profiles',
    'crm_companies',
    'crm_leads',
    'crm_customers',
    'crm_tasks'
  ]
  loop
    execute format('drop trigger if exists %I_set_updated_at on public.%I', table_name, table_name);
    execute format(
      'create trigger %I_set_updated_at before update on public.%I for each row execute function public.set_hira_crm_updated_at()',
      table_name,
      table_name
    );
  end loop;
end;
$$;

create or replace function public.convert_contact_enquiry_to_lead(
  p_enquiry_id uuid,
  p_admin_id uuid,
  p_admin_email text
)
returns uuid
language plpgsql
set search_path = public
as $$
declare
  enquiry public.contact_enquiries%rowtype;
  lead_id uuid;
begin
  select *
  into enquiry
  from public.contact_enquiries
  where id = p_enquiry_id
  for update;

  if not found then
    raise exception 'Enquiry not found';
  end if;

  if enquiry.converted_lead_id is not null then
    return enquiry.converted_lead_id;
  end if;

  insert into public.crm_leads (
    source_enquiry_id,
    contact_name,
    phone,
    whatsapp,
    email,
    source,
    original_message,
    priority,
    status,
    assigned_admin_id,
    assigned_admin_email,
    follow_up_at,
    created_by,
    updated_by
  )
  values (
    enquiry.id,
    enquiry.full_name,
    enquiry.phone,
    enquiry.phone,
    lower(nullif(enquiry.email, '')),
    enquiry.source,
    enquiry.message,
    enquiry.priority,
    'new',
    p_admin_id,
    lower(p_admin_email),
    enquiry.follow_up_at,
    p_admin_id,
    p_admin_id
  )
  on conflict (source_enquiry_id) do update
    set source_enquiry_id = excluded.source_enquiry_id
  returning id into lead_id;

  update public.contact_enquiries
  set
    status = 'converted',
    converted_lead_id = lead_id,
    converted_at = now(),
    assigned_admin_email = coalesce(assigned_admin_email, lower(p_admin_email))
  where id = enquiry.id;

  insert into public.crm_lead_events (
    lead_id,
    event_type,
    title,
    description,
    metadata,
    created_by
  )
  values (
    lead_id,
    'enquiry_converted',
    'Enquiry converted to lead',
    'Website enquiry was converted into a CRM lead.',
    jsonb_build_object('enquiry_id', enquiry.id),
    p_admin_id
  );

  insert into public.admin_audit_logs (
    admin_user_id,
    admin_email,
    action,
    entity_type,
    entity_id,
    entity_display_name,
    after_summary,
    success
  )
  values (
    p_admin_id,
    lower(p_admin_email),
    'enquiry_converted',
    'crm_lead',
    lead_id,
    enquiry.full_name,
    'Converted website enquiry to lead',
    true
  );

  return lead_id;
end;
$$;

create or replace function public.convert_lead_to_customer(
  p_lead_id uuid,
  p_admin_id uuid,
  p_admin_email text,
  p_mark_won boolean default true
)
returns uuid
language plpgsql
set search_path = public
as $$
declare
  lead_record public.crm_leads%rowtype;
  customer_id uuid;
begin
  select *
  into lead_record
  from public.crm_leads
  where id = p_lead_id
    and deleted_at is null
  for update;

  if not found then
    raise exception 'Lead not found';
  end if;

  if lead_record.converted_customer_id is not null then
    return lead_record.converted_customer_id;
  end if;

  insert into public.crm_customers (
    contact_name,
    company_name,
    phone,
    whatsapp,
    email,
    buyer_type,
    city,
    state,
    country,
    source,
    notes,
    converted_from_lead_id,
    created_by,
    updated_by
  )
  values (
    lead_record.contact_name,
    lead_record.company_name,
    lead_record.phone,
    lead_record.whatsapp,
    lead_record.email,
    lead_record.buyer_type,
    lead_record.city,
    lead_record.state,
    lead_record.country,
    'lead_conversion',
    lead_record.internal_summary,
    lead_record.id,
    p_admin_id,
    p_admin_id
  )
  on conflict (converted_from_lead_id) do update
    set converted_from_lead_id = excluded.converted_from_lead_id
  returning id into customer_id;

  update public.crm_leads
  set
    converted_customer_id = customer_id,
    status = case when p_mark_won then 'won' else status end,
    updated_by = p_admin_id,
    updated_at = now()
  where id = lead_record.id;

  insert into public.crm_lead_events (
    lead_id,
    event_type,
    title,
    description,
    metadata,
    created_by
  )
  values (
    lead_record.id,
    'customer_created',
    'Customer created',
    'Lead was converted into a customer record.',
    jsonb_build_object('customer_id', customer_id),
    p_admin_id
  );

  insert into public.admin_audit_logs (
    admin_user_id,
    admin_email,
    action,
    entity_type,
    entity_id,
    entity_display_name,
    after_summary,
    success
  )
  values (
    p_admin_id,
    lower(p_admin_email),
    'lead_converted_to_customer',
    'crm_customer',
    customer_id,
    lead_record.contact_name,
    'Converted lead to customer',
    true
  );

  return customer_id;
end;
$$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'admin_profiles',
    'crm_companies',
    'crm_leads',
    'crm_customers',
    'crm_lead_events',
    'crm_tasks',
    'admin_audit_logs'
  ]
  loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('revoke all on table public.%I from anon, authenticated', table_name);
    execute format('grant all on table public.%I to service_role', table_name);
  end loop;
end;
$$;

revoke all on function public.convert_contact_enquiry_to_lead(uuid, uuid, text)
  from public, anon, authenticated;
grant execute on function public.convert_contact_enquiry_to_lead(uuid, uuid, text)
  to service_role;

revoke all on function public.convert_lead_to_customer(uuid, uuid, text, boolean)
  from public, anon, authenticated;
grant execute on function public.convert_lead_to_customer(uuid, uuid, text, boolean)
  to service_role;

comment on table public.crm_leads is
  'Private CRM leads for Hira Industries. Access only through authorized server-side admin workflows.';
comment on table public.crm_lead_events is
  'Append-only CRM lead timeline events. Normal admin UI does not edit historical events.';
comment on table public.crm_customers is
  'Private CRM customer records converted from leads or created by authorized admins.';
comment on table public.crm_tasks is
  'Private CRM follow-up and task records.';
comment on table public.admin_audit_logs is
  'Private immutable-style admin audit records. Do not store secrets or raw sensitive payloads.';
