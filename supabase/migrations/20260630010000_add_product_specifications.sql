alter table public.products
  add column if not exists set_contents text null,
  add column if not exists available_colors jsonb null,
  add column if not exists key_features jsonb null;

alter table public.products
  drop constraint if exists products_available_colors_array,
  add constraint products_available_colors_array
    check (
      available_colors is null
      or jsonb_typeof(available_colors) = 'array'
    ),
  drop constraint if exists products_key_features_array,
  add constraint products_key_features_array
    check (
      key_features is null
      or jsonb_typeof(key_features) = 'array'
    );

comment on column public.products.set_contents is
  'Human-readable set size or contents, such as 6 Pieces or Custom Mix.';

comment on column public.products.available_colors is
  'JSON array of color names available for catalogue enquiries.';

comment on column public.products.key_features is
  'JSON array of concise product features used on catalogue cards and detail pages.';
