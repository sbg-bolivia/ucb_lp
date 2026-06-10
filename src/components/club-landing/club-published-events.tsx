"use client";

import { ClubMeetupButton } from "@/components/club-landing/club-meetup-button";
import { ClubPaginationBar } from "@/components/club-landing/club-pagination-bar";
import { useClubLinks } from "@/hooks/useClubLinks";
import { CLUB } from "@/lib/club-brand";
import {
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

const PAGE_SIZE = 9;

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

const CATEGORY_LABEL: Record<Exclude<EventFilterCategory, "all">, string> = {
  workshop: "Taller práctico",
  talk: "Charla",
  certification: "Certificación",
  networking: "Networking",
};

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
      <div className="mx-auto mb-14 max-w-3xl text-center">
        <p className={`text-sm ${clubTheme.textMuted}`}>Cargando eventos…</p>
      </div>
    );
  }

  if (!events?.length) {
    return (
      <motion.div
        className="mx-auto mb-14 max-w-3xl rounded-2xl border border-dashed border-[var(--border-soft)] px-6 py-10 text-center"
        {...fadeUpProps}
      >
        <Calendar className="mx-auto h-10 w-10 text-[var(--aws-orange)]" />
        <p className="mt-4 text-lg font-semibold text-[var(--text-main)]">
          Pronto publicaremos fechas
        </p>
        <p className={`mt-2 text-sm sm:text-base ${clubTheme.textMuted}`}>
          El calendario del {CLUB.shortName} se actualiza en Meetup y en este
          sitio.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="mb-14">
      <motion.div className="mx-auto mb-10 max-w-3xl" {...fadeUpProps}>
        <h2 className="text-3xl font-bold tracking-tight text-[var(--text-main)] sm:text-4xl">
          Eventos
        </h2>
        <p className="mt-3 text-base text-[var(--text-muted)] sm:text-lg">
          Aprende, construye y conecta con la comunidad en nuestros eventos y
          talleres.
        </p>
        <div className="mt-6">
          <ClubFilterPills
            options={FILTER_OPTIONS}
            value={filter}
            onChange={onFilterChange}
            dark
          />
        </div>
      </motion.div>

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <h3 className="text-xl font-semibold text-[var(--text-main)]">
          Próximos eventos
        </h3>
        {links.meetupUrl ? (
          <Link
            href={links.meetupUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-[var(--aws-orange)] transition-colors duration-300 hover:text-[#FFAD33]"
          >
            Ver todos los eventos →
          </Link>
        ) : null}
      </div>

      {pageItems.length === 0 ? (
        <p className={`py-12 text-center ${clubTheme.textMuted}`}>
          No hay eventos en esta categoría.
        </p>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((ev) => {
            const badge = formatDateBadge(ev.startsAt);
            const cat = inferEventCategory(ev);
            const duration = formatDuration(ev.startsAt, ev.endsAt);
            const registrationUrl = resolveEventRegistrationUrl(
              ev,
              links.meetupUrl
            );
            const thumb =
              ev.imageUrl?.trim() || CATEGORY_IMAGES[cat];

            return (
              <li key={ev.id}>
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-soft)] transition-all duration-500 hover:border-[var(--aws-orange)]/35 hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
                  <div className="relative h-36 overflow-hidden">
                    <Image
                      src={thumb}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-soft)] via-[var(--aws-ink)]/40 to-transparent" />
                    <div className="absolute left-4 top-4 flex items-start gap-3">
                      <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-[var(--text-main)] text-[var(--aws-ink)] shadow-md">
                        <span className="text-lg font-bold leading-none">
                          {badge.day}
                        </span>
                        <span className="mt-0.5 text-[10px] font-bold uppercase">
                          {badge.month}
                        </span>
                      </div>
                      <span className="rounded-full border border-white/20 bg-black/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
                        {CATEGORY_LABEL[cat]}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h4 className="text-base font-bold leading-snug text-[var(--text-main)]">
                      <Link
                        href={`/eventos/${ev.id}`}
                        className="transition-colors duration-300 hover:text-[var(--aws-orange)]"
                      >
                        {ev.title}
                      </Link>
                    </h4>

                    {ev.description ? (
                      <p className="mt-2 line-clamp-2 flex-1 text-sm text-[var(--text-muted)]">
                        {ev.description}
                      </p>
                    ) : (
                      <div className="flex-1" />
                    )}

                    <div className="mt-4 flex flex-wrap gap-3 text-xs text-[var(--text-muted)]">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-[var(--aws-orange)]" />
                        {ev.isOnline ? "Online" : ev.location ?? "Por confirmar"}
                      </span>
                      {duration ? (
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-[var(--aws-orange)]" />
                          {duration}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--border-soft)] pt-4">
                      <Link
                        href={`/eventos/${ev.id}`}
                        className="inline-flex items-center rounded-full border border-[var(--border-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--text-main)] transition-colors duration-300 hover:border-[var(--aws-orange)]/50"
                      >
                        Ver detalles
                      </Link>
                      {registrationUrl ? (
                        <a
                          href={registrationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-full bg-[var(--aws-orange)] px-3 py-1.5 text-xs font-semibold text-[#0F172A] transition-colors duration-300 hover:bg-[#E88B00]"
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
        dark
        page={page}
        totalPages={totalPages}
        totalItems={filtered.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />

      {links.meetupUrl ? (
        <div className="mt-10 flex justify-center">
          <ClubMeetupButton href={links.meetupUrl} size="lg" showExternal>
            Ver calendario en Meetup
          </ClubMeetupButton>
        </div>
      ) : null}
    </div>
  );
}
