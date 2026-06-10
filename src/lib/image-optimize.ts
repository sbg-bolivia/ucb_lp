export type OptimizedImageResult = {
  file: File;
  contentType: "image/webp" | "image/jpeg" | "image/png" | "image/gif";
  originalBytes: number;
  optimizedBytes: number;
};

type OptimizeOptions = {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
};

function supportsWebp(): boolean {
  if (typeof document === "undefined") return false;
  const canvas = document.createElement("canvas");
  return canvas.toDataURL("image/webp").startsWith("data:image/webp");
}

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

function scaleDimensions(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number
) {
  const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
  return {
    width: Math.max(1, Math.round(width * ratio)),
    height: Math.max(1, Math.round(height * ratio)),
  };
}

/**
 * Redimensiona y comprime imágenes en el cliente antes de subir a S3.
 * Convierte a WebP cuando el navegador lo soporta; si no, JPEG.
 */
export async function optimizeImageForUpload(
  file: File,
  options: OptimizeOptions = {}
): Promise<OptimizedImageResult> {
  const maxWidth = options.maxWidth ?? 1920;
  const maxHeight = options.maxHeight ?? 1920;
  const quality = options.quality ?? 0.82;
  const useWebp = supportsWebp();
  const contentType = useWebp ? "image/webp" : "image/jpeg";

  if (file.type === "image/gif") {
    return {
      file,
      contentType: "image/gif",
      originalBytes: file.size,
      optimizedBytes: file.size,
    };
  }

  if (!file.type.startsWith("image/")) {
    return {
      file,
      contentType: "image/jpeg",
      originalBytes: file.size,
      optimizedBytes: file.size,
    };
  }

  const img = await loadImage(file);
  const { width, height } = scaleDimensions(
    img.naturalWidth,
    img.naturalHeight,
    maxWidth,
    maxHeight
  );

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return {
      file,
      contentType: "image/jpeg",
      originalBytes: file.size,
      optimizedBytes: file.size,
    };
  }

  ctx.drawImage(img, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, contentType, quality);
  });

  if (!blob || blob.size >= file.size * 0.98) {
    return {
      file,
      contentType: useWebp ? "image/webp" : "image/jpeg",
      originalBytes: file.size,
      optimizedBytes: file.size,
    };
  }

  const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
  const ext = useWebp ? "webp" : "jpg";
  const optimizedFile = new File([blob], `${baseName}.${ext}`, {
    type: contentType,
    lastModified: Date.now(),
  });

  return {
    file: optimizedFile,
    contentType,
    originalBytes: file.size,
    optimizedBytes: optimizedFile.size,
  };
}
