alter table public.product_categories
  add column if not exists icon text null,
  add column if not exists updated_at timestamptz not null default now();

alter table public.products
  add column if not exists subcategory_id uuid null
    references public.product_categories(id)
    on delete restrict,
  add column if not exists pieces integer null,
  add column if not exists features text[] not null default '{}',
  add column if not exists tags text[] not null default '{}',
  add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'products'
      and column_name = 'available_colors'
      and data_type = 'jsonb'
  ) then
    alter table public.products
      add column available_colors_text text[] not null default '{}';

    update public.products
    set available_colors_text = coalesce(
      array(
        select jsonb_array_elements_text(
          coalesce(products.available_colors, '[]'::jsonb)
        )
      ),
      '{}'
    );

    alter table public.products
      drop constraint if exists products_available_colors_array,
      drop column available_colors;

    alter table public.products
      rename column available_colors_text to available_colors;
  end if;
end
$$;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'products'
      and column_name = 'key_features'
      and data_type = 'jsonb'
  ) then
    update public.products
    set features = coalesce(
      array(
        select jsonb_array_elements_text(
          coalesce(products.key_features, '[]'::jsonb)
        )
      ),
      '{}'
    );

    alter table public.products
      drop constraint if exists products_key_features_array,
      drop column key_features;
  end if;
end
$$;

update public.products as product
set
  subcategory_id = product.category_id,
  category_id = subcategory.parent_id
from public.product_categories as subcategory
where subcategory.id = product.category_id
  and subcategory.parent_id is not null
  and product.subcategory_id is null;

alter table public.products
  drop constraint if exists products_pieces_nonnegative,
  add constraint products_pieces_nonnegative
    check (pieces is null or pieces >= 0);

create unique index if not exists products_product_code_unique_idx
  on public.products(product_code)
  where product_code is not null;

create index if not exists products_subcategory_sort_idx
  on public.products(subcategory_id, sort_order, name);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null
    references public.products(id)
    on delete cascade,
  image_url text not null,
  alt_text text null,
  is_primary boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint product_images_sort_order_nonnegative
    check (sort_order >= 0),
  constraint product_images_product_url_unique
    unique (product_id, image_url)
);

create unique index if not exists product_images_one_primary_idx
  on public.product_images(product_id)
  where is_primary = true;

create index if not exists product_images_product_sort_idx
  on public.product_images(product_id, is_primary desc, sort_order);

insert into public.product_images (
  product_id,
  image_url,
  alt_text,
  is_primary,
  sort_order
)
select
  product.id,
  product.image_url,
  product.name || ' by Hira Industries',
  true,
  0
from public.products as product
where product.image_url is not null
  and btrim(product.image_url) <> ''
on conflict (product_id, image_url) do update
set
  alt_text = excluded.alt_text,
  is_primary = excluded.is_primary,
  sort_order = excluded.sort_order;

insert into public.product_images (
  product_id,
  image_url,
  alt_text,
  is_primary,
  sort_order
)
select
  product.id,
  case
    when jsonb_typeof(gallery.image) = 'string'
      then trim(both '"' from gallery.image::text)
    else gallery.image ->> 'url'
  end,
  case
    when jsonb_typeof(gallery.image) = 'object'
      then gallery.image ->> 'alt'
    else product.name || ' alternate view ' || gallery.position
  end,
  false,
  gallery.position::integer
from public.products as product
cross join lateral jsonb_array_elements(
  coalesce(product.gallery_images, '[]'::jsonb)
) with ordinality as gallery(image, position)
where coalesce(
  case
    when jsonb_typeof(gallery.image) = 'string'
      then trim(both '"' from gallery.image::text)
    else gallery.image ->> 'url'
  end,
  ''
) <> ''
  and (
    product.image_url is null
    or case
      when jsonb_typeof(gallery.image) = 'string'
        then trim(both '"' from gallery.image::text)
      else gallery.image ->> 'url'
    end <> product.image_url
  )
on conflict (product_id, image_url) do update
set
  alt_text = excluded.alt_text,
  is_primary = false,
  sort_order = excluded.sort_order;

create table if not exists public.product_enquiries (
  id uuid primary key default gen_random_uuid(),
  product_id uuid null
    references public.products(id)
    on delete set null,
  name text null,
  phone text null,
  message text null,
  source text null,
  created_at timestamptz not null default now()
);

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

drop trigger if exists product_categories_set_updated_at
  on public.product_categories;

create trigger product_categories_set_updated_at
before update on public.product_categories
for each row execute function public.set_catalogue_updated_at();

drop trigger if exists products_set_updated_at
  on public.products;

create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_catalogue_updated_at();

alter table public.product_images enable row level security;
alter table public.product_enquiries enable row level security;

revoke all on table public.product_images from anon, authenticated;
revoke all on table public.product_enquiries from anon, authenticated;

grant select on table public.product_images to anon, authenticated;
grant all on table public.product_images to service_role;
grant all on table public.product_enquiries to service_role;

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
      from public.product_categories as main_category
      where main_category.id = products.category_id
        and main_category.is_active = true
    )
    and (
      subcategory_id is null
      or exists (
        select 1
        from public.product_categories as subcategory
        where subcategory.id = products.subcategory_id
          and subcategory.is_active = true
      )
    )
  );

drop policy if exists "Active product images are publicly readable"
  on public.product_images;

create policy "Active product images are publicly readable"
  on public.product_images
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.products
      where products.id = product_images.product_id
        and products.is_active = true
    )
  );

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values
  (
    'product-images',
    'product-images',
    true,
    10485760,
    array['image/jpeg', 'image/png', 'image/webp']
  ),
  (
    'category-images',
    'category-images',
    true,
    10485760,
    array['image/jpeg', 'image/png', 'image/webp']
  )
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

comment on table public.product_images is
  'Normalized product gallery. Exactly one image may be primary for each product.';

comment on table public.product_enquiries is
  'Future-ready catalogue enquiry records.';
