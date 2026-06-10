import { parseDeviceType } from "@/lib/device-type";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

const MAX_PATH = 500;
const ALLOWED_PREFIXES = [
  "/",
  "/eventos",
  "/servicios",
  "/equipo",
  "/nosotros",
  "/unete",
  "/legal",
];

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      path?: string;
      referrer?: string;
      userAgent?: string;
    };
    const path = body.path?.trim();
    const referrer = body.referrer?.trim().slice(0, 500) || null;
    const deviceType = parseDeviceType(body.userAgent);

    if (!path || path.length > MAX_PATH) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const allowed = ALLOWED_PREFIXES.some(
      (prefix) => path === prefix || path.startsWith(`${prefix}/`)
    );
    if (!allowed) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const tenant = await prisma.tenant.findFirst({
      where: { isActive: true },
      select: { id: true },
    });

    await prisma.pageViewHit.create({
      data: {
        path,
        referrer,
        deviceType,
        tenantId: tenant?.id ?? null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
