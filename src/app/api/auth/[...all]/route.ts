import { auth } from "@/lib/auth";
import { getRequestMeta } from "@/lib/request-meta";
import { recordAuthAuditEvent } from "@/services/auditService";
import { toNextJsHandler } from "better-auth/next-js";

const handler = toNextJsHandler(auth);

function normalizeAuthPath(path: string): string {
  return path.replace(/\/+$/, "") || "/";
}

function authSubPath(req: Request): string {
  const url = new URL(req.url);
  const marker = "/api/auth";
  const idx = url.pathname.indexOf(marker);
  if (idx === -1) return normalizeAuthPath(url.pathname);
  return normalizeAuthPath(url.pathname.slice(idx + marker.length) || "/");
}

function mergeResponseCookies(
  requestHeaders: Headers,
  responseHeaders: Headers
): Headers {
  const merged = new Headers(requestHeaders);
  const setCookies =
    typeof responseHeaders.getSetCookie === "function"
      ? responseHeaders.getSetCookie()
      : [];
  if (setCookies.length > 0) {
    merged.set("cookie", setCookies.map((c) => c.split(";")[0]).join("; "));
  }
  return merged;
}

async function resolveLoginUserId(
  req: Request,
  response: Response
): Promise<string | undefined> {
  if (response.status === 200) {
    try {
      const data = (await response.clone().json()) as {
        user?: { id: string };
      };
      if (data.user?.id) return data.user.id;
    } catch {
      // respuesta no JSON
    }
  }

  try {
    const session = await auth.api.getSession({
      headers: mergeResponseCookies(req.headers, response.headers),
    });
    return session?.user?.id;
  } catch {
    return undefined;
  }
}

async function auditSignIn(req: Request, response: Response) {
  const path = authSubPath(req);
  const meta = getRequestMeta(req);

  if (path === "/sign-in/email") {
    if (response.status !== 200) return;
    const userId = await resolveLoginUserId(req, response);
    if (!userId) return;
    await recordAuthAuditEvent({
      action: "LOGIN",
      userId,
      ipAddress: meta.ip,
      userAgent: meta.userAgent,
      provider: "email",
    });
    return;
  }

  if (path.startsWith("/callback/")) {
    const provider = path.replace("/callback/", "").split("/")[0] ?? "social";
    const isRedirect = response.status >= 300 && response.status < 400;
    if (!isRedirect && response.status !== 200) return;

    const userId = await resolveLoginUserId(req, response);
    if (!userId) return;

    await recordAuthAuditEvent({
      action: "LOGIN",
      userId,
      ipAddress: meta.ip,
      userAgent: meta.userAgent,
      provider,
    });
  }
}

async function auditSignOut(userId: string, req: Request) {
  const meta = getRequestMeta(req);
  await recordAuthAuditEvent({
    action: "LOGOUT",
    userId,
    ipAddress: meta.ip,
    userAgent: meta.userAgent,
  });
}

async function runAuthAudit(
  req: Request,
  response: Response,
  logoutUserId?: string
) {
  await Promise.all([
    auditSignIn(req, response),
    logoutUserId ? auditSignOut(logoutUserId, req) : Promise.resolve(),
  ]);
}

export async function GET(req: Request) {
  const response = await handler.GET(req);
  try {
    await auditSignIn(req, response);
  } catch (err) {
    console.error("[audit] login (GET)", err);
  }
  return response;
}

export async function POST(req: Request) {
  const path = authSubPath(req);
  let logoutUserId: string | undefined;

  if (path === "/sign-out") {
    const session = await auth.api.getSession({ headers: req.headers });
    logoutUserId = session?.user?.id;
  }

  const response = await handler.POST(req);

  try {
    await runAuthAudit(req, response, logoutUserId);
  } catch (err) {
    console.error("[audit] auth", err);
  }

  return response;
}
