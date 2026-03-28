import type { Metadata } from "next";

export const defaultMetadata: Metadata = {
  title: {
    default:
      "AXIUM - Software Personalizado para Empresas | Desarrollo a Medida",
    template: "%s | AXIUM",
  },
  description:
    "AXIUM desarrolla software personalizado para empresas en crecimiento y grandes organizaciones. Soluciones enterprise-grade, aplicaciones web y móviles, automatización de procesos e IA. Tu socio tecnológico en Perú.",
  keywords: [
    "software personalizado",
    "desarrollo de software",
    "aplicaciones web",
    "aplicaciones móviles",
    "automatización de procesos",
    "inteligencia artificial",
    "desarrollo enterprise",
    "software a medida",
    "desarrollo de software Perú",
    "consultoría tecnológica",
    "arquitectura de software",
    "sistemas escalables",
    "transformación digital",
    "ingeniería de software",
    "desarrollo de productos",
  ],
  authors: [{ name: "AXIUM" }],
  creator: "AXIUM",
  publisher: "AXIUM",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.SITE_URL || "https://axium.com.pe"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: process.env.SITE_URL || "https://axium.com.pe",
    title: "AXIUM - Software Personalizado para Empresas | Desarrollo a Medida",
    description:
      "Desarrollamos software personalizado que transforma procesos manuales en sistemas eficientes y escalables. Soluciones enterprise-grade para empresas en crecimiento.",
    siteName: "AXIUM",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "AXIUM - Software Personalizado para Empresas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AXIUM - Software Personalizado para Empresas",
    description:
      "Desarrollamos software personalizado que transforma procesos manuales en sistemas eficientes y escalables.",
    images: ["/logo.png"],
    creator: "@axium",
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
    title: title ? `${title} | AXIUM` : defaultMetadata.title,
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

// Metadata específica para la página principal de AXIUM
export const homePageMetadata: Metadata = {
  title: "AXIUM - Software Personalizado para Empresas | Desarrollo a Medida",
  description:
    "AXIUM desarrolla software personalizado para empresas en crecimiento y grandes organizaciones. Soluciones enterprise-grade, aplicaciones web y móviles, automatización de procesos e IA. Tu socio tecnológico en Perú.",
  keywords: [
    "software personalizado",
    "desarrollo de software",
    "aplicaciones web",
    "aplicaciones móviles",
    "automatización de procesos",
    "inteligencia artificial",
    "desarrollo enterprise",
    "software a medida",
    "desarrollo de software Perú",
    "consultoría tecnológica",
    "arquitectura de software",
    "sistemas escalables",
    "transformación digital",
    "ingeniería de software",
    "desarrollo de productos",
  ],
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: process.env.SITE_URL || "https://axium.com.pe",
    title: "AXIUM - Software Personalizado para Empresas | Desarrollo a Medida",
    description:
      "Desarrollamos software personalizado que transforma procesos manuales en sistemas eficientes y escalables. Soluciones enterprise-grade para empresas en crecimiento.",
    siteName: "AXIUM",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "AXIUM - Software Personalizado para Empresas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AXIUM - Software Personalizado para Empresas",
    description:
      "Desarrollamos software personalizado que transforma procesos manuales en sistemas eficientes y escalables.",
    images: ["/logo.png"],
  },
};
