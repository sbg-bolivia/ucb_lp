import { prisma } from "@/lib/db";
import type { AuditAction } from "@prisma/client";

const MAX_CHANGES_BYTES = 12_000;

const SENSITIVE_KEYS = new Set([
  "password",
  "newpassword",
  "currentpassword",
  "confirmpassword",
  "token",
  "secret",
  "accesstoken",
  "refreshtoken",
  "bettermauthtoken",
]);

const RESOURCE_LABELS: Record<string, string> = {
  clubEvents: "evento",
  clubProjects: "proyecto",
  siteBanners: "banner",
  awsServices: "servicio AWS",
  awsCommunities: "comunidad AWS",
  companyInfo: "configuración del club",
  user: "usuario",
  rbac: "rol o permiso",
  uploads: "archivo S3",
  translation: "traducción",
};

const ROUTER_TO_RESOURCE: Record<string, string> = {
  clubEvents: "club_events",
  clubProjects: "club_projects",
  siteBanners: "site_banners",
  awsServices: "aws_services",
  awsCommunities: "aws_communities",
  companyInfo: "tenant_settings",
  user: "users",
  rbac: "rbac",
  uploads: "s3_uploads",
  translation: "translations",
};

function inferAction(procedure: string): AuditAction {
  const method = procedure.split(".").pop()?.toLowerCase() ?? "";
  if (method.includes("create") || method.includes("assign")) return "CREATE";
  if (method.includes("delete") || method.includes("remove")) return "DELETE";
  if (method.includes("restore")) return "RESTORE";
  if (method.includes("reorder")) return "REORDER";
  if (method.includes("update")) return "UPDATE";
  return "OTHER";
}

function sanitizeForAudit(value: unknown, depth = 0): unknown {
  if (depth > 6) return "[truncado]";
  if (value === null || value === undefined) return value;
  if (typeof value === "string") {
    return value.length > 500 ? `${value.slice(0, 500)}…` : value;
  }
  if (typeof value !== "object") return value;
  if (Array.isArray(value)) {
    return value.slice(0, 30).map((v) => sanitizeForAudit(v, depth + 1));
  }
  const out: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      out[key] = "[redactado]";
      continue;
    }
    out[key] = sanitizeForAudit(val, depth + 1);
  }
  return out;
}

function trimChanges(payload: unknown): unknown {
  const sanitized = sanitizeForAudit(payload);
  let json = JSON.stringify(sanitized);
  if (json.length <= MAX_CHANGES_BYTES) return sanitized;
  json = json.slice(0, MAX_CHANGES_BYTES);
  return { _truncated: true, preview: json };
}

function pickResourceId(
  input: unknown,
  resultData: unknown
): string | undefined {
  const fromInput =
    input && typeof input === "object" && "id" in input
      ? String((input as { id: unknown }).id)
      : undefined;
  if (fromInput) return fromInput.slice(0, 80);

  if (resultData && typeof resultData === "object" && "id" in resultData) {
    return String((resultData as { id: unknown }).id).slice(0, 80);
  }
  return undefined;
}

function buildSummary(
  procedure: string,
  input: unknown,
  resultData: unknown
): string {
  const [router, method] = procedure.split(".");
  const label = RESOURCE_LABELS[router ?? ""] ?? router ?? "recurso";
  const action = inferAction(procedure);

  const title =
    (input &&
      typeof input === "object" &&
      "title" in input &&
      (input as { title?: string }).title) ||
    (input &&
      typeof input === "object" &&
      "name" in input &&
      (input as { name?: string }).name) ||
    (resultData &&
      typeof resultData === "object" &&
      "title" in resultData &&
      (resultData as { title?: string }).title) ||
    (resultData &&
      typeof resultData === "object" &&
      "name" in resultData &&
      (resultData as { name?: string }).name);

  const named = title ? `: ${String(title).slice(0, 120)}` : "";

  switch (action) {
    case "CREATE":
      return `Creó ${label}${named}`;
    case "UPDATE":
      return `Actualizó ${label}${named}`;
    case "DELETE":
      return `Eliminó ${label}${named}`;
    case "RESTORE":
      return `Restauró versión de ${label}${named}`;
    case "REORDER":
      return `Reordenó ${label}`;
    default:
      return `${method ?? "Acción"} en ${label}${named}`;
  }
}

export type RecordAuditParams = {
  user: { id: string; email: string; name: string; tenantId: string | null };
  procedure: string;
  input: unknown;
  resultData?: unknown;
  ipAddress?: string | null;
  userAgent?: string | null;
};

export async function recordAuditLog(params: RecordAuditParams): Promise<void> {
  const { user, procedure, input, resultData, ipAddress, userAgent } = params;

  if (procedure.startsWith("auditLogs.")) return;

  const router = procedure.split(".")[0] ?? "unknown";
  const resource = ROUTER_TO_RESOURCE[router] ?? router;
  const action = inferAction(procedure);

  await prisma.auditLog.create({
    data: {
      tenantId: user.tenantId,
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      action,
      resource,
      resourceId: pickResourceId(input, resultData),
      summary: buildSummary(procedure, input, resultData).slice(0, 500),
      changes: trimChanges(input) as object,
      ipAddress: ipAddress ?? null,
      userAgent: userAgent ?? null,
      procedure,
    },
  });
}
