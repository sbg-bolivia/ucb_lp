"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { S3UploadFolder } from "@/lib/s3-constants";
import { cn } from "@/lib/utils";
import { trpc } from "@/utils/trpc";
import { Film, Link2, Loader2, Trash2, Video } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

const MAX_BYTES = 50 * 1024 * 1024;

type Props = {
  id: string;
  label: string;
  folder: S3UploadFolder;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  preferUpload?: boolean;
};

export function S3VideoUploadField({
  id,
  label,
  folder,
  value,
  onChange,
  placeholder = "Sube un video a S3",
  preferUpload = true,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [showManualUrl, setShowManualUrl] = useState(false);

  const { data: s3Status } = trpc.uploads.isConfigured.useQuery();
  const presignMut = trpc.uploads.getPresignedVideoUrl.useMutation();

  const s3Enabled = s3Status?.enabled === true;
  const hasPreview = Boolean(value.trim());

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("video/")) {
      toast.error("Solo se permiten videos");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("El video debe pesar menos de 50 MB");
      return;
    }

    setUploading(true);
    try {
      const contentType = file.type as "video/mp4" | "video/webm";
      const { uploadUrl, publicUrl } = await presignMut.mutateAsync({
        folder,
        fileName: file.name,
        contentType,
      });

      const res = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": contentType },
        body: file,
      });

      if (!res.ok) {
        throw new Error(`S3 respondió ${res.status}`);
      }

      onChange(publicUrl);
      toast.success("Video subido a S3");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error al subir";
      toast.error(msg);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <Label htmlFor={id}>{label}</Label>

      <div
        className={cn(
          "rounded-xl border border-dashed border-border/80 bg-muted/20 p-4",
          hasPreview && "border-solid"
        )}
      >
        {hasPreview ? (
          <div className="overflow-hidden rounded-xl border border-border/60 bg-black">
            <video
              src={value}
              controls
              className="aspect-video max-h-44 w-full object-contain"
              preload="metadata"
            >
              <track kind="captions" />
            </video>
          </div>
        ) : (
          <div className="flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-lg bg-muted/30 py-8 text-center">
            <Film className="h-8 w-8 text-muted-foreground/60" />
            <p className="text-xs text-muted-foreground">
              {s3Enabled
                ? "Sube un video MP4 o WebM para ver la vista previa"
                : "Configura S3 o pega una URL"}
            </p>
          </div>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          {s3Enabled ? (
            <>
              <input
                ref={inputRef}
                type="file"
                accept="video/mp4,video/webm"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleFile(file);
                }}
              />
              <Button
                type="button"
                size="sm"
                disabled={uploading}
                onClick={() => inputRef.current?.click()}
              >
                {uploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Video className="mr-2 h-4 w-4" />
                )}
                {hasPreview ? "Cambiar video" : "Subir a S3"}
              </Button>
            </>
          ) : null}

          {value.trim() ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="text-destructive hover:text-destructive"
              onClick={() => onChange("")}
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
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
            />
          </div>
        )}
      </div>

      {s3Enabled ? (
        <p className="text-xs text-muted-foreground">
          MP4 o WebM · máx. 50 MB ·{" "}
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
