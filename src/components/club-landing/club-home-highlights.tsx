"use client";

import { CLUB } from "@/lib/club-brand";
import {
  clubEase,
  fadeUpProps,
  staggerContainer,
  staggerItem,
} from "@/lib/club-motion";
import { useClubLinks } from "@/hooks/useClubLinks";
import { ArrowUpRight, Cloud, Rocket, UserCircle2, Users } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

import { clubTheme } from "./club-theme";

const items = [
  {
    href: "/beneficios",
    icon: Rocket,
    title: "Beneficios",
    text: "Certificaciones, labs, networking y más — al estilo de capítulos como AWS UD.",
  },
  {
    href: "/eventos",
    icon: Cloud,
    title: "Eventos",
    text: "Talleres, charlas y retos prácticos durante el año.",
  },
  {
    href: "/nosotros",
    icon: Users,
    title: "Nosotros",
    text: `Misión y valores en la ${CLUB.fullUniversity}.`,
  },
  {
    href: "/equipo",
    icon: UserCircle2,
    title: "Core team",
    text: "Las personas que coordinan el club y te acompañan en el camino.",
  },
] as const;

export function ClubHomeHighlights() {
  const links = useClubLinks();

  return (
    <section className={`relative px-4 py-20 sm:px-6 sm:py-28 ${clubTheme.sectionTint}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(59,65,255,0.06),transparent)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(99,102,241,0.12),transparent)]" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div className="mx-auto max-w-3xl text-center" {...fadeUpProps}>
          <h2
            className={`text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl ${clubTheme.textHeading}`}
          >
            ¿Por qué unirte al {CLUB.shortName}?
          </h2>
          <p className={`mt-5 text-lg ${clubTheme.textMuted}`}>
            Inspirados en la experiencia de clubes como{" "}
            <a
              href="https://awsud.club/benefits"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#3b41ff] underline-offset-2 hover:underline dark:text-violet-300"
            >
              AWS Student Builder Group Universidad Distrital
            </a>
            .
          </p>
        </motion.div>

        <motion.div
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
          {items.map((item) => (
            <motion.div key={item.href} variants={staggerItem}>
              <Link
                href={item.href}
                className={`group flex h-full flex-col ${clubTheme.card} ${clubTheme.cardHover} p-7`}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3b41ff] to-[#6a11cb] text-white shadow-md">
                  <item.icon className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <h3 className={`text-lg font-bold ${clubTheme.textHeading}`}>
                  {item.title}
                </h3>
                <p className={`mt-2 flex-1 text-sm leading-relaxed ${clubTheme.textMuted}`}>
                  {item.text}
                </p>
                <span className="mt-4 inline-flex items-center text-sm font-semibold text-[#5c27c4] transition group-hover:text-[#3b41ff] dark:text-violet-300 dark:group-hover:text-violet-200">
                  Ver más
                  <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-14 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: clubEase }}
        >
          {links.meetupUrl ? (
            <a
              href={links.meetupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold text-white transition hover:brightness-110 active:scale-[0.98] ${clubTheme.meetupHighlight}`}
            >
              <span
                className="flex h-6 w-6 items-center justify-center rounded bg-white text-[10px] font-bold text-[#F05663]"
                aria-hidden
              >
                m
              </span>
              Únete en Meetup (principal)
            </a>
          ) : null}
          <Link
            href="/unete"
            className={`inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r px-8 text-sm font-semibold text-white shadow-md transition hover:opacity-95 active:scale-[0.98] ${clubTheme.gradientButton}`}
          >
            Todas las redes
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
