import { ClubAwsServicesCatalog } from "@/components/club-landing/club-aws-services-catalog";
import { ClubPastelBlobs } from "@/components/club-landing/club-pastel-blobs";
import { ClubSiteBanners } from "@/components/club-landing/club-site-banners";
import { clubTheme } from "@/components/club-landing/club-theme";
import { isClubFeatureEnabled } from "@/lib/club-features";
import { clubPageMeta } from "@/lib/club-page-meta";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = clubPageMeta(
  "Servicios AWS",
  "Catálogo curado de servicios Amazon Web Services: cuándo usarlos, tips del club y recursos para estudiantes."
);

export default function ServiciosPage() {
  if (!isClubFeatureEnabled("awsServices")) {
    redirect("/");
  }

  return (
    <>
      <h1 className="sr-only">Servicios AWS</h1>
      <ClubSiteBanners placement="SERVICES_PAGE" variant="page" />
      <section className={`relative overflow-hidden ${clubTheme.sectionY} ${clubTheme.pageBg}`}>
        <ClubPastelBlobs />
        <div className={`relative ${clubTheme.container}`}>
          <ClubAwsServicesCatalog />
        </div>
      </section>
    </>
  );
}
