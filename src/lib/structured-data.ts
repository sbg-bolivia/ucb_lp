export function generateOrganizationSchema() {
  const siteUrl = process.env.SITE_URL || "https://axium.com.pe";
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AXIUM",
    legalName: "AXIUM",
    description:
      "AXIUM desarrolla software personalizado para empresas en crecimiento y grandes organizaciones. Soluciones enterprise-grade, aplicaciones web y móviles, automatización de procesos e IA.",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    foundingDate: "2020",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lima",
      addressCountry: "PE",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: "contacto@axium.com.pe",
        telephone: "+51999999999",
        availableLanguage: ["Spanish", "English"],
      },
    ],
    sameAs: [
      // Agregar URLs de redes sociales cuando estén disponibles
      // "https://twitter.com/axium",
      // "https://linkedin.com/company/axium",
      // "https://facebook.com/axium"
    ],
  };
}

export function generateWebSiteSchema() {
  const siteUrl = process.env.SITE_URL || "https://axium.com.pe";
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AXIUM",
    description:
      "AXIUM desarrolla software personalizado para empresas en crecimiento y grandes organizaciones. Soluciones enterprise-grade, aplicaciones web y móviles, automatización de procesos e IA.",
    url: siteUrl,
    publisher: {
      "@type": "Organization",
      name: "AXIUM",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateSoftwareApplicationSchema() {
  const siteUrl = process.env.SITE_URL || "https://axium.com.pe";
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "AXIUM Software Development Services",
    description:
      "Servicios de desarrollo de software personalizado para empresas. Aplicaciones web, móviles, automatización de procesos e inteligencia artificial.",
    url: siteUrl,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web Browser, iOS, Android",
    offers: {
      "@type": "Offer",
      priceCurrency: "PEN",
      availability: "https://schema.org/InStock",
    },
  };
}

// Schema para LocalBusiness (AXIUM como empresa local en Perú)
export function generateLocalBusinessSchema() {
  const siteUrl = process.env.SITE_URL || "https://axium.com.pe";
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}#business`,
    name: "AXIUM",
    description:
      "Desarrollo de software personalizado, aplicaciones web y móviles, automatización de procesos e inteligencia artificial para empresas en Perú.",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    image: `${siteUrl}/logo.png`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lima",
      addressCountry: "PE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "-12.0464",
      longitude: "-77.0428",
    },
    telephone: "+51999999999",
    email: "contacto@axium.com.pe",
    priceRange: "$$",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    areaServed: {
      "@type": "Country",
      name: "Perú",
    },
  };
}

// Schema para servicios de AXIUM
export function generateServiceSchema() {
  const siteUrl = process.env.SITE_URL || "https://axium.com.pe";
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Software Development",
    provider: {
      "@type": "Organization",
      name: "AXIUM",
      url: siteUrl,
    },
    areaServed: {
      "@type": "Country",
      name: "Perú",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servicios de Desarrollo de Software",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Software a Medida",
            description:
              "Desarrollo de soluciones enterprise-grade adaptadas a tu arquitectura de negocio, con integraciones nativas y escalabilidad garantizada.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Aplicaciones Web",
            description:
              "Desarrollo de aplicaciones web modernas, responsivas y escalables con las mejores tecnologías del mercado.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Aplicaciones Móviles",
            description:
              "Desarrollo de aplicaciones móviles nativas e híbridas para iOS y Android.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Automatización de Procesos",
            description:
              "Automatización de procesos empresariales para mejorar la eficiencia y reducir costos operativos.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Analítica Predictiva e IA",
            description:
              "Implementación de soluciones de inteligencia artificial y analítica predictiva para toma de decisiones inteligente.",
          },
        },
      ],
    },
  };
}
