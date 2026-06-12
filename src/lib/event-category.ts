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

export const EVENT_CATEGORY_VALUES = [
  "workshop",
  "talk",
  "certification",
  "networking",
] as const;

export type EventCategoryValue = (typeof EVENT_CATEGORY_VALUES)[number];

export const EVENT_CATEGORY_LABELS: Record<EventCategoryValue, string> = {
  workshop: "Taller práctico",
  talk: "Charla",
  certification: "Certificación",
  networking: "Networking",
};

/** Clasifica eventos por categoría guardada o, si falta, por título/descripción. */
export function inferEventCategory(event: {
  title: string;
  description?: string | null;
  category?: string | null;
}): Exclude<EventFilterCategory, "all"> {
  if (
    event.category &&
    EVENT_CATEGORY_VALUES.includes(event.category as EventCategoryValue)
  ) {
    return event.category as EventCategoryValue;
  }
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
  event: {
    title: string;
    description?: string | null;
    category?: string | null;
  },
  filter: EventFilterCategory
): boolean {
  if (filter === "all") return true;
  return inferEventCategory(event) === filter;
}
