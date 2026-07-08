export type NavLink = {
  href: string;
  label: string;
  children?: NavLink[];
};

export type StatItem = {
  value: string;
  label: string;
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
        href: "/products?category=dinner-sets",
      },
      {
        label: "Tea & Coffee Sets",
        href: "/products?category=tea-coffee-sets",
      },
      {
        label: "Cups & Mugs",
        href: "/products?category=cups-mugs",
      },
      {
        label: "Plates",
        href: "/products?category=plates",
      },
      {
        label: "Serving Sets",
        href: "/products?category=serving-sets",
      },
      {
        label: "Hotel / Bulk Orders",
        href: "/products?category=hotel-bulk-orders",
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

export const companyMilestones: StatItem[] = [
  { value: "25+", label: "Years Experience" },
  { value: "500+", label: "Product Designs" },
  { value: "1000+", label: "Happy Clients" },
  { value: "15+", label: "Countries Served" },
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
        href: "/products?category=dinner-sets",
      },
      {
        label: "Tea & Coffee Sets",
        href: "/products?category=tea-coffee-sets",
      },
      {
        label: "Cups & Mugs",
        href: "/products?category=cups-mugs",
      },
      {
        label: "Plates",
        href: "/products?category=plates",
      },
      {
        label: "Serving Sets",
        href: "/products?category=serving-sets",
      },
      {
        label: "Hotel / Bulk Orders",
        href: "/products?category=hotel-bulk-orders",
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
