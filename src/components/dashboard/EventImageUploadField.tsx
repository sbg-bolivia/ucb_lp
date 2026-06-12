"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  cropImageFile,
  defaultCropArea,
  type CropArea,
} from "@/lib/image-crop";
import { optimizeImageForUpload } from "@/lib/image-optimize";
import type { S3UploadFolder } from "@/lib/s3-constants";
import { cn } from "@/lib/utils";
import { useTrpcMutation } from "@/utils/trpc-shallow";
import { trpc } from "@/utils/trpc";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import NextImage from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const BANNER_ASPECT = 16 / 9;

type Props = {
  id: string;
  label?: string;
  folder: S3UploadFolder;
  value: string;
  onChange: (url: string) => void;
};

function CropPreview({
  src,
  crop,
  natural,
  aspectClass,
  label,
}: {
  src: string;
  crop: CropArea;
  natural: { width: number; height: number };
  aspectClass: string;
  label: string;
}) {
  const scaleX = 100 / crop.width;
  const scaleY = 100 / crop.height;
  const bgW = natural.width * scaleX;
  const bgH = natural.height * scaleY;
  const posX = -crop.x * scaleX;
  const posY = -crop.y * scaleY;

  return (
    <div className="space-y-1">
      <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
      <div
        className={cn(
          "relative overflow-hidden rounded-lg border border-border bg-muted",
          aspectClass
        )}
      >
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: `${bgW}% ${bgH}%`,
            backgroundPosition: `${posX}% ${posY}%`,
          }}
        />
      </div>
    </div>
  );
}

export function EventImageUploadField({
  id,
  label = "Imagen del evento",
  folder,
  value,
  onChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const [cropOpen, setCropOpen] = useState(false);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [natural, setNatural] = useState({ width: 0, height: 0 });
  const [crop, setCrop] = useState<CropArea | null>(null);
  const [panX, setPanX] = useState(50);
  const [panY, setPanY] = useState(50);
  const [zoom, setZoom] = useState(100);

  const { data: s3Status } = trpc.uploads.isConfigured.useQuery();
  const presignMut = useTrpcMutation(trpc.uploads.getPresignedImageUrl);
  const s3Enabled = s3Status?.enabled === true;
  const hasPreview = Boolean(value.trim()) && !previewError;

  const recomputeCrop = useCallback(
    (nw: number, nh: number, px: number, py: number, z: number) => {
      const base = defaultCropArea(nw, nh, BANNER_ASPECT);
      const zoomFactor = z / 100;
      const w = Math.max(1, Math.round(base.width / zoomFactor));
      const h = Math.max(1, Math.round(w / BANNER_ASPECT));
      const maxX = Math.max(0, nw - w);
      const maxY = Math.max(0, nh - h);
      const x = Math.round((px / 100) * maxX);
      const y = Math.round((py / 100) * maxY);
      setCrop({ x, y, width: w, height: h });
    },
    []
  );

  useEffect(() => {
    if (!natural.width || !natural.height) return;
    recomputeCrop(natural.width, natural.height, panX, panY, zoom);
  }, [natural, panX, panY, zoom, recomputeCrop]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const openCropper = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Solo se permiten imágenes");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen debe pesar menos de 5 MB");
      return;
    }

    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      setSourceFile(file);
      setPreviewUrl(url);
      setNatural({ width: img.naturalWidth, height: img.naturalHeight });
      setPanX(50);
      setPanY(50);
      setZoom(100);
      setCropOpen(true);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      toast.error("No se pudo leer la imagen");
    };
    img.src = url;
  };

  const closeCropper = () => {
    setCropOpen(false);
    setSourceFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setCrop(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const uploadCropped = async () => {
    if (!sourceFile || !crop) return;
    setUploading(true);
    try {
      const cropped = await cropImageFile(sourceFile, crop, {
        maxWidth: 1920,
        quality: 0.86,
      });
      const optimized = await optimizeImageForUpload(cropped, {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.84,
      });
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
      if (!res.ok) throw new Error(`S3 respondió ${res.status}`);

      onChange(publicUrl);
      setPreviewError(false);
      toast.success("Imagen recortada y subida");
      closeCropper();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error al subir");
    } finally {
      setUploading(false);
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
          <div className="space-y-3">
            <div className="relative aspect-video overflow-hidden rounded-xl">
              <NextImage
                src={value}
                alt="Vista previa del banner"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 480px"
                onError={() => setPreviewError(true)}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <p className="text-[11px] font-medium text-muted-foreground">
                  Vista en tarjeta
                </p>
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-muted">
                  <NextImage
                    src={value}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-medium text-muted-foreground">
                  Vista en detalle
                </p>
                <div className="relative aspect-[21/9] overflow-hidden rounded-lg border border-border bg-muted">
                  <NextImage
                    src={value}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-lg bg-muted/30 py-8 text-center">
            <ImagePlus className="h-8 w-8 text-muted-foreground/60" />
            <p className="text-xs text-muted-foreground">
              Sube una imagen y ajústala al recorte 16:9
            </p>
          </div>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          {s3Enabled ? (
            <>
              <input
                ref={inputRef}
                id={id}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void openCropper(file);
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
                  <ImagePlus className="mr-2 h-4 w-4" />
                )}
                {hasPreview ? "Cambiar imagen" : "Subir y recortar"}
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
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Relación 16:9 · se optimiza al subir · ocupa todo el ancho en tarjetas y
        detalle
      </p>

      <Dialog open={cropOpen} onOpenChange={(o) => !o && closeCropper()}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Recortar imagen del evento</DialogTitle>
          </DialogHeader>

          {previewUrl && crop ? (
            <div className="space-y-4">
              <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-black">
                <div
                  className="absolute inset-0 bg-cover bg-no-repeat"
                  style={{
                    backgroundImage: `url(${previewUrl})`,
                    backgroundSize: `${(natural.width / crop.width) * (zoom / 100) * 100}% auto`,
                    backgroundPosition: `${panX}% ${panY}%`,
                  }}
                />
                <div className="pointer-events-none absolute inset-3 rounded-md border-2 border-white/80 shadow-[inset_0_0_0_9999px_rgba(0,0,0,0.35)]" />
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs">Posición horizontal</Label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={panX}
                    className="w-full accent-[var(--aws-orange)]"
                    onChange={(e) => setPanX(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Posición vertical</Label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={panY}
                    className="w-full accent-[var(--aws-orange)]"
                    onChange={(e) => setPanY(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Zoom</Label>
                  <input
                    type="range"
                    min={100}
                    max={180}
                    value={zoom}
                    className="w-full accent-[var(--aws-orange)]"
                    onChange={(e) => setZoom(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <CropPreview
                  src={previewUrl}
                  crop={crop}
                  natural={natural}
                  aspectClass="aspect-[4/3]"
                  label="Tarjeta (4:3)"
                />
                <CropPreview
                  src={previewUrl}
                  crop={crop}
                  natural={natural}
                  aspectClass="aspect-[21/9]"
                  label="Página detalle"
                />
              </div>
            </div>
          ) : null}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeCropper}>
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={() => void uploadCropped()}
              disabled={uploading || !crop}
            >
              {uploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Aplicar y subir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
