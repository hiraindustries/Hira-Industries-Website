-- Allow one draft and one published row for the same CMS page key/slug.

alter table public.cms_pages
  drop constraint if exists cms_pages_page_key_key,
  drop constraint if exists cms_pages_slug_key;

create unique index if not exists cms_pages_page_key_status_unique
  on public.cms_pages(page_key, status)
  where deleted_at is null and status in ('draft', 'published');

create unique index if not exists cms_pages_slug_status_unique
  on public.cms_pages(slug, status)
  where deleted_at is null and status in ('draft', 'published');

create or replace function public.publish_cms_page(
  p_page_key text,
  p_admin_id uuid,
  p_admin_email text
)
returns integer
language plpgsql
set search_path = public
as $$
declare
  draft_row public.cms_pages%rowtype;
  next_version integer;
begin
  select *
  into draft_row
  from public.cms_pages
  where page_key = p_page_key
    and status = 'draft'
    and deleted_at is null
  for update;

  if not found then
    raise exception 'Draft page not found';
  end if;

  select coalesce(max(version), 0) + 1
  into next_version
  from public.cms_versions
  where entity_type = 'page'
    and entity_key = p_page_key;

  insert into public.cms_versions (
    entity_type,
    entity_id,
    entity_key,
    version,
    snapshot,
    created_by
  )
  values (
    'page',
    draft_row.id,
    p_page_key,
    next_version,
    jsonb_build_object(
      'title', draft_row.title,
      'slug', draft_row.slug,
      'content', draft_row.content,
      'seo', draft_row.seo,
      'published_at', now(),
      'published_by', p_admin_email
    ),
    p_admin_id
  );

  insert into public.cms_pages (
    page_key,
    title,
    slug,
    status,
    content,
    seo,
    version,
    created_by,
    updated_by,
    published_by,
    published_at
  )
  values (
    draft_row.page_key,
    draft_row.title,
    draft_row.slug,
    'published',
    draft_row.content,
    draft_row.seo,
    next_version,
    coalesce(draft_row.created_by, p_admin_id),
    p_admin_id,
    p_admin_id,
    now()
  )
  on conflict (page_key, status) where deleted_at is null and status in ('draft', 'published')
  do update set
    title = excluded.title,
    slug = excluded.slug,
    content = excluded.content,
    seo = excluded.seo,
    version = excluded.version,
    updated_by = excluded.updated_by,
    published_by = excluded.published_by,
    published_at = excluded.published_at,
    updated_at = now();

  update public.cms_pages
  set version = next_version,
      updated_by = p_admin_id
  where id = draft_row.id;

  insert into public.cms_audit_logs (
    admin_user_id,
    admin_email,
    action,
    entity_type,
    entity_id,
    entity_key,
    entity_display_name,
    after_summary,
    success
  )
  values (
    p_admin_id,
    lower(p_admin_email),
    'homepage_published',
    'page',
    draft_row.id,
    p_page_key,
    draft_row.title,
    'Published homepage version ' || next_version,
    true
  );

  return next_version;
end;
$$;

create or replace function public.restore_cms_page_version_to_draft(
  p_version_id uuid,
  p_admin_id uuid,
  p_admin_email text
)
returns integer
language plpgsql
set search_path = public
as $$
declare
  version_row public.cms_versions%rowtype;
  snapshot jsonb;
begin
  select *
  into version_row
  from public.cms_versions
  where id = p_version_id
    and entity_type = 'page'
  for update;

  if not found then
    raise exception 'Version not found';
  end if;

  snapshot := version_row.snapshot;

  insert into public.cms_pages (
    page_key,
    title,
    slug,
    status,
    content,
    seo,
    version,
    created_by,
    updated_by
  )
  values (
    version_row.entity_key,
    coalesce(snapshot->>'title', 'Homepage'),
    coalesce(snapshot->>'slug', '/'),
    'draft',
    coalesce(snapshot->'content', '{}'::jsonb),
    coalesce(snapshot->'seo', '{}'::jsonb),
    version_row.version,
    p_admin_id,
    p_admin_id
  )
  on conflict (page_key, status) where deleted_at is null and status in ('draft', 'published')
  do update set
    title = excluded.title,
    slug = excluded.slug,
    content = excluded.content,
    seo = excluded.seo,
    version = excluded.version,
    updated_by = excluded.updated_by,
    updated_at = now();

  insert into public.cms_audit_logs (
    admin_user_id,
    admin_email,
    action,
    entity_type,
    entity_id,
    entity_key,
    entity_display_name,
    after_summary,
    success
  )
  values (
    p_admin_id,
    lower(p_admin_email),
    'homepage_version_restored',
    'page',
    version_row.entity_id,
    version_row.entity_key,
    coalesce(snapshot->>'title', 'Homepage'),
    'Restored homepage version ' || version_row.version || ' to draft',
    true
  );

  return version_row.version;
end;
$$;
