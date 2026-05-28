"use client";

import { CLUB } from "@/lib/club-brand";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type ClubNavLogoProps = {
  className?: string;
  heightClass?: string;
};

/**
 * Modo claro: /logo2.png (trazo negro).
 * Modo oscuro: /logo.png (adecuado para fondo oscuro).
 */
export function ClubNavLogo({
  className = "",
  heightClass = "h-9 sm:h-10",
}: ClubNavLogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const src = isDark ? "/logo.png" : "/logo2.png";

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 rounded-lg outline-offset-4 transition-opacity hover:opacity-90 ${className}`}
      aria-label={`Ir al inicio — ${CLUB.shortName}`}
    >
      <Image
        src={src}
        alt=""
        width={160}
        height={48}
        priority
        className={`${heightClass} w-auto object-contain object-left`}
        aria-hidden
      />
      <span className="hidden min-[380px]:flex flex-col items-start leading-tight">
        <span className="text-[10px] font-bold tracking-tight text-slate-900 sm:text-[11px] dark:text-white">
          AWS Student Builder Groups
        </span>
        <span className="text-[10px] font-medium uppercase tracking-wider text-slate-600 dark:text-white/75">
          UCB · La Paz
        </span>
      </span>
    </Link>
  );
}

type ClubMarkProps = {
  className?: string;
};

/** Marca hero/tarjetas: logo2 en claro, logo en oscuro. */
export function ClubMark({ className = "" }: ClubMarkProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const src = isDark ? "/logo.png" : "/logo2.png";

  return (
    <Image
      src={src}
      alt={`${CLUB.shortName} — ${CLUB.city}`}
      width={280}
      height={120}
      className={`h-auto w-full max-w-[min(100%,280px)] object-contain object-left ${className}`}
    />
  );
}
