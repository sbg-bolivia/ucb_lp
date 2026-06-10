"use client";

import { useClubLinks } from "@/hooks/useClubLinks";
import { CLUB } from "@/lib/club-brand";
import { registrationButtonLabel } from "@/lib/event-labels";
import { resolveEventRegistrationUrl } from "@/lib/event-registration-url";
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
  const links = useClubLinks();
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

      <ul className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((ev) => {
          const registrationUrl = resolveEventRegistrationUrl(ev, links.meetupUrl);

          return (
            <motion.li key={ev.id} variants={staggerItem}>
              <article
                className={`flex h-full flex-col overflow-hidden ${clubTheme.card} ${clubTheme.cardHover}`}
              >
                {ev.imageUrl?.trim() ? (
                  <div className="relative h-36 w-full shrink-0 bg-sky-100 dark:bg-zinc-800 sm:h-32">
                    {/* eslint-disable-next-line @next/next/no-img-element -- URLs arbitrarias desde admin */}
                    <img
                      src={ev.imageUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : null}
                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <div className="flex items-start gap-2 text-xs text-[#3b41ff] dark:text-violet-300">
                    <Calendar
                      className="mt-0.5 h-3.5 w-3.5 shrink-0"
                      aria-hidden
                    />
                    <span className="font-medium leading-snug line-clamp-2">
                      {formatRange(ev.startsAt, ev.endsAt)}
                    </span>
                  </div>
                  <h3
                    className={`mt-2 text-base font-bold leading-snug sm:text-lg ${clubTheme.textHeading}`}
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
                      className={`mt-1.5 line-clamp-2 text-sm leading-relaxed ${clubTheme.textMuted}`}
                    >
                      {ev.description}
                    </p>
                  ) : null}
                  {ev.location?.trim() ? (
                    <p
                      className={`mt-2 flex items-start gap-1.5 text-xs ${clubTheme.textMuted}`}
                    >
                      <MapPin
                        className="mt-0.5 h-3.5 w-3.5 shrink-0"
                        aria-hidden
                      />
                      <span className="line-clamp-1 text-slate-700 dark:text-zinc-300">
                        {ev.location}
                      </span>
                    </p>
                  ) : null}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link
                      href={`/eventos/${ev.id}`}
                      className="inline-flex items-center gap-1 rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold transition hover:border-[#00C8FF]/40 dark:border-white/10"
                    >
                      Ver detalles
                    </Link>
                    {registrationUrl ? (
                      <a
                        href={registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-full bg-[#3b41ff] px-3 py-1.5 text-xs font-semibold text-white transition hover:brightness-110"
                      >
                        <ExternalLink className="h-3 w-3" />
                        {registrationButtonLabel(ev.registrationType)}
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
}
