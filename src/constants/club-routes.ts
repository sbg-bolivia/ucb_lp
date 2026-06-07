/** Rutas del sitio del club (shell con navbar/footer de marca). */
export const CLUB_MARKETING_PATHS = new Set([
  "/",
  "/nosotros",
  "/beneficios",
  "/eventos",
  "/proyectos",
  "/equipo",
  "/unete",
  "/contacto",
]);

const CLUB_MARKETING_PREFIXES = [
  "/eventos/",
  "/proyectos/",
  "/legal/",
] as const;

export function isClubMarketingPath(pathname: string | null): boolean {
  if (!pathname) return false;
  if (CLUB_MARKETING_PATHS.has(pathname)) return true;
  return CLUB_MARKETING_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}
