import { isClubFeatureEnabled } from "@/lib/club-features";

export type ClubNavLink = { href: string; label: string };

const BASE_NAV_LINKS: ClubNavLink[] = [
  { href: "/", label: "Inicio" },
  { href: "/eventos", label: "Eventos" },
  { href: "/equipo", label: "Comunidad" },
  { href: "/nosotros", label: "Sobre nosotros" },
];

/** Enlaces principales del navbar/footer según features activas. */
export function getClubNavLinks(): ClubNavLink[] {
  const links = [...BASE_NAV_LINKS];
  if (isClubFeatureEnabled("awsServices")) {
    links.splice(2, 0, { href: "/servicios", label: "Servicios AWS" });
  }
  if (isClubFeatureEnabled("projects")) {
    links.splice(2, 0, { href: "/proyectos", label: "Proyectos" });
  }
  return links;
}
