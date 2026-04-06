/** Rutas del sitio del club (shell con navbar/footer de marca). */
export const CLUB_MARKETING_PATHS = new Set([
  "/",
  "/nosotros",
  "/beneficios",
  "/eventos",
  "/equipo",
  "/unete",
  "/contacto",
]);

export function isClubMarketingPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return CLUB_MARKETING_PATHS.has(pathname);
}
