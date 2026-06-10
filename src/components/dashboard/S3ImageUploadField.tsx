"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { optimizeImageForUpload } from "@/lib/image-optimize";
import type { S3UploadFolder } from "@/lib/s3-constants";
import { getInitials } from "@/lib/utils/avatar";
import { cn } from "@/lib/utils";
import { useTrpcMutation } from "@/utils/trpc-shallow";
import { trpc } from "@/utils/trpc";
import { Camera, ImagePlus, Link2, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";

const MAX_BYTES = 5 * 1024 * 1024;

type PreviewVariant = "wide" | "square" | "avatar" | "inline-avatar";

type Props = {
  id: string;
  label?: string;
  folder: S3UploadFolder;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  previewVariant?: PreviewVariant;
  /** Si S3 está activo, oculta URL por defecto */
  preferUpload?: boolean;
  /** Nombre para iniciales cuando no hay imagen (solo inline-avatar) */
  fallbackName?: string;
};

export function S3ImageUploadField({
  id,
  label,
  folder,
  value,
  onChange,
  placeholder = "Sube una imagen a S3",
  previewVariant = "wide",
  preferUpload = true,
  fallbackName = "",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [showManualUrl, setShowManualUrl] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  const { data: s3Status } = trpc.uploads.isConfigured.useQuery();
  const presignMut = useTrpcMutation(trpc.uploads.getPresignedImageUrl);

  const s3Enabled = s3Status?.enabled === true;
  const hasPreview = Boolean(value.trim()) && !previewError;
  const isInlineAvatar = previewVariant === "inline-avatar";

  const previewClass =
    previewVariant === "inline-avatar" || previewVariant === "avatar"
      ? "relative mx-auto h-24 w-24 overflow-hidden rounded-2xl"
      : previewVariant === "square"
        ? "relative aspect-square max-h-48 overflow-hidden rounded-xl"
        : "relative aspect-video max-h-44 overflow-hidden rounded-xl";

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Solo se permiten imágenes");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("La imagen debe pesar menos de 5 MB");
      return;
    }

    setUploading(true);
    setPreviewError(false);
    try {
      const optimized = await optimizeImageForUpload(file);
      const uploadFile = optimized.file;
      const contentType = uploadFile.type as
        | "image/jpeg"
        | "image/png"
        | "image/webp"
        | "image/gif";

      const { uploadUrl, publicUrl } = (await presignMut.mutateAsync({
        folder,
        fileName: uploadFile.name,
        contentType,
      })) as { uploadUrl: string; publicUrl: string };

      const res = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": contentType },
        body: uploadFile,
      });

      if (!res.ok) {
        throw new Error(`S3 respondió ${res.status}`);
      }

      onChange(publicUrl);
      const savedPct =
        optimized.originalBytes > 0
          ? Math.round(
              (1 - optimized.optimizedBytes / optimized.originalBytes) * 100
            )
          : 0;
      toast.success(
        savedPct > 5
          ? `Imagen optimizada y subida (−${savedPct}% peso)`
          : "Imagen subida a S3"
      );
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error al subir";
      toast.error(msg);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const fileInput = s3Enabled ? (
    <input
      ref={inputRef}
      type="file"
      accept="image/jpeg,image/png,image/webp,image/gif"
      className="hidden"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) void handleFile(file);
      }}
    />
  ) : null;

  if (isInlineAvatar) {
    const initials = getInitials(fallbackName) || "?";

    return (
      <div className="space-y-2">
        <div className="group relative mx-auto h-24 w-24">
          <div
            className={cn(
              previewClass,
              "border-2 border-primary/20 bg-muted shadow-inner"
            )}
          >
            {hasPreview ? (
              <Image
                src={value}
                alt={fallbackName || "Foto"}
                fill
                className="object-cover"
                sizes="96px"
                onError={() => setPreviewError(true)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#7E2CFF] to-[#00C8FF] text-xl font-bold text-white">
                {initials}
              </div>
            )}

            {uploading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-background/70">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center gap-1 rounded-2xl bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                {s3Enabled ? (
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8"
                    onClick={() => inputRef.current?.click()}
                    aria-label={hasPreview ? "Cambiar foto" : "Subir foto"}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                ) : null}
                {hasPreview ? (
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => {
                      onChange("");
                      setPreviewError(false);
                    }}
                    aria-label="Quitar foto"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>
            )}
          </div>
          {fileInput}
        </div>

        {!s3Enabled || showManualUrl ? (
          <div className="mx-auto max-w-xs space-y-1">
            <Input
              id={id}
              value={value}
              onChange={(e) => {
                setPreviewError(false);
                onChange(e.target.value);
              }}
              placeholder={placeholder}
              className="h-8 text-xs"
            />
          </div>
        ) : null}

        {s3Enabled ? (
          <div className="flex justify-center">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-muted-foreground"
              onClick={() => setShowManualUrl((v) => !v)}
            >
              <Link2 className="mr-1 h-3 w-3" />
              {showManualUrl ? "Ocultar URL" : "URL manual"}
            </Button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {label ? <Label htmlFor={id}>{label}</Label> : null}

      <div
        className={cn(
          "rounded-xl border border-dashed border-border/80 bg-muted/20 p-4",
          hasPreview && "border-solid"
        )}
      >
        {hasPreview ? (
          <div className={previewClass}>
            <Image
              src={value}
              alt="Vista previa"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 320px"
              onError={() => setPreviewError(true)}
            />
          </div>
        ) : (
          <div className="flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-lg bg-muted/30 py-8 text-center">
            <ImagePlus className="h-8 w-8 text-muted-foreground/60" />
            <p className="text-xs text-muted-foreground">
              {s3Enabled
                ? "Sube una imagen para ver la vista previa"
                : "Configura S3 o pega una URL"}
            </p>
          </div>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          {s3Enabled ? (
            <>
              {fileInput}
              <Button
                type="button"
                size="sm"
                disabled={uploading}
                onClick={() => inputRef.current?.click()}
              >
                {uploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ImagePlus className="mr-2 h-4 w-4" />
                )}
                {hasPreview ? "Cambiar imagen" : "Subir a S3"}
              </Button>
            </>
          ) : null}

          {value.trim() ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="text-destructive hover:text-destructive"
              onClick={() => {
                onChange("");
                setPreviewError(false);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Quitar
            </Button>
          ) : null}

          {s3Enabled && preferUpload ? (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setShowManualUrl((v) => !v)}
            >
              <Link2 className="mr-2 h-4 w-4" />
              {showManualUrl ? "Ocultar URL" : "URL manual"}
            </Button>
          ) : null}
        </div>

        {(!s3Enabled || !preferUpload || showManualUrl) && (
          <div className="mt-3 space-y-1">
            <Input
              id={id}
              value={value}
              onChange={(e) => {
                setPreviewError(false);
                onChange(e.target.value);
              }}
              placeholder={placeholder}
            />
          </div>
        )}
      </div>

      {s3Enabled ? (
        <p className="text-xs text-muted-foreground">
          JPG, PNG, WebP o GIF · máx. 5 MB · se optimiza al subir ·{" "}
          <code className="rounded bg-muted px-1">club/{folder}/</code>
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">
          S3 no configurado: configura S3_BUCKET en .env
        </p>
      )}
    </div>
  );
}
