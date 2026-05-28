"use client";

import { fadeUpProps } from "@/lib/club-motion";
import { motion } from "motion/react";

const STACK = [
  "AWS",
  "React",
  "TypeScript",
  "Python",
  "Docker",
  "GitHub",
  "PostgreSQL",
  "Terraform",
] as const;

export function ClubTechStackBar() {
  return (
    <section className="border-t border-white/5 bg-[#0a0b10] px-4 py-8 sm:px-6">
      <motion.div
        className="mx-auto max-w-7xl"
        {...fadeUpProps}
      >
        <p className="mb-6 text-center text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
          Construimos con las mejores tecnologías
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:gap-x-12">
          {STACK.map((name) => (
            <li
              key={name}
              className="text-sm font-semibold tracking-wide text-zinc-500 transition-colors hover:text-zinc-300"
            >
              {name}
            </li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
