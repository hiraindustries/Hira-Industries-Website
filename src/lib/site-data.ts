export type NavLink = {
  href: string;
  label: string;
  children?: NavLink[];
};

export type StatItem = {
  value: string;
  label: string;
};

export type ProductItem = {
  slug: string;
  name: string;
  code: string;
  category: string;
  subcategory?: string;
  categoryLabel: string;
  description: string;
  image: string;
  imagePlaceholder?: boolean;
  pieces: string;
  material: string;
  moq: string;
  isNew: boolean;
};

export type DownloadItem = {
  title: string;
  description: string;
  href: string;
  meta: string;
  actionLabel: string;
  requestKey: string;
  whatsappHref?: string;
};

export const businessInfo = {
  companyName: "Hira Industries",
  email: "info@hiraindustries.com",
  phoneDisplay: "+91 97838 05565",
  phoneHref: "tel:+919783805565",
  whatsappNumber: "919783805565",
  whatsappHref: "https://wa.me/919783805565",
  whatsappCatalogueHref:
    "https://wa.me/919783805565?text=Hello%20Hira%20Industries%2C%20please%20share%20your%20product%20catalogue.",
  location: "Khurja, Uttar Pradesh, India",
  mapsQuery: "Hira Industries Khurja Uttar Pradesh India",
  mapsEmbedHref:
    "https://www.google.com/maps?q=Hira%20Industries%20Khurja%20Uttar%20Pradesh%20India&output=embed",
  mapsHref:
    "https://www.google.com/maps/search/?api=1&query=Hira%20Industries%20Khurja%20Uttar%20Pradesh%20India",
  businessHours: "Mon - Sat: 9:00 AM - 7:00 PM",
  sundayHours: "Sunday: Closed",
} as const;

export const navLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/company", label: "About" },
  {
    href: "/products",
    label: "Products",
    children: [
      {
        label: "Dinner Sets",
        href: "/products?category=dinnerware&subcategory=dinner-sets",
      },
      {
        label: "Tea & Coffee Sets",
        href: "/products?category=drinkware",
      },
      {
        label: "Mugs & Cups",
        href: "/products?category=drinkware&subcategory=coffee-mugs",
      },
      {
        label: "Plates & Bowls",
        href: "/products?category=dinnerware",
      },
      {
        label: "Hotel / HoReCa Collection",
        href: "/products?category=dinnerware",
      },
      {
        label: "Export Range",
        href: "/products?category=shop-by-material",
      },
    ],
  },
  { href: "/manufacturing", label: "Manufacturing" },
  { href: "/quality", label: "Quality" },
  { href: "/collections", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export const heroStats: StatItem[] = [
  { value: "Bulk", label: "Order ready" },
  { value: "Trade", label: "Friendly packaging" },
  { value: "Checks", label: "Consistent finishing" },
];

export const featuredProducts: ProductItem[] = [
  {
    slug: "royal-elegance-dinner-set",
    name: "Royal Elegance Dinner Set",
    code: "HI-DS-001",
    category: "dinnerware",
    subcategory: "dinner-sets",
    categoryLabel: "Dinner Sets",
    description:
      "A refined white and gold dinner collection designed for premium homes, hospitality, and gifting.",
    image: "/images/build-pic-1.png",
    pieces: "24 pcs / set",
    material: "Ceramic",
    moq: "5 sets",
    isNew: true,
  },
  {
    slug: "floral-charm-dinner-set",
    name: "Floral Charm Dinner Set",
    code: "HI-DS-002",
    category: "dinnerware",
    subcategory: "dinner-sets",
    categoryLabel: "Dinner Sets",
    description:
      "Sculpted floral detailing and polished gold accents create a memorable table presentation.",
    image: "/images/build-pic-2.png",
    pieces: "18 pcs / set",
    material: "Ceramic",
    moq: "5 sets",
    isNew: false,
  },
  {
    slug: "heritage-tea-set",
    name: "Heritage Tea Set",
    code: "HI-TC-001",
    category: "drinkware",
    categoryLabel: "Tea & Coffee Sets",
    description:
      "A timeless tea service with warm gold lines, balanced forms, and an elegant everyday finish.",
    image: "/tea.png",
    pieces: "6 pcs / set",
    material: "Ceramic",
    moq: "10 sets",
    isNew: false,
  },
  {
    slug: "artisan-ceramic-mug",
    name: "Artisan Ceramic Mug",
    code: "HI-MC-001",
    category: "drinkware",
    subcategory: "coffee-mugs",
    categoryLabel: "Mugs & Cups",
    description:
      "A comfortable ceramic cup with a smooth finish, ideal for everyday service and premium gifting.",
    image: "/blacktea.png",
    pieces: "4 pcs / set",
    material: "Ceramic",
    moq: "20 sets",
    isNew: false,
  },
  {
    slug: "classic-dinner-plate-set",
    name: "Classic Dinner Plate Set",
    code: "HI-PB-001",
    category: "dinnerware",
    subcategory: "dinner-plates",
    categoryLabel: "Plates & Bowls",
    description:
      "Coordinated plates and bowls with durable glazing and a clean, buyer-ready presentation.",
    image: "/images/build-pic-1.png",
    pieces: "6 pcs / set",
    material: "Ceramic",
    moq: "12 sets",
    isNew: false,
  },
  {
    slug: "horeca-professional-range",
    name: "HoReCa Professional Range",
    code: "HI-HR-001",
    category: "dinnerware",
    categoryLabel: "Hotel / HoReCa Collection",
    description:
      "A practical tableware range planned for hotels, restaurants, banquets, and repeat service.",
    image: "/images/set.jpeg",
    pieces: "Custom mix",
    material: "Ceramic",
    moq: "25 sets",
    isNew: false,
  },
];

export const companyMilestones: StatItem[] = [
  { value: "25+", label: "Years Experience" },
  { value: "500+", label: "Product Designs" },
  { value: "1000+", label: "Happy Clients" },
  { value: "15+", label: "Countries Served" },
];

export const homeCategories = [
  {
    title: "Dinner Sets",
    description: "Complete dining collections for memorable service.",
    image: "/images/build-pic-1.png",
    href: "/products?category=dinnerware&subcategory=dinner-sets",
  },
  {
    title: "Tea & Coffee Sets",
    description: "Elegant service sets for homes, cafes, and gifting.",
    image: "/tea.png",
    href: "/products?category=drinkware",
  },
  {
    title: "Mugs & Cups",
    description: "Premium forms for daily use and custom collections.",
    image: "/blacktea.png",
    href: "/products?category=drinkware&subcategory=coffee-mugs",
  },
  {
    title: "Plates & Bowls",
    description: "Coordinated shapes with polished, durable glazing.",
    image: "/images/build-pic-2.png",
    href: "/products?category=dinnerware",
  },
  {
    title: "Hotel / HoReCa Collection",
    description: "Dependable tableware planned for professional service.",
    image: "/images/set.jpeg",
    href: "/products?category=dinnerware",
  },
  {
    title: "Export Range",
    description: "Buyer-ready collections for international sourcing.",
    image: "/images/build-pic-1.png",
    href: "/products?category=shop-by-material",
  },
];

export const manufacturingSteps = [
  {
    step: "Step 1",
    title: "Material Selection",
    description:
      "Premium raw materials are selected for consistent strength, form, and finish.",
    icon: "material",
  },
  {
    step: "Step 2",
    title: "Design & Finishing",
    description:
      "Each piece is shaped, glazed, and detailed for a clean premium presentation.",
    icon: "finish",
  },
  {
    step: "Step 3",
    title: "Quality Checking",
    description:
      "Multi-point inspection checks balance, surface quality, and visual consistency.",
    icon: "quality",
  },
  {
    step: "Step 4",
    title: "Safe Packaging",
    description:
      "Buyer-ready packing protects products through storage, handling, and dispatch.",
    icon: "packaging",
  },
] as const;

export const qualityPromises = [
  {
    title: "Premium Ceramic Material",
    description: "Selected materials for lasting strength and refined presentation.",
    icon: "material",
  },
  {
    title: "Smooth Finishing",
    description: "Clean glaze, polished edges, and consistent surface quality.",
    icon: "finish",
  },
  {
    title: "Strong Build Quality",
    description: "Reliable forms developed for regular service and handling.",
    icon: "quality",
  },
  {
    title: "Safe Packaging",
    description: "Layered protection planned for trade and bulk dispatch.",
    icon: "packaging",
  },
] as const;

export const galleryImages = [
  {
    src: "/images/build-pic-1.png",
    alt: "White and gold ceramic dinnerware collection",
  },
  {
    src: "/images/build-pic-2.png",
    alt: "White ceramic serveware with gold detailing",
  },
  {
    src: "/tea.png",
    alt: "White tea service with gold rim accents",
  },
  {
    src: "/blacktea.png",
    alt: "Black tea service with gold rim accents",
  },
  {
    src: "/images/set.jpeg",
    alt: "Premium black ceramic tea set",
  },
] as const;

export const downloadResources: DownloadItem[] = [
  {
    title: "Company Profile",
    description:
      "A compact brand overview with company story, product segments, and manufacturing strengths.",
    href: "/contact?request=company-profile",
    meta: "Profile request",
    actionLabel: "Request Company Profile",
    requestKey: "company-profile",
  },
  {
    title: "Product Catalogue",
    description:
      "Featured tea sets, dinner sets, cup & saucer options, and pricing notes for buyers.",
    href: "/contact?request=product-catalogue",
    meta: "Catalogue request",
    actionLabel: "Request Product Catalogue",
    requestKey: "product-catalogue",
    whatsappHref: businessInfo.whatsappCatalogueHref,
  },
  {
    title: "Care Guide",
    description:
      "Practical cleaning, storage, and handling guidance to keep ceramic collections in premium condition.",
    href: "/contact?request=care-guide",
    meta: "Care guide request",
    actionLabel: "Request Care Guide",
    requestKey: "care-guide",
  },
];

export const contactDetails = [
  {
    label: "Email",
    value: businessInfo.email,
    href: `mailto:${businessInfo.email}`,
  },
  {
    label: "Phone",
    value: businessInfo.phoneDisplay,
    href: businessInfo.phoneHref,
  },
  {
    label: "WhatsApp",
    value: businessInfo.phoneDisplay,
    href: businessInfo.whatsappHref,
  },
  {
    label: "Location",
    value: businessInfo.location,
    href: businessInfo.mapsHref,
  },
];

export const footerGroups = [
  {
    title: "Products",
    links: [
      {
        label: "Dinner Sets",
        href: "/products?category=dinnerware&subcategory=dinner-sets",
      },
      {
        label: "Tea & Coffee Sets",
        href: "/products?category=drinkware",
      },
      {
        label: "Mugs & Cups",
        href: "/products?category=drinkware&subcategory=coffee-mugs",
      },
      {
        label: "Plates & Bowls",
        href: "/products?category=dinnerware",
      },
      {
        label: "Hotel / HoReCa Collection",
        href: "/products?category=dinnerware",
      },
      {
        label: "Export Range",
        href: "/products?category=shop-by-material",
      },
    ],
  },
  {
    title: "Quick Links",
    links: [
      { label: "About Us", href: "/company" },
      { label: "Manufacturing", href: "/manufacturing" },
      { label: "Quality", href: "/quality" },
      { label: "Gallery", href: "/collections" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
];
