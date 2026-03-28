"use client";

import { useEffect, useMemo, useState } from "react";

import commonEn from "@/locales/en/common.json";
import dashboardEn from "@/locales/en/dashboard.json";
import landingEn from "@/locales/en/landing.json";
// Import translations statically - Next.js will handle bundling
import commonEs from "@/locales/es/common.json";
import dashboardEs from "@/locales/es/dashboard.json";
import landingEs from "@/locales/es/landing.json";
import commonPt from "@/locales/pt/common.json";
import dashboardPt from "@/locales/pt/dashboard.json";
import landingPt from "@/locales/pt/landing.json";

// Type for translations
type TranslationRecord = Record<string, unknown>;

// Translation registry - maps locale and namespace to the imported translations
const translationsRegistry: Record<
  string,
  Record<string, TranslationRecord>
> = {
  es: {
    common: commonEs as TranslationRecord,
    landing: landingEs as TranslationRecord,
    dashboard: dashboardEs as TranslationRecord,
  },
  en: {
    common: commonEn as TranslationRecord,
    landing: landingEn as TranslationRecord,
    dashboard: dashboardEn as TranslationRecord,
  },
  pt: {
    common: commonPt as TranslationRecord,
    landing: landingPt as TranslationRecord,
    dashboard: dashboardPt as TranslationRecord,
  },
};

/**
 * Hook para obtener traducciones estáticas
 *
 * Uso:
 * const { t, locale, setLocale } = useTranslation("landing");
 * const title = t("hero.title");
 *
 * @param namespace - Namespace de las traducciones (ej: "landing", "common", "dashboard")
 * @returns Objeto con función `t` para obtener traducciones, locale actual y función para cambiar locale
 */
export function useTranslation(namespace = "common") {
  // Estado reactivo para el locale
  const [locale, setLocaleState] = useState<string>("es");

  // Inicializar locale desde localStorage o navegador
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("locale");
      if (stored && ["es", "en", "pt"].includes(stored)) {
        setLocaleState(stored);
      } else {
        const browserLang = navigator.language.split("-")[0];
        if (browserLang && ["es", "en", "pt"].includes(browserLang)) {
          setLocaleState(browserLang);
          localStorage.setItem("locale", browserLang);
        }
      }

      // Escuchar cambios de locale desde otros componentes
      const handleLocaleChange = (e: CustomEvent<string>) => {
        setLocaleState(e.detail);
      };

      window.addEventListener(
        "localechange",
        handleLocaleChange as EventListener
      );
      return () => {
        window.removeEventListener(
          "localechange",
          handleLocaleChange as EventListener
        );
      };
    }
  }, []);

  // Función para cambiar el locale
  const setLocale = (newLocale: string) => {
    if (["es", "en", "pt"].includes(newLocale)) {
      setLocaleState(newLocale);
      if (typeof window !== "undefined") {
        localStorage.setItem("locale", newLocale);
      }
      // Disparar evento personalizado para que otros componentes se actualicen
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("localechange", { detail: newLocale })
        );
      }
    }
  };

  /**
   * Función para obtener traducciones
   * Carga traducciones desde archivos JSON importados estáticamente
   */
  const t = useMemo(() => {
    return (key: string, params?: Record<string, string>): string => {
      // Obtener traducciones del registry
      const translations =
        translationsRegistry[locale]?.[namespace] ??
        translationsRegistry.es?.[namespace] ??
        {};

      // Obtener valor por path anidado (ej: "hero.title" -> translations.hero.title)
      const keys = key.split(".");
      let value: unknown = translations;

      for (const k of keys) {
        value = (value as Record<string, unknown>)?.[k];
        if (value === undefined) break;
      }

      // Si no se encuentra, intentar con fallback a español
      if (value === undefined && locale !== "es") {
        const fallbackTranslations = translationsRegistry.es?.[namespace] ?? {};
        let fallbackValue: unknown = fallbackTranslations;
        for (const k of keys) {
          fallbackValue = (fallbackValue as Record<string, unknown>)?.[k];
          if (fallbackValue === undefined) break;
        }
        value = fallbackValue;
      }

      // Si todavía no hay valor, retornar la key
      if (value === undefined || value === null) {
        return key;
      }

      // Convertir a string y reemplazar parámetros
      let result = String(value);
      if (params) {
        Object.entries(params).forEach(([paramKey, paramValue]) => {
          result = result.replace(
            new RegExp(`\\{${paramKey}\\}`, "g"),
            paramValue
          );
        });
      }

      return result;
    };
  }, [locale, namespace]);

  return { t, locale, setLocale };
}
