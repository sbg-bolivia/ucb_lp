import { recordAuditLog } from "@/services/auditService";
import { TRPCError } from "@trpc/server";
import { isAdmin, isSuperAdmin } from "../services/rbacService";
import { t } from "./context";

// Base router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;

const auditMiddleware = t.middleware(async ({ ctx, next, path, type, getRawInput }) => {
  if (type !== "mutation" || !ctx.user) {
    return next();
  }

  const input = await getRawInput();
  const result = await next();

  if (result.ok) {
    recordAuditLog({
      user: ctx.user,
      procedure: path,
      input,
      resultData: result.data,
      ipAddress: ctx.requestMeta?.ip,
      userAgent: ctx.requestMeta?.userAgent,
    }).catch((err) => {
      console.error("[audit]", err);
    });
  }

  return result;
});

const authMiddleware = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

// Protected procedure that requires authentication
export const protectedProcedure = t.procedure
  .use(authMiddleware)
  .use(auditMiddleware);

// Admin procedure that requires admin role
export const adminProcedure = t.procedure
  .use(authMiddleware)
  .use(async ({ ctx, next }) => {
    const adminCheck = await isAdmin(ctx.user.id, ctx.user.tenantId ?? "");

    if (!adminCheck) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You must be an admin to access this resource",
      });
    }

    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  })
  .use(auditMiddleware);

// Super admin procedure that requires super admin role
export const superAdminProcedure = t.procedure
  .use(authMiddleware)
  .use(async ({ ctx, next }) => {
    const superAdminCheck = await isSuperAdmin(
      ctx.user.id,
      ctx.user.tenantId ?? ""
    );

    if (!superAdminCheck) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You must be a super admin to access this resource",
      });
    }

    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  })
  .use(auditMiddleware);
