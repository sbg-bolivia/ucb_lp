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

export const awsCommunitiesRouter = router({
  /** Comunidades AWS publicadas (mapa y listado en /nosotros). */
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
    const ok = await hasPermissionOrManage(
      ctx.user.id,
      PermissionAction.READ,
      PermissionResource.ADMIN,
      ctx.user.tenantId
    );
    if (!ok) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Sin permiso" });
    }

    return prisma.awsCommunity.findMany({
      where: { tenantId: ctx.user.tenantId },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
  }),
});
