import { ClubBenefits } from "@/components/club-landing/club-benefits";
import { clubPageMeta } from "@/lib/club-page-meta";
import type { Metadata } from "next";

export const metadata: Metadata = clubPageMeta(
  "Beneficios",
  "Por qué unirte al club: carrera, proyectos reales en la nube y comunidad en la UCB La Paz."
);

export default function BeneficiosPage() {
  return (
    <>
      <h1 className="sr-only">Beneficios</h1>
      <ClubBenefits />
    </>
  );
}
