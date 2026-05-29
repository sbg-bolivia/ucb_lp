import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../lib/db";
import { hasPermissionOrManage } from "../../services/rbacService";
import { PermissionAction, PermissionResource } from "../../types/rbac";
import { protectedProcedure, publicProcedure, router } from "../trpc";

const optionalUrl = z
  .string()
  .max(2000)
  .optional()
  .nullable()
  .transform((v) => (v?.trim() ? v.trim() : null));

const clubEventCreateSchema = z.object({
  title: z.string().min(1).max(200).trim(),
  description: z.string().max(20000).optional().nullable(),
  startsAt: z.union([z.coerce.date(), z.null()]).optional(),
  endsAt: z.union([z.coerce.date(), z.null()]).optional(),
  location: z.string().max(500).optional().nullable(),
  imageUrl: optionalUrl,
  externalUrl: optionalUrl,
  isPublished: z.boolean().optional(),
  sortOrder: z.number().int().min(0).max(9999).optional(),
});

const clubEventUpdateSchema = clubEventCreateSchema
  .partial()
  .extend({ id: z.string().uuid() });

async function getFirstActiveTenantId(): Promise<string | null> {
  const t = await prisma.tenant.findFirst({
    where: { isActive: true },
    select: { id: true },
  });
  return t?.id ?? null;
}

export const clubEventsRouter = router({
  /** Eventos publicados del tenant por defecto (sitio público). */
  listPublic: publicProcedure.query(async () => {
    const tenantId = await getFirstActiveTenantId();
    if (!tenantId) return [];

    return prisma.clubEvent.findMany({
      where: { tenantId, isPublished: true },
      orderBy: [{ sortOrder: "asc" }, { startsAt: "desc" }],
    });
  }),

  listForAdmin: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user.tenantId) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Sin tenant" });
    }
    const ok = await hasPermissionOrManage(
      ctx.user.id,
      PermissionAction.READ,
      PermissionResource.ADMIN,
      ctx.user.tenantId
    );
    if (!ok) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Sin permiso" });
    }

    return prisma.clubEvent.findMany({
      where: { tenantId: ctx.user.tenantId },
      orderBy: [{ sortOrder: "asc" }, { startsAt: "desc" }],
    });
  }),

  create: protectedProcedure
    .input(clubEventCreateSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user.tenantId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Sin tenant" });
      }
      const ok = await hasPermissionOrManage(
        ctx.user.id,
        PermissionAction.CREATE,
        PermissionResource.ADMIN,
        ctx.user.tenantId
      );
      if (!ok) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Sin permiso" });
      }

      return prisma.clubEvent.create({
        data: {
          tenantId: ctx.user.tenantId,
          title: input.title,
          description: input.description ?? null,
          startsAt: input.startsAt ?? null,
          endsAt: input.endsAt ?? null,
          location: input.location?.trim() || null,
          imageUrl: input.imageUrl ?? null,
          externalUrl: input.externalUrl ?? null,
          isPublished: input.isPublished ?? true,
          sortOrder: input.sortOrder ?? 0,
        },
      });
    }),

  update: protectedProcedure
    .input(clubEventUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user.tenantId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Sin tenant" });
      }
      const ok = await hasPermissionOrManage(
        ctx.user.id,
        PermissionAction.UPDATE,
        PermissionResource.ADMIN,
        ctx.user.tenantId
      );
      if (!ok) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Sin permiso" });
      }

      const { id, ...patch } = input;
      const existing = await prisma.clubEvent.findFirst({
        where: { id, tenantId: ctx.user.tenantId },
      });
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Evento no encontrado",
        });
      }

      const data: Record<string, unknown> = {};
      if (patch.title !== undefined) data.title = patch.title;
      if (patch.description !== undefined) data.description = patch.description;
      if (patch.startsAt !== undefined) data.startsAt = patch.startsAt;
      if (patch.endsAt !== undefined) data.endsAt = patch.endsAt;
      if (patch.location !== undefined)
        data.location = patch.location?.trim() || null;
      if (patch.imageUrl !== undefined) data.imageUrl = patch.imageUrl;
      if (patch.externalUrl !== undefined) data.externalUrl = patch.externalUrl;
      if (patch.isPublished !== undefined) data.isPublished = patch.isPublished;
      if (patch.sortOrder !== undefined) data.sortOrder = patch.sortOrder;

      return prisma.clubEvent.update({
        where: { id },
        data,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user.tenantId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Sin tenant" });
      }
      const ok = await hasPermissionOrManage(
        ctx.user.id,
        PermissionAction.DELETE,
        PermissionResource.ADMIN,
        ctx.user.tenantId
      );
      if (!ok) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Sin permiso" });
      }

      const existing = await prisma.clubEvent.findFirst({
        where: { id: input.id, tenantId: ctx.user.tenantId },
      });
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Evento no encontrado",
        });
      }

      await prisma.clubEvent.delete({ where: { id: input.id } });
      return { ok: true as const };
    }),
});
