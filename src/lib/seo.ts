import type { Metadata } from "next";

import { CLUB } from "@/lib/club-brand";

const siteUrl =
  process.env.SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "http://localhost:3000";

const defaultTitle = `${CLUB.shortName} | ${CLUB.fullUniversity}`;
const defaultDescription = `${CLUB.shortName} en la ${CLUB.fullUniversity}: comunidad estudiantil, AWS, proyectos en la nube y certificaciones. ${CLUB.tagline}`;

export const defaultMetadata: Metadata = {
  title: {
    default: defaultTitle,
    template: `%s | ${CLUB.shortName}`,
  },
  description: defaultDescription,
  keywords: [
    "AWS",
    "AWS Student Builder Group",
    "AWS SBG",
    "UCB",
    "Universidad Católica Boliviana",
    "San Pablo",
    "cloud computing",
    "Bolivia",
    "estudiantes",
    "AWS Educate",
    "comunidad tech",
  ],
  authors: [{ name: CLUB.shortName }],
  creator: CLUB.shortName,
  publisher: CLUB.shortName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      {
        url: "/logo/AWS SBG UCB - La Paz - Blanco.svg",
        type: "image/svg+xml",
      },
      { url: "/logo/AWS SBG UCB - La Paz - Blanco.svg", sizes: "any" },
    ],
    shortcut: "/logo/AWS SBG UCB - La Paz - Blanco.svg",
    apple: "/logo/AWS SBG UCB - La Paz - Blanco.svg",
  },
  openGraph: {
    type: "website",
    locale: "es_BO",
    url: siteUrl,
    title: defaultTitle,
    description: defaultDescription,
    siteName: CLUB.shortName,
    images: [
      {
        url: "/logo/AWS SBG UCB - La Paz - Negro.png",
        width: 1200,
        height: 630,
        alt: `${CLUB.shortName} — ${CLUB.fullUniversity}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/logo/AWS SBG UCB - La Paz - Negro.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
  },
};

export function generateMetadata({
  title,
  description,
  keywords,
  image,
}: {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
}): Metadata {
  return {
    title: title ? `${title} | ${CLUB.shortName}` : defaultMetadata.title,
    description: description || defaultMetadata.description,
    keywords: keywords || defaultMetadata.keywords,
    openGraph: {
      ...defaultMetadata.openGraph,
      title: title || defaultMetadata.openGraph?.title,
      description: description || defaultMetadata.openGraph?.description,
      images: image ? [{ url: image }] : defaultMetadata.openGraph?.images,
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: title || defaultMetadata.twitter?.title,
      description: description || defaultMetadata.twitter?.description,
      images: image ? [image] : defaultMetadata.twitter?.images,
    },
  };
}

export const homePageMetadata: Metadata = {
  title: defaultTitle,
  description: defaultDescription,
  keywords: defaultMetadata.keywords as string[],
  openGraph: {
    type: "website",
    locale: "es_BO",
    url: siteUrl,
    title: defaultTitle,
    description: defaultDescription,
    siteName: CLUB.shortName,
    images: [
      {
        url: "/logo/AWS SBG UCB - La Paz - Negro.png",
        width: 1200,
        height: 630,
        alt: `${CLUB.shortName} — ${CLUB.fullUniversity}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/logo/AWS SBG UCB - La Paz - Negro.png"],
  },
};
