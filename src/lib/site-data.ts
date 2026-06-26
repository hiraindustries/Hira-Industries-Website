export type NavLink = {
  href: string;
  label: string;
};

export type FeatureItem = {
  title: string;
  description: string;
  icon: string;
};

export type StatItem = {
  value: string;
  label: string;
};

export type ProductItem = {
  title: string;
  category: string;
  price: string;
  description: string;
  image: string;
  badge?: string;
  objectPosition?: string;
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
  mapsHref:
    "https://maps.google.com/?q=Hira%20Industries%20Khurja%20Uttar%20Pradesh%20India",
  businessHours: "Mon - Sat, 10:00 AM - 7:00 PM",
} as const;

export const navLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/company", label: "Company Profile" },
  { href: "/products", label: "Products" },
  { href: "/quality", label: "Quality" },
  { href: "/collections", label: "Collections" },
  { href: "/downloads", label: "Downloads" },
  { href: "/contact", label: "Contact Us" },
];

export const heroStats: StatItem[] = [
  { value: "Bulk", label: "Order ready" },
  { value: "Trade", label: "Friendly packaging" },
  { value: "Checks", label: "Consistent finishing" },
];

export const featureItems: FeatureItem[] = [
  {
    icon: "diamond",
    title: "Premium Ceramic Tableware",
    description:
      "Refined tea sets, dinner sets, cup and saucer collections, and serveware for buyer-ready presentation.",
  },
  {
    icon: "pen",
    title: "Careful Glazing & Finishing",
    description:
      "Clean surfaces, balanced silhouettes, and polished detailing give every collection a premium finish.",
  },
  {
    icon: "shield",
    title: "Consistent Quality Checks",
    description:
      "Products are reviewed for surface consistency, balance, finish quality, and packing readiness.",
  },
  {
    icon: "box",
    title: "Buyer-Ready Packaging",
    description:
      "Packaging and dispatch support are planned for hotels, retailers, gifting clients, and trade orders.",
  },
];

export const companyStats: StatItem[] = [
  { value: "Bulk", label: "Order capability" },
  { value: "Glaze", label: "Finish checks" },
  { value: "Trade", label: "Buyer-ready packaging" },
  { value: "Dispatch", label: "Reliable support" },
];

export const qualityStats: StatItem[] = [
  { value: "Material", label: "Selection review" },
  { value: "Glaze", label: "Surface checks" },
  { value: "Pack", label: "Buyer-ready handling" },
  { value: "Dispatch", label: "Order support" },
];

export const productFilters = [
  "All Products",
  "Tea Set",
  "Dinner Set",
  "Cup & Saucer",
  "Coffee Set",
  "Serveware",
  "Accessories",
];

export const featuredProducts: ProductItem[] = [
  {
    title: "Royal Marble Tea Set",
    category: "Tea Set",
    price: "INR 4,995",
    description: "Statement tea service with gold rim detailing and a deep black marble finish.",
    image: "/images/set.jpeg",
    badge: "New",
    objectPosition: "center center",
  },
  {
    title: "Golden Essence Tea Set",
    category: "Tea Set",
    price: "INR 5,200",
    description: "Elegant curves with a warm metallic accent made for premium hospitality settings.",
    image: "/tea.png",
    objectPosition: "center center",
  },
  {
    title: "Classic Black Tea Set",
    category: "Tea Set",
    price: "INR 3,999",
    description: "Bold, contemporary, and versatile for everyday tea service or premium gifting.",
    image: "/blacktea.png",
    objectPosition: "center center",
  },
  {
    title: "Ivory Grace Tea Set",
    category: "Tea Set",
    price: "INR 4,800",
    description: "A softer palette for refined interiors, boutique hotels, and special occasions.",
    image: "/tea.png",
    objectPosition: "center center",
  },
  {
    title: "Royal Gold Dinner Set",
    category: "Dinner Set",
    price: "INR 12,500",
    description: "Formal dinnerware crafted for memorable gatherings and premium dining rooms.",
    image:
      "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTFxXNFs8wE4jdCpMYXAONhuSAstdWfqBuqh-L1Ex2hHf79qHJ1Prtd7Nl9FVHi8PIB4DndXvixD72UKztEfZ6E2ZW1IFhQ0ouL5r15S8JCRPaLM4VROGt6yao3QFUoyU1fTnrgoA&usqp=CAc",
    objectPosition: "center center",
  },
  {
    title: "Coffee Ritual Set",
    category: "Coffee Set",
    price: "INR 5,650",
    description: "Compact, modern, and suited for curated coffee service and gifting.",
    image:
      "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=1200&auto=format&fit=crop",
    objectPosition: "center center",
  },
  {
    title: "Premium Cup & Saucer",
    category: "Cup & Saucer",
    price: "INR 2,450",
    description: "A clean, timeless silhouette with a polished gold accent for cafes and lounges.",
    image:
      "https://rukminim2.flixcart.com/image/612/612/xif0q/cup-saucer/g/6/x/pack-of-6-bone-china-white-golden-series-pack-of-6-tea-cups-and-original-imahmbtgsstvja5r.jpeg?q=70",
    objectPosition: "center center",
  },
  {
    title: "Serveware Accent Bowl",
    category: "Serveware",
    price: "INR 3,150",
    description: "For snacks, condiments, and shared presentation across premium table settings.",
    image:
      "https://plus.unsplash.com/premium_photo-1661963026516-5ecf0e65e1b3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGluZHVzdHJpYWwlMjBjZXJhbWljJTIwcHJvZHVjdHMlMjBpbWFnZXN8ZW58MHx8MHx8fDA%3D",
    objectPosition: "center center",
  },
  {
    title: "Accessories Set",
    category: "Accessories",
    price: "INR 1,650",
    description: "Add-on pieces and finishing details for display-ready, coordinated collections.",
    image:
      "https://images.unsplash.com/photo-1567016432779-094069958ea5?q=80&w=1200",
    objectPosition: "center center",
  },
];

export const collectionHighlights = [
  {
    title: "Tea Sets",
    subtitle: "Elegance in every sip",
    description:
      "Signature tea service pieces designed to feel refined in premium homes, boutiques, and hospitality spaces.",
    image: "/tea.png",
    objectPosition: "center center",
  },
  {
    title: "Dinner Sets",
    subtitle: "Crafted for memorable moments",
    description:
      "Statement table settings that combine balance, practicality, and visual richness for larger gatherings.",
    image:
      "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTFxXNFs8wE4jdCpMYXAONhuSAstdWfqBuqh-L1Ex2hHf79qHJ1Prtd7Nl9FVHi8PIB4DndXvixD72UKztEfZ6E2ZW1IFhQ0ouL5r15S8JCRPaLM4VROGt6yao3QFUoyU1fTnrgoA&usqp=CAc",
    objectPosition: "center center",
  },
  {
    title: "Cup & Saucer",
    subtitle: "Polished everyday ritual",
    description:
      "Clean and elegant service sets for cafes, offices, gifting, and premium home collections.",
    image: "/blacktea.png",
    objectPosition: "center center",
  },
  {
    title: "Serveware",
    subtitle: "Functional with presence",
    description:
      "Matching accent pieces that complete a curated table with a cohesive, premium finish.",
    image:
      "https://plus.unsplash.com/premium_photo-1661963026516-5ecf0e65e1b3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGluZHVzdHJpYWwlMjBjZXJhbWljJTIwcHJvZHVjdHMlMjBpbWFnZXN8ZW58MHx8MHx8fDA%3D",
    objectPosition: "center center",
  },
];

export const qualitySteps = [
  {
    step: "01",
    title: "Raw material selection",
    description:
      "We source materials for consistency, strength, and a refined finish before anything enters production.",
  },
  {
    step: "02",
    title: "Forming and glazing",
    description:
      "Each piece is shaped, refined, and glazed to preserve crisp edges and premium surface quality.",
  },
  {
    step: "03",
    title: "Kiln firing",
    description:
      "Controlled firing cycles are used to improve durability, stability, and long-term performance.",
  },
  {
    step: "04",
    title: "Final inspection",
    description:
      "Finished products are checked for surface consistency, balance, finish quality, and packaging readiness.",
  },
];

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
    title: "Quick Links",
    links: [
      { label: "Home", href: "/" },
      { label: "Company Profile", href: "/company" },
      { label: "Products", href: "/products" },
      { label: "Quality", href: "/quality" },
      { label: "Downloads", href: "/downloads" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Products",
    links: [
      { label: "Tea Set", href: "/products" },
      { label: "Dinner Set", href: "/products" },
      { label: "Cup & Saucer", href: "/products" },
      { label: "Serveware", href: "/products" },
    ],
  },
];
