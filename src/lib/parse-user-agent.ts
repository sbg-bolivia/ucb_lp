/** Resumen legible del navegador / SO a partir del user-agent. */
export function parseUserAgentSummary(ua: string | null | undefined): string {
  if (!ua?.trim()) return "Desconocido";

  const s = ua;
  let browser = "Navegador";
  if (/Edg\//i.test(s)) browser = "Edge";
  else if (/Chrome\//i.test(s) && !/Chromium/i.test(s)) browser = "Chrome";
  else if (/Firefox\//i.test(s)) browser = "Firefox";
  else if (/Safari\//i.test(s) && !/Chrome/i.test(s)) browser = "Safari";
  else if (/OPR\//i.test(s)) browser = "Opera";

  let os = "SO desconocido";
  if (/Windows NT 10/i.test(s)) os = "Windows";
  else if (/Windows/i.test(s)) os = "Windows";
  else if (/Mac OS X/i.test(s)) os = "macOS";
  else if (/Android/i.test(s)) os = "Android";
  else if (/iPhone|iPad/i.test(s)) os = "iOS";
  else if (/Linux/i.test(s)) os = "Linux";

  const mobile = /Mobile|Android|iPhone/i.test(s) ? " · móvil" : "";
  return `${browser} · ${os}${mobile}`;
}
