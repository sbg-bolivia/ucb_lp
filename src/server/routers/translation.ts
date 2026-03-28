/**
 * Translation Router (TRPC)
 *
 * Endpoints para gestionar traducciones:
 * - Obtener traducciones
 * - Guardar traducciones
 * - Listar locales
 * - Aprobar traducciones
 */

import { TranslationStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  approveTranslation,
  getActiveLocales,
  getDefaultLocale,
  getLocaleByCode,
  getTranslation,
  getTranslations,
  saveTranslation,
  saveTranslations,
} from "../../lib/translations";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const translationRouter = router({
  /**
   * Obtener todas las locales activas
   */
  getLocales: publicProcedure.query(async () => {
    const locales = await getActiveLocales();
    return locales;
  }),

  /**
   * Obtener locale por defecto
   */
  getDefaultLocale: publicProcedure.query(async () => {
    const locale = await getDefaultLocale();
    if (!locale) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No default locale found",
      });
    }
    return locale;
  }),

  /**
   * Obtener locale por código
   */
  getLocale: publicProcedure
    .input(z.object({ languageCode: z.string() }))
    .query(async ({ input }) => {
      const locale = await getLocaleByCode(input.languageCode);
      if (!locale) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Locale ${input.languageCode} not found`,
        });
      }
      return locale;
    }),

  /**
   * Obtener una traducción específica
   */
  get: publicProcedure
    .input(
      z.object({
        entityType: z.string(),
        entityId: z.string(),
        fieldName: z.string(),
        localeCode: z.string(),
        tenantId: z.string().optional().nullable(),
      })
    )
    .query(async ({ input }) => {
      const translation = await getTranslation(
        input.entityType,
        input.entityId,
        input.fieldName,
        input.localeCode,
        { tenantId: input.tenantId ?? undefined }
      );
      return translation;
    }),

  /**
   * Obtener todas las traducciones de una entidad
   */
  getAll: publicProcedure
    .input(
      z.object({
        entityType: z.string(),
        entityId: z.string(),
        localeCode: z.string(),
        tenantId: z.string().optional().nullable(),
        status: z
          .nativeEnum(TranslationStatus)
          .optional()
          .default(TranslationStatus.PUBLISHED),
      })
    )
    .query(async ({ input }) => {
      const translations = await getTranslations(
        input.entityType,
        input.entityId,
        input.localeCode,
        {
          tenantId: input.tenantId ?? undefined,
          status: input.status,
        }
      );
      return translations;
    }),

  /**
   * Guardar una traducción (requiere autenticación)
   */
  save: protectedProcedure
    .input(
      z.object({
        entityType: z.string(),
        entityId: z.string(),
        localeCode: z.string(),
        fieldName: z.string(),
        translatedValue: z.string(),
        tenantId: z.string().optional().nullable(),
        status: z.nativeEnum(TranslationStatus).optional(),
        translatorNotes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await saveTranslation(
        input.entityType,
        input.entityId,
        input.localeCode,
        input.fieldName,
        input.translatedValue,
        {
          tenantId: input.tenantId ?? undefined,
          status: input.status,
          translatorNotes: input.translatorNotes,
        }
      );
      return { success: true };
    }),

  /**
   * Guardar múltiples traducciones (requiere autenticación)
   */
  saveBulk: protectedProcedure
    .input(
      z.object({
        entityType: z.string(),
        entityId: z.string(),
        localeCode: z.string(),
        translations: z.record(z.string(), z.string()),
        tenantId: z.string().optional().nullable(),
        status: z.nativeEnum(TranslationStatus).optional(),
      })
    )
    .mutation(async ({ input }) => {
      await saveTranslations(
        input.entityType,
        input.entityId,
        input.localeCode,
        input.translations,
        {
          tenantId: input.tenantId ?? undefined,
          status: input.status,
        }
      );
      return { success: true };
    }),

  /**
   * Aprobar una traducción (requiere autenticación)
   */
  approve: protectedProcedure
    .input(
      z.object({
        translationId: z.string(),
        status: z
          .nativeEnum(TranslationStatus)
          .optional()
          .default(TranslationStatus.PUBLISHED),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User ID not found",
        });
      }

      await approveTranslation(input.translationId, ctx.user.id, input.status);
      return { success: true };
    }),
});
