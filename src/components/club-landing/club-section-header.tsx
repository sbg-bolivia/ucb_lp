"use client";

import { fadeUpProps } from "@/lib/club-motion";
import { motion } from "motion/react";
import { clubTheme } from "./club-theme";

type ClubSectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function ClubSectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
}: ClubSectionHeaderProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <motion.header className={`w-full ${alignClass}`} {...fadeUpProps}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--aws-orange)]">
        {eyebrow}
      </p>
      <h2 className={`mt-2 text-2xl font-bold tracking-tight sm:text-3xl ${clubTheme.textHeading}`}>
        {title}
      </h2>
      {description ? (
        <p className={`mt-3 text-sm leading-relaxed sm:text-base ${clubTheme.textMuted}`}>
          {description}
        </p>
      ) : null}
    </motion.header>
  );
}
