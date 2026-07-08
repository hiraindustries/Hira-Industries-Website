begin;

-- Keep products and images intact. This migration only adjusts category visibility
-- and reassigns products where there is an obvious category mapping.

insert into public.product_categories (
  name,
  slug,
  parent_id,
  description,
  image_url,
  sort_order,
  is_active
)
values (
  'Hira Industries Product Catalogue',
  'crockery-website-product-categories',
  null,
  'Premium ceramic crockery catalogue for homes, hospitality, retail, wholesale, and gifting buyers.',
  null,
  0,
  true
)
on conflict (slug) do update
set
  name = excluded.name,
  parent_id = excluded.parent_id,
  description = excluded.description,
  image_url = excluded.image_url,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

with approved_main_categories as (
  select * from (values
    ('Dinner Sets', 'dinner-sets', 10),
    ('Tea & Coffee Sets', 'tea-coffee-sets', 20),
    ('Cups & Mugs', 'cups-mugs', 30),
    ('Plates', 'plates', 40),
    ('Bowls', 'bowls', 50),
    ('Serving Sets', 'serving-sets', 60),
    ('Gift Sets', 'gift-sets', 70),
    ('Hotel / Bulk Orders', 'hotel-bulk-orders', 80),
    ('Bathroom Accessories', 'bathroom-accessories', 90),
    ('Glassware & Drinkware', 'glassware-drinkware', 100),
    ('Home Decor & Accents', 'home-decor-accents', 110),
    ('Jar & Storage', 'jar-storage', 120)
  ) as seed(name, slug, sort_order)
)
insert into public.product_categories (
  name,
  slug,
  parent_id,
  description,
  image_url,
  sort_order,
  is_active
)
select
  seed.name,
  seed.slug,
  root.id,
  case seed.slug
    when 'dinner-sets' then 'Complete ceramic dinner collections for refined homes, hospitality service, and memorable gifting.'
    when 'tea-coffee-sets' then 'Coordinated tea and coffee service collections with premium ceramic finishes.'
    when 'cups-mugs' then 'Everyday and premium ceramic cups and mugs for homes, cafes, retail, and gifting.'
    when 'plates' then 'Dinner, quarter, snack, and serving plates with dependable glazing and polished presentation.'
    when 'bowls' then 'Versatile ceramic bowls for soups, snacks, serving, storage, and coordinated table settings.'
    when 'serving-sets' then 'Presentation-ready serving bowls, trays, platters, and table service collections.'
    when 'gift-sets' then 'Buyer-ready ceramic gifting collections for weddings, festivals, corporate needs, and celebrations.'
    when 'hotel-bulk-orders' then 'Trade-ready crockery solutions for hotels, restaurants, retailers, wholesalers, and repeat buyers.'
    when 'bathroom-accessories' then 'Coordinated ceramic bathroom accessories designed for premium hospitality and modern living spaces.'
    when 'glassware-drinkware' then 'Elegant drinkware and glassware selections for presentation, hospitality, and gifting occasions.'
    when 'home-decor-accents' then 'Decorative ceramic accents and statement pieces suited for homes, retail display, and premium interiors.'
    else 'Practical ceramic storage and presentation pieces that fit premium tableware collections.'
  end,
  null,
  seed.sort_order,
  true
from approved_main_categories as seed
cross join lateral (
  select id
  from public.product_categories
  where slug = 'crockery-website-product-categories'
  limit 1
) as root
on conflict (slug) do update
set
  name = excluded.name,
  parent_id = excluded.parent_id,
  description = excluded.description,
  image_url = excluded.image_url,
  sort_order = excluded.sort_order,
  is_active = true;

-- Deactivate the old, irrelevant main categories without deleting them.
update public.product_categories
set is_active = false
where slug in (
  'dinnerware',
  'drinkware',
  'serveware',
  'cookware',
  'bakeware',
  'kitchen-storage',
  'bar-glassware',
  'kids-crockery',
  'pooja-festive',
  'gift-sets-hampers',
  'shop-by-material',
  'cutlery-flatware'
)
and parent_id is null;

-- Reactivate the approved main categories if any were previously disabled.
update public.product_categories
set is_active = true
where slug in (
  'dinner-sets',
  'tea-coffee-sets',
  'cups-mugs',
  'plates',
  'bowls',
  'serving-sets',
  'gift-sets',
  'hotel-bulk-orders',
  'bathroom-accessories',
  'glassware-drinkware',
  'home-decor-accents',
  'jar-storage'
);

-- Reassign products only where the previous category clearly maps to one of the
-- approved main categories. Leave other products untouched.
update public.products as product
set category_id = approved.id
from public.product_categories as approved
where approved.slug = 'dinner-sets'
  and product.category_id in (
    select id from public.product_categories where slug in ('dinnerware')
  );

update public.products as product
set category_id = approved.id
from public.product_categories as approved
where approved.slug = 'glassware-drinkware'
  and product.category_id in (
    select id from public.product_categories where slug in ('drinkware', 'bar-glassware')
  );

update public.products as product
set category_id = approved.id
from public.product_categories as approved
where approved.slug = 'serving-sets'
  and product.category_id in (
    select id from public.product_categories where slug in ('serveware')
  );

update public.products as product
set category_id = approved.id
from public.product_categories as approved
where approved.slug = 'gift-sets'
  and product.category_id in (
    select id from public.product_categories where slug in ('gift-sets-hampers')
  );

commit;
