import { businessProfile } from "@/lib/site/business-info";

export type ResourcePage = {
  slug: string;
  title: string;
  description: string;
  intro: string;
  image: string;
  sections: Array<{
    heading: string;
    body: string[];
  }>;
  links: Array<{
    label: string;
    href: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
};

export const resourcePages = [
  {
    slug: "ceramic-crockery-manufacturer-khurja",
    title: "Ceramic Crockery Manufacturer in Khurja",
    description:
      "Learn how buyers can evaluate a ceramic crockery manufacturer in Khurja and understand Hira Industries product categories, quality checks and enquiry process.",
    intro:
      "Khurja is widely associated with ceramic products, and buyers often compare suppliers by product range, finishing consistency, packaging support and response quality. Hira Industries presents its public catalogue for ceramic crockery enquiries from homes, retailers, hospitality buyers and trade customers.",
    image: "/images/build-pic-1.png",
    sections: [
      {
        heading: "What buyers usually compare",
        body: [
          "A practical comparison starts with the product range: dinner sets, tea and coffee sets, cups, mugs, plates, bowls, serveware, gift sets and hospitality crockery.",
          "Buyers should also review product codes, material notes, colour options, packaging expectations and whether the supplier can share current catalogue details before an order is discussed.",
        ],
      },
      {
        heading: "How Hira Industries presents its catalogue",
        body: [
          "The public catalogue shows active product categories and product detail pages with descriptions, product codes where available, materials, colours and visible product images.",
          "For current availability, MOQ, samples, delivery timing and packaging details, buyers should contact Hira Industries directly because these values can vary by product and order requirement.",
        ],
      },
    ],
    links: [
      { label: "Browse ceramic crockery products", href: "/products" },
      { label: "Contact Hira Industries in Khurja", href: "/contact" },
    ],
    faqs: [
      {
        question: "Where is Hira Industries located?",
        answer: `${businessProfile.officialName} is located in Khurja, Uttar Pradesh, India.`,
      },
      {
        question: "How can buyers request current catalogue details?",
        answer:
          "Buyers can use the contact form or WhatsApp link on the website to request current catalogue details and product availability.",
      },
    ],
  },
  {
    slug: "wholesale-ceramic-crockery",
    title: "Wholesale Ceramic Crockery Buying Guide",
    description:
      "A practical wholesale ceramic crockery guide covering product selection, catalogue checks, packaging questions and enquiry details buyers should confirm.",
    intro:
      "Wholesale crockery buyers need clear product information before discussing quantities. This guide outlines the details to confirm when evaluating ceramic dinnerware, tea sets, cups, mugs, plates, bowls and serveware.",
    image: "/images/products/white-gold-pattern-dinner-plate-set.png",
    sections: [
      {
        heading: "Information to prepare before enquiry",
        body: [
          "Share the product category, target quantity, preferred colours or finish, destination, packing expectations and whether the order is for retail, hospitality, gifting or distribution.",
          "If exact MOQ, sample policy, delivery timing or transport terms matter to your purchase, ask Hira Industries to confirm them for the selected products before planning procurement.",
        ],
      },
      {
        heading: "Useful product checks",
        body: [
          "Review product detail pages for product codes, materials, colours and feature notes. For products without enough public detail, request the latest catalogue or ask for specific photographs before confirming next steps.",
          "Avoid assuming microwave-safe, dishwasher-safe or food-service compliance claims unless the business confirms them for the exact product range.",
        ],
      },
    ],
    links: [
      { label: "View all product categories", href: "/products" },
      { label: "Send a wholesale enquiry", href: "/contact?intent=bulk-details" },
    ],
    faqs: [
      {
        question: "Does the website publish wholesale prices?",
        answer:
          "No. Product prices and wholesale terms should be requested directly from Hira Industries for the selected items and quantities.",
      },
      {
        question: "Is MOQ published online?",
        answer:
          "No public MOQ is published on the website. Buyers should contact Hira Industries to confirm MOQ for the required product category.",
      },
    ],
  },
  {
    slug: "hotel-restaurant-crockery",
    title: "Hotel and Restaurant Crockery Guide",
    description:
      "Buyer-focused guidance for hotels and restaurants evaluating ceramic crockery, table presentation, replacement planning and packing questions.",
    intro:
      "Hospitality buyers usually need consistent presentation, repeatable product selection and clear communication around replacement needs. Ceramic crockery should be assessed by finish, shape, colour, handling requirements and suitability for the intended service style.",
    image: "/images/Bulk Order Handling.png",
    sections: [
      {
        heading: "Hospitality questions to confirm",
        body: [
          "Ask whether the selected products are suitable for the service environment, expected handling pattern and presentation style. Do not assume dishwasher or microwave suitability unless confirmed for that product.",
          "For restaurants and hotels, ask about repeat availability, replacement planning, packing, delivery timing and product code consistency before placing a bulk enquiry.",
        ],
      },
      {
        heading: "Relevant catalogue areas",
        body: [
          "Dinner sets, plates, bowls, serving sets, tea and coffee sets, cups, mugs and hotel/bulk-order categories are the most relevant starting points for hospitality crockery.",
          "Share the table format and usage expectations when enquiring so the team can suggest the most suitable collection to review.",
        ],
      },
    ],
    links: [
      { label: "View hotel and bulk-order products", href: "/products?category=hotel-bulk-orders" },
      { label: "Send a hospitality enquiry", href: "/contact?intent=hospitality" },
    ],
    faqs: [
      {
        question: "Are hospitality-specific details published for every product?",
        answer:
          "No. Public product pages show available catalogue details, but hospitality buyers should confirm usage, packing and repeat availability directly with Hira Industries.",
      },
    ],
  },
  {
    slug: "custom-crockery-enquiry-checklist",
    title: "Custom Crockery Enquiry Checklist",
    description:
      "A careful guide for special crockery requirements, including what buyers should prepare and what must be confirmed with Hira Industries.",
    intro:
      "Special crockery requirements need direct confirmation because finish, packaging, minimum quantities, samples and lead times depend on the selected product and current production plan.",
    image: "/images/Design & Finishing.png",
    sections: [
      {
        heading: "What to share in a special requirement enquiry",
        body: [
          "Share the product type, preferred finish, packing expectations, estimated quantity and target use case.",
          "Ask Hira Industries to confirm whether any customisation is currently available for the selected product before relying on it for procurement or launch planning.",
        ],
      },
      {
        heading: "Details that need direct confirmation",
        body: [
          "MOQ, sample cost, artwork requirements, colour matching, packaging options, lead time and transport terms are not published as fixed values on the website.",
          "Ask for written confirmation for the current product range before assuming any customisation capability.",
        ],
      },
    ],
    links: [
      { label: "Ask about special requirements", href: "/contact?intent=custom-requirements" },
      { label: "Browse product starting points", href: "/products" },
    ],
    faqs: [
      {
        question: "Does the website guarantee customisation?",
        answer:
          "No. Buyers should contact Hira Industries to confirm whether any customisation is currently available for their selected product and quantity.",
      },
    ],
  },
  {
    slug: "bulk-order-guide",
    title: "Bulk Ceramic Crockery Order Guide",
    description:
      "A simple guide to preparing bulk ceramic crockery enquiries for Hira Industries, including product details, quantity questions and packing checks.",
    intro:
      "Bulk enquiries are easier to handle when the buyer shares clear product, quantity and packing expectations. This guide explains what to prepare before contacting Hira Industries.",
    image: "/images/Packaging Process.png",
    sections: [
      {
        heading: "Prepare a clear requirement",
        body: [
          "List the product categories, desired products or product codes, approximate quantity, delivery location, packing needs and whether the order is for retail, hospitality, gifting or distribution.",
          "If a catalogue item is only a starting point, mention the preferred material, colour, finish and use case so the team can respond with relevant options.",
        ],
      },
      {
        heading: "Confirm commercial details directly",
        body: [
          "MOQ, pricing, sample availability, payment terms, delivery timing and damage or transit policy are not published as fixed public values.",
          "Buyers should ask Hira Industries to confirm these details for the selected products before making commercial commitments.",
        ],
      },
    ],
    links: [
      { label: "Send a bulk order enquiry", href: "/contact?intent=bulk-details" },
      { label: "Request the product catalogue", href: "/downloads/product-catalogue" },
    ],
    faqs: [
      {
        question: "What should a bulk enquiry include?",
        answer:
          "A useful bulk enquiry includes product categories, quantity, destination, packing requirements and intended use such as retail, hotel, restaurant, gifting or wholesale.",
      },
    ],
  },
  {
    slug: "ceramic-vs-porcelain",
    title: "Ceramic vs Porcelain Crockery",
    description:
      "A buyer-friendly overview of ceramic and porcelain crockery differences, with guidance to confirm material and usage details before ordering.",
    intro:
      "Ceramic and porcelain are often compared by buyers reviewing dinnerware and tableware. The right choice depends on product design, material composition, firing, finish, handling needs and budget.",
    image: "/images/Quality Checking.png",
    sections: [
      {
        heading: "How to compare materials",
        body: [
          "Ceramic is a broad term that covers multiple clay-based tableware products. Porcelain is generally considered a refined ceramic material, but exact properties vary by product and production method.",
          "For buying decisions, ask for the actual product material and usage guidance rather than relying only on broad category labels.",
        ],
      },
      {
        heading: "Questions to ask before purchase",
        body: [
          "Confirm material, finish, colour options, care guidance, packing and whether the product is suitable for the intended home, retail or hospitality use.",
          "Do not assume microwave-safe or dishwasher-safe performance unless the supplier confirms it for the specific item.",
        ],
      },
    ],
    links: [
      { label: "Explore ceramic crockery products", href: "/products" },
      { label: "Ask about product material", href: "/contact" },
    ],
    faqs: [
      {
        question: "Are all ceramic products dishwasher-safe?",
        answer:
          "The website does not publish a universal dishwasher-safe claim. Buyers should confirm care guidance for the specific product before ordering.",
      },
    ],
  },
  {
    slug: "dinnerware-set-guide",
    title: "Dinnerware Set Buying Guide",
    description:
      "A practical dinnerware set guide for selecting ceramic plates, bowls, serving pieces and tea or coffee items for home, retail or hospitality use.",
    intro:
      "A dinnerware set should be selected by intended use, number of place settings, finish, colour, serving needs and replacement planning. Product details should be confirmed for the exact collection before ordering.",
    image: "/images/products/white-gold-rim-soup-bowl-plate.png",
    sections: [
      {
        heading: "Plan the table format",
        body: [
          "Start with the core items: dinner plates, quarter plates, bowls and serving pieces. Add cups, mugs or tea/coffee sets if the table format needs a coordinated presentation.",
          "For hospitality or retail, product codes and repeat availability are important so that the same collection can be referenced later.",
        ],
      },
      {
        heading: "Review finish and care needs",
        body: [
          "Gold rims, printed patterns, reactive glazes and textured finishes can change care requirements. Ask Hira Industries for care guidance for the selected collection.",
          "If the set contents are not listed on a product page, contact the team to confirm the current composition and available combinations.",
        ],
      },
    ],
    links: [
      { label: "Browse dinner set products", href: "/products?category=dinner-sets" },
      { label: "Request dinnerware set details", href: "/contact?intent=dinnerware" },
    ],
    faqs: [
      {
        question: "Are set contents fixed for every dinnerware product?",
        answer:
          "Not always. Buyers should confirm set contents for the selected product because public product pages may not include every current combination.",
      },
    ],
  },
] as const satisfies readonly ResourcePage[];

export function getResourcePage(slug: string) {
  return resourcePages.find((page) => page.slug === slug) ?? null;
}
