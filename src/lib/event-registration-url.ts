import type { RegistrationType } from "@prisma/client";

function isDashboardOrRelativeUrl(url: string): boolean {
  const t = url.trim();
  if (!t) return true;
  if (t.startsWith("/dashboard") || t.startsWith("/login")) return true;
  try {
    const parsed = new URL(t);
    if (parsed.pathname.startsWith("/dashboard")) return true;
  } catch {
    return true;
  }
  return false;
}

/** URL externa válida para registro / inscripción de un evento. */
export function resolveEventRegistrationUrl(
  event: {
    registrationUrl?: string | null;
    externalUrl?: string | null;
    registrationType?: RegistrationType | null;
  },
  clubMeetupUrl?: string | null
): string | null {
  const candidates = [event.registrationUrl, event.externalUrl]
    .map((u) => u?.trim())
    .filter((u): u is string => Boolean(u));

  for (const url of candidates) {
    if (!isDashboardOrRelativeUrl(url)) return url;
  }

  const meetup = clubMeetupUrl?.trim();
  if (meetup && !isDashboardOrRelativeUrl(meetup)) {
    if (
      event.registrationType === "MEETUP" ||
      event.registrationType === "EXTERNAL" ||
      event.registrationType === "NONE" ||
      !event.registrationType ||
      candidates.length > 0
    ) {
      return meetup;
    }
  }

  return null;
}

/** Solo enlaces http(s) — evita rutas internas mal configuradas. */
export function safeExternalHref(url: string | null | undefined): string | null {
  const t = url?.trim();
  if (!t?.startsWith("http://") && !t?.startsWith("https://")) return null;
  if (isDashboardOrRelativeUrl(t)) return null;
  return t;
}
