import { AwsCommunityType } from "@prisma/client";
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

const optionalText = z
  .string()
  .max(10000)
  .optional()
  .nullable()
  .transform((v) => (v?.trim() ? v.trim() : null));

const awsCommunityCreateSchema = z.object({
  name: z.string().min(1).max(200).trim(),
  communityType: z.nativeEnum(AwsCommunityType),
  university: z.string().max(200).optional().nullable(),
  department: z.string().max(100).optional().nullable(),
  city: z.string().min(1).max(100).trim(),
  country: z.string().max(2).optional(),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  description: optionalText,
  meetupUrl: optionalUrl,
  websiteUrl: optionalUrl,
  logoUrl: optionalUrl,
  isOwnGroup: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  sortOrder: z.number().int().min(0).max(9999).optional(),
});

const awsCommunityUpdateSchema = awsCommunityCreateSchema
  .partial()
  .extend({ id: z.string().min(1) });

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
  const ok = await hasPermissionOrManage(
    userId,
    action,
    PermissionResource.ADMIN,
    tenantId
  );
  if (!ok) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Sin permiso" });
  }
}

export const awsCommunitiesRouter = router({
  listPublic: publicProcedure.query(async () => {
    const tenantId = await getFirstActiveTenantId();
    if (!tenantId) return [];

    return prisma.awsCommunity.findMany({
      where: { tenantId, isPublished: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
  }),

  getPublic: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ input }) => {
      const tenantId = await getFirstActiveTenantId();
      if (!tenantId) return null;

      return prisma.awsCommunity.findFirst({
        where: { id: input.id, tenantId, isPublished: true },
      });
    }),

  listForAdmin: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user.tenantId) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Sin tenant" });
    }
    await assertAdmin(
      ctx.user.id,
      ctx.user.tenantId,
      PermissionAction.READ
    );

    return prisma.awsCommunity.findMany({
      where: { tenantId: ctx.user.tenantId },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
  }),

  create: protectedProcedure
    .input(awsCommunityCreateSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user.tenantId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Sin tenant" });
      }
      await assertAdmin(
        ctx.user.id,
        ctx.user.tenantId,
        PermissionAction.CREATE
      );

      return prisma.awsCommunity.create({
        data: {
          tenantId: ctx.user.tenantId,
          name: input.name,
          communityType: input.communityType,
          university: input.university?.trim() || null,
          department: input.department?.trim() || null,
          city: input.city,
          country: input.country ?? "BO",
          latitude: input.latitude ?? null,
          longitude: input.longitude ?? null,
          description: input.description ?? null,
          meetupUrl: input.meetupUrl ?? null,
          websiteUrl: input.websiteUrl ?? null,
          logoUrl: input.logoUrl ?? null,
          isOwnGroup: input.isOwnGroup ?? false,
          isPublished: input.isPublished ?? true,
          sortOrder: input.sortOrder ?? 0,
        },
      });
    }),

  update: protectedProcedure
    .input(awsCommunityUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user.tenantId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Sin tenant" });
      }
      await assertAdmin(
        ctx.user.id,
        ctx.user.tenantId,
        PermissionAction.UPDATE
      );

      const { id, ...patch } = input;
      const existing = await prisma.awsCommunity.findFirst({
        where: { id, tenantId: ctx.user.tenantId },
      });
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Comunidad no encontrada",
        });
      }

      const data: Record<string, unknown> = {};
      if (patch.name !== undefined) data.name = patch.name;
      if (patch.communityType !== undefined)
        data.communityType = patch.communityType;
      if (patch.university !== undefined)
        data.university = patch.university?.trim() || null;
      if (patch.department !== undefined)
        data.department = patch.department?.trim() || null;
      if (patch.city !== undefined) data.city = patch.city;
      if (patch.country !== undefined) data.country = patch.country;
      if (patch.latitude !== undefined) data.latitude = patch.latitude;
      if (patch.longitude !== undefined) data.longitude = patch.longitude;
      if (patch.description !== undefined) data.description = patch.description;
      if (patch.meetupUrl !== undefined) data.meetupUrl = patch.meetupUrl;
      if (patch.websiteUrl !== undefined) data.websiteUrl = patch.websiteUrl;
      if (patch.logoUrl !== undefined) data.logoUrl = patch.logoUrl;
      if (patch.isOwnGroup !== undefined) data.isOwnGroup = patch.isOwnGroup;
      if (patch.isPublished !== undefined) data.isPublished = patch.isPublished;
      if (patch.sortOrder !== undefined) data.sortOrder = patch.sortOrder;

      return prisma.awsCommunity.update({ where: { id }, data });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user.tenantId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Sin tenant" });
      }
      await assertAdmin(
        ctx.user.id,
        ctx.user.tenantId,
        PermissionAction.DELETE
      );

      const existing = await prisma.awsCommunity.findFirst({
        where: { id: input.id, tenantId: ctx.user.tenantId },
      });
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Comunidad no encontrada",
        });
      }

      await prisma.awsCommunity.delete({ where: { id: input.id } });
      return { ok: true as const };
    }),
});
