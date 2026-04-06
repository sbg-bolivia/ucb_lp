"use client";

import { useClubLinks } from "@/hooks/useClubLinks";
import { CLUB } from "@/lib/club-brand";
import {
  clubEase,
  fadeUpProps,
  staggerContainer,
  staggerItem,
} from "@/lib/club-motion";
import { CalendarDays, Code2, GraduationCap, PartyPopper } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

import { ClubPublishedEvents } from "./club-published-events";
import { clubTheme } from "./club-theme";

const blocks = [
  {
    icon: Code2,
    title: "Labs y talleres",
    description:
      "Práctica guiada con consola AWS, arquitecturas sencillas y retos por niveles.",
  },
  {
    icon: GraduationCap,
    title: "Ruta hacia certificaciones",
    description:
      "Grupos de estudio, recursos y simulacros para acercarte a exámenes como Cloud Practitioner.",
  },
  {
    icon: CalendarDays,
    title: "Eventos y charlas",
    description:
      "Invitados de la industria, sesiones en vivo y espacios para preguntar sin filtro.",
  },
  {
    icon: PartyPopper,
    title: "Comunidad y networking",
    description:
      "Conoce a otros clubs, participa en hackathons y suma experiencia en equipo.",
  },
] as const;

function MeetupMark({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex h-6 w-6 items-center justify-center rounded bg-white text-[10px] font-bold text-[#F05663] ${className}`}
      aria-hidden
    >
      m
    </span>
  );
}

export function ClubActivities() {
  const links = useClubLinks();

  return (
    <section
      id="actividades"
      className={`relative px-4 py-20 sm:px-6 sm:py-28 ${clubTheme.sectionTint}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/60 to-transparent" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div className="mx-auto max-w-3xl text-center" {...fadeUpProps}>
          <p className="text-sm font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#3b41ff] to-[#6a11cb]">
            Qué hacemos
          </p>
          <h2
            className={`mt-3 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl ${clubTheme.textHeading}`}
          >
            Actividades que te suman experiencia
          </h2>
          <p className={`mt-5 text-lg ${clubTheme.textMuted}`}>
            En el {CLUB.shortName} combinamos teoría útil, práctica intensa y
            comunidad durante todo el año.
          </p>
        </motion.div>

        <ClubPublishedEvents />

        <motion.div
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          {blocks.map((b) => (
            <motion.article
              key={b.title}
              variants={staggerItem}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25, ease: clubEase }}
              className={`group relative overflow-hidden ${clubTheme.card} ${clubTheme.cardHover} p-8 sm:p-9`}
            >
              <div
                className="pointer-events-none absolute -right-6 -top-6 h-36 w-36 rounded-full bg-gradient-to-br from-[#3b41ff]/15 to-[#6a11cb]/10 blur-2xl transition-opacity group-hover:opacity-100"
                aria-hidden
              />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3b41ff] to-[#6a11cb] text-white shadow-md">
                <b.icon className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <h3
                className={`relative mt-5 text-xl font-bold ${clubTheme.textHeading}`}
              >
                {b.title}
              </h3>
              <p
                className={`relative mt-3 text-sm leading-relaxed sm:text-base ${clubTheme.textMuted}`}
              >
                {b.description}
              </p>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          className="mt-14 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: clubEase }}
        >
          {links.meetupUrl ? (
            <a
              href={links.meetupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex min-h-[48px] items-center justify-center gap-3 rounded-full px-8 py-3.5 text-base font-bold text-white transition hover:brightness-110 active:scale-[0.98] ${clubTheme.meetupHighlight}`}
            >
              <MeetupMark />
              Únete en Meetup — eventos del club
            </a>
          ) : (
            <Link
              href="/unete"
              className={`inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-8 py-3.5 text-base font-bold text-white ${clubTheme.meetupHighlight}`}
            >
              Ver enlace Meetup en Únete
            </Link>
          )}
          <Link
            href="/unete"
            className="inline-flex items-center rounded-full border-2 border-[#3b41ff] bg-white px-6 py-3 text-sm font-semibold text-[#3b41ff] shadow-sm transition hover:bg-violet-50 active:scale-[0.98] dark:border-violet-400 dark:bg-zinc-900/80 dark:text-violet-200 dark:hover:bg-zinc-800"
          >
            WhatsApp, TikTok y más redes
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
