import type { EventStatus, RegistrationType } from "@prisma/client";

export const REGISTRATION_TYPE_LABELS: Record<RegistrationType, string> = {
  MEETUP: "Meetup",
  YOUTUBE: "YouTube",
  GOOGLE_MEET: "Google Meet",
  ZOOM: "Zoom",
  TEAMS: "Microsoft Teams",
  EXTERNAL: "Enlace externo",
  NONE: "Sin registro",
};

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  DRAFT: "Borrador",
  UPCOMING: "Próximo",
  PAST: "Pasado",
  CANCELLED: "Cancelado",
};

/** Texto del botón de registro según tipo */
export function registrationButtonLabel(
  type: RegistrationType | null | undefined
): string {
  switch (type) {
    case "MEETUP":
      return "Inscribirse en Meetup";
    case "YOUTUBE":
      return "Ver en YouTube";
    case "GOOGLE_MEET":
      return "Unirse en Google Meet";
    case "ZOOM":
      return "Unirse en Zoom";
    case "TEAMS":
      return "Unirse en Teams";
    case "NONE":
      return "Ver más";
    default:
      return "Inscribirse / ver más";
  }
}
