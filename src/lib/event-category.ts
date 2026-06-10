export type EventFilterCategory =
  | "all"
  | "workshop"
  | "talk"
  | "certification"
  | "networking";

export const EVENT_FILTER_LABELS: Record<EventFilterCategory, string> = {
  all: "Todos",
  workshop: "Talleres",
  talk: "Charlas",
  certification: "Certificaciones",
  networking: "Networking",
};

/** Clasifica eventos por título/descripción (sin campo extra en BD). */
export function inferEventCategory(event: {
  title: string;
  description?: string | null;
}): Exclude<EventFilterCategory, "all"> {
  const text = `${event.title} ${event.description ?? ""}`.toLowerCase();

  if (/network|alumni|café|networking|egresad/i.test(text)) {
    return "networking";
  }
  if (/certif|practitioner|examen|simulacro|ruta cloud/i.test(text)) {
    return "certification";
  }
  if (/charla|talk|invitad|sesión|conferencia/i.test(text)) {
    return "talk";
  }
  if (/workshop|taller|lab|hands-on|buildathon|gameday|práctic/i.test(text)) {
    return "workshop";
  }

  return "workshop";
}

export function matchesEventFilter(
  event: { title: string; description?: string | null },
  filter: EventFilterCategory
): boolean {
  if (filter === "all") return true;
  return inferEventCategory(event) === filter;
}
