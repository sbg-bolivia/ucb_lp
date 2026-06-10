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

      const items = await prisma.auditLog.findMany({
        where: {
          tenantId: ctx.user.tenantId,
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
        where: { tenantId: ctx.user.tenantId },
        distinct: ["userId"],
        select: {
          userId: true,
          userEmail: true,
          userName: true,
        },
        orderBy: { userEmail: "asc" },
      });

      const resources = await prisma.auditLog.findMany({
        where: { tenantId: ctx.user.tenantId },
        distinct: ["resource"],
        select: { resource: true },
        orderBy: { resource: "asc" },
      });

      return {
        items: items.map((row) => ({
          ...row,
          actionLabel: ACTION_LABELS[row.action],
          resourceLabel: RESOURCE_LABELS[row.resource] ?? row.resource,
        })),
        nextCursor,
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
