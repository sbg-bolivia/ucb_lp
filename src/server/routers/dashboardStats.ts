import { TRPCError } from "@trpc/server";
import { GA_TRACKING_ID } from "../../lib/analytics";
import { parseReferrerSource } from "../../lib/device-type";
import { prisma } from "../../lib/db";
import {
  fetchGa4TrafficReport,
  isGa4DataApiConfigured,
} from "../../lib/ga4-data-api";
import { hasAdminOrContentPermission } from "../../services/rbacService";
import { PermissionAction } from "../../types/rbac";
import { protectedProcedure, router } from "../trpc";

async function assertDashboardRead(userId: string, tenantId: string) {
  const ok = await hasAdminOrContentPermission(
    userId,
    PermissionAction.READ,
    tenantId
  );
  if (!ok) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Sin permiso" });
  }
}

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function aggregateCounts(
  rows: Array<{ value: string | null; count: number }>
): Array<{ label: string; count: number }> {
  const map = new Map<string, number>();
  for (const row of rows) {
    const label = row.value?.trim() || "Otro";
    map.set(label, (map.get(label) ?? 0) + row.count);
  }
  return Array.from(map.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

export const dashboardStatsRouter = router({
  getOverview: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user.tenantId) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Sin tenant" });
    }
    await assertDashboardRead(ctx.user.id, ctx.user.tenantId);

    const tenantId = ctx.user.tenantId;
    const now = new Date();
    const last7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      users,
      eventsPublished,
      eventsTotal,
      servicesPublished,
      communitiesPublished,
      projectsPublished,
      views7d,
      views30d,
      topPages,
      dailyViews,
      referrerHits,
      deviceHits,
      ga4Report,
    ] = await Promise.all([
      prisma.user.count({ where: { tenantId } }),
      prisma.clubEvent.count({
        where: { tenantId, isPublished: true },
      }),
      prisma.clubEvent.count({ where: { tenantId } }),
      prisma.awsService.count({
        where: { tenantId, isPublished: true },
      }),
      prisma.awsCommunity.count({
        where: { tenantId, isPublished: true },
      }),
      prisma.clubProject.count({
        where: { tenantId, isPublished: true },
      }),
      prisma.pageViewHit.count({
        where: { createdAt: { gte: last7 } },
      }),
      prisma.pageViewHit.count({
        where: { createdAt: { gte: last30 } },
      }),
      prisma.pageViewHit.groupBy({
        by: ["path"],
        where: { createdAt: { gte: last30 } },
        _count: { path: true },
        orderBy: { _count: { path: "desc" } },
        take: 8,
      }),
      prisma.pageViewHit.findMany({
        where: { createdAt: { gte: last30 } },
        select: { createdAt: true },
      }),
      prisma.pageViewHit.findMany({
        where: { createdAt: { gte: last30 } },
        select: { referrer: true },
      }),
      prisma.pageViewHit.groupBy({
        by: ["deviceType"],
        where: { createdAt: { gte: last30 } },
        _count: { deviceType: true },
      }),
      isGa4DataApiConfigured() ? fetchGa4TrafficReport() : Promise.resolve(null),
    ]);

    const dayMap = new Map<string, number>();
    for (let i = 6; i >= 0; i--) {
      const d = startOfDay(new Date(now.getTime() - i * 24 * 60 * 60 * 1000));
      dayMap.set(d.toISOString().slice(0, 10), 0);
    }
    for (const hit of dailyViews) {
      const key = startOfDay(hit.createdAt).toISOString().slice(0, 10);
      if (dayMap.has(key)) {
        dayMap.set(key, (dayMap.get(key) ?? 0) + 1);
      }
    }

    const sourceMap = new Map<string, number>();
    for (const hit of referrerHits) {
      const label = parseReferrerSource(hit.referrer);
      sourceMap.set(label, (sourceMap.get(label) ?? 0) + 1);
    }
    const internalSources = Array.from(sourceMap.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const internalDevices = aggregateCounts(
      deviceHits.map((d) => ({
        value: d.deviceType,
        count: d._count.deviceType,
      }))
    );

    return {
      content: {
        users,
        eventsPublished,
        eventsTotal,
        servicesPublished,
        communitiesPublished,
        projectsPublished,
      },
      traffic: {
        views7d,
        views30d,
        topPages: topPages.map((p) => ({
          path: p.path,
          views: p._count.path,
        })),
        last7Days: Array.from(dayMap.entries()).map(([date, views]) => ({
          date,
          views,
        })),
        sources: internalSources,
        devices: internalDevices,
      },
      integrations: {
        googleAnalyticsConfigured: Boolean(GA_TRACKING_ID),
        googleAnalyticsId: GA_TRACKING_ID ? "•••• configurado" : null,
        ga4DataApiConfigured: isGa4DataApiConfigured(),
        ga4: ga4Report
          ? {
              sources: ga4Report.sources.map((s) => ({
                label: s.dimension,
                count: s.metric,
              })),
              devices: ga4Report.devices.map((d) => ({
                label: d.dimension,
                count: d.metric,
              })),
            }
          : null,
      },
    };
  }),

  getAlerts: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user.tenantId) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Sin tenant" });
    }
    await assertDashboardRead(ctx.user.id, ctx.user.tenantId);

    const tenantId = ctx.user.tenantId;
    const now = new Date();
    const in48h = new Date(now.getTime() + 48 * 60 * 60 * 1000);
    const in7d = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const [upcomingEvents, expiringBanners, draftEvents] = await Promise.all([
      prisma.clubEvent.findMany({
        where: {
          tenantId,
          startsAt: { gte: now, lte: in48h },
        },
        orderBy: { startsAt: "asc" },
        take: 6,
        select: {
          id: true,
          title: true,
          startsAt: true,
          isPublished: true,
        },
      }),
      prisma.siteBanner.findMany({
        where: {
          tenantId,
          isActive: true,
          endsAt: { gte: now, lte: in7d },
        },
        orderBy: { endsAt: "asc" },
        take: 5,
        select: {
          id: true,
          title: true,
          endsAt: true,
        },
      }),
      prisma.clubEvent.count({
        where: { tenantId, isPublished: false },
      }),
    ]);

    return {
      upcomingEvents,
      expiringBanners,
      draftEvents,
    };
  }),
});
