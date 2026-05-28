import { ClubActivities } from "@/components/club-landing/club-activities";
import { clubPageMeta } from "@/lib/club-page-meta";
import type { Metadata } from "next";

export const metadata: Metadata = clubPageMeta(
  "Eventos y actividades",
  "Talleres, charlas, labs con AWS y networking. Actividades del AWS Student Builder Group UCB La Paz."
);

export default function EventosPage() {
  return (
    <>
      <h1 className="sr-only">Eventos y actividades</h1>
      <ClubActivities />
    </>
  );
}
