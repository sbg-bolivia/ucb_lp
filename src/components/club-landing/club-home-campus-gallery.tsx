"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { fadeUpProps } from "@/lib/club-motion";
import { UNIVERSITY_IMAGES } from "@/lib/university-assets";
import { motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { clubTheme } from "./club-theme";

const GALLERY = [
  { src: UNIVERSITY_IMAGES.communityDay, alt: "Community Day en el campus", position: "object-center" },
  { src: UNIVERSITY_IMAGES.awsCommunityDay2024, alt: "AWS Community Day 2024", position: "object-center" },
  { src: UNIVERSITY_IMAGES.goldenJackets, alt: "Golden Jackets del club", position: "object-[center_70%]" },
  { src: UNIVERSITY_IMAGES.auditorio, alt: "Auditorio UCB", position: "object-[center_30%]" },
  { src: UNIVERSITY_IMAGES.enComunidad, alt: "Estudiantes en comunidad", position: "object-center" },
  { src: UNIVERSITY_IMAGES.communityDay2, alt: "Actividad del club", position: "object-center" },
] as const;

const VISIBLE_COLS = 4;
const AUTO_PLAY_MS = 5000;

export function ClubHomeCampusGallery() {
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setActiveIndex(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api || GALLERY.length <= VISIBLE_COLS) return;
    const id = window.setInterval(() => {
      if (api.canScrollNext()) api.scrollNext();
      else api.scrollTo(0);
    }, AUTO_PLAY_MS);
    return () => window.clearInterval(id);
  }, [api]);

  return (
    <section className={`pt-6 pb-8 sm:pt-8 sm:pb-10 ${clubTheme.sectionTint}`}>
      <div className={clubTheme.container}>
        <motion.div className="mb-5 max-w-2xl" {...fadeUpProps}>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--aws-orange)]">
            Vida en el campus
          </p>
          <h2 className={`mt-1.5 text-2xl font-bold tracking-tight sm:text-3xl ${clubTheme.textHeading}`}>
            Momentos que construyen comunidad
          </h2>
          <p className={`mt-1.5 text-sm ${clubTheme.textMuted}`}>
            Talleres, community days y actividades del AWS Student Builder Group UCB.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Carousel
            setApi={setApi}
            opts={{
              loop: GALLERY.length > VISIBLE_COLS,
              align: "start",
              duration: 45,
              dragFree: false,
            }}
            className="w-full"
            aria-label="Galería de fotos del campus"
          >
            <CarouselContent className="-ml-2 sm:-ml-2.5">
              {GALLERY.map((item, index) => (
                <CarouselItem
                  key={item.src}
                  className="basis-1/4 pl-2 sm:pl-2.5"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg sm:rounded-xl">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className={`object-cover transition-transform duration-700 ease-out ${item.position}`}
                      sizes="25vw"
                      priority={index < VISIBLE_COLS}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {GALLERY.length > VISIBLE_COLS ? (
            <div className="mt-3 flex items-center justify-center gap-1.5">
              {GALLERY.map((item, i) => (
                <button
                  key={item.src}
                  type="button"
                  aria-label={`Ir a la foto ${i + 1}: ${item.alt}`}
                  aria-current={i === activeIndex ? "true" : undefined}
                  onClick={() => api?.scrollTo(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === activeIndex
                      ? "w-7 bg-[var(--aws-orange)]"
                      : "w-1.5 bg-slate-300 hover:bg-slate-400 dark:bg-[var(--border-soft)] dark:hover:bg-slate-500"
                  }`}
                />
              ))}
            </div>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}
