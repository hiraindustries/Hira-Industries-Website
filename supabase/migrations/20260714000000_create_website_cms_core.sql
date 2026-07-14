-- Hira Industries website CMS core.
-- Hidden foundation only: admin UI and public integration must be enabled
-- route-by-route after workflow testing.

create extension if not exists pgcrypto;

create or replace function public.set_website_cms_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.cms_pages (
  id uuid primary key default gen_random_uuid(),
  page_key text not null unique,
  title text not null,
  slug text not null unique,
  status text not null default 'draft',
  content jsonb not null default '{}'::jsonb,
  seo jsonb not null default '{}'::jsonb,
  version integer not null default 1,
  created_by uuid,
  updated_by uuid,
  published_by uuid,
  published_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cms_pages_status_check
    check (status in ('draft', 'published', 'archived')),
  constraint cms_pages_content_object
    check (jsonb_typeof(content) = 'object'),
  constraint cms_pages_seo_object
    check (jsonb_typeof(seo) = 'object'),
  constraint cms_pages_key_safe
    check (page_key ~ '^[a-z0-9][a-z0-9_-]*$'),
  constraint cms_pages_slug_safe
    check (slug = '/' or slug ~ '^/[a-z0-9][a-z0-9_/-]*$')
);

create table if not exists public.cms_sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.cms_pages(id) on delete cascade,
  section_key text not null,
  title text,
  status text not null default 'draft',
  content jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  version integer not null default 1,
  created_by uuid,
  updated_by uuid,
  published_by uuid,
  published_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cms_sections_status_check
    check (status in ('draft', 'published', 'archived')),
  constraint cms_sections_content_object
    check (jsonb_typeof(content) = 'object'),
  constraint cms_sections_key_safe
    check (section_key ~ '^[a-z0-9][a-z0-9_-]*$')
);

create table if not exists public.cms_versions (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid,
  entity_key text not null,
  version integer not null,
  snapshot jsonb not null,
  restored_from_version_id uuid references public.cms_versions(id) on delete set null,
  created_by uuid,
  created_at timestamptz not null default now(),
  constraint cms_versions_entity_type_check
    check (entity_type in ('page', 'section', 'settings', 'navigation', 'footer', 'media', 'redirect')),
  constraint cms_versions_snapshot_object
    check (jsonb_typeof(snapshot) = 'object')
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  setting_key text not null unique,
  status text not null default 'draft',
  value jsonb not null default '{}'::jsonb,
  created_by uuid,
  updated_by uuid,
  published_by uuid,
  published_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint site_settings_status_check
    check (status in ('draft', 'published', 'archived')),
  constraint site_settings_value_object
    check (jsonb_typeof(value) = 'object'),
  constraint site_settings_key_safe
    check (setting_key ~ '^[a-z0-9][a-z0-9_-]*$')
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  source text not null default 'static',
  file_path text not null unique,
  public_url text,
  filename text not null,
  mime_type text not null,
  size_bytes bigint,
  width integer,
  height integer,
  alt_text text,
  usage_context text,
  status text not null default 'active',
  created_by uuid,
  updated_by uuid,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint media_assets_source_check
    check (source in ('static', 'storage')),
  constraint media_assets_status_check
    check (status in ('active', 'archived')),
  constraint media_assets_path_safe
    check (file_path !~ '(^|/)\.\.(/|$)'),
  constraint media_assets_mime_check
    check (mime_type in ('image/webp', 'image/jpeg', 'image/png', 'image/gif'))
);

create table if not exists public.navigation_items (
  id uuid primary key default gen_random_uuid(),
  location text not null,
  parent_id uuid references public.navigation_items(id) on delete cascade,
  label text not null,
  href text not null,
  is_external boolean not null default false,
  sort_order integer not null default 0,
  status text not null default 'draft',
  created_by uuid,
  updated_by uuid,
  published_by uuid,
  published_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint navigation_items_location_check
    check (location in ('header', 'footer', 'mobile')),
  constraint navigation_items_status_check
    check (status in ('draft', 'published', 'archived')),
  constraint navigation_items_safe_href
    check (href !~* '^\s*(javascript|data):')
);

create table if not exists public.redirect_rules (
  id uuid primary key default gen_random_uuid(),
  source_path text not null unique,
  target_url text not null,
  http_status integer not null default 301,
  status text not null default 'draft',
  created_by uuid,
  updated_by uuid,
  published_by uuid,
  published_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint redirect_rules_status_check
    check (status in ('draft', 'published', 'archived')),
  constraint redirect_rules_http_status_check
    check (http_status in (301, 302, 307, 308)),
  constraint redirect_rules_source_path_check
    check (source_path ~ '^/[A-Za-z0-9._~!$&''()*+,;=:@%/-]*$'),
  constraint redirect_rules_target_safe
    check (target_url !~* '^\s*(javascript|data):')
);

create table if not exists public.cms_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid,
  admin_email text,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  entity_key text,
  entity_display_name text,
  before_summary text,
  after_summary text,
  success boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists cms_pages_status_slug_idx
  on public.cms_pages(status, slug)
  where deleted_at is null;

create index if not exists cms_sections_page_status_order_idx
  on public.cms_sections(page_id, status, sort_order)
  where deleted_at is null;

create index if not exists cms_versions_entity_idx
  on public.cms_versions(entity_type, entity_key, version desc);

create index if not exists site_settings_status_key_idx
  on public.site_settings(status, setting_key)
  where deleted_at is null;

create index if not exists media_assets_status_created_idx
  on public.media_assets(status, created_at desc)
  where deleted_at is null;

create index if not exists navigation_items_location_status_order_idx
  on public.navigation_items(location, status, sort_order)
  where deleted_at is null;

create index if not exists redirect_rules_published_source_idx
  on public.redirect_rules(source_path)
  where status = 'published' and deleted_at is null;

create index if not exists cms_audit_logs_created_idx
  on public.cms_audit_logs(created_at desc);

do $$
declare
  cms_table_name text;
begin
  foreach cms_table_name in array array[
    'cms_pages',
    'cms_sections',
    'site_settings',
    'media_assets',
    'navigation_items',
    'redirect_rules'
  ]
  loop
    execute format('drop trigger if exists %I_set_updated_at on public.%I', cms_table_name, cms_table_name);
    execute format(
      'create trigger %I_set_updated_at before update on public.%I for each row execute function public.set_website_cms_updated_at()',
      cms_table_name,
      cms_table_name
    );
  end loop;
end;
$$;

alter table public.cms_pages enable row level security;
alter table public.cms_sections enable row level security;
alter table public.cms_versions enable row level security;
alter table public.site_settings enable row level security;
alter table public.media_assets enable row level security;
alter table public.navigation_items enable row level security;
alter table public.redirect_rules enable row level security;
alter table public.cms_audit_logs enable row level security;

revoke all on table public.cms_pages from anon, authenticated;
revoke all on table public.cms_sections from anon, authenticated;
revoke all on table public.cms_versions from anon, authenticated;
revoke all on table public.site_settings from anon, authenticated;
revoke all on table public.media_assets from anon, authenticated;
revoke all on table public.navigation_items from anon, authenticated;
revoke all on table public.redirect_rules from anon, authenticated;
revoke all on table public.cms_audit_logs from anon, authenticated;

grant select on table public.cms_pages to anon, authenticated;
grant select on table public.cms_sections to anon, authenticated;
grant select on table public.site_settings to anon, authenticated;
grant select on table public.media_assets to anon, authenticated;
grant select on table public.navigation_items to anon, authenticated;
grant select on table public.redirect_rules to anon, authenticated;
grant all on table public.cms_pages to service_role;
grant all on table public.cms_sections to service_role;
grant all on table public.cms_versions to service_role;
grant all on table public.site_settings to service_role;
grant all on table public.media_assets to service_role;
grant all on table public.navigation_items to service_role;
grant all on table public.redirect_rules to service_role;
grant all on table public.cms_audit_logs to service_role;

drop policy if exists "Published CMS pages are public" on public.cms_pages;
create policy "Published CMS pages are public"
on public.cms_pages
for select
using (status = 'published' and deleted_at is null);

drop policy if exists "Published CMS sections are public" on public.cms_sections;
create policy "Published CMS sections are public"
on public.cms_sections
for select
using (status = 'published' and is_visible = true and deleted_at is null);

drop policy if exists "Published site settings are public" on public.site_settings;
create policy "Published site settings are public"
on public.site_settings
for select
using (status = 'published' and deleted_at is null);

drop policy if exists "Active media assets are public" on public.media_assets;
create policy "Active media assets are public"
on public.media_assets
for select
using (status = 'active' and deleted_at is null);

drop policy if exists "Published navigation items are public" on public.navigation_items;
create policy "Published navigation items are public"
on public.navigation_items
for select
using (status = 'published' and deleted_at is null);

drop policy if exists "Published redirects are public" on public.redirect_rules;
create policy "Published redirects are public"
on public.redirect_rules
for select
using (status = 'published' and deleted_at is null);

comment on table public.cms_pages is
  'Website CMS page records. Drafts are private; public clients can only read published rows.';
comment on table public.cms_versions is
  'CMS version snapshots for admin-controlled publish and restore workflows. Not publicly readable.';
comment on table public.cms_audit_logs is
  'CMS audit log records. Not publicly readable or editable from client applications.';
