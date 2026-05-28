"use client";

import { fadeUpProps } from "@/lib/club-motion";
import { motion } from "motion/react";

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
    <motion.header className={`max-w-3xl ${alignClass}`} {...fadeUpProps}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00C8FF]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-zinc-400 sm:text-lg">
          {description}
        </p>
      ) : null}
    </motion.header>
  );
}
