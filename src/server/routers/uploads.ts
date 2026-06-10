import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createPresignedUploadUrl, isS3Configured } from "../../lib/s3";
import { S3_UPLOAD_FOLDERS } from "../../lib/s3-constants";
import { hasPermissionOrManage } from "../../services/rbacService";
import { PermissionAction, PermissionResource } from "../../types/rbac";
import { protectedProcedure, router } from "../trpc";

export const uploadsRouter = router({
  /** Indica si S3 está listo para subir desde el admin. */
  isConfigured: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user.tenantId) return { enabled: false as const };
    const ok = await hasPermissionOrManage(
      ctx.user.id,
      PermissionAction.READ,
      PermissionResource.ADMIN,
      ctx.user.tenantId
    );
    if (!ok) return { enabled: false as const };
    return { enabled: isS3Configured() };
  }),

  /** URL firmada para subir imagen directo a S3 desde el dashboard. */
  getPresignedImageUrl: protectedProcedure
    .input(
      z.object({
        folder: z.enum(S3_UPLOAD_FOLDERS),
        fileName: z.string().min(1).max(200),
        contentType: z.enum([
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/gif",
        ]),
      })
    )
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
      if (!isS3Configured()) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message:
            "S3 no configurado. Añade S3_REGION y S3_BUCKET en las variables de entorno.",
        });
      }

      try {
        return await createPresignedUploadUrl({ ...input, mediaKind: "image" });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Error al firmar subida S3";
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message });
      }
    }),

  /** URL firmada para subir video promocional directo a S3. */
  getPresignedVideoUrl: protectedProcedure
    .input(
      z.object({
        folder: z.enum(S3_UPLOAD_FOLDERS),
        fileName: z.string().min(1).max(200),
        contentType: z.enum(["video/mp4", "video/webm"]),
      })
    )
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
      if (!isS3Configured()) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message:
            "S3 no configurado. Añade S3_REGION y S3_BUCKET en las variables de entorno.",
        });
      }

      try {
        return await createPresignedUploadUrl({ ...input, mediaKind: "video" });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Error al firmar subida S3";
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message });
      }
    }),
});
