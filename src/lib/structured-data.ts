import { CLUB, getSiteUrl } from "@/lib/club-brand";
import { CLUB_LINK_DEFAULTS } from "@/lib/club-default-links";

export function generateOrganizationSchema() {
  const siteUrl = getSiteUrl();
  const sameAs = [
    CLUB_LINK_DEFAULTS.linkedinUrl,
    CLUB_LINK_DEFAULTS.instagramUrl,
    CLUB_LINK_DEFAULTS.meetupUrl,
    CLUB_LINK_DEFAULTS.tiktokUrl,
    CLUB_LINK_DEFAULTS.whatsappUrl,
  ].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: CLUB.shortName,
    alternateName: CLUB.fullUniversity,
    description: CLUB.tagline,
    url: siteUrl,
    logo: `${siteUrl}/logo/AWS%20SBG%20UCB%20-%20La%20Paz%20-%20Negro.png`,
    email: CLUB.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "La Paz",
      addressCountry: CLUB.country,
    },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function generateWebSiteSchema() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: CLUB.shortName,
    description: CLUB.tagline,
    url: siteUrl,
    publisher: {
      "@type": "Organization",
      name: CLUB.shortName,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo/AWS%20SBG%20UCB%20-%20La%20Paz%20-%20Negro.png`,
      },
    },
  };
}
