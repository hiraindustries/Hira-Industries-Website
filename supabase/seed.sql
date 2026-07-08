begin;

-- Keep legacy rows for referential integrity, but remove them from the public
-- catalogue. The required hierarchy below is reactivated by slug.
update public.product_categories
set is_active = false;

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

with main_category_seed (
  name,
  slug,
  description,
  image_url,
  sort_order
) as (
  values
    (
      'Dinner Sets',
      'dinner-sets',
      'Complete ceramic dinner collections for refined homes, hospitality service, and memorable gifting.',
      '/images/products/white-gold-pattern-dinner-plate-set.png',
      10
    ),
    (
      'Tea & Coffee Sets',
      'tea-coffee-sets',
      'Coordinated tea and coffee service collections with premium ceramic finishes.',
      '/tea.png',
      20
    ),
    (
      'Cups & Mugs',
      'cups-mugs',
      'Everyday and premium ceramic cups and mugs for homes, cafes, retail, and gifting.',
      '/images/products/pink-rose-mug-set-display.png',
      30
    ),
    (
      'Plates',
      'plates',
      'Dinner, quarter, snack, and serving plates with dependable glazing and polished presentation.',
      '/images/products/white-plate-gold-stripe-border.png',
      40
    ),
    (
      'Bowls',
      'bowls',
      'Versatile ceramic bowls for soups, snacks, serving, storage, and coordinated table settings.',
      '/images/products/white-gold-rim-soup-bowl-plate.png',
      50
    ),
    (
      'Serving Sets',
      'serving-sets',
      'Presentation-ready serving bowls, trays, platters, and table service collections.',
      '/images/products/green-gold-dry-fruit-serving-bowl.png',
      60
    ),
    (
      'Gift Sets',
      'gift-sets',
      'Buyer-ready ceramic gifting collections for weddings, festivals, corporate needs, and celebrations.',
      '/images/products/pink-rose-mug-gift-set-box.png',
      70
    ),
    (
      'Hotel / Bulk Orders',
      'hotel-bulk-orders',
      'Trade-ready crockery solutions for hotels, restaurants, retailers, wholesalers, and repeat buyers.',
      '/images/Bulk Order Handling.png',
      80
    ),
    (
      'Bathroom Accessories',
      'bathroom-accessories',
      'Coordinated ceramic bathroom accessories designed for premium hospitality and modern living spaces.',
      null,
      90
    ),
    (
      'Glassware & Drinkware',
      'glassware-drinkware',
      'Elegant drinkware and glassware selections for presentation, hospitality, and gifting occasions.',
      null,
      100
    ),
    (
      'Home Decor & Accents',
      'home-decor-accents',
      'Decorative ceramic accents and statement pieces suited for homes, retail display, and premium interiors.',
      null,
      110
    ),
    (
      'Jar & Storage',
      'jar-storage',
      'Practical ceramic jars and storage pieces that pair function with a premium finish.',
      null,
      120
    )
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
  seed.description,
  seed.image_url,
  seed.sort_order,
  true
from main_category_seed as seed
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
  is_active = excluded.is_active;

with subcategory_seed (
  name,
  slug,
  parent_slug,
  description,
  image_url,
  sort_order
) as (
  values
    (
      'Ceramic Dinner Sets',
      'ceramic-dinner-sets',
      'dinner-sets',
      'Coordinated ceramic dinner sets for everyday and formal table service.',
      '/images/build-pic-1.png',
      10
    ),
    (
      'Premium Dinner Sets',
      'premium-dinner-sets',
      'dinner-sets',
      'Statement dinner collections with refined shapes and premium detailing.',
      '/images/build-pic-2.png',
      20
    ),
    (
      'White & Gold Dinner Sets',
      'white-gold-dinner-sets',
      'dinner-sets',
      'Elegant white ceramic dinner sets finished with polished gold accents.',
      '/images/products/white-gold-pattern-dinner-plate-set.png',
      30
    ),
    (
      'Family Dinner Sets',
      'family-dinner-sets',
      'dinner-sets',
      'Practical multi-piece dinner sets planned for family dining and gatherings.',
      '/images/build-pic-1.png',
      40
    ),

    (
      'Tea Cup Sets',
      'tea-cup-sets',
      'tea-coffee-sets',
      'Coordinated ceramic tea cups for daily service, hospitality, and gifting.',
      '/tea.png',
      10
    ),
    (
      'Coffee Cup Sets',
      'coffee-cup-sets',
      'tea-coffee-sets',
      'Balanced ceramic coffee cup collections for homes, cafes, and hotels.',
      '/blacktea.png',
      20
    ),
    (
      'Cup & Saucer Sets',
      'cup-saucer-sets',
      'tea-coffee-sets',
      'Matching cup and saucer sets with clean buyer-ready presentation.',
      '/tea.png',
      30
    ),
    (
      'Premium Tea Sets',
      'premium-tea-sets',
      'tea-coffee-sets',
      'Complete premium tea service collections for refined entertaining.',
      '/images/set.jpeg',
      40
    ),

    (
      'Coffee Mugs',
      'coffee-mugs',
      'cups-mugs',
      'Comfortable ceramic mugs for coffee service, gifting, and retail ranges.',
      '/blacktea.png',
      10
    ),
    (
      'Tea Cups',
      'tea-cups',
      'cups-mugs',
      'Elegant ceramic tea cups designed for dependable everyday use.',
      '/tea.png',
      20
    ),
    (
      'Printed Mugs',
      'printed-mugs',
      'cups-mugs',
      'Decorative printed ceramic mugs for retail, gifting, and custom collections.',
      '/images/products/pink-rose-mug-set-display.png',
      30
    ),
    (
      'Premium Ceramic Mugs',
      'premium-ceramic-mugs',
      'cups-mugs',
      'Premium glazed mugs with polished forms and refined finishing.',
      '/images/products/pink-rose-mug-set-display.png',
      40
    ),

    (
      'Dinner Plates',
      'dinner-plates',
      'plates',
      'Full-size ceramic dinner plates for coordinated table settings.',
      '/images/products/white-plate-gold-stripe-border.png',
      10
    ),
    (
      'Quarter Plates',
      'quarter-plates',
      'plates',
      'Compact quarter plates for sides, starters, desserts, and snacks.',
      '/images/products/white-gold-pattern-dinner-plate-set.png',
      20
    ),
    (
      'Snack Plates',
      'snack-plates',
      'plates',
      'Versatile snack plates for everyday service and entertaining.',
      '/images/build-pic-2.png',
      30
    ),
    (
      'Serving Plates',
      'serving-plates',
      'plates',
      'Larger ceramic plates for shared dishes and polished presentation.',
      '/images/products/gold-stripe-pasta-plate-lifestyle.png',
      40
    ),

    (
      'Soup Bowls',
      'soup-bowls',
      'bowls',
      'Ceramic soup bowls designed for home and hospitality service.',
      '/images/products/white-gold-rim-soup-bowl-plate.png',
      10
    ),
    (
      'Serving Bowls',
      'serving-bowls',
      'bowls',
      'Presentation-ready bowls for curries, salads, snacks, and shared service.',
      '/images/products/green-gold-dry-fruit-serving-bowl.png',
      20
    ),
    (
      'Snack Bowls',
      'snack-bowls',
      'bowls',
      'Compact ceramic bowls for dry fruits, snacks, dips, and accompaniments.',
      '/images/products/green-gold-dry-fruit-bowl-lifestyle.png',
      30
    ),
    (
      'Ceramic Bowl Sets',
      'ceramic-bowl-sets',
      'bowls',
      'Coordinated multi-size ceramic bowl sets for storage and serving.',
      '/images/products/blue-ceramic-storage-bowls-with-lids.png',
      40
    ),

    (
      'Serving Bowls',
      'serving-bowls-serving-sets',
      'serving-sets',
      'Premium serving bowl collections for snacks, dry fruits, and shared dishes.',
      '/images/products/green-gold-dry-fruit-serving-bowl.png',
      10
    ),
    (
      'Serving Trays',
      'serving-trays',
      'serving-sets',
      'Practical serving trays with polished, buyer-ready presentation.',
      '/images/build-pic-2.png',
      20
    ),
    (
      'Platter Sets',
      'platter-sets',
      'serving-sets',
      'Coordinated platters for entertaining, hospitality, and gifting.',
      '/images/products/white-gold-pattern-dinner-plate-set.png',
      30
    ),
    (
      'Table Serving Sets',
      'table-serving-sets',
      'serving-sets',
      'Complete table serving collections for professional and home use.',
      '/images/products/green-gold-dry-fruit-bowl-lifestyle.png',
      40
    ),

    (
      'Crockery Gift Sets',
      'crockery-gift-sets',
      'gift-sets',
      'Curated ceramic crockery gifts for celebrations and business requirements.',
      '/images/products/white-gold-bathroom-tray-set.png',
      10
    ),
    (
      'Tea & Coffee Gift Sets',
      'tea-coffee-gift-sets',
      'gift-sets',
      'Presentation-ready tea and coffee collections prepared for gifting.',
      '/tea.png',
      20
    ),
    (
      'Mug Gift Sets',
      'mug-gift-sets',
      'gift-sets',
      'Boxed ceramic mug sets for weddings, festivals, and return gifts.',
      '/images/products/pink-rose-mug-gift-set-box.png',
      30
    ),
    (
      'Wedding / Festive Gift Sets',
      'wedding-festive-gift-sets',
      'gift-sets',
      'Premium ceramic gift collections for weddings and festive occasions.',
      '/images/products/pink-rose-mug-gift-set-box.png',
      40
    ),

    (
      'Hotel Crockery',
      'hotel-crockery',
      'hotel-bulk-orders',
      'Durable ceramic crockery collections prepared for hotel service.',
      '/images/Bulk Order Handling.png',
      10
    ),
    (
      'Restaurant Crockery',
      'restaurant-crockery',
      'hotel-bulk-orders',
      'Professional tableware ranges for restaurants, cafes, and banquet service.',
      '/images/Quality Checking.png',
      20
    ),
    (
      'Retail Store Products',
      'retail-store-products',
      'hotel-bulk-orders',
      'Buyer-ready ceramic collections planned for retail display and repeat supply.',
      '/images/Packaging Process.png',
      30
    ),
    (
      'Wholesale Crockery Collection',
      'wholesale-crockery-collection',
      'hotel-bulk-orders',
      'Flexible wholesale crockery collections for trade and distribution buyers.',
      '/images/Product Making & Sourcing.png',
      40
    )
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
  parent.id,
  seed.description,
  seed.image_url,
  seed.sort_order,
  true
from subcategory_seed as seed
join public.product_categories as parent
  on parent.slug = seed.parent_slug
on conflict (slug) do update
set
  name = excluded.name,
  parent_id = excluded.parent_id,
  description = excluded.description,
  image_url = excluded.image_url,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

-- Remove demonstration rows and image-only duplicate rows from earlier seeds.
delete from public.products
where slug in (
  'royal-gold-dinner-plate',
  'classic-side-plate-set',
  'heritage-dinner-set',
  'regal-cup-saucer-set',
  'midnight-coffee-mug-set',
  'classic-tea-pot-service',
  'gold-rim-serving-tray',
  'heritage-serving-bowl',
  'classic-ceramic-pitcher',
  'classic-dining-spoon-set',
  'hotel-fork-knife-set',
  'premium-flatware-collection',
  'everyday-cookware-set',
  'premium-kadhai-pan-set',
  'classic-everyday-tawa',
  'ceramic-baking-dish',
  'celebration-cake-stand',
  'oven-ready-baking-tray',
  'stackable-storage-container-set',
  'ceramic-kitchen-canister-set',
  'organised-spice-box',
  'classic-wine-glass-set',
  'tavern-beer-mug-set',
  'whiskey-tumbler-set',
  'traditional-pooja-thali-set',
  'festive-diya-set',
  'celebration-decor-collection',
  'kids-meal-plate-bowl-set',
  'junior-sipper-bottle',
  'kids-lunch-box-set',
  'royal-wedding-dinner-gift-set',
  'executive-corporate-crockery-set',
  'festive-tea-hamper',
  'artisan-ceramic-collection',
  'fine-porcelain-dining-set',
  'classic-glass-tableware-set',
  'white-gold-soap-dispenser-lifestyle-image',
  'white-gold-bathroom-set-lifestyle-image',
  'pink-rose-mug-set-display',
  'green-gold-dry-fruit-bowl-lifestyle-image',
  'white-gold-rim-soup-bowl-plate',
  'white-gold-pattern-soup-plate-lifestyle-image',
  'blue-storage-bowl-lifestyle-image',
  'brown-mosaic-bowl-lifestyle-image',
  'gold-stripe-pasta-plate-lifestyle-image',
  'brown-mosaic-storage-bowl-stack',
  'brown-mosaic-ceramic-container-set'
);

with product_seed (
  name,
  slug,
  main_category_slug,
  subcategory_slug,
  short_description,
  description,
  product_code,
  material,
  set_contents,
  available_colors,
  key_features,
  image_url,
  gallery_images,
  is_featured,
  sort_order
) as (
  values
    (
      'White & Gold Soap Dispenser Set with Sponge Holder',
      'white-gold-soap-dispenser-set-with-sponge-holder',
      'gift-sets',
      'crockery-gift-sets',
      'A coordinated white ceramic dispenser set finished with elegant gold detailing and a practical sponge holder.',
      'This premium ceramic utility set brings refined organisation to modern homes, hotels, and gifting collections. Its polished finish and gold accents create a clean luxury presentation.',
      'HI-BA-001',
      'Ceramic',
      '2 Dispensers with Holders',
      jsonb_build_array('White', 'Gold'),
      jsonb_build_array(
        'Premium Ceramic Finish',
        'Polished Gold Detailing',
        'Gift Ready',
        'Easy to Clean',
        'Coordinated Design'
      ),
      '/images/products/white-gold-soap-dispenser-set.png',
      jsonb_build_array(
        jsonb_build_object(
          'url', '/images/products/white-gold-soap-dispenser-lifestyle.png',
          'alt', 'White and gold soap dispenser set in a bathroom setting'
        )
      ),
      true,
      10
    ),
    (
      'White & Gold Bathroom Tray Set',
      'white-gold-bathroom-tray-set',
      'gift-sets',
      'crockery-gift-sets',
      'A premium ceramic organiser collection arranged on a coordinated white and gold tray.',
      'Designed to keep essentials neatly presented, this set balances practical utility with an elegant ceramic finish. It is suitable for modern homes, hotels, guest spaces, and sophisticated gifting.',
      'HI-BA-003',
      'Ceramic',
      '5 Pieces with Tray',
      jsonb_build_array('White', 'Gold'),
      jsonb_build_array(
        'Complete Organiser Set',
        'Gold Accent Finish',
        'Premium Presentation',
        'Hotel Ready',
        'Gift Ready'
      ),
      '/images/products/white-gold-bathroom-tray-set.png',
      jsonb_build_array(
        jsonb_build_object(
          'url', '/images/products/white-gold-bathroom-set-lifestyle.png',
          'alt', 'White and gold organiser set beside a wash basin'
        )
      ),
      false,
      20
    ),
    (
      'Pink Rose Mug Gift Set with Box',
      'pink-rose-mug-gift-set-with-box',
      'gift-sets',
      'mug-gift-sets',
      'A boxed ceramic mug gift set decorated with delicate pink rose artwork.',
      'Prepared for wedding gifting and festive presentation, this set combines a premium ceramic finish with an elegant floral design. The coordinated box makes it suitable for celebrations, return gifting, and curated hampers.',
      'HI-GH-005',
      'Ceramic',
      '7-Piece Gift Set',
      jsonb_build_array('White', 'Pink', 'Gold'),
      jsonb_build_array(
        'Boxed Presentation',
        'Raised Floral Detail',
        'Gold Accents',
        'Wedding Gift Ready',
        'Premium Ceramic'
      ),
      '/images/products/pink-rose-mug-gift-set-box.png',
      jsonb_build_array(
        jsonb_build_object(
          'url', '/images/products/pink-rose-mug-set-display.png',
          'alt', 'Pink rose ceramic mug gift set displayed outside its box'
        )
      ),
      true,
      30
    ),
    (
      'Green & Gold Dry Fruit Serving Bowl',
      'green-gold-dry-fruit-serving-bowl',
      'serving-sets',
      'serving-bowls-serving-sets',
      'A rich green ceramic serving bowl finished with premium gold detailing.',
      'Created for dry fruits, snacks, and festive table service, this bowl delivers an elegant centrepiece presentation. Its polished finish suits premium homes, hospitality, festive gifting, and retail collections.',
      'HI-SV-007',
      'Ceramic',
      '1 Serving Bowl',
      jsonb_build_array('Green', 'Gold'),
      jsonb_build_array(
        'Premium Glazed Finish',
        'Gold Detailing',
        'Festive Presentation',
        'Food Serving Ready',
        'Gift Suitable'
      ),
      '/images/products/green-gold-dry-fruit-serving-bowl.png',
      jsonb_build_array(
        jsonb_build_object(
          'url', '/images/products/green-gold-dry-fruit-bowl-lifestyle.png',
          'alt', 'Green and gold serving bowl styled with dry fruits'
        )
      ),
      true,
      40
    ),
    (
      'White Gold Rim Soup Bowl Plate',
      'white-gold-rim-soup-bowl-plate',
      'bowls',
      'soup-bowls',
      'A white ceramic soup bowl plate with a clean polished gold rim.',
      'The refined profile supports soup, curry, salad, and plated service across homes and hospitality settings. Its premium glaze and gold edge create an elegant addition to coordinated dinnerware collections.',
      'HI-DW-009',
      'Ceramic',
      '1 Bowl Plate',
      jsonb_build_array('White', 'Gold'),
      jsonb_build_array(
        'Polished Gold Rim',
        'Premium Glaze',
        'Deep Serving Profile',
        'Hospitality Suitable',
        'Elegant Finish'
      ),
      '/images/products/white-gold-rim-soup-bowl-plate.png',
      jsonb_build_array(
        jsonb_build_object(
          'url', '/images/products/white-gold-rim-soup-bowl-lifestyle.png',
          'alt', 'White gold rim soup bowl plate in a dining setting'
        )
      ),
      true,
      50
    ),
    (
      'White Gold Pattern Dinner Plate Set',
      'white-gold-pattern-dinner-plate-set',
      'plates',
      'dinner-plates',
      'A coordinated white ceramic dinner plate set featuring an elegant gold pattern.',
      'This premium plate collection is designed for formal dining, hospitality service, and memorable gifting. The polished glaze and patterned gold detailing give each table setting a refined, cohesive finish.',
      'HI-DW-011',
      'Ceramic',
      '2-Piece Plate Set',
      jsonb_build_array('White', 'Gold'),
      jsonb_build_array(
        'Coordinated Plate Set',
        'Patterned Gold Detail',
        'Premium Glaze',
        'Formal Dining Ready',
        'Gift Suitable'
      ),
      '/images/products/white-gold-pattern-dinner-plate-set.png',
      jsonb_build_array(
        jsonb_build_object(
          'url', '/images/products/white-gold-pattern-soup-plate-lifestyle.png',
          'alt', 'White gold pattern soup plate presented for table service'
        )
      ),
      true,
      60
    ),
    (
      'Blue Ceramic Storage Bowls with Lids',
      'blue-ceramic-storage-bowls-with-lids',
      'bowls',
      'ceramic-bowl-sets',
      'A vibrant blue ceramic bowl set supplied with secure matching lids.',
      'Designed for practical kitchen storage and organised serving, these bowls combine utility with a premium glazed finish. The coordinated set is suitable for modern homes, gifting, and retail presentation.',
      'HI-KS-013',
      'Ceramic',
      '3 Bowls with Lids',
      jsonb_build_array('Blue'),
      jsonb_build_array(
        'Three Coordinated Sizes',
        'Secure Lids',
        'Premium Glaze',
        'Storage and Serving',
        'Stackable Design'
      ),
      '/images/products/blue-ceramic-storage-bowls-with-lids.png',
      jsonb_build_array(
        jsonb_build_object(
          'url', '/images/products/blue-storage-bowl-lifestyle.png',
          'alt', 'Blue ceramic storage bowl set in a kitchen setting'
        )
      ),
      false,
      70
    ),
    (
      'Brown Mosaic Storage Bowls with Lids',
      'brown-mosaic-storage-bowls-with-lids',
      'bowls',
      'ceramic-bowl-sets',
      'A coordinated ceramic bowl set with rich brown mosaic detailing and clear lids.',
      'The covered bowls provide dependable kitchen utility with a distinctive premium finish. Their warm patterned design suits modern storage, serving, gifting, and decorative countertop presentation.',
      'HI-KS-015',
      'Ceramic',
      '3 Bowls with Lids',
      jsonb_build_array('Brown', 'Blue Accents'),
      jsonb_build_array(
        'Mosaic Glaze Pattern',
        'Three Coordinated Sizes',
        'Secure Clear Lids',
        'Storage and Serving',
        'Stackable Design'
      ),
      '/images/products/brown-mosaic-storage-bowls-with-lids.png',
      jsonb_build_array(
        jsonb_build_object(
          'url', '/images/products/brown-mosaic-bowl-lifestyle.png',
          'alt', 'Brown mosaic storage bowls used for fresh food serving'
        ),
        jsonb_build_object(
          'url', '/images/products/brown-mosaic-ceramic-container-set.png',
          'alt', 'Brown mosaic ceramic container set stacked with lids'
        )
      ),
      false,
      80
    ),
    (
      'White Plate with Gold Stripe Border',
      'white-plate-with-gold-stripe-border',
      'plates',
      'dinner-plates',
      'A clean white ceramic plate finished with a precise gold stripe border.',
      'The understated design supports everyday elegance, formal dining, and professional hospitality service. Its polished ceramic surface also makes it a refined choice for gifting and coordinated dinner sets.',
      'HI-DW-017',
      'Ceramic',
      '1 Dinner Plate',
      jsonb_build_array('White', 'Gold'),
      jsonb_build_array(
        'Minimal Gold Stripe',
        'Polished Ceramic Surface',
        'Formal Dining Ready',
        'Hospitality Suitable',
        'Easy Coordination'
      ),
      '/images/products/white-plate-gold-stripe-border.png',
      jsonb_build_array(
        jsonb_build_object(
          'url', '/images/products/gold-stripe-pasta-plate-lifestyle.png',
          'alt', 'White plate with gold stripe border used for pasta service'
        )
      ),
      false,
      90
    )
)
insert into public.products (
  name,
  slug,
  category_id,
  subcategory_id,
  short_description,
  description,
  product_code,
  material,
  set_contents,
  pieces,
  available_colors,
  features,
  tags,
  image_url,
  gallery_images,
  is_featured,
  is_active,
  sort_order
)
select
  seed.name,
  seed.slug,
  main_category.id,
  subcategory.id,
  seed.short_description,
  seed.description,
  seed.product_code,
  seed.material,
  seed.set_contents,
  case seed.slug
    when 'white-gold-soap-dispenser-set-with-sponge-holder' then 2
    when 'white-gold-bathroom-tray-set' then 5
    when 'pink-rose-mug-gift-set-with-box' then 7
    when 'green-gold-dry-fruit-serving-bowl' then 1
    when 'white-gold-rim-soup-bowl-plate' then 1
    when 'white-gold-pattern-dinner-plate-set' then 2
    when 'blue-ceramic-storage-bowls-with-lids' then 3
    when 'brown-mosaic-storage-bowls-with-lids' then 3
    when 'white-plate-with-gold-stripe-border' then 1
    else null
  end,
  array(
    select jsonb_array_elements_text(seed.available_colors)
  ),
  array(
    select jsonb_array_elements_text(seed.key_features)
  ),
  array[
    replace(seed.main_category_slug, '-', ' '),
    replace(seed.subcategory_slug, '-', ' ')
  ],
  seed.image_url,
  seed.gallery_images,
  seed.is_featured,
  true,
  seed.sort_order
from product_seed as seed
join public.product_categories as main_category
  on main_category.slug = seed.main_category_slug
join public.product_categories as subcategory
  on subcategory.slug = seed.subcategory_slug
on conflict (slug) do update
set
  name = excluded.name,
  category_id = excluded.category_id,
  subcategory_id = excluded.subcategory_id,
  short_description = excluded.short_description,
  description = excluded.description,
  product_code = excluded.product_code,
  material = excluded.material,
  set_contents = excluded.set_contents,
  pieces = excluded.pieces,
  available_colors = excluded.available_colors,
  features = excluded.features,
  tags = excluded.tags,
  image_url = excluded.image_url,
  gallery_images = excluded.gallery_images,
  is_featured = excluded.is_featured,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order;

delete from public.product_images
where product_id in (
  select id
  from public.products
  where slug in (
    'white-gold-soap-dispenser-set-with-sponge-holder',
    'white-gold-bathroom-tray-set',
    'pink-rose-mug-gift-set-with-box',
    'green-gold-dry-fruit-serving-bowl',
    'white-gold-rim-soup-bowl-plate',
    'white-gold-pattern-dinner-plate-set',
    'blue-ceramic-storage-bowls-with-lids',
    'brown-mosaic-storage-bowls-with-lids',
    'white-plate-with-gold-stripe-border'
  )
);

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
where product.slug in (
  'white-gold-soap-dispenser-set-with-sponge-holder',
  'white-gold-bathroom-tray-set',
  'pink-rose-mug-gift-set-with-box',
  'green-gold-dry-fruit-serving-bowl',
  'white-gold-rim-soup-bowl-plate',
  'white-gold-pattern-dinner-plate-set',
  'blue-ceramic-storage-bowls-with-lids',
  'brown-mosaic-storage-bowls-with-lids',
  'white-plate-with-gold-stripe-border'
)
  and product.image_url is not null;

insert into public.product_images (
  product_id,
  image_url,
  alt_text,
  is_primary,
  sort_order
)
select
  product.id,
  gallery.image ->> 'url',
  coalesce(
    gallery.image ->> 'alt',
    product.name || ' alternate view ' || gallery.position
  ),
  false,
  gallery.position::integer
from public.products as product
cross join lateral jsonb_array_elements(
  coalesce(product.gallery_images, '[]'::jsonb)
) with ordinality as gallery(image, position)
where product.slug in (
  'white-gold-soap-dispenser-set-with-sponge-holder',
  'white-gold-bathroom-tray-set',
  'pink-rose-mug-gift-set-with-box',
  'green-gold-dry-fruit-serving-bowl',
  'white-gold-rim-soup-bowl-plate',
  'white-gold-pattern-dinner-plate-set',
  'blue-ceramic-storage-bowls-with-lids',
  'brown-mosaic-storage-bowls-with-lids',
  'white-plate-with-gold-stripe-border'
)
  and coalesce(gallery.image ->> 'url', '') <> '';

commit;
