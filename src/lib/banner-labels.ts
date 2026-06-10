import type { BannerPlacement } from "@prisma/client";

export const BANNER_PLACEMENT_LABELS: Record<BannerPlacement, string> = {
  HOME_HERO: "Home — hero principal",
  HOME_SECONDARY: "Home — secundario",
  EVENTS_PAGE: "Página de eventos",
  SERVICES_PAGE: "Página de servicios",
};
