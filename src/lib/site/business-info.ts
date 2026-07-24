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
    instagram: string | null;
    facebook: string | null;
    linkedin: string | null;
    youtube: string | null;
  };
  foundingDate: OptionalVerifiedValue;
  serviceArea: string[];
  knowsAbout: string[];
};

export const TODO_VERIFY = "TODO_VERIFY";

export const businessInfo = {
  name: "Hira Industries",
  location: "Khurja, Uttar Pradesh, India",
  city: "Khurja",
  state: "Uttar Pradesh",
  country: "India",
  countryCode: "IN",
  phoneDisplay: "+91 97838 05565",
  phoneE164: "+919783805565",
  whatsappNumber: "919783805565",
  whatsappUrl: "https://wa.me/919783805565",
  email: "hiraindustrieskhurja@gmail.com",
  instagramUrl: "https://www.instagram.com/hira_industries_khurja/",
  canonicalHost: "https://www.hiraindustrieskhurja.com",
  copyrightText: "© 2026 Hira Industries. All rights reserved.",
} as const;

export const businessProfile = {
  officialName: businessInfo.name,
  alternateName: businessInfo.name,
  websiteUrl: businessInfo.canonicalHost,
  description:
    "Hira Industries is a ceramic crockery manufacturer and supplier in Khurja, Uttar Pradesh, offering dinner sets, tea and coffee sets, cups, mugs, plates, bowls, serveware and hospitality crockery.",
  telephone: businessInfo.phoneE164,
  telephoneDisplay: businessInfo.phoneDisplay,
  whatsappNumber: businessInfo.whatsappNumber,
  email: businessInfo.email,
  address: {
    streetAddress: "",
    city: businessInfo.city,
    district: "",
    state: businessInfo.state,
    postalCode: "",
    country: businessInfo.countryCode,
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
    instagram: businessInfo.instagramUrl,
    facebook: null,
    linkedin: null,
    youtube: null,
  },
  // TODO_VERIFY: Add a founding date only after owner verification.
  foundingDate: null,
  serviceArea: [businessInfo.city, businessInfo.state, businessInfo.country],
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

export function createWhatsAppUrl(message?: string) {
  const normalizedMessage = message?.trim();

  if (!normalizedMessage) {
    return businessInfo.whatsappUrl;
  }

  return `${businessInfo.whatsappUrl}?text=${encodeURIComponent(normalizedMessage)}`;
}

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
    !isVerifiedValue(address.city) ||
    !isVerifiedValue(address.state) ||
    !isVerifiedValue(address.country)
  ) {
    return null;
  }

  return {
    "@type": "PostalAddress",
    streetAddress: isVerifiedValue(address.streetAddress)
      ? address.streetAddress
      : undefined,
    addressLocality: address.city,
    addressRegion: address.state,
    postalCode: isVerifiedValue(address.postalCode)
      ? address.postalCode
      : undefined,
    addressCountry: address.country,
  };
}
