import { prisma } from "@/lib/db";
import { normalizeEnvValue } from "@/lib/normalize-env";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function sanitizeDatabaseError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);

  if (msg.includes('"postgresql') || msg.includes("'postgresql")) {
    return "DATABASE_URL tiene comillas literales. En Amplify pon el valor SIN comillas.";
  }
  if (msg.includes("Environment variable not found: DATABASE_URL")) {
    return "DATABASE_URL no está disponible en runtime. Guarda la variable en Amplify y haz Redeploy.";
  }
  if (
    msg.includes("ECONNREFUSED") ||
    msg.includes("ETIMEDOUT") ||
    msg.includes("timeout")
  ) {
    return "No se alcanza el RDS. Revisa: RDS público, security group (puerto 5432) y región us-east-1.";
  }
  if (msg.includes("password authentication failed")) {
    return "Usuario o contraseña de PostgreSQL incorrectos.";
  }
  if (msg.includes("does not exist") && msg.includes("database")) {
    return "La base de datos sbgbo_prod no existe en el servidor RDS.";
  }
  if (msg.includes("relation") && msg.includes("does not exist")) {
    return "Faltan tablas. Ejecuta prisma migrate deploy contra RDS (o revisa logs del build en Amplify).";
  }

  return msg.slice(0, 240);
}

export async function GET() {
  const rawDatabaseUrl = process.env.DATABASE_URL;
  const databaseUrl = normalizeEnvValue(rawDatabaseUrl);
  const hasDatabaseUrl = Boolean(databaseUrl);
  const hadQuotes =
    Boolean(rawDatabaseUrl?.trim()) &&
    rawDatabaseUrl?.trim() !== databaseUrl;

  const hasSiteUrl = Boolean(
    normalizeEnvValue(process.env.SITE_URL) ||
      normalizeEnvValue(process.env.NEXT_PUBLIC_SITE_URL)
  );

  let database = false;
  let databaseError: string | undefined;

  if (hasDatabaseUrl) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      database = true;
    } catch (err) {
      database = false;
      databaseError = sanitizeDatabaseError(err);
    }
  } else {
    databaseError =
      "DATABASE_URL vacía o no definida en el entorno de ejecución.";
  }

  const ok = hasDatabaseUrl && hasSiteUrl && database;

  return NextResponse.json(
    {
      ok,
      checks: {
        databaseUrl: hasDatabaseUrl,
        databaseUrlHadQuotes: hadQuotes,
        siteUrl: hasSiteUrl,
        database,
        databaseError,
      },
    },
    { status: ok ? 200 : 503 }
  );
}
