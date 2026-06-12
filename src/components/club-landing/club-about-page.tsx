"use client";

import { CLUB } from "@/lib/club-brand";
import { fadeUpProps } from "@/lib/club-motion";
import { UNIVERSITY_IMAGES } from "@/lib/university-assets";
import { Cloud, Eye, Heart, Sparkles, Target } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";

import { clubTheme } from "./club-theme";
import { ClubPastelBlobs } from "./club-pastel-blobs";

const VALUES = [
  {
    icon: Target,
    title: "Nuestra misión",
    description:
      "Empoderar a estudiantes para construir soluciones reales en la nube, con práctica guiada y proyectos que suman al portafolio.",
    tint: "text-[var(--aws-orange)] bg-[var(--aws-orange)]/12 dark:bg-[var(--aws-orange)]/18 dark:text-[var(--aws-orange)]",
  },
  {
    icon: Eye,
    title: "Nuestra visión",
    description:
      "Ser la comunidad estudiantil de referencia en cloud computing en Bolivia, conectada al ecosistema global de AWS.",
    tint: "text-[var(--ucb-blue)] bg-[var(--ucb-blue-soft)]/35 dark:bg-sky-500/15 dark:text-sky-300",
  },
  {
    icon: Heart,
    title: "Nuestros valores",
    description:
      "Colaboración, curiosidad y aprendizaje práctico. Creemos en compartir conocimiento y crecer en equipo.",
    tint: "text-[var(--pastel-violet)] bg-[var(--pastel-violet-soft)] dark:bg-violet-500/15 dark:text-violet-300",
  },
] as const;

export function ClubAboutPage() {
  return (
    <>
      <section className={`relative overflow-hidden ${clubTheme.sectionY}`}>
        <ClubPastelBlobs subtle />
        <div
          className={`relative ${clubTheme.container} grid items-center gap-10 lg:grid-cols-2 lg:gap-14`}
        >
          <motion.div {...fadeUpProps} className="relative z-10">
            <h2
              className={`text-3xl font-bold tracking-tight sm:text-4xl ${clubTheme.textHeading}`}
            >
              Sobre nosotros
            </h2>
            <p className="mt-3 text-lg font-medium text-[var(--ucb-blue)] dark:text-sky-300">
              Estudiantes construyendo el futuro en la nube.
            </p>
            <p className={`mt-4 text-base leading-relaxed ${clubTheme.textMuted}`}>
              Somos el {CLUB.shortName} en {CLUB.city}: una comunidad que conecta
              el campus con el ecosistema AWS, sin importar tu carrera.
            </p>

            <ul className="mt-8 space-y-5">
              {VALUES.map((item, i) => (
                <motion.li
                  key={item.title}
                  className="flex gap-4"
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.45 }}
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${item.tint}`}
                  >
                    <item.icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className={`font-bold ${clubTheme.textHeading}`}>
                      {item.title}
                    </h3>
                    <p className={`mt-1 text-sm leading-relaxed ${clubTheme.textMuted}`}>
                      {item.description}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="relative mx-auto w-full max-w-lg lg:max-w-none"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="absolute -right-3 top-1/2 hidden h-[78%] w-14 -translate-y-1/2 rounded-[50%] bg-[var(--pastel-violet)]/35 blur-md dark:bg-[var(--pastel-violet)]/20 lg:block"
              aria-hidden
            />
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-[var(--border-soft)] shadow-[var(--shadow-soft)]">
              <Image
                src={UNIVERSITY_IMAGES.entrada}
                alt="Campus UCB La Paz"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>

            <div
              className="absolute -bottom-4 left-4 right-4 flex items-center gap-3 rounded-2xl border border-[var(--border-soft)] bg-[rgba(255,248,240,0.95)] p-4 shadow-lg backdrop-blur-sm sm:left-6 sm:right-auto sm:max-w-xs dark:bg-[var(--surface-soft)]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--ucb-blue)]/10 text-[var(--ucb-blue)] dark:bg-sky-500/15 dark:text-sky-300">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className={`text-sm font-bold leading-snug ${clubTheme.textHeading}`}>
                  Universidad Católica Boliviana &quot;San Pablo&quot;
                </p>
                <p className={`text-xs ${clubTheme.textMuted}`}>
                  La Paz · Cochabamba · Santa Cruz · Tarija
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className={`relative overflow-hidden ${clubTheme.sectionTint} py-10 sm:py-12`}>
        <ClubPastelBlobs subtle />
        <div className={`relative ${clubTheme.container}`}>
          <motion.div
            className="flex flex-col items-start gap-4 rounded-[1.75rem] border border-[var(--border-soft)] bg-gradient-to-r from-[var(--pastel-violet-soft)] via-[rgba(255,248,240,0.92)] to-[var(--bg-soft-blue)] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8 dark:from-[var(--surface)] dark:via-[var(--surface-soft)] dark:to-[var(--surface)]"
            {...fadeUpProps}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--ucb-blue)]/10 text-[var(--ucb-blue)] dark:bg-sky-500/15 dark:text-sky-300">
                <Cloud className="h-6 w-6" />
              </div>
              <div>
                <p className={`text-lg font-bold sm:text-xl ${clubTheme.textHeading}`}>
                  Construimos más que proyectos, construimos comunidad.
                </p>
                <p className={`mt-1 text-sm ${clubTheme.textMuted}`}>
                  Si tienes curiosidad y ganas de aprender, este es tu lugar.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
