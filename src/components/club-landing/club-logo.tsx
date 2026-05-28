"use client";

import { CLUB } from "@/lib/club-brand";
import { CLUB_LOGO } from "@/lib/club-brand-assets";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type ClubNavLogoProps = {
  className?: string;
  heightClass?: string;
};

export function ClubNavLogo({
  className = "",
  heightClass = "h-9 sm:h-10 md:h-11",
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
      className={`inline-flex min-w-0 items-center rounded-lg outline-offset-4 transition-opacity hover:opacity-90 ${className}`}
      aria-label={`Ir al inicio — ${CLUB.shortName}`}
    >
      <Image
        src={src}
        alt={`${CLUB.shortName} — UCB La Paz`}
        width={220}
        height={56}
        priority
        className={`${heightClass} w-auto max-w-[min(100%,220px)] object-contain object-left`}
      />
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
