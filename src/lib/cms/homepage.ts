import type { CatalogueData } from "@/lib/catalogue";

export const homepagePageKey = "homepage";
export const homepagePath = "/";

export const homepageSectionKeys = [
  "hero",
  "introduction",
  "categories",
  "featured_products",
  "manufacturing_preview",
  "quality_preview",
  "gallery_preview",
  "bulk_enquiry_cta",
  "catalogue_cta",
] as const;

export type HomepageSectionKey = (typeof homepageSectionKeys)[number];

export type HomepageHeroContent = {
  visible: boolean;
  eyebrow: string;
  heading: string;
  highlightedText: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  primaryCtaLabel: string;
  primaryCtaUrl: string;
  secondaryCtaLabel: string;
  secondaryCtaUrl: string;
};

export type HomepageIntroContent = {
  visible: boolean;
  eyebrow: string;
  heading: string;
  highlightedText: string;
  paragraphs: string[];
  imageUrl: string;
  imageAlt: string;
  ctaLabel: string;
  ctaUrl: string;
};

export type HomepageCategoryContent = {
  visible: boolean;
  heading: string;
  description: string;
  selectedCategoryIds: string[];
};

export type HomepageFeaturedProductsContent = {
  visible: boolean;
  heading: string;
  description: string;
  selectedProductIds: string[];
  maxVisibleProducts: number;
};

export type HomepagePreviewContent = {
  visible: boolean;
  eyebrow: string;
  heading: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  ctaLabel: string;
  ctaUrl: string;
};

export type HomepageGalleryImage = {
  src: string;
  alt: string;
};

export type HomepageGalleryContent = {
  visible: boolean;
  heading: string;
  description: string;
  images: HomepageGalleryImage[];
  ctaLabel: string;
  ctaUrl: string;
};

export type HomepageBulkCtaContent = {
  visible: boolean;
  heading: string;
  highlightedText: string;
  description: string;
  buttonLabel: string;
  buttonUrl: string;
  secondaryButtonLabel: string;
  secondaryButtonUrl: string;
  backgroundImage: string;
};

export type HomepageCatalogueCtaContent = {
  visible: boolean;
  eyebrow: string;
  heading: string;
  highlightedText: string;
  description: string;
  buttonLabel: string;
  catalogueUrl: string;
  secondaryButtonLabel: string;
  secondaryButtonUrl: string;
};

export type HomepageContent = {
  hero: HomepageHeroContent;
  introduction: HomepageIntroContent;
  categories: HomepageCategoryContent;
  featuredProducts: HomepageFeaturedProductsContent;
  manufacturingPreview: HomepagePreviewContent;
  qualityPreview: HomepagePreviewContent;
  galleryPreview: HomepageGalleryContent;
  bulkEnquiryCta: HomepageBulkCtaContent;
  catalogueCta: HomepageCatalogueCtaContent;
  sectionOrder: HomepageSectionKey[];
};

export type HomepageCmsRecord = {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published" | "archived";
  content: HomepageContent;
  version: number;
  updatedAt: string;
  publishedAt: string | null;
  updatedBy: string | null;
  publishedBy: string | null;
};

export type HomepageVersionRecord = {
  id: string;
  version: number;
  createdAt: string;
  createdBy: string | null;
  snapshot: {
    title: string;
    slug: string;
    content: HomepageContent;
    publishedAt?: string;
    publishedBy?: string | null;
  };
};

type ValidationResult =
  | { ok: true; content: HomepageContent }
  | { ok: false; errors: string[] };

const maxLengths = {
  eyebrow: 80,
  heading: 160,
  highlightedText: 80,
  description: 700,
  paragraph: 900,
  ctaLabel: 80,
  url: 220,
  alt: 180,
};

export const fallbackHomepageContent: HomepageContent = {
  hero: {
    visible: true,
    eyebrow: "Crafting Elegance",
    heading: "Hira Industries",
    highlightedText: "",
    description:
      "Hira Industries is a ceramic crockery manufacturer and supplier in Khurja, Uttar Pradesh. Premium ceramic tableware for buyers who need polished design, consistent finishing, and dependable support for retail, hospitality, gifting, and bulk enquiries.",
    imageUrl: "/images/set.jpeg",
    imageAlt: "Black ceramic tea set with gold accents",
    primaryCtaLabel: "Explore Products",
    primaryCtaUrl: "/products",
    secondaryCtaLabel: "Company Profile",
    secondaryCtaUrl: "/company",
  },
  introduction: {
    visible: true,
    eyebrow: "Welcome to Hira Industries",
    heading: "Crafting Excellence in",
    highlightedText: "Ceramic Crockery",
    paragraphs: [
      "Hira Industries is a manufacturer and supplier of premium ceramic crockery, serving homes, hotels, restaurants, retailers, and wholesale buyers with dependable product collections.",
      "From dinner sets, tea and coffee sets, cups and mugs, bowls, and serveware to buyer-ready hotel crockery, every collection is developed for polished presentation, reliable daily use, and practical bulk sourcing.",
      "Explore our products, learn more about our manufacturing process, review our quality standards, or contact us for bulk orders and catalogue support.",
    ],
    imageUrl: "/images/Hira-office.webp",
    imageAlt: "Hira Industries factory outlet reception in Khurja",
    ctaLabel: "Learn More About Us",
    ctaUrl: "/company",
  },
  categories: {
    visible: true,
    heading: "Explore Product Categories",
    description:
      "Discover our wide range of premium ceramic crockery collections designed for every need.",
    selectedCategoryIds: [],
  },
  featuredProducts: {
    visible: true,
    heading: "Our Premium Collection",
    description:
      "Handpicked products from our finest collections, ready for homes, hotels, and retail.",
    selectedProductIds: [],
    maxVisibleProducts: 6,
  },
  manufacturingPreview: {
    visible: true,
    eyebrow: "Our Process",
    heading: "How We Craft Excellence",
    description:
      "Every piece goes through a meticulous process to ensure premium quality.",
    imageUrl: "/images/build-pic-2.png",
    imageAlt: "Ceramic manufacturing process at Hira Industries",
    ctaLabel: "Learn About Manufacturing",
    ctaUrl: "/manufacturing",
  },
  qualityPreview: {
    visible: true,
    eyebrow: "Our Promise",
    heading: "Quality You Can Trust",
    description:
      "Every product from Hira Industries carries our commitment to excellence.",
    imageUrl: "",
    imageAlt: "",
    ctaLabel: "View Quality Standards",
    ctaUrl: "/quality",
  },
  galleryPreview: {
    visible: true,
    heading: "Our Finest Showcase",
    description: "A glimpse of our premium collections and craftsmanship.",
    images: [
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
    ],
    ctaLabel: "View Full Gallery",
    ctaUrl: "/collections",
  },
  bulkEnquiryCta: {
    visible: true,
    heading: "Need Crockery in",
    highlightedText: "Bulk?",
    description:
      "Looking for crockery in bulk for hotels, restaurants, retail stores, or wholesale supply? Share your product, quantity, packing, and delivery requirements so our team can confirm current details.",
    buttonLabel: "Send Bulk Enquiry",
    buttonUrl: "/contact?intent=bulk-details",
    secondaryButtonLabel: "Contact Us",
    secondaryButtonUrl: "/contact",
    backgroundImage: "/images/build-pic-1.png",
  },
  catalogueCta: {
    visible: true,
    eyebrow: "Buyer Resources",
    heading: "Get Our Latest",
    highlightedText: "Product Catalogue",
    description:
      "Explore our complete range of premium ceramic crockery. Get the latest Hira Industries product catalogue delivered to your WhatsApp instantly.",
    buttonLabel: "Request Catalogue",
    catalogueUrl: "whatsapp_catalogue",
    secondaryButtonLabel: "View Products",
    secondaryButtonUrl: "/products",
  },
  sectionOrder: [
    "introduction",
    "categories",
    "featured_products",
    "manufacturing_preview",
    "quality_preview",
    "gallery_preview",
    "bulk_enquiry_cta",
    "catalogue_cta",
  ],
};

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readString(
  source: Record<string, unknown>,
  key: string,
  fallback: string,
) {
  const value = source[key];
  return typeof value === "string" ? value.trim() : fallback;
}

function readBoolean(
  source: Record<string, unknown>,
  key: string,
  fallback: boolean,
) {
  return typeof source[key] === "boolean" ? source[key] : fallback;
}

function readNumber(
  source: Record<string, unknown>,
  key: string,
  fallback: number,
) {
  return typeof source[key] === "number" && Number.isFinite(source[key])
    ? source[key]
    : fallback;
}

function readStringArray(value: unknown, fallback: string[]) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : fallback;
}

function validateText(
  errors: string[],
  label: string,
  value: string,
  maxLength: number,
  required = true,
) {
  if (required && !value) {
    errors.push(`${label} is required.`);
  }

  if (value.length > maxLength) {
    errors.push(`${label} must be ${maxLength} characters or fewer.`);
  }
}

function isSafeUrl(value: string) {
  if (!value) {
    return true;
  }

  if (/^\s*(javascript|data|file):/i.test(value)) {
    return false;
  }

  if (value === "whatsapp_catalogue") {
    return true;
  }

  if (value.startsWith("/")) {
    return !value.startsWith("//") && !value.includes("..");
  }

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function validateUrl(errors: string[], label: string, value: string) {
  validateText(errors, label, value, maxLengths.url);

  if (!isSafeUrl(value)) {
    errors.push(`${label} must be an internal path or safe URL.`);
  }
}

function validateImagePath(errors: string[], label: string, value: string) {
  validateText(errors, label, value, maxLengths.url, false);

  if (value && (!value.startsWith("/") || value.includes(".."))) {
    errors.push(`${label} must be a safe public image path.`);
  }
}

function readHero(value: unknown): HomepageHeroContent {
  const fallback = fallbackHomepageContent.hero;
  const source = isObject(value) ? value : {};
  return {
    visible: readBoolean(source, "visible", fallback.visible),
    eyebrow: readString(source, "eyebrow", fallback.eyebrow),
    heading: readString(source, "heading", fallback.heading),
    highlightedText: readString(
      source,
      "highlightedText",
      fallback.highlightedText,
    ),
    description: readString(source, "description", fallback.description),
    imageUrl: readString(source, "imageUrl", fallback.imageUrl),
    imageAlt: readString(source, "imageAlt", fallback.imageAlt),
    primaryCtaLabel: readString(
      source,
      "primaryCtaLabel",
      fallback.primaryCtaLabel,
    ),
    primaryCtaUrl: readString(
      source,
      "primaryCtaUrl",
      fallback.primaryCtaUrl,
    ),
    secondaryCtaLabel: readString(
      source,
      "secondaryCtaLabel",
      fallback.secondaryCtaLabel,
    ),
    secondaryCtaUrl: readString(
      source,
      "secondaryCtaUrl",
      fallback.secondaryCtaUrl,
    ),
  };
}

function validateHero(errors: string[], hero: HomepageHeroContent) {
  validateText(errors, "Hero eyebrow", hero.eyebrow, maxLengths.eyebrow);
  validateText(errors, "Hero heading", hero.heading, maxLengths.heading);
  validateText(
    errors,
    "Hero highlighted text",
    hero.highlightedText,
    maxLengths.highlightedText,
    false,
  );
  validateText(
    errors,
    "Hero description",
    hero.description,
    maxLengths.description,
  );
  validateImagePath(errors, "Hero image URL", hero.imageUrl);
  validateText(errors, "Hero image alt text", hero.imageAlt, maxLengths.alt);
  validateText(
    errors,
    "Hero primary CTA label",
    hero.primaryCtaLabel,
    maxLengths.ctaLabel,
  );
  validateUrl(errors, "Hero primary CTA URL", hero.primaryCtaUrl);
  validateText(
    errors,
    "Hero secondary CTA label",
    hero.secondaryCtaLabel,
    maxLengths.ctaLabel,
  );
  validateUrl(errors, "Hero secondary CTA URL", hero.secondaryCtaUrl);
}

export function parseHomepageContent(input: unknown): ValidationResult {
  const source = isObject(input) ? input : {};
  const errors: string[] = [];
  const fallback = fallbackHomepageContent;
  const introSource = isObject(source.introduction) ? source.introduction : {};
  const categorySource = isObject(source.categories) ? source.categories : {};
  const productSource = isObject(source.featuredProducts)
    ? source.featuredProducts
    : {};
  const manufacturingSource = isObject(source.manufacturingPreview)
    ? source.manufacturingPreview
    : {};
  const qualitySource = isObject(source.qualityPreview)
    ? source.qualityPreview
    : {};
  const gallerySource = isObject(source.galleryPreview)
    ? source.galleryPreview
    : {};
  const bulkSource = isObject(source.bulkEnquiryCta)
    ? source.bulkEnquiryCta
    : {};
  const catalogueSource = isObject(source.catalogueCta)
    ? source.catalogueCta
    : {};

  const galleryImages = Array.isArray(gallerySource.images)
    ? gallerySource.images
        .filter(isObject)
        .map((image) => ({
          src: readString(image, "src", ""),
          alt: readString(image, "alt", ""),
        }))
    : fallback.galleryPreview.images;

  const sectionOrder = readStringArray(
    source.sectionOrder,
    fallback.sectionOrder,
  ).filter((key): key is HomepageSectionKey =>
    homepageSectionKeys.includes(key as HomepageSectionKey),
  );
  const missingSections = fallback.sectionOrder.filter(
    (key) => !sectionOrder.includes(key),
  );

  const content: HomepageContent = {
    hero: readHero(source.hero),
    introduction: {
      visible: readBoolean(introSource, "visible", fallback.introduction.visible),
      eyebrow: readString(introSource, "eyebrow", fallback.introduction.eyebrow),
      heading: readString(introSource, "heading", fallback.introduction.heading),
      highlightedText: readString(
        introSource,
        "highlightedText",
        fallback.introduction.highlightedText,
      ),
      paragraphs: readStringArray(
        introSource.paragraphs,
        fallback.introduction.paragraphs,
      ).map((paragraph) => paragraph.trim()),
      imageUrl: readString(
        introSource,
        "imageUrl",
        fallback.introduction.imageUrl,
      ),
      imageAlt: readString(
        introSource,
        "imageAlt",
        fallback.introduction.imageAlt,
      ),
      ctaLabel: readString(
        introSource,
        "ctaLabel",
        fallback.introduction.ctaLabel,
      ),
      ctaUrl: readString(introSource, "ctaUrl", fallback.introduction.ctaUrl),
    },
    categories: {
      visible: readBoolean(categorySource, "visible", fallback.categories.visible),
      heading: readString(categorySource, "heading", fallback.categories.heading),
      description: readString(
        categorySource,
        "description",
        fallback.categories.description,
      ),
      selectedCategoryIds: readStringArray(
        categorySource.selectedCategoryIds,
        [],
      ),
    },
    featuredProducts: {
      visible: readBoolean(
        productSource,
        "visible",
        fallback.featuredProducts.visible,
      ),
      heading: readString(
        productSource,
        "heading",
        fallback.featuredProducts.heading,
      ),
      description: readString(
        productSource,
        "description",
        fallback.featuredProducts.description,
      ),
      selectedProductIds: readStringArray(productSource.selectedProductIds, []),
      maxVisibleProducts: Math.min(
        12,
        Math.max(
          1,
          readNumber(
            productSource,
            "maxVisibleProducts",
            fallback.featuredProducts.maxVisibleProducts,
          ),
        ),
      ),
    },
    manufacturingPreview: {
      visible: readBoolean(
        manufacturingSource,
        "visible",
        fallback.manufacturingPreview.visible,
      ),
      eyebrow: readString(
        manufacturingSource,
        "eyebrow",
        fallback.manufacturingPreview.eyebrow,
      ),
      heading: readString(
        manufacturingSource,
        "heading",
        fallback.manufacturingPreview.heading,
      ),
      description: readString(
        manufacturingSource,
        "description",
        fallback.manufacturingPreview.description,
      ),
      imageUrl: readString(
        manufacturingSource,
        "imageUrl",
        fallback.manufacturingPreview.imageUrl,
      ),
      imageAlt: readString(
        manufacturingSource,
        "imageAlt",
        fallback.manufacturingPreview.imageAlt,
      ),
      ctaLabel: readString(
        manufacturingSource,
        "ctaLabel",
        fallback.manufacturingPreview.ctaLabel,
      ),
      ctaUrl: readString(
        manufacturingSource,
        "ctaUrl",
        fallback.manufacturingPreview.ctaUrl,
      ),
    },
    qualityPreview: {
      visible: readBoolean(
        qualitySource,
        "visible",
        fallback.qualityPreview.visible,
      ),
      eyebrow: readString(
        qualitySource,
        "eyebrow",
        fallback.qualityPreview.eyebrow,
      ),
      heading: readString(
        qualitySource,
        "heading",
        fallback.qualityPreview.heading,
      ),
      description: readString(
        qualitySource,
        "description",
        fallback.qualityPreview.description,
      ),
      imageUrl: readString(
        qualitySource,
        "imageUrl",
        fallback.qualityPreview.imageUrl,
      ),
      imageAlt: readString(
        qualitySource,
        "imageAlt",
        fallback.qualityPreview.imageAlt,
      ),
      ctaLabel: readString(
        qualitySource,
        "ctaLabel",
        fallback.qualityPreview.ctaLabel,
      ),
      ctaUrl: readString(
        qualitySource,
        "ctaUrl",
        fallback.qualityPreview.ctaUrl,
      ),
    },
    galleryPreview: {
      visible: readBoolean(
        gallerySource,
        "visible",
        fallback.galleryPreview.visible,
      ),
      heading: readString(
        gallerySource,
        "heading",
        fallback.galleryPreview.heading,
      ),
      description: readString(
        gallerySource,
        "description",
        fallback.galleryPreview.description,
      ),
      images: galleryImages,
      ctaLabel: readString(
        gallerySource,
        "ctaLabel",
        fallback.galleryPreview.ctaLabel,
      ),
      ctaUrl: readString(
        gallerySource,
        "ctaUrl",
        fallback.galleryPreview.ctaUrl,
      ),
    },
    bulkEnquiryCta: {
      visible: readBoolean(
        bulkSource,
        "visible",
        fallback.bulkEnquiryCta.visible,
      ),
      heading: readString(bulkSource, "heading", fallback.bulkEnquiryCta.heading),
      highlightedText: readString(
        bulkSource,
        "highlightedText",
        fallback.bulkEnquiryCta.highlightedText,
      ),
      description: readString(
        bulkSource,
        "description",
        fallback.bulkEnquiryCta.description,
      ),
      buttonLabel: readString(
        bulkSource,
        "buttonLabel",
        fallback.bulkEnquiryCta.buttonLabel,
      ),
      buttonUrl: readString(
        bulkSource,
        "buttonUrl",
        fallback.bulkEnquiryCta.buttonUrl,
      ),
      secondaryButtonLabel: readString(
        bulkSource,
        "secondaryButtonLabel",
        fallback.bulkEnquiryCta.secondaryButtonLabel,
      ),
      secondaryButtonUrl: readString(
        bulkSource,
        "secondaryButtonUrl",
        fallback.bulkEnquiryCta.secondaryButtonUrl,
      ),
      backgroundImage: readString(
        bulkSource,
        "backgroundImage",
        fallback.bulkEnquiryCta.backgroundImage,
      ),
    },
    catalogueCta: {
      visible: readBoolean(
        catalogueSource,
        "visible",
        fallback.catalogueCta.visible,
      ),
      eyebrow: readString(
        catalogueSource,
        "eyebrow",
        fallback.catalogueCta.eyebrow,
      ),
      heading: readString(
        catalogueSource,
        "heading",
        fallback.catalogueCta.heading,
      ),
      highlightedText: readString(
        catalogueSource,
        "highlightedText",
        fallback.catalogueCta.highlightedText,
      ),
      description: readString(
        catalogueSource,
        "description",
        fallback.catalogueCta.description,
      ),
      buttonLabel: readString(
        catalogueSource,
        "buttonLabel",
        fallback.catalogueCta.buttonLabel,
      ),
      catalogueUrl: readString(
        catalogueSource,
        "catalogueUrl",
        fallback.catalogueCta.catalogueUrl,
      ),
      secondaryButtonLabel: readString(
        catalogueSource,
        "secondaryButtonLabel",
        fallback.catalogueCta.secondaryButtonLabel,
      ),
      secondaryButtonUrl: readString(
        catalogueSource,
        "secondaryButtonUrl",
        fallback.catalogueCta.secondaryButtonUrl,
      ),
    },
    sectionOrder: [...sectionOrder, ...missingSections],
  };

  validateHero(errors, content.hero);
  validateText(
    errors,
    "Introduction heading",
    content.introduction.heading,
    maxLengths.heading,
  );
  validateText(
    errors,
    "Introduction highlighted text",
    content.introduction.highlightedText,
    maxLengths.highlightedText,
    false,
  );
  content.introduction.paragraphs.forEach((paragraph, index) =>
    validateText(
      errors,
      `Introduction paragraph ${index + 1}`,
      paragraph,
      maxLengths.paragraph,
    ),
  );
  validateImagePath(errors, "Introduction image URL", content.introduction.imageUrl);
  validateUrl(errors, "Introduction CTA URL", content.introduction.ctaUrl);
  validateText(errors, "Categories heading", content.categories.heading, maxLengths.heading);
  validateText(errors, "Featured products heading", content.featuredProducts.heading, maxLengths.heading);
  validateText(errors, "Manufacturing heading", content.manufacturingPreview.heading, maxLengths.heading);
  validateImagePath(errors, "Manufacturing image URL", content.manufacturingPreview.imageUrl);
  validateUrl(errors, "Manufacturing CTA URL", content.manufacturingPreview.ctaUrl);
  validateText(errors, "Quality heading", content.qualityPreview.heading, maxLengths.heading);
  validateUrl(errors, "Quality CTA URL", content.qualityPreview.ctaUrl);
  validateText(errors, "Gallery heading", content.galleryPreview.heading, maxLengths.heading);
  validateUrl(errors, "Gallery CTA URL", content.galleryPreview.ctaUrl);
  content.galleryPreview.images.forEach((image, index) => {
    validateImagePath(errors, `Gallery image ${index + 1}`, image.src);
    validateText(errors, `Gallery image ${index + 1} alt`, image.alt, maxLengths.alt);
  });
  validateText(errors, "Bulk enquiry heading", content.bulkEnquiryCta.heading, maxLengths.heading);
  validateUrl(errors, "Bulk enquiry button URL", content.bulkEnquiryCta.buttonUrl);
  validateUrl(errors, "Bulk enquiry secondary URL", content.bulkEnquiryCta.secondaryButtonUrl);
  validateImagePath(errors, "Bulk enquiry background image", content.bulkEnquiryCta.backgroundImage);
  validateText(errors, "Catalogue CTA heading", content.catalogueCta.heading, maxLengths.heading);
  validateUrl(errors, "Catalogue CTA URL", content.catalogueCta.catalogueUrl);
  validateUrl(errors, "Catalogue secondary URL", content.catalogueCta.secondaryButtonUrl);

  return errors.length > 0 ? { ok: false, errors } : { ok: true, content };
}

export function getHomepageProducts(
  catalogue: CatalogueData,
  content: HomepageContent,
) {
  const selectedIds = content.featuredProducts.selectedProductIds;
  const max = content.featuredProducts.maxVisibleProducts;

  if (selectedIds.length > 0) {
    const byId = new Map(catalogue.products.map((product) => [product.id, product]));
    return selectedIds
      .map((id) => byId.get(id))
      .filter((product): product is CatalogueData["products"][number] =>
        Boolean(product?.is_active),
      )
      .slice(0, max);
  }

  const featuredProducts = catalogue.products
    .filter((product) => product.is_featured)
    .slice(0, max);
  const fallbackProducts = catalogue.products.slice(0, max);
  return featuredProducts.length > 0 ? featuredProducts : fallbackProducts;
}

export function getHomepageCategories(
  catalogue: CatalogueData,
  content: HomepageContent,
) {
  const selectedIds = content.categories.selectedCategoryIds;

  if (selectedIds.length > 0) {
    const byId = new Map(
      catalogue.categoryCards.map((category) => [category.id, category]),
    );
    return selectedIds
      .map((id) => byId.get(id))
      .filter((category): category is CatalogueData["categoryCards"][number] =>
        Boolean(category),
      )
      .slice(0, 6);
  }

  return catalogue.categoryCards.slice(0, 6);
}
