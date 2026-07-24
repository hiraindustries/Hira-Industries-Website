import type { JsonLdObject } from "@/lib/seo/json-ld";
import {
  businessProfile,
  getVerifiedPostalAddress,
  getVerifiedSocialProfileUrls,
  isVerifiedValue,
  withBusinessUrl,
} from "@/lib/site/business-info";

export const organizationId = `${businessProfile.websiteUrl}/#organization`;
export const localBusinessId = `${businessProfile.websiteUrl}/#local-business`;
export const websiteId = `${businessProfile.websiteUrl}/#website`;

export function buildOrganizationSchema(): JsonLdObject {
  return {
    "@type": "Organization",
    "@id": organizationId,
    name: businessProfile.officialName,
    url: withBusinessUrl("/"),
    logo: withBusinessUrl(businessProfile.logoPath),
    image: withBusinessUrl(businessProfile.defaultShareImagePath),
    description: businessProfile.description,
    email: businessProfile.email,
    telephone: businessProfile.telephone,
    areaServed: businessProfile.serviceArea,
    knowsAbout: businessProfile.knowsAbout,
    sameAs: getVerifiedSocialProfileUrls(),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: businessProfile.telephone,
      contactType: "customer support",
      areaServed: "IN",
      availableLanguage: ["en", "hi"],
    },
  };
}

export function buildLocalBusinessSchema(): JsonLdObject {
  const address = getVerifiedPostalAddress();
  const latitude = businessProfile.geo.latitude;
  const longitude = businessProfile.geo.longitude;

  return {
    "@type": "LocalBusiness",
    "@id": localBusinessId,
    name: businessProfile.officialName,
    url: withBusinessUrl("/"),
    image: withBusinessUrl(businessProfile.defaultShareImagePath),
    logo: withBusinessUrl(businessProfile.logoPath),
    description: businessProfile.description,
    telephone: businessProfile.telephone,
    email: businessProfile.email,
    address: address ?? undefined,
    geo:
      isVerifiedValue(latitude) && isVerifiedValue(longitude)
        ? {
            "@type": "GeoCoordinates",
            latitude,
            longitude,
          }
        : undefined,
    openingHours:
      businessProfile.openingHours.length > 0
        ? businessProfile.openingHours
        : undefined,
    areaServed: businessProfile.serviceArea,
    parentOrganization: {
      "@id": organizationId,
    },
  };
}

export function buildWebsiteSchema(): JsonLdObject {
  return {
    "@type": "WebSite",
    "@id": websiteId,
    name: businessProfile.officialName,
    url: withBusinessUrl("/"),
    inLanguage: "en-IN",
    publisher: {
      "@id": organizationId,
    },
  };
}

export function buildHomeGraphSchema(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildOrganizationSchema(),
      buildLocalBusinessSchema(),
      buildWebsiteSchema(),
    ],
  };
}
