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
  'Crockery Website Product Categories',
  'crockery-website-product-categories',
  null,
  'Complete Hira Industries catalogue hierarchy.',
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
      'Dinnerware',
      'dinnerware',
      'Complete dining collections for homes, hospitality, retail, and gifting.',
      '/images/build-pic-1.png',
      10
    ),
    (
      'Drinkware',
      'drinkware',
      'Refined cups, mugs, pots, bottles, and drink service essentials.',
      '/tea.png',
      20
    ),
    (
      'Serveware',
      'serveware',
      'Presentation-ready trays, bowls, platters, casseroles, and pitchers.',
      '/images/build-pic-2.png',
      30
    ),
    (
      'Cutlery & Flatware',
      'cutlery-flatware',
      'Coordinated cutlery essentials for everyday and professional service.',
      '/images/set.jpeg',
      40
    ),
    (
      'Cookware',
      'cookware',
      'Dependable cookware collections planned for practical daily use.',
      '/images/Product Making & Sourcing.png',
      50
    ),
    (
      'Bakeware',
      'bakeware',
      'Functional baking and presentation pieces for kitchens and gifting.',
      '/images/Design & Finishing.png',
      60
    ),
    (
      'Kitchen Storage',
      'kitchen-storage',
      'Organised storage solutions for modern kitchens and food service.',
      '/images/Packaging Process.png',
      70
    ),
    (
      'Bar & Glassware',
      'bar-glassware',
      'Elegant glassware and bar essentials for entertaining and hospitality.',
      '/images/set.jpeg',
      80
    ),
    (
      'Pooja & Festive',
      'pooja-festive',
      'Traditional pieces for celebrations, pooja settings, and festive gifting.',
      '/images/build-pic-1.png',
      90
    ),
    (
      'Kids Crockery',
      'kids-crockery',
      'Practical and engaging tableware collections designed for children.',
      '/tea.png',
      100
    ),
    (
      'Gift Sets & Hampers',
      'gift-sets-hampers',
      'Presentation-ready gifting collections for weddings, festivals, and business.',
      '/images/build-pic-2.png',
      110
    ),
    (
      'Shop by Material',
      'shop-by-material',
      'Explore tableware collections by ceramic, glass, metal, and other materials.',
      '/images/build-pic-1.png',
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
  sort_order
) as (
  values
    ('Dinner Plates', 'dinner-plates', 'dinnerware', 10),
    ('Quarter / Side Plates', 'quarter-side-plates', 'dinnerware', 20),
    ('Bowls - Veg, Curry, Salad', 'bowls-veg-curry-salad', 'dinnerware', 30),
    ('Dinner Sets', 'dinner-sets', 'dinnerware', 40),
    ('Thali Sets', 'thali-sets', 'dinnerware', 50),

    ('Cups & Saucers', 'cups-saucers', 'drinkware', 10),
    ('Coffee Mugs', 'coffee-mugs', 'drinkware', 20),
    ('Glasses & Tumblers', 'glasses-tumblers', 'drinkware', 30),
    ('Tea / Coffee Pots & Kettles', 'tea-coffee-pots-kettles', 'drinkware', 40),
    ('Bottles & Flasks', 'bottles-flasks', 'drinkware', 50),

    ('Serving Trays', 'serving-trays', 'serveware', 10),
    ('Casseroles', 'casseroles', 'serveware', 20),
    ('Serving Bowls & Platters', 'serving-bowls-platters', 'serveware', 30),
    ('Jugs & Pitchers', 'jugs-pitchers', 'serveware', 40),

    ('Spoons', 'spoons', 'cutlery-flatware', 10),
    ('Forks & Knives', 'forks-knives', 'cutlery-flatware', 20),
    ('Chopsticks', 'chopsticks', 'cutlery-flatware', 30),
    ('Cutlery Sets', 'cutlery-sets', 'cutlery-flatware', 40),

    ('Cookware Sets', 'cookware-sets', 'cookware', 10),
    ('Kadhai & Pans', 'kadhai-pans', 'cookware', 20),
    ('Pressure Cookers', 'pressure-cookers', 'cookware', 30),
    ('Tawa', 'tawa', 'cookware', 40),

    ('Baking Dishes', 'baking-dishes', 'bakeware', 10),
    ('Cake Stands', 'cake-stands', 'bakeware', 20),
    ('Baking Trays', 'baking-trays', 'bakeware', 30),

    ('Storage Containers', 'storage-containers', 'kitchen-storage', 10),
    ('Jars & Canisters', 'jars-canisters', 'kitchen-storage', 20),
    ('Spice Boxes', 'spice-boxes', 'kitchen-storage', 30),
    ('Lunch Boxes', 'lunch-boxes', 'kitchen-storage', 40),

    ('Wine Glasses', 'wine-glasses', 'bar-glassware', 10),
    ('Beer Mugs', 'beer-mugs', 'bar-glassware', 20),
    ('Cocktail / Whiskey Glasses', 'cocktail-whiskey-glasses', 'bar-glassware', 30),
    ('Bar Accessories', 'bar-accessories', 'bar-glassware', 40),

    ('Pooja Thalis', 'pooja-thalis', 'pooja-festive', 10),
    ('Diyas & Lamps', 'diyas-lamps', 'pooja-festive', 20),
    ('Festive Decor', 'festive-decor', 'pooja-festive', 30),

    ('Kids Plates & Bowls', 'kids-plates-bowls', 'kids-crockery', 10),
    ('Sipper Cups & Bottles', 'sipper-cups-bottles', 'kids-crockery', 20),
    ('Kids Lunch Box Sets', 'kids-lunch-box-sets', 'kids-crockery', 30),
    ('Character / Cartoon Sets', 'character-cartoon-sets', 'kids-crockery', 40),

    ('Wedding Gift Sets', 'wedding-gift-sets', 'gift-sets-hampers', 10),
    ('Corporate Gifting', 'corporate-gifting', 'gift-sets-hampers', 20),
    ('Return Gifts', 'return-gifts', 'gift-sets-hampers', 30),
    ('Festive Hampers', 'festive-hampers', 'gift-sets-hampers', 40),

    ('Ceramic & Stoneware', 'ceramic-stoneware', 'shop-by-material', 10),
    ('Bone China & Porcelain', 'bone-china-porcelain', 'shop-by-material', 20),
    ('Glass', 'glass', 'shop-by-material', 30),
    ('Melamine & Acrylic', 'melamine-acrylic', 'shop-by-material', 40),
    ('Stainless Steel', 'stainless-steel', 'shop-by-material', 50),
    ('Brass & Copper', 'brass-copper', 'shop-by-material', 60)
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
  null,
  null,
  seed.sort_order,
  true
from subcategory_seed as seed
join public.product_categories as parent
  on parent.slug = seed.parent_slug
on conflict (slug) do update
set
  name = excluded.name,
  parent_id = excluded.parent_id,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

with product_seed (
  name,
  slug,
  category_slug,
  short_description,
  description,
  product_code,
  material,
  image_url,
  is_featured,
  sort_order
) as (
  values
    (
      'Royal Gold Dinner Plate',
      'royal-gold-dinner-plate',
      'dinner-plates',
      'A refined ceramic dinner plate with a polished gold-accented presentation.',
      'Designed for premium dining, hospitality service, retail collections, and coordinated table settings.',
      'HI-DW-001',
      'Ceramic',
      '/images/build-pic-1.png',
      true,
      10
    ),
    (
      'Classic Side Plate Set',
      'classic-side-plate-set',
      'quarter-side-plates',
      'Coordinated quarter plates with smooth glazing and balanced proportions.',
      'A practical side plate collection for starters, desserts, hospitality service, and everyday dining.',
      'HI-DW-002',
      'Ceramic',
      '/images/build-pic-2.png',
      false,
      20
    ),
    (
      'Heritage Dinner Set',
      'heritage-dinner-set',
      'dinner-sets',
      'A complete dinner collection with an elegant dark and gold visual finish.',
      'A presentation-ready dinner set suited to premium homes, gifting, retailers, and hospitality buyers.',
      'HI-DW-003',
      'Ceramic',
      '/images/set.jpeg',
      true,
      30
    ),

    (
      'Regal Cup & Saucer Set',
      'regal-cup-saucer-set',
      'cups-saucers',
      'An elegant cup and saucer pairing for tea service and premium gifting.',
      'Created for comfortable serving with a coordinated finish suitable for homes, hotels, and cafes.',
      'HI-DR-001',
      'Ceramic',
      '/tea.png',
      true,
      10
    ),
    (
      'Midnight Coffee Mug Set',
      'midnight-coffee-mug-set',
      'coffee-mugs',
      'A rich dark mug collection with refined gold detailing.',
      'A distinctive coffee mug set for modern kitchens, executive gifting, cafes, and retail presentation.',
      'HI-DR-002',
      'Ceramic',
      '/blacktea.png',
      false,
      20
    ),
    (
      'Classic Tea Pot Service',
      'classic-tea-pot-service',
      'tea-coffee-pots-kettles',
      'A coordinated tea service designed around polished everyday presentation.',
      'The collection combines a refined tea pot profile with matching service pieces for hosting and gifting.',
      'HI-DR-003',
      'Ceramic',
      '/tea.png',
      false,
      30
    ),

    (
      'Gold Rim Serving Tray',
      'gold-rim-serving-tray',
      'serving-trays',
      'A polished serving tray developed for elegant table presentation.',
      'Suitable for homes, hotels, restaurants, gifting collections, and coordinated hospitality service.',
      'HI-SV-001',
      'Ceramic',
      '/images/build-pic-2.png',
      true,
      10
    ),
    (
      'Heritage Serving Bowl',
      'heritage-serving-bowl',
      'serving-bowls-platters',
      'A versatile glazed serving bowl for shared dishes and table centrepieces.',
      'Balanced for practical serving while maintaining the premium finish expected in formal settings.',
      'HI-SV-002',
      'Ceramic',
      '/images/build-pic-1.png',
      false,
      20
    ),
    (
      'Classic Ceramic Pitcher',
      'classic-ceramic-pitcher',
      'jugs-pitchers',
      'A clean ceramic pitcher with a refined hospitality-ready profile.',
      'Designed for water, beverages, and coordinated table service across homes and professional venues.',
      'HI-SV-003',
      'Ceramic',
      '/tea.png',
      false,
      30
    ),

    (
      'Classic Dining Spoon Set',
      'classic-dining-spoon-set',
      'spoons',
      'A balanced spoon collection for everyday and professional dining.',
      'A dependable flatware option created for coordinated table settings, hospitality, and retail buyers.',
      'HI-CF-001',
      'Stainless Steel',
      '/images/set.jpeg',
      false,
      10
    ),
    (
      'Hotel Fork & Knife Set',
      'hotel-fork-knife-set',
      'forks-knives',
      'Coordinated forks and knives with a clean service-ready appearance.',
      'Developed for hotels, restaurants, banquet service, and buyers requiring a consistent flatware range.',
      'HI-CF-002',
      'Stainless Steel',
      '/images/set.jpeg',
      true,
      20
    ),
    (
      'Premium Flatware Collection',
      'premium-flatware-collection',
      'cutlery-sets',
      'A complete cutlery assortment for polished dining presentation.',
      'The collection supports home, hospitality, gifting, and retail requirements with a coordinated finish.',
      'HI-CF-003',
      'Stainless Steel',
      '/images/build-pic-1.png',
      false,
      30
    ),

    (
      'Everyday Cookware Set',
      'everyday-cookware-set',
      'cookware-sets',
      'A practical cookware assortment planned for dependable daily preparation.',
      'Designed as a coordinated starter collection for home kitchens, retailers, and gifting requirements.',
      'HI-CW-001',
      'Metal',
      '/images/Product Making & Sourcing.png',
      true,
      10
    ),
    (
      'Premium Kadhai & Pan Set',
      'premium-kadhai-pan-set',
      'kadhai-pans',
      'A versatile kadhai and pan pairing for regular kitchen use.',
      'The collection focuses on practical forms, reliable handling, and buyer-ready presentation.',
      'HI-CW-002',
      'Metal',
      '/images/Material Selection.png',
      false,
      20
    ),
    (
      'Classic Everyday Tawa',
      'classic-everyday-tawa',
      'tawa',
      'A streamlined tawa designed for simple everyday cooking.',
      'A practical kitchen essential selected for consistent build quality and convenient daily use.',
      'HI-CW-003',
      'Metal',
      '/images/Design & Finishing.png',
      false,
      30
    ),

    (
      'Ceramic Baking Dish',
      'ceramic-baking-dish',
      'baking-dishes',
      'An oven-ready ceramic dish with a polished table-to-serve finish.',
      'Designed for baking, serving, gifting, and coordinated kitchen collections.',
      'HI-BW-001',
      'Ceramic',
      '/images/build-pic-2.png',
      true,
      10
    ),
    (
      'Celebration Cake Stand',
      'celebration-cake-stand',
      'cake-stands',
      'An elevated cake stand for celebrations and premium dessert presentation.',
      'Suitable for homes, bakeries, hospitality service, event styling, and festive gifting.',
      'HI-BW-002',
      'Ceramic',
      '/images/build-pic-1.png',
      false,
      20
    ),
    (
      'Oven Ready Baking Tray',
      'oven-ready-baking-tray',
      'baking-trays',
      'A functional baking tray developed for dependable kitchen use.',
      'The clean form supports practical preparation, presentation, and retail-ready bakeware collections.',
      'HI-BW-003',
      'Ceramic',
      '/images/Design & Finishing.png',
      false,
      30
    ),

    (
      'Stackable Storage Container Set',
      'stackable-storage-container-set',
      'storage-containers',
      'A coordinated container set for organised everyday kitchen storage.',
      'Designed for practical stacking, dependable handling, and clean presentation in modern kitchens.',
      'HI-KS-001',
      'Mixed Material',
      '/images/Packaging Process.png',
      true,
      10
    ),
    (
      'Ceramic Kitchen Canister Set',
      'ceramic-kitchen-canister-set',
      'jars-canisters',
      'A refined canister collection for dry storage and countertop display.',
      'Combines useful storage with a premium ceramic finish for homes, gifting, and retail collections.',
      'HI-KS-002',
      'Ceramic',
      '/images/build-pic-2.png',
      false,
      20
    ),
    (
      'Organised Spice Box',
      'organised-spice-box',
      'spice-boxes',
      'A practical compartmentalised spice storage solution.',
      'Created for convenient kitchen organisation, protected storage, and buyer-ready presentation.',
      'HI-KS-003',
      'Mixed Material',
      '/images/Packaging Process.png',
      false,
      30
    ),

    (
      'Classic Wine Glass Set',
      'classic-wine-glass-set',
      'wine-glasses',
      'A refined glass collection for formal dinners and hospitality service.',
      'Designed for balanced presentation across homes, hotels, restaurants, and gifting collections.',
      'HI-BG-001',
      'Glass',
      '/images/set.jpeg',
      true,
      10
    ),
    (
      'Tavern Beer Mug Set',
      'tavern-beer-mug-set',
      'beer-mugs',
      'A substantial mug collection for casual service and entertaining.',
      'A practical barware choice for homes, hospitality venues, gifting, and retail buyers.',
      'HI-BG-002',
      'Glass',
      '/blacktea.png',
      false,
      20
    ),
    (
      'Whiskey Tumbler Set',
      'whiskey-tumbler-set',
      'cocktail-whiskey-glasses',
      'A clean tumbler profile for whiskey, cocktails, and premium bar settings.',
      'The coordinated set supports refined serving, entertaining, and hospitality presentation.',
      'HI-BG-003',
      'Glass',
      '/images/set.jpeg',
      false,
      30
    ),

    (
      'Traditional Pooja Thali Set',
      'traditional-pooja-thali-set',
      'pooja-thalis',
      'A coordinated thali collection for traditional pooja settings.',
      'Created for household rituals, festive occasions, gifting, and ceremonial presentation.',
      'HI-PF-001',
      'Mixed Material',
      '/images/build-pic-1.png',
      true,
      10
    ),
    (
      'Festive Diya Set',
      'festive-diya-set',
      'diyas-lamps',
      'A decorative diya collection for celebrations and traditional settings.',
      'A presentation-ready festive set suited to home decor, gifting, and seasonal retail ranges.',
      'HI-PF-002',
      'Ceramic',
      '/images/build-pic-2.png',
      false,
      20
    ),
    (
      'Celebration Decor Collection',
      'celebration-decor-collection',
      'festive-decor',
      'A coordinated festive decor assortment for special occasions.',
      'Designed to support celebratory table settings, gifting collections, and seasonal presentation.',
      'HI-PF-003',
      'Mixed Material',
      '/images/set.jpeg',
      false,
      30
    ),

    (
      'Kids Meal Plate & Bowl Set',
      'kids-meal-plate-bowl-set',
      'kids-plates-bowls',
      'A practical coordinated dining set sized for children.',
      'Designed for comfortable everyday meals, gifting, school use, and family-focused retail collections.',
      'HI-KC-001',
      'Ceramic',
      '/images/build-pic-2.png',
      true,
      10
    ),
    (
      'Junior Sipper Bottle',
      'junior-sipper-bottle',
      'sipper-cups-bottles',
      'A convenient child-friendly bottle for everyday hydration.',
      'A practical option for school, travel, gifting, and coordinated kids crockery ranges.',
      'HI-KC-002',
      'Mixed Material',
      '/tea.png',
      false,
      20
    ),
    (
      'Kids Lunch Box Set',
      'kids-lunch-box-set',
      'kids-lunch-box-sets',
      'A coordinated lunch box collection for school and travel.',
      'Designed around practical packing, dependable closure, and clean child-friendly presentation.',
      'HI-KC-003',
      'Mixed Material',
      '/images/Packaging Process.png',
      false,
      30
    ),

    (
      'Royal Wedding Dinner Gift Set',
      'royal-wedding-dinner-gift-set',
      'wedding-gift-sets',
      'A presentation-ready dinner collection created for wedding gifting.',
      'Combines coordinated ceramic pieces, premium visual finishing, and memorable gift presentation.',
      'HI-GH-001',
      'Ceramic',
      '/images/build-pic-1.png',
      true,
      10
    ),
    (
      'Executive Corporate Crockery Set',
      'executive-corporate-crockery-set',
      'corporate-gifting',
      'A refined crockery collection for business and employee gifting.',
      'Suitable for branded gifting programs, festive distribution, client appreciation, and executive hampers.',
      'HI-GH-002',
      'Ceramic',
      '/images/build-pic-2.png',
      true,
      20
    ),
    (
      'Festive Tea Hamper',
      'festive-tea-hamper',
      'festive-hampers',
      'A coordinated tea service prepared for festive gifting.',
      'The hamper combines premium ceramic presentation with a versatile format for personal and corporate buyers.',
      'HI-GH-003',
      'Ceramic',
      '/tea.png',
      false,
      30
    ),

    (
      'Artisan Ceramic Collection',
      'artisan-ceramic-collection',
      'ceramic-stoneware',
      'A versatile ceramic and stoneware range with a refined glazed finish.',
      'Developed for homes, hospitality, retailers, and buyers seeking dependable ceramic tableware.',
      'HI-MT-001',
      'Ceramic & Stoneware',
      '/images/Material Selection.png',
      true,
      10
    ),
    (
      'Fine Porcelain Dining Set',
      'fine-porcelain-dining-set',
      'bone-china-porcelain',
      'A lightweight premium dining collection with an elegant porcelain finish.',
      'A polished choice for formal homes, hospitality settings, gifting, and premium retail collections.',
      'HI-MT-002',
      'Porcelain',
      '/images/build-pic-2.png',
      false,
      20
    ),
    (
      'Classic Glass Tableware Set',
      'classic-glass-tableware-set',
      'glass',
      'A coordinated glass tableware collection for serving and entertaining.',
      'Designed for versatile use across homes, restaurants, hotels, gifting, and retail presentation.',
      'HI-MT-003',
      'Glass',
      '/images/set.jpeg',
      false,
      30
    )
)
insert into public.products (
  name,
  slug,
  category_id,
  short_description,
  description,
  product_code,
  material,
  image_url,
  is_featured,
  is_active,
  sort_order
)
select
  seed.name,
  seed.slug,
  category.id,
  seed.short_description,
  seed.description,
  seed.product_code,
  seed.material,
  seed.image_url,
  seed.is_featured,
  true,
  seed.sort_order
from product_seed as seed
join public.product_categories as category
  on category.slug = seed.category_slug
on conflict (slug) do update
set
  name = excluded.name,
  category_id = excluded.category_id,
  short_description = excluded.short_description,
  description = excluded.description,
  product_code = excluded.product_code,
  material = excluded.material,
  image_url = excluded.image_url,
  is_featured = excluded.is_featured,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order;
