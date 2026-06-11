"use client";

import { Button } from "@/components/ui/button";
import { trpc } from "@/utils/trpc";
import { Calendar, MapPin, Video } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ClubSectionHeader } from "./club-section-header";
import { clubTheme } from "./club-theme";

const containerVariants: import("motion/react").Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.08 },
  },
};

const cardVariants: import("motion/react").Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

function formatDateBadge(startsAt: Date | string | null) {
  if (!startsAt) return { day: "—", month: "TBD" };
  const d = new Date(startsAt);
  const day = d.getDate().toString();
  const month = new Intl.DateTimeFormat("es-BO", { month: "short" })
    .format(d)
    .toUpperCase()
    .replace(".", "");
  return { day, month };
}

function formatTimeRange(
  startsAt: Date | string | null,
  endsAt: Date | string | null
) {
  if (!startsAt) return "Horario por confirmar";
  const fmt = new Intl.DateTimeFormat("es-BO", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const start = fmt.format(new Date(startsAt));
  if (!endsAt) return start;
  return `${start} – ${fmt.format(new Date(endsAt))}`;
}

function isOnlineLocation(location: string | null | undefined) {
  if (!location) return false;
  return /zoom|online|virtual|remot/i.test(location);
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1540575467067-178ab98d8357?auto=format&fit=crop&w=900&q=80";

export function ClubHomeEvents() {
  const { data: events, isLoading } = trpc.clubEvents.listPublic.useQuery(
    undefined,
    { staleTime: 120_000 }
  );
  const featured = (events ?? []).slice(0, 4);

  return (
    <section className={`bg-transparent ${clubTheme.sectionY} ${clubTheme.pageBg}`}>
      <div className={clubTheme.container}>
        <ClubSectionHeader
          eyebrow="Eventos destacados"
          title="Lo que viene"
          description="Talleres presenciales y online con labs reales en AWS."
        />

        {isLoading ? (
          <p className={`mt-8 text-sm ${clubTheme.textMuted}`}>Cargando eventos…</p>
        ) : featured.length === 0 ? (
          <div
            className={`mt-8 rounded-2xl border border-dashed px-6 py-10 text-center ${clubTheme.card}`}
          >
            <p className={`text-base font-semibold ${clubTheme.textHeading}`}>
              Pronto publicaremos eventos
            </p>
            <p className={`mt-2 text-sm ${clubTheme.textMuted}`}>
              Gestiona el calendario desde el panel de administración.
            </p>
            <Button asChild className="mt-5 rounded-full">
              <Link href="/eventos">Ver calendario</Link>
            </Button>
          </div>
        ) : (
          <motion.ul
            className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {featured.map((event, index) => {
              const badge = formatDateBadge(event.startsAt);
              const online = isOnlineLocation(event.location);

              return (
                <motion.li key={event.id} variants={cardVariants}>
                  <article
                    className={`flex h-full flex-col overflow-hidden rounded-xl ${clubTheme.card} ${clubTheme.cardHover}`}
                  >
                    <Link
                      href={`/eventos/${event.id}`}
                      className="relative block aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-[var(--surface)]"
                    >
                      <Image
                        src={event.imageUrl?.trim() || FALLBACK_IMAGE}
                        alt={event.title}
                        fill
                        className="object-contain object-center transition-transform duration-500 group-hover:scale-[1.02]"
                        sizes="(max-width: 640px) 50vw, 25vw"
                        priority={index === 0}
                        loading={index === 0 ? undefined : "lazy"}
                      />
                      <div className="absolute left-3 top-3 flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-white/95 text-[var(--aws-ink)] shadow-md dark:bg-[var(--surface-soft)] dark:text-[var(--text-main)]">
                        <span className="text-sm font-bold leading-none">
                          {badge.day}
                        </span>
                        <span className="mt-0.5 text-[9px] font-bold uppercase tracking-wide text-[var(--aws-orange)]">
                          {badge.month}
                        </span>
                      </div>
                    </Link>

                    <div className="flex flex-1 flex-col p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${clubTheme.textMuted} border-slate-200 bg-slate-50 dark:border-[var(--border-soft)] dark:bg-white/5`}
                        >
                          {online ? (
                            <Video className="h-3 w-3" />
                          ) : (
                            <MapPin className="h-3 w-3" />
                          )}
                          {online ? "Online" : "Presencial"}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${clubTheme.textMuted} border-slate-200 bg-slate-50 dark:border-[var(--border-soft)] dark:bg-white/5`}
                        >
                          <Calendar className="h-3 w-3" />
                          {formatTimeRange(event.startsAt, event.endsAt)}
                        </span>
                      </div>

                      <h3 className={`mt-3 text-base font-bold leading-snug ${clubTheme.textHeading}`}>
                        <Link
                          href={`/eventos/${event.id}`}
                          className="transition-colors duration-300 hover:text-[var(--aws-orange)]"
                        >
                          {event.title}
                        </Link>
                      </h3>

                      {event.location ? (
                        <p className={`mt-2 line-clamp-1 text-xs ${clubTheme.textMuted}`}>
                          {event.location}
                        </p>
                      ) : null}

                      <div className="mt-4">
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="h-8 rounded-full text-xs"
                        >
                          <Link href={`/eventos/${event.id}`}>Ver detalles</Link>
                        </Button>
                      </div>
                    </div>
                  </article>
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </div>
    </section>
  );
}
