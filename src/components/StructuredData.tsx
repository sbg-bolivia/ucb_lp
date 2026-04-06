import {
  generateOrganizationSchema,
  generateWebSiteSchema,
} from "@/lib/structured-data";

export function StructuredData() {
  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for JSON-LD structured data
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateOrganizationSchema()),
        }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for JSON-LD structured data
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateWebSiteSchema()),
        }}
      />
    </>
  );
}
