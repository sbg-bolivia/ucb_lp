import { BannerPlacement } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../lib/db";
import { hasAdminOrContentPermission } from "../../services/rbacService";
import { PermissionAction } from "../../types/rbac";
import { protectedProcedure, publicProcedure, router } from "../trpc";

const optionalUrl = z
  .string()
  .max(2000)
  .optional()
  .nullable()
  .transform((v) => (v?.trim() ? v.trim() : null));

const optionalText = z
  .string()
  .max(500)
  .optional()
  .nullable()
  .transform((v) => (v?.trim() ? v.trim() : null));

const siteBannerCreateSchema = z.object({
  title: optionalText,
  subtitle: optionalText,
  imageUrl: z.string().min(1).max(2000).trim(),
  linkUrl: optionalUrl,
  placement: z.nativeEnum(BannerPlacement).optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().min(0).max(9999).optional(),
  startsAt: z.union([z.coerce.date(), z.null()]).optional(),
  endsAt: z.union([z.coerce.date(), z.null()]).optional(),
});

const siteBannerUpdateSchema = siteBannerCreateSchema
  .partial()
  .extend({ id: z.string().uuid() });

async function getFirstActiveTenantId(): Promise<string | null> {
  const t = await prisma.tenant.findFirst({
    where: { isActive: true },
    select: { id: true },
  });
  return t?.id ?? null;
}

async function assertAdmin(
  userId: string,
  tenantId: string,
  action: PermissionAction
) {
  const ok = await hasAdminOrContentPermission(userId, action, tenantId);
  if (!ok) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Sin permiso" });
  }
}

function isBannerActiveNow(banner: {
  isActive: boolean;
  startsAt: Date | null;
  endsAt: Date | null;
}): boolean {
  if (!banner.isActive) return false;
  const now = new Date();
  if (banner.startsAt && banner.startsAt > now) return false;
  if (banner.endsAt && banner.endsAt < now) return false;
  return true;
}

export const siteBannersRouter = router({
  listPublic: publicProcedure
    .input(
      z
        .object({
          placement: z.nativeEnum(BannerPlacement).optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const tenantId = await getFirstActiveTenantId();
      if (!tenantId) return [];

      const banners = await prisma.siteBanner.findMany({
        where: {
          tenantId,
          isActive: true,
          ...(input?.placement ? { placement: input.placement } : {}),
        },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      });

      return banners.filter(isBannerActiveNow);
    }),

  listForAdmin: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user.tenantId) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Sin tenant" });
    }
    await assertAdmin(ctx.user.id, ctx.user.tenantId, PermissionAction.READ);

    return prisma.siteBanner.findMany({
      where: { tenantId: ctx.user.tenantId },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
  }),

  create: protectedProcedure
    .input(siteBannerCreateSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user.tenantId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Sin tenant" });
      }
      await assertAdmin(ctx.user.id, ctx.user.tenantId, PermissionAction.CREATE);

      return prisma.siteBanner.create({
        data: {
          tenantId: ctx.user.tenantId,
          title: input.title ?? null,
          subtitle: input.subtitle ?? null,
          imageUrl: input.imageUrl,
          linkUrl: input.linkUrl ?? null,
          placement: input.placement ?? "HOME_HERO",
          isActive: input.isActive ?? true,
          sortOrder: input.sortOrder ?? 0,
          startsAt: input.startsAt ?? null,
          endsAt: input.endsAt ?? null,
        },
      });
    }),

  update: protectedProcedure
    .input(siteBannerUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user.tenantId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Sin tenant" });
      }
      await assertAdmin(ctx.user.id, ctx.user.tenantId, PermissionAction.UPDATE);

      const { id, ...patch } = input;
      const existing = await prisma.siteBanner.findFirst({
        where: { id, tenantId: ctx.user.tenantId },
      });
      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Banner no encontrado" });
      }

      const data: Record<string, unknown> = {};
      if (patch.title !== undefined) data.title = patch.title;
      if (patch.subtitle !== undefined) data.subtitle = patch.subtitle;
      if (patch.imageUrl !== undefined) data.imageUrl = patch.imageUrl;
      if (patch.linkUrl !== undefined) data.linkUrl = patch.linkUrl;
      if (patch.placement !== undefined) data.placement = patch.placement;
      if (patch.isActive !== undefined) data.isActive = patch.isActive;
      if (patch.sortOrder !== undefined) data.sortOrder = patch.sortOrder;
      if (patch.startsAt !== undefined) data.startsAt = patch.startsAt;
      if (patch.endsAt !== undefined) data.endsAt = patch.endsAt;

      return prisma.siteBanner.update({ where: { id }, data });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user.tenantId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Sin tenant" });
      }
      await assertAdmin(ctx.user.id, ctx.user.tenantId, PermissionAction.DELETE);

      const existing = await prisma.siteBanner.findFirst({
        where: { id: input.id, tenantId: ctx.user.tenantId },
      });
      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Banner no encontrado" });
      }

      await prisma.siteBanner.delete({ where: { id: input.id } });
      return { ok: true as const };
    }),

  reorder: protectedProcedure
    .input(z.object({ orderedIds: z.array(z.string().uuid()).min(1) }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user.tenantId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Sin tenant" });
      }
      await assertAdmin(ctx.user.id, ctx.user.tenantId, PermissionAction.UPDATE);

      const existing = await prisma.siteBanner.findMany({
        where: { tenantId: ctx.user.tenantId, id: { in: input.orderedIds } },
        select: { id: true },
      });
      if (existing.length !== input.orderedIds.length) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "IDs inválidos" });
      }

      await prisma.$transaction(
        input.orderedIds.map((id, index) =>
          prisma.siteBanner.update({
            where: { id },
            data: { sortOrder: index },
          })
        )
      );

      return { ok: true as const };
    }),
});
