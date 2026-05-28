"use client";

import { CLUB_LOGO } from "@/lib/club-brand-assets";
import { clubEase } from "@/lib/club-motion";
import Image from "next/image";
import { motion } from "motion/react";
import { useState } from "react";

type ClubPortalVisualProps = {
  /** `hero` más grande; `cta` versión compacta del pre-footer */
  variant?: "hero" | "cta";
  className?: string;
};

const HERO_VIDEO = process.env.NEXT_PUBLIC_HERO_VIDEO_URL ?? "/hero/chip-portal.webm";
const SPLINE_URL = process.env.NEXT_PUBLIC_SPLINE_SCENE_URL;

/**
 * Visual del “portal” con chip flotante.
 * Orden de prioridad: Spline (si hay URL) → video WebM → animación CSS.
 * Ver `public/hero/README.md` para exportar tu asset 3D.
 */
export function ClubPortalVisual({
  variant = "hero",
  className = "",
}: ClubPortalVisualProps) {
  const [videoFailed, setVideoFailed] = useState(false);
  const sizeClass =
    variant === "hero"
      ? "h-[min(72vw,520px)] w-full max-w-[560px]"
      : "h-[min(50vw,360px)] w-full max-w-[400px]";

  const useVideo = Boolean(HERO_VIDEO) && !videoFailed && !SPLINE_URL;

  return (
    <div
      className={`relative mx-auto flex items-center justify-center ${sizeClass} ${className}`}
    >
      {SPLINE_URL ? (
        <SplineEmbed url={SPLINE_URL} className="absolute inset-0 h-full w-full" />
      ) : null}

      {!SPLINE_URL && (
        <>
          {/* Haz de luz */}
          <div className="club-portal-beams pointer-events-none absolute inset-0" aria-hidden />

          {/* Anillos de suelo (perspectiva) */}
          <div
            className="pointer-events-none absolute bottom-[8%] left-1/2 w-[95%] -translate-x-1/2"
            aria-hidden
          >
            <div className="club-portal-floor relative aspect-[2.4/1] w-full">
              {[1, 0.82, 0.64, 0.48].map((scale, i) => (
                <motion.div
                  key={scale}
                  className="club-portal-ring absolute left-1/2 top-1/2 rounded-[50%] border"
                  style={{
                    width: `${scale * 100}%`,
                    height: `${scale * 42}%`,
                    marginLeft: `-${(scale * 100) / 2}%`,
                    marginTop: `-${(scale * 42) / 2}%`,
                    borderColor:
                      i % 2 === 0
                        ? "rgba(0, 200, 255, 0.45)"
                        : "rgba(126, 44, 255, 0.4)",
                    boxShadow:
                      i === 0
                        ? "0 0 40px rgba(0,200,255,0.35), 0 0 60px rgba(126,44,255,0.25)"
                        : undefined,
                  }}
                  animate={{ opacity: [0.5, 0.9, 0.5] }}
                  transition={{
                    duration: 3 + i * 0.4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: clubEase,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Video opcional (export desde Spline/Blender) */}
          {useVideo ? (
            <motion.video
              className="absolute z-20 h-[55%] w-[55%] object-contain drop-shadow-[0_0_48px_rgba(0,200,255,0.5)]"
              src={HERO_VIDEO}
              autoPlay
              loop
              muted
              playsInline
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: clubEase }}
              onError={() => setVideoFailed(true)}
              aria-label="Chip AWS SBG animado"
            />
          ) : (
            <FloatingChip variant={variant} />
          )}
        </>
      )}
    </div>
  );
}

function FloatingChip({ variant }: { variant: "hero" | "cta" }) {
  const chipSize =
    variant === "hero"
      ? "h-28 w-28 sm:h-36 sm:w-36 md:h-44 md:w-44"
      : "h-24 w-24 sm:h-32 sm:w-32";

  return (
    <motion.div
      className={`club-portal-chip relative z-20 ${chipSize}`}
      animate={{ y: [0, -14, 0], rotateY: [0, 8, 0, -8, 0] }}
      transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: clubEase }}
    >
      <div
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#22D3FF] via-[#4269F3] to-[#B14DFF] shadow-[0_0_50px_rgba(34,211,255,0.5),0_0_80px_rgba(177,77,255,0.35)]"
        aria-hidden
      />
      <div className="absolute inset-[3px] rounded-[14px] bg-gradient-to-br from-[#1e2030] to-[#0a0b10]" />
      <Image
        src={CLUB_LOGO.white}
        alt="AWS SBG chip"
        width={120}
        height={120}
        className="relative z-10 h-[72%] w-[72%] object-contain object-left-top p-2 drop-shadow-lg"
        style={{ clipPath: "inset(0 0 58% 0)" }}
        priority
      />
      {/* Brillo especular */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/25 via-transparent to-transparent"
        aria-hidden
      />
    </motion.div>
  );
}

function SplineEmbed({ url, className }: { url: string; className?: string }) {
  return (
    <iframe
      title="Visual 3D AWS SBG"
      src={url}
      className={className}
      loading="lazy"
      allow="fullscreen"
    />
  );
}
