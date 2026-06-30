create extension if not exists pgcrypto;

create table if not exists public.product_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  parent_id uuid null,
  description text null,
  image_url text null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint product_categories_parent_id_fkey
    foreign key (parent_id)
    references public.product_categories(id)
    on delete restrict,
  constraint product_categories_parent_not_self
    check (parent_id is null or parent_id <> id),
  constraint product_categories_sort_order_nonnegative
    check (sort_order >= 0)
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category_id uuid not null,
  short_description text not null,
  description text not null,
  product_code text null,
  material text null,
  image_url text null,
  gallery_images jsonb null,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint products_category_id_fkey
    foreign key (category_id)
    references public.product_categories(id)
    on delete restrict,
  constraint products_gallery_images_array
    check (gallery_images is null or jsonb_typeof(gallery_images) = 'array'),
  constraint products_sort_order_nonnegative
    check (sort_order >= 0)
);

create index if not exists product_categories_parent_sort_idx
  on public.product_categories(parent_id, sort_order, name);

create index if not exists product_categories_active_idx
  on public.product_categories(is_active)
  where is_active = true;

create index if not exists products_category_sort_idx
  on public.products(category_id, sort_order, name);

create index if not exists products_active_idx
  on public.products(is_active)
  where is_active = true;

create index if not exists products_featured_idx
  on public.products(is_featured, sort_order)
  where is_active = true and is_featured = true;

alter table public.product_categories enable row level security;
alter table public.products enable row level security;

revoke all on table public.product_categories from anon, authenticated;
revoke all on table public.products from anon, authenticated;

grant select on table public.product_categories to anon, authenticated;
grant select on table public.products to anon, authenticated;
grant all on table public.product_categories to service_role;
grant all on table public.products to service_role;

drop policy if exists "Active categories are publicly readable"
  on public.product_categories;

create policy "Active categories are publicly readable"
  on public.product_categories
  for select
  to anon, authenticated
  using (is_active = true);

drop policy if exists "Active products are publicly readable"
  on public.products;

create policy "Active products are publicly readable"
  on public.products
  for select
  to anon, authenticated
  using (
    is_active = true
    and exists (
      select 1
      from public.product_categories
      where product_categories.id = products.category_id
        and product_categories.is_active = true
    )
  );

comment on table public.product_categories is
  'Hierarchical catalogue categories. Public clients may read active rows only.';

comment on table public.products is
  'Catalogue products for enquiries. Public clients may read active rows only.';
