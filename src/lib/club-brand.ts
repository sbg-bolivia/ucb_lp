/** Marca y enlaces del AWS Student Builder Group UCB — ajusta NEXT_PUBLIC_* en .env */

export const CLUB = {
  shortName: "AWS Student Builder Group UCB",
  /** Texto junto al logo en la barra de navegación */
  navTitle: "AWS Student Builder Group at UCB",
  fullUniversity: 'Universidad Católica Boliviana "San Pablo"',
  heroLine1: "AWS Student Builder Group",
  tagline:
    "Únete a estudiantes universitarios en Bolivia que aprenden AWS, construyen proyectos reales en la nube y preparan su carrera en tecnología. ¡Todas las carreras son bienvenidas!",
  city: "La Paz, Bolivia",
  country: "BO",
  email: "awscloudclubucblapaz@gmail.com",
} as const;

/** URL del sitio en servidor (API, emails, SEO, Better Auth). */
export function getSiteUrl(): string {
  return (
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000"
  );
}

/**
 * URL base para el cliente (navegador).
 * `SITE_URL` no se expone al bundle del cliente; usa el origen actual o
 * `NEXT_PUBLIC_SITE_URL`.
 */
export function getClientSiteUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "http://localhost:3000"
  );
}
