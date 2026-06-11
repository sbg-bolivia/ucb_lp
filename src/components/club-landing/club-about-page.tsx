"use client";

import { CLUB } from "@/lib/club-brand";
import { fadeUpProps } from "@/lib/club-motion";
import { UNIVERSITY_IMAGES } from "@/lib/university-assets";
import { Eye, Target } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";

import { clubTheme } from "./club-theme";

const STATS = [
  { value: "4+", label: "Años de trayectoria" },
  { value: "120+", label: "Miembros activos" },
  { value: "25+", label: "Eventos realizados" },
  { value: "15+", label: "Talleres AWS" },
] as const;

const GALLERY = [
  { src: UNIVERSITY_IMAGES.communityDay, alt: "Community Day en el campus", position: "object-center" },
  { src: UNIVERSITY_IMAGES.awsCommunityDay2024, alt: "AWS Community Day 2024", position: "object-center" },
  { src: UNIVERSITY_IMAGES.goldenJackets, alt: "Golden Jackets del club", position: "object-[center_70%]" },
  { src: UNIVERSITY_IMAGES.awsUgLeads, alt: "Líderes AWS User Group", position: "object-center" },
  { src: UNIVERSITY_IMAGES.auditorio, alt: "Auditorio UCB", position: "object-[center_30%]" },
  { src: UNIVERSITY_IMAGES.communityDay2, alt: "Actividad en comunidad", position: "object-center" },
] as const;

export function ClubAboutPage() {
  return (
    <>
      <section
        className={`relative overflow-hidden border-b border-[var(--border-soft)] ${clubTheme.sectionSoft}`}
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute inset-y-0 right-0 w-1/2 bg-[var(--bg)] dark:bg-[var(--surface)]" />
        </div>

        <div className={`relative ${clubTheme.container} grid items-center gap-8 py-10 sm:py-12 lg:grid-cols-2 lg:gap-12`}>
          <motion.div {...fadeUpProps} className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--aws-orange)]">
              Sobre nosotros
            </p>
            <h2
              className={`mt-2 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl ${clubTheme.textHeading}`}
            >
              El puente entre la universidad y el{" "}
              <span className="text-[var(--aws-orange)]">ecosistema cloud</span>
            </h2>
            <p className={`mt-4 text-base leading-relaxed ${clubTheme.textMuted}`}>
              Somos el {CLUB.shortName} en {CLUB.city}: estudiantes que exploran
              AWS, construyen portafolio y se preparan para oportunidades reales
              en tecnología — sin importar la carrera.
            </p>
          </motion.div>

          <motion.div
            className="relative mx-auto w-full max-w-lg lg:max-w-none"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="absolute -right-2 top-6 hidden h-[88%] w-[88%] rounded-[2rem] border-2 border-[var(--aws-orange)]/70 lg:block"
              aria-hidden
            />
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[var(--border-soft)] shadow-lg">
              <Image
                src={UNIVERSITY_IMAGES.entrada}
                alt="Campus UCB La Paz"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className={`${clubTheme.sectionTint} py-8 sm:py-10`}>
        <div className={`${clubTheme.container} grid max-w-5xl gap-4 sm:grid-cols-2`}>
          <motion.article className={`p-6 ${clubTheme.card}`} {...fadeUpProps}>
            <Target className="h-7 w-7 text-[var(--aws-orange)]" />
            <h3 className={`mt-3 text-lg font-bold ${clubTheme.textHeading}`}>
              Nuestra misión
            </h3>
            <p className={`mt-2 text-sm leading-relaxed ${clubTheme.textMuted}`}>
              Empoderar a estudiantes para construir soluciones reales en la nube,
              con práctica guiada, mentoría entre pares y proyectos que suman al
              portafolio profesional.
            </p>
          </motion.article>
          <motion.article
            className={`p-6 ${clubTheme.card}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.06 }}
          >
            <Eye className="h-7 w-7 text-[var(--aws-orange)]" />
            <h3 className={`mt-3 text-lg font-bold ${clubTheme.textHeading}`}>
              Nuestra visión
            </h3>
            <p className={`mt-2 text-sm leading-relaxed ${clubTheme.textMuted}`}>
              Ser la comunidad estudiantil de referencia en cloud computing en
              Bolivia, conectada al ecosistema global de AWS y a las oportunidades
              del mercado tecnológico.
            </p>
          </motion.article>
        </div>
      </section>

      <section className="py-6 sm:py-8">
        <div className={`${clubTheme.container} max-w-5xl rounded-2xl px-5 py-6 sm:px-8 sm:py-7 ${clubTheme.card}`}>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-xl font-bold text-[var(--aws-orange)] sm:text-2xl">
                  {s.value}
                </p>
                <p className={`mt-0.5 text-xs sm:text-sm ${clubTheme.textMuted}`}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-8 sm:pb-10">
        <div className={`${clubTheme.container} mb-5 max-w-6xl`}>
          <h3 className={`text-xl font-bold sm:text-2xl ${clubTheme.textHeading}`}>
            Vida en el campus
          </h3>
          <p className={`mt-1 text-sm ${clubTheme.textMuted}`}>
            Talleres, community days y momentos del {CLUB.shortName}.
          </p>
        </div>
        <div className={`${clubTheme.container} grid max-w-6xl grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3`}>
          {GALLERY.map((item) => (
            <div
              key={item.src}
              className="group relative aspect-[4/3] overflow-hidden rounded-lg sm:rounded-xl"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className={`object-cover ${item.position} transition-transform duration-500 group-hover:scale-[1.03]`}
                sizes="(max-width: 640px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
