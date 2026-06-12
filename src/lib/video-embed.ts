export type VideoEmbed = {
  type: "youtube" | "vimeo" | "direct";
  embedUrl: string;
  originalUrl: string;
};

export function parseVideoEmbed(url: string): VideoEmbed | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  const ytMatch =
    trimmed.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/
    ) ?? null;
  if (ytMatch?.[1]) {
    return {
      type: "youtube",
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}`,
      originalUrl: trimmed,
    };
  }

  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch?.[1]) {
    return {
      type: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
      originalUrl: trimmed,
    };
  }

  if (
    /\.(mp4|webm|ogg|mov)(\?|#|$)/i.test(trimmed) ||
    /amazonaws\.com/i.test(trimmed) ||
    /cloudfront\.net/i.test(trimmed)
  ) {
    return { type: "direct", embedUrl: trimmed, originalUrl: trimmed };
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return { type: "direct", embedUrl: trimmed, originalUrl: trimmed };
  }

  return null;
}
