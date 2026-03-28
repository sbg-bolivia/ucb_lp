"use client";

import { LanguagesIcon } from "@/components/ui/LanguagesIcon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/utils/trpc";
import { TranslationStatus } from "@prisma/client";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface TranslationButtonProps {
  entityType: string;
  entityId: string;
  fieldName: string;
  fieldLabel: string;
  fieldType?: "text" | "textarea";
}

export function TranslationButton({
  entityType,
  entityId,
  fieldName,
  fieldLabel,
  fieldType = "text",
}: TranslationButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [translationStatuses, setTranslationStatuses] = useState<
    Record<string, TranslationStatus>
  >({
    en: TranslationStatus.PUBLISHED,
    pt: TranslationStatus.PUBLISHED,
  });

  // Only show non-default locales (exclude "es" as default)
  const locales = [
    { code: "en", name: "English" },
    { code: "pt", name: "Português" },
  ];

  // Load translations only when dialog is open
  const {
    data: enTranslation,
    isLoading: isLoadingEn,
    refetch: refetchEn,
  } = trpc.translation.get.useQuery(
    {
      entityType,
      entityId,
      localeCode: "en",
      fieldName,
    },
    { enabled: isOpen && !!entityId }
  );

  const {
    data: ptTranslation,
    isLoading: isLoadingPt,
    refetch: refetchPt,
  } = trpc.translation.get.useQuery(
    {
      entityType,
      entityId,
      localeCode: "pt",
      fieldName,
    },
    { enabled: isOpen && !!entityId }
  );

  // Initialize translations when dialog opens (only non-default locales)
  useEffect(() => {
    if (isOpen) {
      const loaded: Record<string, string> = {};
      const statuses: Record<string, TranslationStatus> = {
        en: TranslationStatus.PUBLISHED,
        pt: TranslationStatus.PUBLISHED,
      };

      // Load from published translations
      if (enTranslation) {
        loaded.en = enTranslation;
      }
      if (ptTranslation) {
        loaded.pt = ptTranslation;
      }

      setTranslations(loaded);
      setTranslationStatuses(statuses);
    }
  }, [isOpen, enTranslation, ptTranslation]);

  const saveTranslation = trpc.translation.save.useMutation({
    onSuccess: async () => {
      toast.success("Traducción guardada");
      // Refetch translations if dialog is open
      if (isOpen) {
        await Promise.all([refetchEn(), refetchPt()]);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Error al guardar traducción");
    },
  });

  const handleTranslationChange = (locale: string, value: string) => {
    setTranslations((prev) => ({
      ...prev,
      [locale]: value,
    }));
  };

  const handleStatusChange = (locale: string, status: TranslationStatus) => {
    setTranslationStatuses((prev) => ({
      ...prev,
      [locale]: status,
    }));
  };

  const handleSaveTranslation = async (locale: string) => {
    const value = translations[locale] || "";
    if (value.trim() === "") {
      toast.error("El campo no puede estar vacío");
      return;
    }

    const status = translationStatuses[locale] || TranslationStatus.PUBLISHED;

    await saveTranslation.mutateAsync({
      entityType,
      entityId,
      localeCode: locale,
      fieldName,
      translatedValue: value,
      status,
    });
  };

  // Only show button if entityId exists
  if (!entityId) return null;

  const statusLabels: Record<TranslationStatus, string> = {
    DRAFT: "Borrador",
    REVIEW: "En Revisión",
    APPROVED: "Aprobado",
    PUBLISHED: "Publicado",
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          title="Gestionar traducciones"
        >
          <LanguagesIcon size={16} className="text-neutral-800" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Traducciones - {fieldLabel}</DialogTitle>
          <DialogDescription>
            Edita las traducciones de este campo (idioma por defecto: Español)
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {isLoadingEn || isLoadingPt ? (
            // Loading skeleton
            locales.map((locale) => (
              <div key={locale.code} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
                {fieldType === "textarea" ? (
                  <Skeleton className="h-20 w-full" />
                ) : (
                  <Skeleton className="h-10 w-full" />
                )}
              </div>
            ))
          ) : locales.length > 0 ? (
            locales.map((locale) => (
              <div key={locale.code} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`${fieldName}-${locale.code}`}>
                    {locale.name}
                  </Label>
                  <div className="flex items-center gap-2">
                    <Select
                      value={
                        translationStatuses[locale.code] ||
                        TranslationStatus.PUBLISHED
                      }
                      onValueChange={(value) =>
                        handleStatusChange(
                          locale.code,
                          value as TranslationStatus
                        )
                      }
                    >
                      <SelectTrigger className="w-32 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(statusLabels).map(([status, label]) => (
                          <SelectItem key={status} value={status}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSaveTranslation(locale.code)}
                      disabled={saveTranslation.isPending}
                    >
                      <Save className="h-3 w-3 mr-1" />
                      Guardar
                    </Button>
                  </div>
                </div>
                {fieldType === "textarea" ? (
                  <Textarea
                    id={`${fieldName}-${locale.code}`}
                    value={translations[locale.code] || ""}
                    onChange={(e) =>
                      handleTranslationChange(locale.code, e.target.value)
                    }
                    placeholder={`Traducción en ${locale.name}...`}
                    rows={3}
                  />
                ) : (
                  <Input
                    id={`${fieldName}-${locale.code}`}
                    value={translations[locale.code] || ""}
                    onChange={(e) =>
                      handleTranslationChange(locale.code, e.target.value)
                    }
                    placeholder={`Traducción en ${locale.name}...`}
                  />
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No hay idiomas adicionales configurados
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
