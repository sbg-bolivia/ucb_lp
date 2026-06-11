import { ClubAboutCta } from "@/components/club-landing/club-about-cta";
import { ClubAboutPage } from "@/components/club-landing/club-about-page";
import { ClubAwsCommunitiesSection } from "@/components/club-landing/club-aws-communities-section";
import { clubPageMeta } from "@/lib/club-page-meta";
import type { Metadata } from "next";

export const metadata: Metadata = clubPageMeta(
  "Nosotros",
  "Conoce al AWS Student Builder Group UCB La Paz: misión, valores y cómo conectamos la universidad con el ecosistema cloud."
);

export default function NosotrosPage() {
  return (
    <>
      <h1 className="sr-only">Nosotros</h1>
      <ClubAboutPage />
      <ClubAwsCommunitiesSection />
      <ClubAboutCta />
    </>
  );
}
