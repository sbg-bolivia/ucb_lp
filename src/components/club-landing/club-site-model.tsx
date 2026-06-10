"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

import type { ClubHeroModelProps } from "./club-hero-model";

const ClubHeroModel = dynamic(
  () => import("./club-hero-model").then((m) => m.ClubHeroModel),
  { ssr: false }
);

type Props = {
  variant?: ClubHeroModelProps["variant"];
  autoRotate?: boolean;
  onInteractingChange?: (interacting: boolean) => void;
  className?: string;
};

/** Modelo 3D — carga diferida cuando entra en viewport (hero). */
export function ClubSiteModel({
  variant = "hero",
  autoRotate = true,
  onInteractingChange,
  className,
}: Props) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(variant !== "hero");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (variant === "hero") {
      setVisible(true);
      void import("./club-hero-model").then((m) => {
        m.preloadHeroModel?.();
      });
      return;
    }
    if (!rootRef.current) return;
    const el = rootRef.current;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          void import("./club-hero-model").then((m) => {
            m.preloadHeroModel?.();
          });
          obs.disconnect();
        }
      },
      { rootMargin: "120px", threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [variant]);

  if (!mounted) {
    return (
      <div
        ref={rootRef}
        className={className}
        aria-hidden
        style={{ minHeight: variant === "ambient" ? 200 : 280 }}
      />
    );
  }

  return (
    <div ref={rootRef} className={className}>
      {visible ? (
        <ClubHeroModel
          variant={variant}
          autoRotate={autoRotate}
          lightMode={resolvedTheme === "light" ? "light" : "dark"}
          onInteractingChange={onInteractingChange}
        />
      ) : (
        <div
          className="flex h-full min-h-[200px] items-center justify-center text-xs text-[var(--text-muted)]"
          aria-hidden
        >
          …
        </div>
      )}
    </div>
  );
}
