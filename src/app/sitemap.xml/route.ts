import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl =
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  const staticPages = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/nosotros", priority: 0.9, changeFrequency: "weekly" as const },
    {
      path: "/beneficios",
      priority: 0.9,
      changeFrequency: "weekly" as const,
    },
    { path: "/eventos", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/equipo", priority: 0.85, changeFrequency: "monthly" as const },
    { path: "/unete", priority: 0.95, changeFrequency: "weekly" as const },
    { path: "/contacto", priority: 0.85, changeFrequency: "monthly" as const },
    {
      path: "/legal/terms",
      priority: 0.3,
      changeFrequency: "yearly" as const,
    },
    {
      path: "/legal/privacy",
      priority: 0.3,
      changeFrequency: "yearly" as const,
    },
    {
      path: "/legal/cookies",
      priority: 0.3,
      changeFrequency: "yearly" as const,
    },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map(
      (page) => `
  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join("")}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
