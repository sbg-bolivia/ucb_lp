import { ClubAboutBanner } from "@/components/club-landing/club-about-banner";
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
      <ClubAboutBanner />
    </>
  );
}
