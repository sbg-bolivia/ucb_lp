import { parseVideoEmbed } from "@/lib/video-embed";

export type RecapMediaItem = {
  url: string;
  type: "image" | "video";
};

function inferMediaType(url: string): RecapMediaItem["type"] {
  if (parseVideoEmbed(url)) return "video";
  return "image";
}

export function parseRecapGallery(value: unknown): RecapMediaItem[] {
  if (!Array.isArray(value)) return [];
  const items: RecapMediaItem[] = [];
  for (const entry of value) {
    if (typeof entry === "string" && entry.trim()) {
      const url = entry.trim();
      items.push({ url, type: inferMediaType(url) });
      continue;
    }
    if (
      entry &&
      typeof entry === "object" &&
      "url" in entry &&
      typeof (entry as { url: unknown }).url === "string"
    ) {
      const url = (entry as { url: string }).url.trim();
      if (!url) continue;
      const type =
        (entry as { type?: string }).type === "video" ||
        (entry as { type?: string }).type === "image"
          ? ((entry as { type: "image" | "video" }).type as RecapMediaItem["type"])
          : inferMediaType(url);
      items.push({ url, type });
    }
  }
  return items;
}

export function recapGalleryToLines(items: RecapMediaItem[]): string {
  return items.map((item) => item.url).join("\n");
}

export function linesToRecapGallery(text: string): RecapMediaItem[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((url) => ({ url, type: inferMediaType(url) }));
}
