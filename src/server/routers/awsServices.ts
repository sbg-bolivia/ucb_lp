import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../lib/db";
import { hasPermissionOrManage } from "../../services/rbacService";
import { PermissionAction, PermissionResource } from "../../types/rbac";
import { protectedProcedure, publicProcedure, router } from "../trpc";

async function getFirstActiveTenantId(): Promise<string | null> {
  const t = await prisma.tenant.findFirst({
    where: { isActive: true },
    select: { id: true },
  });
  return t?.id ?? null;
}

export const awsServicesRouter = router({
  /** Catálogo público de servicios AWS publicados. */
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
    const ok = await hasPermissionOrManage(
      ctx.user.id,
      PermissionAction.READ,
      PermissionResource.ADMIN,
      ctx.user.tenantId
    );
    if (!ok) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Sin permiso" });
    }

    return prisma.awsService.findMany({
      where: { tenantId: ctx.user.tenantId },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: {
        cards: { orderBy: [{ sortOrder: "asc" }] },
      },
    });
  }),
});
