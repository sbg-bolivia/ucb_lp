"use client";

import { useClubLinks } from "@/hooks/useClubLinks";
import { CLUB } from "@/lib/club-brand";
import {
  clubEase,
  fadeUpProps,
  staggerContainer,
  staggerItem,
} from "@/lib/club-motion";
import {
  BookOpen,
  CalendarHeart,
  Globe2,
  MapPin,
  MessageCircle,
  Sparkles,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

import { clubTheme } from "./club-theme";

const stats = [
  {
    icon: Globe2,
    value: "AWS Cloud Clubs",
    label: "Red mundial de capítulos estudiantiles",
  },
  {
    icon: Users,
    value: "Todas las carreras",
    label: "No hace falta ser de sistemas para empezar",
  },
  {
    icon: MapPin,
    value: CLUB.city,
    label: "Presencial y online cuando aplique",
  },
  {
    icon: Sparkles,
    value: "100% estudiantil",
    label: "Aprendizaje entre pares y voluntariado",
  },
] as const;

const steps = [
  {
    n: "1",
    title: "Regístrate en Meetup",
    text: "Ahí publicamos fechas, lugares y materiales de cada actividad.",
    href: "/unete",
  },
  {
    n: "2",
    title: "Entra al grupo de WhatsApp",
    text: "Coordina dudas rápidas y avisos del día a día con la comunidad.",
    href: "/unete",
  },
  {
    n: "3",
    title: "Sumás a un taller o charla",
    text: "Labs en vivo, invitados y retos para armar portafolio en la nube.",
    href: "/eventos",
  },
] as const;

export function ClubHomeLandingExtras() {
  const links = useClubLinks();

  return (
    <>
      <section
        className={`relative border-b border-sky-200/50 px-4 py-14 sm:px-6 sm:py-20 dark:border-white/10 ${clubTheme.sectionSoft}`}
        aria-label="En resumen"
      >
        <div className="relative mx-auto max-w-7xl">
          <motion.div
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
          >
            {stats.map((s) => (
              <motion.div
                key={s.value}
                variants={staggerItem}
                className="flex gap-4 rounded-2xl border border-sky-200/60 bg-white/80 p-5 dark:border-white/10 dark:bg-zinc-900/60"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#3b41ff]/10 text-[#3b41ff] dark:bg-violet-500/15 dark:text-violet-300">
                  <s.icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div>
                  <p
                    className={`text-base font-bold leading-tight ${clubTheme.textHeading}`}
                  >
                    {s.value}
                  </p>
                  <p
                    className={`mt-1 text-sm leading-snug ${clubTheme.textMuted}`}
                  >
                    {s.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section
        className={`relative px-4 py-16 sm:px-6 sm:py-24 ${clubTheme.sectionTint}`}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_80%_20%,rgba(59,65,255,0.06),transparent)] dark:opacity-90" />

        <div className="relative mx-auto max-w-7xl">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            {...fadeUpProps}
          >
            <p className="text-sm font-bold uppercase tracking-widest text-[#3b41ff] dark:text-violet-300">
              Tu primer mes en el club
            </p>
            <h2
              className={`mt-3 text-3xl font-bold tracking-tight sm:text-4xl ${clubTheme.textHeading}`}
            >
              Tres pasos para no perderte nada
            </h2>
            <p className={`mt-4 text-lg ${clubTheme.textMuted}`}>
              Así suele arrancar quien se une al {CLUB.shortName}: claridad
              desde el día uno.
            </p>
          </motion.div>

          <motion.ol
            className="mt-12 grid gap-6 md:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
          >
            {steps.map((step) => (
              <motion.li
                key={step.n}
                variants={staggerItem}
                className={`relative flex flex-col ${clubTheme.card} p-7`}
              >
                <span
                  className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#6a11cb] text-sm font-bold text-white"
                  aria-hidden
                >
                  {step.n}
                </span>
                <h3 className={`text-lg font-bold ${clubTheme.textHeading}`}>
                  {step.title}
                </h3>
                <p
                  className={`mt-2 flex-1 text-sm leading-relaxed ${clubTheme.textMuted}`}
                >
                  {step.text}
                </p>
                <Link
                  href={step.href}
                  className="mt-5 text-sm font-semibold text-[#3b41ff] underline-offset-2 hover:underline dark:text-violet-300"
                >
                  Ver detalles →
                </Link>
              </motion.li>
            ))}
          </motion.ol>

          {(links.meetupUrl || links.whatsappUrl) && (
            <motion.div
              className="mt-12 flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-sky-200/70 bg-white/70 px-5 py-4 dark:border-white/10 dark:bg-zinc-900/50"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, ease: clubEase }}
            >
              <CalendarHeart className="h-5 w-5 shrink-0 text-[#3b41ff] dark:text-violet-300" />
              <p
                className={`text-center text-sm sm:text-base ${clubTheme.textMuted}`}
              >
                <span className={`font-semibold ${clubTheme.textHeading}`}>
                  Próximo paso:
                </span>{" "}
                {links.meetupUrl ? (
                  <a
                    href={links.meetupUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#3b41ff] underline-offset-2 hover:underline dark:text-violet-300"
                  >
                    abre Meetup
                  </a>
                ) : null}
                {links.meetupUrl && links.whatsappUrl ? " y " : null}
                {links.whatsappUrl ? (
                  <a
                    href={links.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#3b41ff] underline-offset-2 hover:underline dark:text-violet-300"
                  >
                    únete al WhatsApp
                  </a>
                ) : null}
                .
              </p>
            </motion.div>
          )}
        </div>
      </section>

      <section
        className={`relative border-y border-sky-200/50 px-4 py-16 sm:px-6 sm:py-20 dark:border-white/10 ${clubTheme.sectionSoft}`}
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.div {...fadeUpProps}>
              <p className="text-sm font-bold uppercase tracking-widest text-[#3b41ff] dark:text-violet-300">
                Qué vas a encontrar
              </p>
              <h2
                className={`mt-3 text-3xl font-bold tracking-tight sm:text-4xl ${clubTheme.textHeading}`}
              >
                Más que charlas: práctica con la consola y proyecto propio
              </h2>
              <p
                className={`mt-5 text-lg leading-relaxed ${clubTheme.textMuted}`}
              >
                Sesiones donde tocamos servicios reales, diseñamos arquitecturas
                sencillas y documentamos lo aprendido para tu CV o LinkedIn.
                Sumamos ética, costos y buenas prácticas desde el inicio.
              </p>
              <ul className="mt-8 space-y-3">
                {[
                  "Laboratorios guiados y retos por niveles",
                  "Espacio seguro para preguntar y equivocarse",
                  "Conexión con la red global de Cloud Clubs",
                ].map((line) => (
                  <li
                    key={line}
                    className={`flex gap-3 text-sm sm:text-base ${clubTheme.textMuted}`}
                  >
                    <BookOpen
                      className="mt-0.5 h-5 w-5 shrink-0 text-[#3b41ff] dark:text-violet-400"
                      aria-hidden
                    />
                    <span className="text-slate-700 dark:text-zinc-300">
                      {line}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/nosotros"
                  className="inline-flex items-center justify-center rounded-full bg-[#3b41ff] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:brightness-110 active:scale-[0.98]"
                >
                  Conocer misión y valores
                </Link>
                <Link
                  href="/beneficios"
                  className="inline-flex items-center justify-center rounded-full border border-sky-300/80 bg-white/90 px-6 py-2.5 text-sm font-semibold text-[#1e3a8a] transition hover:bg-sky-50 dark:border-white/15 dark:bg-zinc-800/80 dark:text-zinc-100 dark:hover:bg-zinc-800"
                >
                  Ver todos los beneficios
                </Link>
              </div>
            </motion.div>

            <motion.div
              className={`${clubTheme.card} p-8 sm:p-10`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: clubEase }}
            >
              <MessageCircle
                className="h-10 w-10 text-[#3b41ff] dark:text-violet-400"
                strokeWidth={1.5}
              />
              <h3
                className={`mt-4 text-xl font-bold sm:text-2xl ${clubTheme.textHeading}`}
              >
                ¿Preguntas antes de unirte?
              </h3>
              <p className={`mt-3 leading-relaxed ${clubTheme.textMuted}`}>
                Escríbenos al correo del club o pásate por la página de
                contacto. Respondemos lo antes posible (somos estudiantes
                voluntarios).
              </p>
              <a
                href={`mailto:${CLUB.email}`}
                className="mt-5 inline-flex break-all text-sm font-semibold text-[#3b41ff] underline-offset-2 hover:underline dark:text-violet-300"
              >
                {CLUB.email}
              </a>
              <Link
                href="/contacto"
                className="mt-6 block text-sm font-semibold text-[#6a11cb] dark:text-violet-300"
              >
                Formulario de contacto →
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
