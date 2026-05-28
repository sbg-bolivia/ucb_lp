import { ClubCoreTeam } from "@/components/club-landing/club-core-team";
import { clubPageMeta } from "@/lib/club-page-meta";
import type { Metadata } from "next";

export const metadata: Metadata = clubPageMeta(
  "Core team",
  "Conoce al equipo que lidera el AWS Student Builder Group UCB La Paz: roles y enlaces a redes."
);

export default function EquipoPage() {
  return (
    <>
      <h1 className="sr-only">Core team</h1>
      <ClubCoreTeam />
    </>
  );
}
