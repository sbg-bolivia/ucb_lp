export type DeviceType = "mobile" | "tablet" | "desktop" | "other";

export function parseDeviceType(userAgent: string | null | undefined): DeviceType {
  if (!userAgent) return "other";
  if (/iPad|Tablet|PlayBook|Silk/i.test(userAgent)) return "tablet";
  if (/Mobi|Android|iPhone|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
    return "mobile";
  }
  if (/Windows|Macintosh|Linux|CrOS/i.test(userAgent)) return "desktop";
  return "other";
}

export function parseReferrerSource(referrer: string | null | undefined): string {
  if (!referrer?.trim()) return "Directo";
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    return host || "Directo";
  } catch {
    return "Otro";
  }
}
