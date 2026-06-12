"use client";

import { ClubEventVideo } from "@/components/club-landing/club-event-video";
import { fadeUpProps } from "@/lib/club-motion";
import type { RecapMediaItem } from "@/lib/event-recap";
import { motion } from "motion/react";
import Image from "next/image";

import { clubTheme } from "./club-theme";

export function ClubEventRecapGallery({ items }: { items: RecapMediaItem[] }) {
  if (!items.length) return null;

  return (
    <motion.section className="mt-10" {...fadeUpProps}>
      <h2 className={`mb-4 text-lg font-bold ${clubTheme.textHeading}`}>
        Así se vivió el evento
      </h2>
      <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
        {items.map((item, index) => (
          <motion.li
            key={`${item.url}-${index}`}
            className="overflow-hidden rounded-xl border border-[var(--border-soft)] bg-[var(--bg-soft-blue)] dark:bg-[var(--surface)]"
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.4, delay: index * 0.04 }}
          >
            {item.type === "video" ? (
              <div className="p-2">
                <ClubEventVideo url={item.url} preferPortrait size="sm" />
              </div>
            ) : (
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={item.url}
                  alt=""
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 640px) 50vw, 25vw"
                  loading="lazy"
                />
              </div>
            )}
          </motion.li>
        ))}
      </ul>
    </motion.section>
  );
}
