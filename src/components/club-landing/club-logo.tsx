"use client";

import { CLUB } from "@/lib/club-brand";
import { CLUB_LOGO } from "@/lib/club-brand-assets";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type ClubNavLogoProps = {
  className?: string;
  heightClass?: string;
  showTitle?: boolean;
};

export function ClubNavLogo({
  className = "",
  heightClass = "h-8 w-auto sm:h-9",
  showTitle = true,
}: ClubNavLogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const src = isDark ? CLUB_LOGO.white : CLUB_LOGO.black;

  return (
    <Link
      href="/"
      className={`inline-flex min-w-0 items-center gap-2 rounded-lg outline-offset-4 transition-opacity hover:opacity-90 sm:gap-2.5 ${className}`}
      aria-label={`Ir al inicio — ${CLUB.navTitle}`}
    >
      <Image
        src={src}
        alt=""
        width={120}
        height={40}
        priority
        className={`${heightClass} shrink-0 object-contain object-left`}
      />
      {showTitle ? (
        <span
          className={`hidden min-w-0 max-w-[10.5rem] text-[11px] font-semibold leading-tight tracking-tight sm:max-w-[12rem] sm:text-xs md:inline-block lg:max-w-[15rem] lg:text-[13px] ${isDark ? "text-white" : "text-slate-900"}`}
        >
          {CLUB.navTitle}
        </span>
      ) : null}
    </Link>
  );
}

type ClubMarkProps = {
  className?: string;
  variant?: "full" | "icon";
};

/** Marca compacta (chip del logo) para hero / decoración. */
export function ClubMark({ className = "", variant = "full" }: ClubMarkProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const src = isDark ? CLUB_LOGO.white : CLUB_LOGO.black;

  if (variant === "icon") {
    return (
      <div
        className={`relative h-20 w-20 overflow-hidden rounded-2xl ${className}`}
        aria-hidden
      >
        <Image
          src={src}
          alt=""
          fill
          className="object-cover object-left-top scale-[2.2]"
        />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={`${CLUB.shortName}`}
      width={200}
      height={52}
      className={`h-auto w-full max-w-[200px] object-contain object-left ${className}`}
    />
  );
}
