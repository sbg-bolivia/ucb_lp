import {
  AwsDifficultyLevel,
  AwsServiceCardType,
  AwsServiceCategory,
} from "@prisma/client";
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
  .max(20000)
  .optional()
  .nullable()
  .transform((v) => (v?.trim() ? v.trim() : null));

const slugSchema = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug: solo minúsculas, números y guiones");

const awsServiceCreateSchema = z.object({
  slug: slugSchema,
  name: z.string().min(1).max(200).trim(),
  category: z.nativeEnum(AwsServiceCategory),
  shortDescription: z.string().min(1).max(500).trim(),
  technicalExplanation: optionalText,
  whenToUse: optionalText,
  whenNotToUse: optionalText,
  officialDocsUrl: optionalUrl,
  iconUrl: optionalUrl,
  coverImageUrl: optionalUrl,
  promoVideoUrl: optionalUrl,
  difficultyLevel: z.nativeEnum(AwsDifficultyLevel).optional().nullable(),
  pricingNote: optionalText,
  isPopular: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  sortOrder: z.number().int().min(0).max(9999).optional(),
});

const awsServiceUpdateSchema = awsServiceCreateSchema
  .partial()
  .extend({ id: z.string().uuid() });

const awsServiceCardCreateSchema = z.object({
  serviceId: z.string().uuid(),
  cardType: z.nativeEnum(AwsServiceCardType),
  title: z.string().max(200).optional().nullable(),
  content: z.string().min(1).max(10000).trim(),
  iconKey: z.string().max(50).optional().nullable(),
  linkUrl: optionalUrl,
  linkLabel: z.string().max(100).optional().nullable(),
  isPublished: z.boolean().optional(),
  sortOrder: z.number().int().min(0).max(9999).optional(),
});

const awsServiceCardUpdateSchema = awsServiceCardCreateSchema
  .omit({ serviceId: true })
  .partial()
  .extend({
    id: z.string().uuid(),
    content: z.string().min(1).max(10000).trim().optional(),
  });

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

async function getOwnedService(id: string, tenantId: string) {
  const service = await prisma.awsService.findFirst({
    where: { id, tenantId },
  });
  if (!service) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Servicio no encontrado",
    });
  }
  return service;
}

export const awsServicesRouter = router({
  listPublic: publicProcedure.query(async () => {
    const tenantId = await getFirstActiveTenantId();
    if (!tenantId) return [];

    return prisma.awsService.findMany({
      where: { tenantId, isPublished: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: {
        id: true,
        slug: true,
        name: true,
        category: true,
        shortDescription: true,
        iconUrl: true,
        coverImageUrl: true,
        isPopular: true,
        difficultyLevel: true,
      },
    });
  }),

  getPublicBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1).max(120) }))
    .query(async ({ input }) => {
      const tenantId = await getFirstActiveTenantId();
      if (!tenantId) return null;

      return prisma.awsService.findFirst({
        where: {
          tenantId,
          slug: input.slug,
          isPublished: true,
        },
        include: {
          cards: {
            where: { isPublished: true },
            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
          },
        },
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

    return prisma.awsService.findMany({
      where: { tenantId: ctx.user.tenantId },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: {
        cards: { orderBy: [{ sortOrder: "asc" }] },
      },
    });
  }),

  create: protectedProcedure
    .input(awsServiceCreateSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user.tenantId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Sin tenant" });
      }
      await assertAdmin(
        ctx.user.id,
        ctx.user.tenantId,
        PermissionAction.CREATE
      );

      const existing = await prisma.awsService.findFirst({
        where: { tenantId: ctx.user.tenantId, slug: input.slug },
      });
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Ya existe un servicio con ese slug",
        });
      }

      return prisma.awsService.create({
        data: {
          tenantId: ctx.user.tenantId,
          slug: input.slug,
          name: input.name,
          category: input.category,
          shortDescription: input.shortDescription,
          technicalExplanation: input.technicalExplanation ?? null,
          whenToUse: input.whenToUse ?? null,
          whenNotToUse: input.whenNotToUse ?? null,
          officialDocsUrl: input.officialDocsUrl ?? null,
          iconUrl: input.iconUrl ?? null,
          coverImageUrl: input.coverImageUrl ?? null,
          promoVideoUrl: input.promoVideoUrl ?? null,
          difficultyLevel: input.difficultyLevel ?? null,
          pricingNote: input.pricingNote ?? null,
          isPopular: input.isPopular ?? false,
          isPublished: input.isPublished ?? false,
          sortOrder: input.sortOrder ?? 0,
        },
      });
    }),

  update: protectedProcedure
    .input(awsServiceUpdateSchema)
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
      await getOwnedService(id, ctx.user.tenantId);

      if (patch.slug) {
        const clash = await prisma.awsService.findFirst({
          where: {
            tenantId: ctx.user.tenantId,
            slug: patch.slug,
            NOT: { id },
          },
        });
        if (clash) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Ya existe otro servicio con ese slug",
          });
        }
      }

      const data: Record<string, unknown> = {};
      if (patch.slug !== undefined) data.slug = patch.slug;
      if (patch.name !== undefined) data.name = patch.name;
      if (patch.category !== undefined) data.category = patch.category;
      if (patch.shortDescription !== undefined)
        data.shortDescription = patch.shortDescription;
      if (patch.technicalExplanation !== undefined)
        data.technicalExplanation = patch.technicalExplanation;
      if (patch.whenToUse !== undefined) data.whenToUse = patch.whenToUse;
      if (patch.whenNotToUse !== undefined)
        data.whenNotToUse = patch.whenNotToUse;
      if (patch.officialDocsUrl !== undefined)
        data.officialDocsUrl = patch.officialDocsUrl;
      if (patch.iconUrl !== undefined) data.iconUrl = patch.iconUrl;
      if (patch.coverImageUrl !== undefined)
        data.coverImageUrl = patch.coverImageUrl;
      if (patch.promoVideoUrl !== undefined)
        data.promoVideoUrl = patch.promoVideoUrl;
      if (patch.difficultyLevel !== undefined)
        data.difficultyLevel = patch.difficultyLevel;
      if (patch.pricingNote !== undefined) data.pricingNote = patch.pricingNote;
      if (patch.isPopular !== undefined) data.isPopular = patch.isPopular;
      if (patch.isPublished !== undefined) data.isPublished = patch.isPublished;
      if (patch.sortOrder !== undefined) data.sortOrder = patch.sortOrder;

      return prisma.awsService.update({ where: { id }, data });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user.tenantId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Sin tenant" });
      }
      await assertAdmin(
        ctx.user.id,
        ctx.user.tenantId,
        PermissionAction.DELETE
      );
      await getOwnedService(input.id, ctx.user.tenantId);
      await prisma.awsService.delete({ where: { id: input.id } });
      return { ok: true as const };
    }),

  createCard: protectedProcedure
    .input(awsServiceCardCreateSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user.tenantId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Sin tenant" });
      }
      await assertAdmin(
        ctx.user.id,
        ctx.user.tenantId,
        PermissionAction.CREATE
      );
      await getOwnedService(input.serviceId, ctx.user.tenantId);

      return prisma.awsServiceCard.create({
        data: {
          serviceId: input.serviceId,
          cardType: input.cardType,
          title: input.title?.trim() || null,
          content: input.content,
          iconKey: input.iconKey?.trim() || null,
          linkUrl: input.linkUrl ?? null,
          linkLabel: input.linkLabel?.trim() || null,
          isPublished: input.isPublished ?? true,
          sortOrder: input.sortOrder ?? 0,
        },
      });
    }),

  updateCard: protectedProcedure
    .input(awsServiceCardUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user.tenantId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Sin tenant" });
      }
      await assertAdmin(
        ctx.user.id,
        ctx.user.tenantId,
        PermissionAction.UPDATE
      );

      const card = await prisma.awsServiceCard.findFirst({
        where: { id: input.id },
        include: { service: { select: { tenantId: true } } },
      });
      if (!card || card.service.tenantId !== ctx.user.tenantId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tarjeta no encontrada",
        });
      }

      const { id, ...patch } = input;
      const data: Record<string, unknown> = {};
      if (patch.cardType !== undefined) data.cardType = patch.cardType;
      if (patch.title !== undefined) data.title = patch.title?.trim() || null;
      if (patch.content !== undefined) data.content = patch.content;
      if (patch.iconKey !== undefined) data.iconKey = patch.iconKey?.trim() || null;
      if (patch.linkUrl !== undefined) data.linkUrl = patch.linkUrl;
      if (patch.linkLabel !== undefined)
        data.linkLabel = patch.linkLabel?.trim() || null;
      if (patch.isPublished !== undefined) data.isPublished = patch.isPublished;
      if (patch.sortOrder !== undefined) data.sortOrder = patch.sortOrder;

      return prisma.awsServiceCard.update({ where: { id }, data });
    }),

  deleteCard: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user.tenantId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Sin tenant" });
      }
      await assertAdmin(
        ctx.user.id,
        ctx.user.tenantId,
        PermissionAction.DELETE
      );

      const card = await prisma.awsServiceCard.findFirst({
        where: { id: input.id },
        include: { service: { select: { tenantId: true } } },
      });
      if (!card || card.service.tenantId !== ctx.user.tenantId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tarjeta no encontrada",
        });
      }

      await prisma.awsServiceCard.delete({ where: { id: input.id } });
      return { ok: true as const };
    }),
});
