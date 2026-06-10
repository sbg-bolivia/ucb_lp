/** IP y user-agent del cliente (Amplify / proxy incluido). */
export type RequestMeta = {
  ip: string | null;
  userAgent: string | null;
};

const SENSITIVE_HEADERS = new Set(["authorization", "cookie", "x-api-key"]);

export function isSensitiveHeader(name: string): boolean {
  return SENSITIVE_HEADERS.has(name.toLowerCase());
}

export function getClientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.slice(0, 45);
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp.slice(0, 45);
  return null;
}

export function getRequestMeta(request: Request): RequestMeta {
  return {
    ip: getClientIp(request),
    userAgent: request.headers.get("user-agent")?.slice(0, 500) ?? null,
  };
}
