"use client";

import { isEventPast } from "@/lib/event-timing";
import { trpc } from "@/utils/trpc";
import { ArrowRight, Calendar, MapPin, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

import { clubTheme } from "./club-theme";

function formatDateBadge(startsAt: Date | string | null) {
  if (!startsAt) return { day: "—", month: "TBD" };
  const d = new Date(startsAt);
  return {
    day: String(d.getDate()),
    month: new Intl.DateTimeFormat("es-BO", { month: "short" })
      .format(d)
      .toUpperCase()
      .replace(".", ""),
  };
}

function formatTimeShort(
  startsAt: Date | string | null,
  endsAt: Date | string | null
) {
  if (!startsAt) return "Por confirmar";
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
  return /zoom|online|virtual|remot|meet/i.test(location);
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1540575467067-178ab98d8357?auto=format&fit=crop&w=640&q=70";

export function ClubHomeEvents() {
  const { data: events, isLoading } = trpc.clubEvents.listPublic.useQuery(
    undefined,
    { staleTime: 180_000, refetchOnWindowFocus: false }
  );

  const featured = useMemo(() => {
    const list = events ?? [];
    const upcoming = list
      .filter((e) => !isEventPast(e))
      .sort((a, b) => {
        const ta = a.startsAt ? new Date(a.startsAt).getTime() : Number.POSITIVE_INFINITY;
        const tb = b.startsAt ? new Date(b.startsAt).getTime() : Number.POSITIVE_INFINITY;
        return ta - tb;
      });

    if (upcoming.length > 0) return upcoming.slice(0, 4);

    return [...list]
      .sort((a, b) => {
        const ta = a.startsAt ? new Date(a.startsAt).getTime() : 0;
        const tb = b.startsAt ? new Date(b.startsAt).getTime() : 0;
        return tb - ta;
      })
      .slice(0, 4);
  }, [events]);

  const showingPast = featured.length > 0 && featured.every((e) => isEventPast(e));

  return (
    <section className={`bg-transparent ${clubTheme.sectionYCompact} ${clubTheme.pageBg}`}>
      <div className={clubTheme.container}>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--aws-orange)]">
              Eventos destacados
            </p>
            <h2 className={`mt-1 text-xl font-bold sm:text-2xl ${clubTheme.textHeading}`}>
              Lo que viene
            </h2>
            {showingPast ? (
              <p className={`mt-1 text-xs ${clubTheme.textMuted}`}>
                Últimos eventos del club
              </p>
            ) : (
              <p className={`mt-1 hidden text-xs sm:block ${clubTheme.textMuted}`}>
                Talleres presenciales y online con labs en AWS.
              </p>
            )}
          </div>
          <Link
            href="/eventos"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--aws-orange)] transition hover:text-[#E88B00]"
          >
            Ver todos
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-[168px] animate-pulse rounded-xl bg-black/[0.04] dark:bg-white/[0.04]"
                aria-hidden
              />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div
            className={`rounded-xl border border-dashed px-4 py-6 text-center ${clubTheme.card}`}
          >
            <p className={`text-sm font-semibold ${clubTheme.textHeading}`}>
              Pronto publicaremos eventos
            </p>
            <Link
              href="/eventos"
              className="mt-3 inline-flex text-xs font-semibold text-[var(--aws-orange)]"
            >
              Ir al calendario →
            </Link>
          </div>
        ) : (
          <ul className="mx-auto grid max-w-5xl gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((event, index) => {
              const badge = formatDateBadge(event.startsAt);
              const online = event.isOnline || isOnlineLocation(event.location);
              const past = isEventPast(event);
              const href = `/eventos/${event.id}`;

              return (
                <li key={event.id}>
                  <article
                    className={`group flex h-full flex-col overflow-hidden rounded-xl ${clubTheme.card} transition-shadow hover:shadow-md`}
                  >
                    <Link
                      href={href}
                      className="relative block aspect-[16/10] overflow-hidden bg-[var(--bg-soft-blue)] dark:bg-[var(--surface)]"
                    >
                      <Image
                        src={event.imageUrl?.trim() || FALLBACK_IMAGE}
                        alt=""
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
                        quality={70}
                        loading={index < 2 ? "eager" : "lazy"}
                        priority={index === 0}
                      />
                      <div className="absolute left-2 top-2 flex h-9 w-9 flex-col items-center justify-center rounded-md bg-white/95 text-[var(--aws-ink)] shadow-sm dark:bg-[var(--surface-soft)] dark:text-[var(--text-main)]">
                        <span className="text-[11px] font-bold leading-none">
                          {badge.day}
                        </span>
                        <span className="mt-0.5 text-[7px] font-bold uppercase text-[var(--aws-orange)]">
                          {badge.month}
                        </span>
                      </div>
                      {past ? (
                        <span className="absolute right-2 top-2 rounded-full bg-black/55 px-1.5 py-0.5 text-[8px] font-bold uppercase text-white">
                          Pasado
                        </span>
                      ) : null}
                    </Link>

                    <div className="flex flex-1 flex-col p-2.5">
                      <div className="flex flex-wrap gap-1">
                        <span
                          className={`inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[9px] font-medium ${clubTheme.textMuted} border-[var(--border-soft)] bg-white/50 dark:bg-white/5`}
                        >
                          {online ? (
                            <Video className="h-2.5 w-2.5" />
                          ) : (
                            <MapPin className="h-2.5 w-2.5" />
                          )}
                          {online ? "Online" : "Presencial"}
                        </span>
                        <span
                          className={`inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[9px] font-medium ${clubTheme.textMuted} border-[var(--border-soft)] bg-white/50 dark:bg-white/5`}
                        >
                          <Calendar className="h-2.5 w-2.5" />
                          {formatTimeShort(event.startsAt, event.endsAt)}
                        </span>
                      </div>

                      <h3 className={`mt-1.5 line-clamp-2 text-xs font-bold leading-snug ${clubTheme.textHeading}`}>
                        <Link
                          href={href}
                          className="transition-colors hover:text-[var(--aws-orange)]"
                        >
                          {event.title}
                        </Link>
                      </h3>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
