"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/hooks/useTranslation";
import { trpc } from "@/utils/trpc";
import { Globe, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface TranslatableField {
  key: string;
  label: string;
  type: "text" | "textarea";
  placeholder?: string;
}

interface MultiLanguageEditorProps {
  entityType: string;
  entityId: string;
  fields: TranslatableField[];
  title: string;
  description?: string;
}

export function MultiLanguageEditor({
  entityType,
  entityId,
  fields,
  title,
  description,
}: MultiLanguageEditorProps) {
  const { t } = useTranslation("dashboard");
  const [activeLocale, setActiveLocale] = useState<string>("es");
  const [translations, setTranslations] = useState<
    Record<string, Record<string, string>>
  >({
    es: {},
    en: {},
    pt: {},
  });

  const locales = [
    { code: "es", name: "Español" },
    { code: "en", name: "English" },
    { code: "pt", name: "Português" },
  ];

  // Load translations for all locales
  const { data: esTranslations, refetch: refetchEs } =
    trpc.translation.getAll.useQuery(
      {
        entityType,
        entityId,
        localeCode: "es",
        // Load all statuses to allow editing
      },
      { enabled: !!entityId }
    );

  const { data: enTranslations, refetch: refetchEn } =
    trpc.translation.getAll.useQuery(
      {
        entityType,
        entityId,
        localeCode: "en",
        // Load all statuses
      },
      { enabled: !!entityId }
    );

  const { data: ptTranslations, refetch: refetchPt } =
    trpc.translation.getAll.useQuery(
      {
        entityType,
        entityId,
        localeCode: "pt",
        // Load all statuses
      },
      { enabled: !!entityId }
    );

  // Initialize translations from loaded data (getAll returns Record<string, string>)
  useEffect(() => {
    const loaded: Record<string, Record<string, string>> = {
      es: esTranslations || {},
      en: enTranslations || {},
      pt: ptTranslations || {},
    };

    setTranslations(loaded);
  }, [esTranslations, enTranslations, ptTranslations]);

  const saveTranslation = trpc.translation.save.useMutation({
    onSuccess: () => {
      toast.success(t("save") || "Traducción guardada");
      refetchEs();
      refetchEn();
      refetchPt();
    },
    onError: (error) => {
      toast.error(error.message || "Error al guardar traducción");
    },
  });

  const saveBulkTranslations = trpc.translation.saveBulk.useMutation({
    onSuccess: () => {
      toast.success(t("save") || "Traducciones guardadas");
      refetchEs();
      refetchEn();
      refetchPt();
    },
    onError: (error) => {
      toast.error(error.message || "Error al guardar traducciones");
    },
  });

  const handleFieldChange = (
    locale: string,
    fieldKey: string,
    value: string
  ) => {
    setTranslations((prev) => ({
      ...prev,
      [locale]: {
        ...prev[locale],
        [fieldKey]: value,
      },
    }));
  };

  const handleSaveAll = async () => {
    try {
      // Save all translations for current locale
      const currentLocaleTranslations = translations[activeLocale] || {};
      const translationsToSave: Record<string, string> = {};

      fields.forEach((field) => {
        const value = currentLocaleTranslations[field.key];
        if (value !== undefined && value.trim() !== "") {
          translationsToSave[field.key] = value;
        }
      });

      if (Object.keys(translationsToSave).length > 0) {
        await saveBulkTranslations.mutateAsync({
          entityType,
          entityId,
          localeCode: activeLocale,
          translations: translationsToSave,
        });
      }

      toast.success(t("save") || "Traducciones guardadas exitosamente");
    } catch (error) {
      console.error("Error saving translations:", error);
    }
  };

  const handleSaveField = async (fieldKey: string, locale: string) => {
    const value = translations[locale]?.[fieldKey] || "";
    if (value.trim() === "") return;

    await saveTranslation.mutateAsync({
      entityType,
      entityId,
      localeCode: locale,
      fieldName: fieldKey,
      translatedValue: value,
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {title}
            </CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <Button
            onClick={handleSaveAll}
            disabled={
              saveBulkTranslations.isPending || saveTranslation.isPending
            }
          >
            <Save className="h-4 w-4 mr-2" />
            {t("save") || "Guardar"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeLocale} onValueChange={setActiveLocale}>
          <TabsList className="grid w-full grid-cols-3">
            {locales.map((locale) => (
              <TabsTrigger key={locale.code} value={locale.code}>
                {locale.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {locales.map((locale) => (
            <TabsContent
              key={locale.code}
              value={locale.code}
              className="space-y-4 mt-6"
            >
              {fields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`${field.key}-${locale.code}`}>
                      {field.label}
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSaveField(field.key, locale.code)}
                      disabled={saveTranslation.isPending}
                    >
                      {t("save") || "Guardar"}
                    </Button>
                  </div>
                  {field.type === "textarea" ? (
                    <Textarea
                      id={`${field.key}-${locale.code}`}
                      value={translations[locale.code]?.[field.key] || ""}
                      onChange={(e) =>
                        handleFieldChange(
                          locale.code,
                          field.key,
                          e.target.value
                        )
                      }
                      placeholder={field.placeholder}
                      rows={field.key === "description" ? 4 : 3}
                    />
                  ) : (
                    <Input
                      id={`${field.key}-${locale.code}`}
                      value={translations[locale.code]?.[field.key] || ""}
                      onChange={(e) =>
                        handleFieldChange(
                          locale.code,
                          field.key,
                          e.target.value
                        )
                      }
                      placeholder={field.placeholder}
                    />
                  )}
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
