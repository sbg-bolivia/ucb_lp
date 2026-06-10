import { prisma } from "@/lib/db";
import type { AuditAction } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { adminProcedure, router } from "../trpc";

const ACTION_LABELS: Record<AuditAction, string> = {
  CREATE: "Creación",
  UPDATE: "Actualización",
  DELETE: "Eliminación",
  RESTORE: "Restauración",
  REORDER: "Reorden",
  LOGIN: "Inicio de sesión",
  LOGOUT: "Cierre de sesión",
  OTHER: "Otro",
};

const RESOURCE_LABELS: Record<string, string> = {
  club_events: "Eventos",
  club_projects: "Proyectos",
  site_banners: "Banners",
  aws_services: "Servicios AWS",
  aws_communities: "Comunidades",
  tenant_settings: "Configuración",
  users: "Usuarios",
  rbac: "Roles y permisos",
  s3_uploads: "Archivos S3",
  translations: "Traducciones",
  auth_sessions: "Sesiones",
};

export const auditLogsRouter = router({
  list: adminProcedure
    .input(
      z
        .object({
          cursor: z.string().optional(),
          limit: z.number().min(1).max(100).default(30),
          userId: z.string().optional(),
          action: z
            .enum([
              "CREATE",
              "UPDATE",
              "DELETE",
              "RESTORE",
              "REORDER",
              "LOGIN",
              "LOGOUT",
              "OTHER",
            ])
            .optional(),
          resource: z.string().optional(),
          search: z.string().max(120).optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.user.tenantId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Sin tenant" });
      }

      const limit = input?.limit ?? 30;
      const search = input?.search?.trim();
      const tenantId = ctx.user.tenantId;
      const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const tenantScope = {
        OR: [
          { tenantId },
          { user: { tenantId } },
        ],
      };

      const items = await prisma.auditLog.findMany({
        where: {
          ...tenantScope,
          ...(input?.userId ? { userId: input.userId } : {}),
          ...(input?.action ? { action: input.action } : {}),
          ...(input?.resource ? { resource: input.resource } : {}),
          ...(search
            ? {
                OR: [
                  { summary: { contains: search, mode: "insensitive" } },
                  { userEmail: { contains: search, mode: "insensitive" } },
                  { userName: { contains: search, mode: "insensitive" } },
                  { ipAddress: { contains: search } },
                ],
              }
            : {}),
        },
        orderBy: { createdAt: "desc" },
        take: limit + 1,
        ...(input?.cursor ? { cursor: { id: input.cursor }, skip: 1 } : {}),
      });

      let nextCursor: string | undefined;
      if (items.length > limit) {
        const next = items.pop();
        nextCursor = next?.id;
      }

      const users = await prisma.auditLog.findMany({
        where: tenantScope,
        distinct: ["userId"],
        select: {
          userId: true,
          userEmail: true,
          userName: true,
        },
        orderBy: { userEmail: "asc" },
      });

      const resources = await prisma.auditLog.findMany({
        where: tenantScope,
        distinct: ["resource"],
        select: { resource: true },
        orderBy: { resource: "asc" },
      });

      const [total24h, loginsToday, logoutsToday, mutationsToday, recentLogins] =
        await Promise.all([
          prisma.auditLog.count({
            where: { ...tenantScope, createdAt: { gte: since24h } },
          }),
          prisma.auditLog.count({
            where: {
              ...tenantScope,
              action: "LOGIN",
              createdAt: { gte: startOfDay },
            },
          }),
          prisma.auditLog.count({
            where: {
              ...tenantScope,
              action: "LOGOUT",
              createdAt: { gte: startOfDay },
            },
          }),
          prisma.auditLog.count({
            where: {
              ...tenantScope,
              action: { in: ["CREATE", "UPDATE", "DELETE", "RESTORE", "REORDER"] },
              createdAt: { gte: startOfDay },
            },
          }),
          prisma.auditLog.findMany({
            where: { ...tenantScope, action: "LOGIN" },
            orderBy: { createdAt: "desc" },
            take: 8,
            select: {
              id: true,
              createdAt: true,
              userName: true,
              userEmail: true,
              ipAddress: true,
              summary: true,
              changes: true,
            },
          }),
        ]);

      const authMeta = (changes: unknown) => {
        if (!changes || typeof changes !== "object") {
          return { providerLabel: null as string | null, deviceLabel: null as string | null };
        }
        const c = changes as { provider?: string; device?: string };
        const labels: Record<string, string> = {
          email: "Correo",
          credential: "Correo",
          google: "Google",
          github: "GitHub",
          social: "Red social",
        };
        return {
          providerLabel: c.provider ? (labels[c.provider] ?? c.provider) : null,
          deviceLabel: c.device ?? null,
        };
      };

      return {
        items: items.map((row) => {
          const meta =
            row.action === "LOGIN" || row.action === "LOGOUT"
              ? authMeta(row.changes)
              : { providerLabel: null, deviceLabel: null };
          return {
            ...row,
            actionLabel: ACTION_LABELS[row.action],
            resourceLabel: RESOURCE_LABELS[row.resource] ?? row.resource,
            providerLabel: meta.providerLabel,
            deviceLabel: meta.deviceLabel,
          };
        }),
        nextCursor,
        stats: {
          total24h,
          loginsToday,
          logoutsToday,
          mutationsToday,
        },
        recentLogins: recentLogins.map((row) => {
          const meta = authMeta(row.changes);
          return {
            ...row,
            providerLabel: meta.providerLabel,
            deviceLabel: meta.deviceLabel,
          };
        }),
        filters: {
          users,
          resources: resources.map((r) => ({
            value: r.resource,
            label: RESOURCE_LABELS[r.resource] ?? r.resource,
          })),
          actions: Object.entries(ACTION_LABELS).map(([value, label]) => ({
            value,
            label,
          })),
        },
      };
    }),
});
