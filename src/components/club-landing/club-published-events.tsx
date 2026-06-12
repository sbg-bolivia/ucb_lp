"use client";

import { ClubMeetupButton } from "@/components/club-landing/club-meetup-button";
import { ClubPaginationBar } from "@/components/club-landing/club-pagination-bar";
import { useClubLinks } from "@/hooks/useClubLinks";
import { CLUB } from "@/lib/club-brand";
import {
  EVENT_CATEGORY_LABELS,
  EVENT_FILTER_LABELS,
  type EventFilterCategory,
  inferEventCategory,
  matchesEventFilter,
} from "@/lib/event-category";
import { resolveEventRegistrationUrl } from "@/lib/event-registration-url";
import { registrationButtonLabel } from "@/lib/event-labels";
import { fadeUpProps } from "@/lib/club-motion";
import { UNIVERSITY_IMAGES } from "@/lib/university-assets";
import { trpc } from "@/utils/trpc";
import { Calendar, Clock, ExternalLink, MapPin } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { ClubFilterPills } from "./club-filter-pills";
import { clubTheme } from "./club-theme";

const PAGE_SIZE = 8;

const FILTER_OPTIONS = (
  Object.keys(EVENT_FILTER_LABELS) as EventFilterCategory[]
).map((value) => ({ value, label: EVENT_FILTER_LABELS[value] }));

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

function formatDuration(
  startsAt: Date | string | null,
  endsAt: Date | string | null
) {
  if (!startsAt || !endsAt) return null;
  const hours = Math.round(
    (new Date(endsAt).getTime() - new Date(startsAt).getTime()) / 3_600_000
  );
  if (hours < 1) return "1 hora";
  return `${hours} horas`;
}

const CATEGORY_IMAGES: Record<Exclude<EventFilterCategory, "all">, string> = {
  workshop: UNIVERSITY_IMAGES.auditorio,
  talk: UNIVERSITY_IMAGES.awsUgLeads,
  certification: UNIVERSITY_IMAGES.biblioteca,
  networking: UNIVERSITY_IMAGES.enComunidad,
};

export function ClubPublishedEvents() {
  const links = useClubLinks();
  const [filter, setFilter] = useState<EventFilterCategory>("all");
  const [page, setPage] = useState(1);
  const { data: events, isLoading } = trpc.clubEvents.listPublic.useQuery();

  const filtered = useMemo(
    () => (events ?? []).filter((ev) => matchesEventFilter(ev, filter)),
    [events, filter]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const onFilterChange = (value: EventFilterCategory) => {
    setFilter(value);
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="mb-10 text-center">
        <p className={`text-sm ${clubTheme.textMuted}`}>Cargando eventos…</p>
      </div>
    );
  }

  if (!events?.length) {
    return (
      <motion.div
        className={`mb-10 rounded-2xl border border-dashed px-6 py-10 text-center ${clubTheme.card}`}
        {...fadeUpProps}
      >
        <Calendar className="mx-auto h-9 w-9 text-[var(--aws-orange)]" />
        <p className={`mt-4 text-base font-semibold ${clubTheme.textHeading}`}>
          Pronto publicaremos fechas
        </p>
        <p className={`mt-2 text-sm ${clubTheme.textMuted}`}>
          El calendario del {CLUB.shortName} se actualiza en Meetup y en este
          sitio.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="mb-10">
      <motion.div className="mb-8 w-full" {...fadeUpProps}>
        <h2 className={`text-2xl font-bold tracking-tight sm:text-3xl ${clubTheme.textHeading}`}>
          Eventos
        </h2>
        <p className={`mt-2 text-sm sm:text-base ${clubTheme.textMuted}`}>
          Aprende, construye y conecta con la comunidad en nuestros eventos y
          talleres.
        </p>
        <div className="mt-5">
          <ClubFilterPills
            options={FILTER_OPTIONS}
            value={filter}
            onChange={onFilterChange}
          />
        </div>
      </motion.div>

      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <h3 className={`text-lg font-semibold ${clubTheme.textHeading}`}>
          Próximos eventos
        </h3>
        {links.meetupUrl ? (
          <Link
            href={links.meetupUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-[var(--aws-orange)] transition-colors duration-300 hover:text-[#E88B00]"
          >
            Ver todos los eventos →
          </Link>
        ) : null}
      </div>

      {pageItems.length === 0 ? (
        <p className={`py-10 text-center text-sm ${clubTheme.textMuted}`}>
          No hay eventos en esta categoría.
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {pageItems.map((ev) => {
            const badge = formatDateBadge(ev.startsAt);
            const cat = inferEventCategory(ev);
            const duration = formatDuration(ev.startsAt, ev.endsAt);
            const registrationUrl = resolveEventRegistrationUrl(
              ev,
              links.meetupUrl
            );
            const thumb = ev.imageUrl?.trim() || CATEGORY_IMAGES[cat];

            return (
              <li key={ev.id}>
                <article
                  className={`flex h-full flex-col overflow-hidden rounded-xl ${clubTheme.card} ${clubTheme.cardHover}`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-[var(--surface)]">
                    <Image
                      src={thumb}
                      alt=""
                      fill
                      className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute left-3 top-3 flex items-start gap-2">
                      <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg bg-white/95 text-[var(--aws-ink)] shadow-md dark:bg-[var(--surface-soft)] dark:text-[var(--text-main)]">
                        <span className="text-sm font-bold leading-none">
                          {badge.day}
                        </span>
                        <span className="mt-0.5 text-[9px] font-bold uppercase">
                          {badge.month}
                        </span>
                      </div>
                      <span className="rounded-full border border-white/30 bg-black/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
                        {EVENT_CATEGORY_LABELS[cat]}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <h4 className={`text-sm font-bold leading-snug ${clubTheme.textHeading}`}>
                      <Link
                        href={`/eventos/${ev.id}`}
                        className="transition-colors duration-300 hover:text-[var(--aws-orange)]"
                      >
                        {ev.title}
                      </Link>
                    </h4>

                    {ev.description ? (
                      <p className={`mt-2 line-clamp-2 flex-1 text-xs leading-relaxed ${clubTheme.textMuted}`}>
                        {ev.description}
                      </p>
                    ) : (
                      <div className="flex-1" />
                    )}

                    <div className={`mt-3 flex flex-wrap gap-2 text-xs ${clubTheme.textMuted}`}>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-[var(--aws-orange)]" />
                        {ev.isOnline ? "Online" : ev.location ?? "Por confirmar"}
                      </span>
                      {duration ? (
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3 text-[var(--aws-orange)]" />
                          {duration}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-200 pt-3 dark:border-[var(--border-soft)]">
                      <Link
                        href={`/eventos/${ev.id}`}
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors duration-300 hover:border-[var(--aws-orange)]/50 ${clubTheme.textHeading} border-slate-200 dark:border-[var(--border-soft)]`}
                      >
                        Ver detalles
                      </Link>
                      {registrationUrl ? (
                        <a
                          href={registrationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-full bg-[var(--aws-orange)] px-3 py-1 text-xs font-semibold text-[#0F172A] transition-colors duration-300 hover:bg-[#E88B00]"
                        >
                          <ExternalLink className="h-3 w-3" />
                          {registrationButtonLabel(ev.registrationType)}
                        </a>
                      ) : null}
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}

      <ClubPaginationBar
        page={page}
        totalPages={totalPages}
        totalItems={filtered.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />

      {links.meetupUrl ? (
        <div className="mt-8 flex justify-center">
          <ClubMeetupButton href={links.meetupUrl} size="lg" showExternal />
        </div>
      ) : null}
    </div>
  );
}
