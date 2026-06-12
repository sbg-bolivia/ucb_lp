"use client";

import { cn } from "@/lib/utils";
import { parseVideoEmbed } from "@/lib/video-embed";
import { ExternalLink, Play } from "lucide-react";
import { useState } from "react";

type ClubEventVideoProps = {
  url: string;
  preferPortrait?: boolean;
  /** sm = galería · md = inline · lg = columna lateral completa */
  size?: "sm" | "md" | "lg";
};

export function ClubEventVideo({
  url,
  preferPortrait = true,
  size = "md",
}: ClubEventVideoProps) {
  const [playing, setPlaying] = useState(false);
  const embed = parseVideoEmbed(url);

  if (!embed) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--aws-orange)] hover:underline"
      >
        <ExternalLink className="h-4 w-4" />
        Ver video
      </a>
    );
  }

  const isLarge = size === "lg";
  const isSmall = size === "sm";

  const portraitFrame = cn(
    "relative w-full overflow-hidden",
    preferPortrait && "aspect-[9/16] max-h-[min(72vh,580px)]"
  );

  const shellClass = cn(
    portraitFrame,
    "rounded-xl border border-[var(--border-soft)] bg-black shadow-md dark:border-white/10",
    !isLarge && !preferPortrait && "aspect-video max-h-none",
    isSmall && "mx-auto max-w-[150px]",
    !isLarge && !isSmall && !preferPortrait && "mx-auto max-w-[220px]",
    !isLarge && !isSmall && preferPortrait && "mx-auto max-w-[220px]"
  );

  const mediaClass = cn(
    "h-full w-full bg-black",
    preferPortrait ? "object-cover object-center" : "object-contain"
  );

  const playShellClass = cn(
    shellClass,
    "group flex flex-col items-center justify-center gap-2.5 bg-gradient-to-b from-black/85 to-black p-4 text-center transition hover:border-[var(--aws-orange)]/40"
  );

  if (!playing) {
    return (
      <button
        type="button"
        onClick={() => setPlaying(true)}
        className={playShellClass}
        aria-label="Reproducir video del evento"
      >
        <span
          className={cn(
            "flex items-center justify-center rounded-full bg-[var(--aws-orange)] text-[var(--ucb-blue-dark)] shadow-md transition group-hover:scale-105",
            isLarge ? "h-12 w-12" : "h-10 w-10"
          )}
        >
          <Play
            className={cn("fill-current pl-0.5", isLarge ? "h-5 w-5" : "h-4 w-4")}
          />
        </span>
        <span className={cn("font-semibold text-white/85", isLarge ? "text-xs" : "text-[11px]")}>
          Reproducir video
        </span>
        <span className="text-[10px] text-white/50">Carga al tocar</span>
      </button>
    );
  }

  if (embed.type === "direct") {
    return (
      <div className={shellClass}>
        <video
          controls
          playsInline
          autoPlay
          preload="metadata"
          className={mediaClass}
          src={embed.embedUrl}
        >
          <track kind="captions" />
        </video>
      </div>
    );
  }

  const iframeShell = cn(
    "relative w-full overflow-hidden rounded-xl border border-[var(--border-soft)] bg-black shadow-md dark:border-white/10",
    isLarge ? "aspect-video" : shellClass
  );

  return (
    <div className={iframeShell}>
      <iframe
        title="Video del evento"
        src={embed.embedUrl}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
