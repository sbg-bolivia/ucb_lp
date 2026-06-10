"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

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

/** Modelo 3D del club — siempre visible tras hidratar (sin bloqueos por reduced-motion). */
export function ClubSiteModel({
  variant = "hero",
  autoRotate = true,
  onInteractingChange,
  className,
}: Props) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        className={className}
        aria-hidden
        style={{ minHeight: variant === "ambient" ? 200 : 280 }}
      />
    );
  }

  return (
    <div className={className}>
      <ClubHeroModel
        variant={variant}
        autoRotate={autoRotate}
        lightMode={resolvedTheme === "light" ? "light" : "dark"}
        onInteractingChange={onInteractingChange}
      />
    </div>
  );
}
