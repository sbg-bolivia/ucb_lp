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
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const cardVariants: import("motion/react").Variants = {
  hidden: { opacity: 0, scale: 0.95, filter: "blur(15px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
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
  const featured = (events ?? []).slice(0, 3);

  return (
    <section
      className={`bg-transparent ${clubTheme.sectionY} ${clubTheme.pageBg}`}
      style={{ perspective: "1500px" }}
    >
      <div className="mx-auto max-w-7xl">
        <ClubSectionHeader
          eyebrow="Eventos destacados"
          title="Lo que viene"
          description="Talleres presenciales y online con labs reales en AWS."
        />

        {isLoading ? (
          <p className={`mt-10 text-center text-sm ${clubTheme.textMuted}`}>
            Cargando eventos…
          </p>
        ) : featured.length === 0 ? (
          <div
            className={`mt-10 rounded-2xl border border-dashed px-6 py-12 text-center ${clubTheme.card}`}
          >
            <p className={`text-lg font-semibold ${clubTheme.textHeading}`}>
              Pronto publicaremos eventos
            </p>
            <p className={`mt-2 text-sm ${clubTheme.textMuted}`}>
              Gestiona el calendario desde el panel de administración.
            </p>
            <Button asChild className="mt-6 rounded-full">
              <Link href="/eventos">Ver calendario</Link>
            </Button>
          </div>
        ) : (
          <motion.div
            className="mt-10 grid gap-12 lg:gap-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {featured.map((event, index) => {
              const badge = formatDateBadge(event.startsAt);
              const online = isOnlineLocation(event.location);
              const accent =
                index % 2 === 0
                  ? "from-[#00C8FF]/10"
                  : "from-[#7E2CFF]/10";

              return (
                <motion.article
                  key={event.id}
                  variants={cardVariants}
                  className={`club-glass group relative flex flex-col overflow-hidden rounded-[2rem] border border-black/[0.06] bg-white shadow-xl dark:border-white/5 dark:bg-[#0C0D12] lg:flex-row ${clubTheme.cardHover}`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${accent} to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                  />

                  <div className="relative block h-64 w-full shrink-0 overflow-hidden lg:h-auto lg:w-2/5">
                    <Link href={`/eventos/${event.id}`}>
                      <div className="h-full w-full">
                        <Image
                          src={event.imageUrl?.trim() || FALLBACK_IMAGE}
                          alt={event.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 1024px) 100vw, 40vw"
                          priority={index === 0}
                          loading={index === 0 ? undefined : "lazy"}
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 lg:bg-gradient-to-r dark:from-[#0C0D12]" />

                      <div className="absolute left-6 top-6 flex h-16 w-16 flex-col items-center justify-center rounded-2xl border border-white/20 bg-black/40 text-white shadow-xl backdrop-blur-md">
                        <span className="text-xl font-bold leading-none">
                          {badge.day}
                        </span>
                        <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[#00C8FF]">
                          {badge.month}
                        </span>
                      </div>
                    </Link>
                  </div>

                  <div className="relative flex flex-1 flex-col justify-center p-8 sm:p-10 lg:pl-12">
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${clubTheme.textMuted} border-black/[0.08] bg-black/[0.03] dark:border-white/10 dark:bg-white/5`}
                      >
                        {online ? (
                          <Video className="h-3.5 w-3.5" />
                        ) : (
                          <MapPin className="h-3.5 w-3.5" />
                        )}
                        {online ? "Online" : "Presencial"}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${clubTheme.textMuted} border-black/[0.08] bg-black/[0.03] dark:border-white/10 dark:bg-white/5`}
                      >
                        <Calendar className="h-3.5 w-3.5" />
                        {formatTimeRange(event.startsAt, event.endsAt)}
                      </span>
                    </div>

                    <h3
                      className={`mt-6 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl ${clubTheme.textHeading}`}
                    >
                      <Link
                        href={`/eventos/${event.id}`}
                        className="transition-colors hover:text-[#00C8FF]"
                      >
                        {event.title}
                      </Link>
                    </h3>

                    {event.location ? (
                      <div
                        className={`mt-4 flex items-center gap-2 ${clubTheme.textMuted}`}
                      >
                        <MapPin className="h-4 w-4 shrink-0 text-[#7E2CFF]" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                    ) : null}

                    <div className="relative z-20 mt-10 flex flex-wrap gap-4">
                      <Button
                        asChild
                        className="rounded-full bg-slate-900 px-8 text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                      >
                        <Link href={`/eventos/${event.id}`}>Ver detalles</Link>
                      </Button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
