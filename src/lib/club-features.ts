/**
 * Flags de funcionalidades del sitio. Activar cuando el core team esté listo.
 */
export const CLUB_FEATURES = {
  /** Sección pública y admin de proyectos del club */
  projects: false,
  /** Sincronización automática con Meetup API (requiere Meetup Pro) */
  meetupSync: false,
  /** Catálogo público de servicios AWS (/servicios) */
  awsServices: true,
  /** Mapa de otras comunidades AWS en /nosotros */
  awsCommunitiesMap: true,
} as const;

export type ClubFeature = keyof typeof CLUB_FEATURES;

export function isClubFeatureEnabled(feature: ClubFeature): boolean {
  return CLUB_FEATURES[feature];
}
