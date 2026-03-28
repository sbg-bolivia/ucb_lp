/**
 * Translation Helper Library - CONSOLIDADO
 *
 * Maneja DOS tipos de traducciones:
 *
 * 1. TRADUCCIONES ESTÁTICAS (desde archivos JSON)
 *    - Para: UI, landing pages, botones, mensajes del sistema
 *    - Archivos: src/locales/{locale}/{namespace}.json
 *    - Uso: staticTranslations.get('es', 'hero.title', 'landing')
 *
 * 2. TRADUCCIONES DINÁMICAS (desde Base de Datos)
 *    - Para: Cursos, capítulos, categorías, contenido generado por admins
 *    - Tabla: translations (Prisma)
 *    - Uso: await getTranslation('course', '123', 'title', 'es')
 */

import fs from "node:fs";
import path from "node:path";
import { PrismaClient, TranslationStatus } from "@prisma/client";

const prisma = new PrismaClient();

// ============================================
// PARTE 1: TRADUCCIONES ESTÁTICAS (JSON)
// ============================================

interface StaticTranslations {
  [locale: string]: {
    [namespace: string]: Record<string, unknown>;
  };
}

let staticTranslationsCache: StaticTranslations | null = null;

class StaticTranslationLoader {
  private defaultLocale = "es";

  private getTranslations(): StaticTranslations {
    if (staticTranslationsCache) {
      return staticTranslationsCache;
    }

    // Solo cargar en servidor
    if (typeof window !== "undefined") {
      return {};
    }

    staticTranslationsCache = {};
    this.loadTranslations();
    return staticTranslationsCache;
  }

  private loadTranslations() {
    if (!staticTranslationsCache) {
      staticTranslationsCache = {};
    }

    const localesPath = path.join(process.cwd(), "src/locales");
    const locales = ["es", "en", "pt"];

    locales.forEach((locale) => {
      if (!staticTranslationsCache) {
        staticTranslationsCache = {};
      }
      staticTranslationsCache[locale] = {};

      const localePath = path.join(localesPath, locale);
      if (!fs.existsSync(localePath)) {
        return;
      }

      const files = fs.readdirSync(localePath);
      files.forEach((file) => {
        if (file.endsWith(".json")) {
          const namespace = file.replace(".json", "");
          const filePath = path.join(localePath, file);
          try {
            const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));
            if (!staticTranslationsCache) {
              staticTranslationsCache = {};
            }
            if (!staticTranslationsCache[locale]) {
              staticTranslationsCache[locale] = {};
            }
            staticTranslationsCache[locale][namespace] = content;
          } catch (error) {
            console.error(`Error loading translation file ${filePath}:`, error);
          }
        }
      });
    });
  }

  get(locale: string, key: string, namespace = "landing"): string {
    const translations = this.getTranslations();
    const localeData =
      translations[locale] || translations[this.defaultLocale] || {};
    const namespaceData = localeData[namespace] || {};

    const keys = key.split(".");
    let value: unknown = namespaceData;

    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
      if (value === undefined) {
        const defaultData = translations[this.defaultLocale]?.[namespace] || {};
        let fallbackValue: unknown = defaultData;
        for (const fk of keys) {
          fallbackValue = (fallbackValue as Record<string, unknown>)?.[fk];
        }
        return typeof fallbackValue === "string" ? fallbackValue : key;
      }
    }

    return typeof value === "string" ? value : String(value);
  }

  getAll(locale: string, namespace = "landing"): Record<string, unknown> {
    const translations = this.getTranslations();
    const localeData =
      translations[locale] || translations[this.defaultLocale] || {};
    return localeData[namespace] || {};
  }
}

// Exportar singleton para traducciones estáticas
export const staticTranslations = new StaticTranslationLoader();

// ============================================
// PARTE 2: TRADUCCIONES DINÁMICAS (Base de Datos)
// ============================================

interface TranslationOptions {
  tenantId?: string | null;
  status?: TranslationStatus;
}

/**
 * Obtener traducción de una entidad desde BD
 */
export async function getTranslation(
  entityType: string,
  entityId: string,
  fieldName: string,
  localeCode: string,
  options: TranslationOptions = {}
): Promise<string | null> {
  const { tenantId = null, status = TranslationStatus.PUBLISHED } = options;

  const locale = await prisma.locale.findUnique({
    where: { languageCode: localeCode },
  });

  if (!locale) {
    console.warn(`Locale ${localeCode} not found`);
    return null;
  }

  const translation = await prisma.translation.findFirst({
    where: {
      translatableType: entityType,
      translatableId: entityId,
      fieldName,
      localeId: locale.id,
      translationStatus: status,
      tenantId: tenantId ?? null,
    },
  });

  return translation?.translatedValue || null;
}

/**
 * Obtener múltiples traducciones de una entidad desde BD
 */
export async function getTranslations(
  entityType: string,
  entityId: string,
  localeCode: string,
  options: TranslationOptions = {}
): Promise<Record<string, string>> {
  const { tenantId = null, status = TranslationStatus.PUBLISHED } = options;

  const locale = await prisma.locale.findUnique({
    where: { languageCode: localeCode },
  });

  if (!locale) {
    return {};
  }

  const translations = await prisma.translation.findMany({
    where: {
      translatableType: entityType,
      translatableId: entityId,
      localeId: locale.id,
      translationStatus: status,
      tenantId: tenantId ?? null,
    },
    select: {
      fieldName: true,
      translatedValue: true,
    },
  });

  return translations.reduce(
    (acc, t) => {
      acc[t.fieldName] = t.translatedValue;
      return acc;
    },
    {} as Record<string, string>
  );
}

/**
 * Guardar o actualizar traducción en BD
 */
export async function saveTranslation(
  entityType: string,
  entityId: string,
  localeCode: string,
  fieldName: string,
  translatedValue: string,
  options: TranslationOptions & {
    status?: TranslationStatus;
    translatorNotes?: string;
    approvedBy?: string;
  } = {}
): Promise<void> {
  const {
    tenantId = null,
    status = TranslationStatus.PUBLISHED,
    translatorNotes,
    approvedBy,
  } = options;

  const locale = await prisma.locale.findUnique({
    where: { languageCode: localeCode },
  });

  if (!locale) {
    throw new Error(`Locale ${localeCode} not found`);
  }

  const tenantIdValue = tenantId ?? null;

  const existing = await prisma.translation.findFirst({
    where: {
      translatableType: entityType,
      translatableId: entityId,
      localeId: locale.id,
      fieldName,
      tenantId: tenantIdValue,
    },
  });

  if (existing) {
    await prisma.translation.update({
      where: { id: existing.id },
      data: {
        translatedValue,
        translationStatus: status,
        translatorNotes,
        approvedBy,
        approvedAt: approvedBy ? new Date() : undefined,
        updatedAt: new Date(),
      },
    });
  } else {
    await prisma.translation.create({
      data: {
        translatableType: entityType,
        translatableId: entityId,
        localeId: locale.id,
        fieldName,
        translatedValue,
        translationStatus: status,
        translatorNotes,
        approvedBy,
        approvedAt: approvedBy ? new Date() : undefined,
        tenantId: tenantIdValue,
      },
    });
  }
}

/**
 * Guardar múltiples traducciones de una vez en BD
 */
export async function saveTranslations(
  entityType: string,
  entityId: string,
  localeCode: string,
  translations: Record<string, string>,
  options: TranslationOptions & {
    status?: TranslationStatus;
    approvedBy?: string;
  } = {}
): Promise<void> {
  const { status = TranslationStatus.PUBLISHED, approvedBy } = options;

  const locale = await prisma.locale.findUnique({
    where: { languageCode: localeCode },
  });

  if (!locale) {
    throw new Error(`Locale ${localeCode} not found`);
  }

  await Promise.all(
    Object.entries(translations).map(([fieldName, translatedValue]) =>
      saveTranslation(
        entityType,
        entityId,
        localeCode,
        fieldName,
        translatedValue,
        { ...options, status, approvedBy }
      )
    )
  );
}

/**
 * Obtener entidad con traducciones mergeadas desde BD
 */
export async function getEntityWithTranslations<T extends { id: string }>(
  entity: T,
  localeCode: string,
  translatableFields: string[],
  options: TranslationOptions = {}
): Promise<T> {
  const translations = await getTranslations(
    entity.constructor.name.toLowerCase(),
    entity.id,
    localeCode,
    options
  );

  const translatedEntity = { ...entity };
  translatableFields.forEach((field) => {
    if (translations[field]) {
      (translatedEntity as Record<string, unknown>)[field] =
        translations[field];
    }
  });

  return translatedEntity;
}

/**
 * Obtener todas las locales activas
 */
export async function getActiveLocales() {
  return prisma.locale.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
  });
}

/**
 * Obtener locale por código
 */
export async function getLocaleByCode(languageCode: string) {
  return prisma.locale.findUnique({
    where: { languageCode },
  });
}

/**
 * Obtener locale por defecto
 */
export async function getDefaultLocale() {
  return prisma.locale.findFirst({
    where: { isDefault: true, isActive: true },
  });
}

/**
 * Aprobar traducciones
 */
export async function approveTranslation(
  translationId: string,
  approvedBy: string,
  status: TranslationStatus = TranslationStatus.PUBLISHED
) {
  return prisma.translation.update({
    where: { id: translationId },
    data: {
      translationStatus: status,
      approvedBy,
      approvedAt: new Date(),
    },
  });
}

/**
 * Buscar entidades por término de búsqueda en cualquier idioma
 */
export async function searchEntitiesMultiLanguage(
  entityType: string,
  searchTerm: string,
  localeCode: string,
  options: TranslationOptions = {}
): Promise<string[]> {
  const { tenantId = null, status = TranslationStatus.PUBLISHED } = options;

  const locale = await prisma.locale.findUnique({
    where: { languageCode: localeCode },
  });

  if (!locale) {
    return [];
  }

  const translations = await prisma.translation.findMany({
    where: {
      translatableType: entityType,
      translatedValue: {
        contains: searchTerm,
        mode: "insensitive",
      },
      localeId: locale.id,
      translationStatus: status,
      tenantId: tenantId ?? null,
    },
    select: {
      translatableId: true,
    },
    distinct: ["translatableId"],
  });

  return translations.map((t) => t.translatableId);
}
