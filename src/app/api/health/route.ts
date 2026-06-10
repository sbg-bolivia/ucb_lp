import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const hasDatabaseUrl = Boolean(process.env.DATABASE_URL?.trim());
  const hasSiteUrl = Boolean(
    process.env.SITE_URL?.trim() || process.env.NEXT_PUBLIC_SITE_URL?.trim()
  );

  let database = false;
  if (hasDatabaseUrl) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      database = true;
    } catch {
      database = false;
    }
  }

  const ok = hasDatabaseUrl && hasSiteUrl && database;

  return NextResponse.json(
    {
      ok,
      checks: {
        databaseUrl: hasDatabaseUrl,
        siteUrl: hasSiteUrl,
        database,
      },
    },
    { status: ok ? 200 : 503 }
  );
}
