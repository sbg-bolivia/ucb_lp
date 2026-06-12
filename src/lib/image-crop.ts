export type CropArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("No se pudo leer la imagen"));
    };
    img.src = url;
  });
}

/** Área de recorte centrada con relación de aspecto fija (píxeles naturales). */
export function defaultCropArea(
  naturalWidth: number,
  naturalHeight: number,
  aspectRatio: number
): CropArea {
  let cropWidth = naturalWidth;
  let cropHeight = cropWidth / aspectRatio;

  if (cropHeight > naturalHeight) {
    cropHeight = naturalHeight;
    cropWidth = cropHeight * aspectRatio;
  }

  return {
    x: Math.round((naturalWidth - cropWidth) / 2),
    y: Math.round((naturalHeight - cropHeight) / 2),
    width: Math.round(cropWidth),
    height: Math.round(cropHeight),
  };
}

/** Recorta y exporta como WebP/JPEG según soporte del navegador. */
export async function cropImageFile(
  file: File,
  crop: CropArea,
  options?: { maxWidth?: number; quality?: number }
): Promise<File> {
  const img = await loadImage(file);
  const maxWidth = options?.maxWidth ?? 1920;
  const quality = options?.quality ?? 0.85;
  const scale = Math.min(1, maxWidth / crop.width);
  const outW = Math.max(1, Math.round(crop.width * scale));
  const outH = Math.max(1, Math.round(crop.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas no disponible");

  ctx.drawImage(
    img,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    outW,
    outH
  );

  const useWebp = canvas.toDataURL("image/webp").startsWith("data:image/webp");
  const mime = useWebp ? "image/webp" : "image/jpeg";
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, mime, quality);
  });
  if (!blob) throw new Error("No se pudo exportar la imagen recortada");

  const baseName = file.name.replace(/\.[^.]+$/, "") || "evento";
  const ext = useWebp ? "webp" : "jpg";
  return new File([blob], `${baseName}-crop.${ext}`, {
    type: mime,
    lastModified: Date.now(),
  });
}
