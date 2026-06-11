"use client";

import { motion } from "motion/react";
import { clubTheme } from "./club-theme";

export function ClubCtaBand() {
  return (
    <section
      id="cta"
      className="bg-transparent pt-6 pb-8 sm:pt-8 sm:pb-10"
      aria-labelledby="cta-heading"
    >
      <div className={clubTheme.container}>
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`relative overflow-hidden rounded-2xl px-6 py-10 text-center sm:px-10 sm:py-12 ${clubTheme.gradientCta}`}
        >
          <div
            className="pointer-events-none absolute inset-0 club-grid opacity-[0.15] dark:opacity-[0.22]"
            aria-hidden
          />
        </motion.div>
      </div>
    </section>
  );
}
