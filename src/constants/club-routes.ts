import { isClubFeatureEnabled } from "@/lib/club-features";

/** Rutas del sitio del club (shell con navbar/footer de marca). */
const BASE_MARKETING_PATHS = [
  "/",
  "/nosotros",
  "/beneficios",
  "/eventos",
  "/equipo",
  "/unete",
  "/contacto",
] as const;

const CLUB_MARKETING_PREFIXES = ["/eventos/", "/legal/"] as const;

function buildMarketingPaths(): Set<string> {
  const paths = new Set<string>(BASE_MARKETING_PATHS);
  if (isClubFeatureEnabled("projects")) {
    paths.add("/proyectos");
  }
  if (isClubFeatureEnabled("awsServices")) {
    paths.add("/servicios");
  }
  return paths;
}

export const CLUB_MARKETING_PATHS = buildMarketingPaths();

function buildMarketingPrefixes(): readonly string[] {
  const prefixes: string[] = [...CLUB_MARKETING_PREFIXES];
  if (isClubFeatureEnabled("projects")) {
    prefixes.push("/proyectos/");
  }
  if (isClubFeatureEnabled("awsServices")) {
    prefixes.push("/servicios/");
  }
  return prefixes;
}

export function isClubMarketingPath(pathname: string | null): boolean {
  if (!pathname) return false;
  if (CLUB_MARKETING_PATHS.has(pathname)) return true;
  return buildMarketingPrefixes().some((prefix) =>
    pathname.startsWith(prefix)
  );
}
