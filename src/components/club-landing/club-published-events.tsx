"use client";

import { CLUB } from "@/lib/club-brand";
import { fadeUpProps, staggerContainer, staggerItem } from "@/lib/club-motion";
import { trpc } from "@/utils/trpc";
import { Calendar, ExternalLink, MapPin } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

import { clubTheme } from "./club-theme";

function formatRange(
  startsAt: Date | string | null,
  endsAt: Date | string | null
) {
  if (!startsAt) return "Fecha por confirmar";
  const s = new Date(startsAt);
  const fmt = new Intl.DateTimeFormat("es-BO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  if (!endsAt) return fmt.format(s);
  const e = new Intl.DateTimeFormat("es-BO", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(endsAt));
  return `${fmt.format(s)} — ${e}`;
}

export function ClubPublishedEvents() {
  const { data: events, isLoading } = trpc.clubEvents.listPublic.useQuery();

  if (isLoading) {
    return (
      <div className="mx-auto mb-14 max-w-3xl text-center">
        <p className={`text-sm ${clubTheme.textMuted}`}>Cargando eventos…</p>
      </div>
    );
  }

  if (!events?.length) {
    return (
      <motion.div
        className="mx-auto mb-14 max-w-3xl rounded-2xl border border-dashed border-sky-300/70 bg-white/50 px-6 py-10 text-center dark:border-white/15 dark:bg-zinc-900/40"
        {...fadeUpProps}
      >
        <Calendar className="mx-auto h-10 w-10 text-[#3b41ff] dark:text-violet-400" />
        <p className={`mt-4 text-lg font-semibold ${clubTheme.textHeading}`}>
          Pronto publicaremos fechas
        </p>
        <p className={`mt-2 text-sm sm:text-base ${clubTheme.textMuted}`}>
          El calendario del {CLUB.shortName} se actualiza en Meetup y en este
          sitio. Mientras tanto, únete en{" "}
          <Link
            href="/unete"
            className="font-semibold text-[#3b41ff] underline-offset-2 hover:underline dark:text-violet-300"
          >
            Únete
          </Link>{" "}
          para no perderte nada.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="mb-14"
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
    >
      <motion.div
        className="mx-auto mb-10 max-w-3xl text-center"
        {...fadeUpProps}
      >
        <p className="text-sm font-bold uppercase tracking-widest text-[#3b41ff] dark:text-violet-300">
          Calendario
        </p>
        <h2
          className={`mt-3 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl ${clubTheme.textHeading}`}
        >
          Próximos eventos y actividades
        </h2>
        <p className={`mt-3 text-base sm:text-lg ${clubTheme.textMuted}`}>
          Lo que el equipo ha publicado desde el panel de administración.
        </p>
      </motion.div>

      <ul className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2">
        {events.map((ev) => (
          <motion.li key={ev.id} variants={staggerItem}>
            <article
              className={`flex h-full flex-col overflow-hidden ${clubTheme.card} ${clubTheme.cardHover}`}
            >
              {ev.imageUrl?.trim() ? (
                <div className="relative aspect-[21/9] w-full bg-sky-100 dark:bg-zinc-800">
                  {/* eslint-disable-next-line @next/next/no-img-element -- URLs arbitrarias desde admin */}
                  <img
                    src={ev.imageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : null}
              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <div className="flex items-start gap-2 text-sm text-[#3b41ff] dark:text-violet-300">
                  <Calendar className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  <span className="font-medium leading-snug">
                    {formatRange(ev.startsAt, ev.endsAt)}
                  </span>
                </div>
                <h3
                  className={`mt-3 text-xl font-bold ${clubTheme.textHeading}`}
                >
                  <Link
                    href={`/eventos/${ev.id}`}
                    className="hover:text-[#00C8FF] transition-colors"
                  >
                    {ev.title}
                  </Link>
                </h3>
                {ev.description ? (
                  <p
                    className={`mt-2 line-clamp-4 text-sm leading-relaxed sm:text-base ${clubTheme.textMuted}`}
                  >
                    {ev.description}
                  </p>
                ) : null}
                {ev.location?.trim() ? (
                  <p
                    className={`mt-3 flex items-start gap-2 text-sm ${clubTheme.textMuted}`}
                  >
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                    <span className="text-slate-700 dark:text-zinc-300">
                      {ev.location}
                    </span>
                  </p>
                ) : null}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={`/eventos/${ev.id}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-4 py-2 text-xs font-semibold transition hover:border-[#00C8FF]/40 sm:text-sm dark:border-white/10"
                  >
                    Ver detalles
                  </Link>
                  {ev.externalUrl?.trim() ? (
                    <a
                      href={ev.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#3b41ff] px-4 py-2 text-xs font-semibold text-white transition hover:brightness-110 sm:text-sm"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Ver más / inscribirse
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
