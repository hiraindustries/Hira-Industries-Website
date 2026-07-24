export type OptionalVerifiedValue = string | null;

export type BusinessProfile = {
  officialName: string;
  alternateName: string;
  websiteUrl: string;
  description: string;
  telephone: string;
  telephoneDisplay: string;
  whatsappNumber: string;
  email: string;
  address: {
    streetAddress: string;
    city: string;
    district: string;
    state: string;
    postalCode: string;
    country: string;
  };
  geo: {
    latitude: OptionalVerifiedValue;
    longitude: OptionalVerifiedValue;
  };
  openingHours: string[];
  logoPath: string;
  defaultShareImagePath: string;
  googleBusinessProfileUrl: string;
  socialProfiles: {
    instagram: string;
    facebook: string;
    linkedin: string;
    youtube: string;
  };
  foundingDate: OptionalVerifiedValue;
  serviceArea: string[];
  knowsAbout: string[];
};

const websiteUrl = "https://www.hiraindustrieskhurja.com";

export const TODO_VERIFY = "TODO_VERIFY";

export const businessProfile = {
  officialName: "Hira Industries",
  alternateName: "Hira Industries Khurja",
  websiteUrl,
  description:
    "Hira Industries is a ceramic crockery manufacturer and supplier in Khurja, Uttar Pradesh, offering dinner sets, tea and coffee sets, cups, mugs, plates, bowls, serveware and hospitality crockery.",
  telephone: "+919783805565",
  telephoneDisplay: "+91 97838 05565",
  whatsappNumber: "919783805565",
  email: "info@hiraindustries.com",
  address: {
    // TODO_VERIFY: Replace with the full verified street/factory/showroom address before adding PostalAddress JSON-LD.
    streetAddress: "TODO_VERIFY_FULL_ADDRESS",
    city: "Khurja",
    // TODO_VERIFY: Confirm the district from the business owner before publishing it in structured data.
    district: "TODO_VERIFY_DISTRICT",
    state: "Uttar Pradesh",
    // TODO_VERIFY: Confirm the postal code from the business owner before publishing it in structured data.
    postalCode: "TODO_VERIFY_POSTAL_CODE",
    country: "IN",
  },
  geo: {
    // TODO_VERIFY: Add verified coordinates only from the official business profile or owner.
    latitude: null,
    longitude: null,
  },
  // TODO_VERIFY: Add opening hours only after owner verification.
  openingHours: [],
  logoPath: "/images/Hira-Logo.png",
  defaultShareImagePath: "/images/build-pic-1.png",
  // TODO_VERIFY: Add the canonical Google Business Profile URL when the owner confirms it.
  googleBusinessProfileUrl: "TODO_VERIFY_GOOGLE_BUSINESS_PROFILE_URL",
  socialProfiles: {
    instagram: "https://www.instagram.com/hira_industries_khurja/",
    facebook: "TODO_VERIFY_FACEBOOK_URL",
    linkedin: "TODO_VERIFY_LINKEDIN_URL",
    youtube: "TODO_VERIFY_YOUTUBE_URL",
  },
  // TODO_VERIFY: Add a founding date only after owner verification.
  foundingDate: null,
  serviceArea: ["Khurja", "Uttar Pradesh", "India"],
  knowsAbout: [
    "Ceramic crockery",
    "Dinner sets",
    "Tea and coffee sets",
    "Cups and mugs",
    "Ceramic plates",
    "Ceramic bowls",
    "Serveware",
    "Hotel and restaurant crockery",
    "Bulk crockery enquiries",
  ],
} as const satisfies BusinessProfile;

export function isVerifiedValue(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    !value.includes(TODO_VERIFY)
  );
}

export function isVerifiedUrl(value: unknown): value is string {
  if (!isVerifiedValue(value)) {
    return false;
  }

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function withBusinessUrl(path: string) {
  if (!path) {
    return businessProfile.websiteUrl;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${businessProfile.websiteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getVerifiedSocialProfileUrls() {
  return [
    businessProfile.googleBusinessProfileUrl,
    businessProfile.socialProfiles.instagram,
    businessProfile.socialProfiles.facebook,
    businessProfile.socialProfiles.linkedin,
    businessProfile.socialProfiles.youtube,
  ].filter(isVerifiedUrl);
}

export function getVerifiedPostalAddress() {
  const { address } = businessProfile;

  if (
    !isVerifiedValue(address.streetAddress) ||
    !isVerifiedValue(address.city) ||
    !isVerifiedValue(address.state) ||
    !isVerifiedValue(address.postalCode) ||
    !isVerifiedValue(address.country)
  ) {
    return null;
  }

  return {
    "@type": "PostalAddress",
    streetAddress: address.streetAddress,
    addressLocality: address.city,
    addressRegion: address.state,
    postalCode: address.postalCode,
    addressCountry: address.country,
  };
}
