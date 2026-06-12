"use client";



import { ClubPageLoading } from "@/components/club-landing/club-page-loading";

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
import { isEventPast } from "@/lib/event-timing";

import { registrationButtonLabel } from "@/lib/event-labels";

import { fadeUpProps } from "@/lib/club-motion";

import { UNIVERSITY_IMAGES } from "@/lib/university-assets";

import { trpc } from "@/utils/trpc";

import { Calendar, Clock, ExternalLink, MapPin, Play } from "lucide-react";

import { motion } from "motion/react";

import Image from "next/image";

import Link from "next/link";

import { useMemo, useState } from "react";



import { ClubFilterPills } from "./club-filter-pills";

import { ClubEventsCalendarArt } from "./club-events-calendar-art";

import { ClubPastelBlobs } from "./club-pastel-blobs";

import { clubTheme } from "./club-theme";



const PAGE_SIZE = 6;



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

  if (hours < 1) return "1 h";

  return `${hours} h`;

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



  const heroBlock = (

    <motion.div

      className="relative mb-8 overflow-hidden rounded-[2rem] border border-[var(--border-soft)] bg-[rgba(255,248,240,0.72)] p-5 shadow-[var(--shadow-soft)] backdrop-blur-sm sm:p-7 dark:bg-[var(--surface-soft)]/80"

      {...fadeUpProps}

    >

      <ClubPastelBlobs subtle className="rounded-[2rem]" />

      <div className="relative grid items-center gap-5 lg:grid-cols-[1fr_auto] lg:gap-8">

        <div>

          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-[rgba(255,248,240,0.9)] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[var(--ucb-blue)] dark:bg-[var(--surface)]">

            <Calendar className="h-3.5 w-3.5 text-[var(--aws-orange)]" />

            AWS Student Builder Group

          </span>

          <h2

            className={`mt-3 text-2xl font-bold tracking-tight sm:text-3xl ${clubTheme.textHeading}`}

          >

            Eventos

          </h2>

          <p className={`mt-2 max-w-xl text-sm ${clubTheme.textMuted}`}>

            Aprende, construye y conecta con la comunidad en nuestros talleres,

            charlas y actividades del {CLUB.shortName}.

          </p>

          <div className="mt-4">

            <ClubFilterPills

              options={FILTER_OPTIONS}

              value={filter}

              onChange={onFilterChange}

            />

          </div>

        </div>

        <div className="mx-auto hidden w-full max-w-[240px] lg:block">

          <ClubEventsCalendarArt className="h-auto w-full drop-shadow-lg" />

        </div>

      </div>

    </motion.div>

  );



  if (isLoading) {

    return (

      <div className="mb-10">

        {heroBlock}

        <ClubPageLoading label="Cargando eventos…" />

      </div>

    );

  }



  if (!events?.length) {

    return (

      <div className="mb-10">

        {heroBlock}

        <motion.div

          className={`rounded-2xl border border-dashed border-[var(--border-soft)] px-6 py-10 text-center ${clubTheme.card}`}

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

      </div>

    );

  }



  return (

    <div className="mb-10">

      {heroBlock}



      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">

        <h3 className={`text-base font-semibold ${clubTheme.textHeading}`}>

          Próximos eventos

          <span className={`ml-2 text-sm font-normal ${clubTheme.textMuted}`}>

            ({filtered.length})

          </span>

        </h3>

        {links.meetupUrl ? (

          <Link

            href={links.meetupUrl}

            target="_blank"

            rel="noopener noreferrer"

            className="text-sm font-semibold text-[var(--aws-orange)] transition-colors hover:text-[#E88B00]"

          >

            Ver todos en Meetup →

          </Link>

        ) : null}

      </div>



      {pageItems.length === 0 ? (

        <p className={`py-10 text-center text-sm ${clubTheme.textMuted}`}>

          No hay eventos en esta categoría.

        </p>

      ) : (

        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {pageItems.map((ev) => {

            const badge = formatDateBadge(ev.startsAt);

            const cat = inferEventCategory(ev);

            const duration = formatDuration(ev.startsAt, ev.endsAt);

            const registrationUrl = resolveEventRegistrationUrl(

              ev,

              links.meetupUrl

            );

            const thumb = ev.imageUrl?.trim() || CATEGORY_IMAGES[cat];
            const past = isEventPast(ev);
            const hasVideo = Boolean(ev.promoVideoUrl?.trim());

            const detailHref = `/eventos/${ev.id}`;



            return (

              <li key={ev.id}>

                <article

                  className={`group relative flex h-full flex-col overflow-hidden rounded-xl ${clubTheme.card} ${clubTheme.cardHover}`}

                >

                  <Link

                    href={detailHref}

                    className="absolute inset-0 z-0 rounded-xl"

                    aria-label={`Ver detalles de ${ev.title}`}

                  />

                  <div className="relative z-[1] pointer-events-none aspect-[16/10] overflow-hidden bg-[var(--bg-soft-blue)] dark:bg-[var(--surface)]">

                    <Image
                      src={thumb}
                      alt=""
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      loading="lazy"
                      quality={70}
                    />

                    {past ? (
                      <span className="absolute right-2.5 top-2.5 rounded-full bg-black/60 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                        Pasado
                      </span>
                    ) : hasVideo ? (
                      <div className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm">
                        <Play className="h-3.5 w-3.5 fill-current" />
                      </div>
                    ) : null}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-80 transition-opacity group-hover:opacity-95" />

                    <div className="absolute left-2.5 top-2.5 flex items-start gap-1.5">

                      <div className="flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-md bg-white/95 text-[var(--aws-ink)] shadow-sm dark:bg-[var(--surface-soft)] dark:text-[var(--text-main)]">

                        <span className="text-xs font-bold leading-none">

                          {badge.day}

                        </span>

                        <span className="mt-0.5 text-[8px] font-bold uppercase">

                          {badge.month}

                        </span>

                      </div>

                      <span className="rounded-full bg-black/50 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">

                        {EVENT_CATEGORY_LABELS[cat]}

                      </span>

                    </div>

                    <div className="absolute inset-x-0 bottom-0 flex translate-y-1 gap-1.5 p-2.5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">

                      <span className="rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-[var(--ucb-blue-dark)] shadow-sm">

                        Más detalles

                      </span>

                      {registrationUrl ? (

                        <span className="rounded-full bg-[var(--aws-orange)] px-2.5 py-1 text-[10px] font-bold text-[var(--ucb-blue-dark)] shadow-sm">

                          {registrationButtonLabel(ev.registrationType)}

                        </span>

                      ) : null}

                    </div>

                  </div>



                  <div className="relative z-[1] flex flex-1 flex-col p-3 pointer-events-none">

                    <h4 className={`line-clamp-2 text-sm font-bold leading-snug ${clubTheme.textHeading} transition-colors group-hover:text-[var(--aws-orange)]`}>

                      {ev.title}

                    </h4>

                    <div className={`mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] ${clubTheme.textMuted}`}>

                      <span className="inline-flex items-center gap-1">

                        <MapPin className="h-3 w-3 shrink-0 text-[var(--aws-orange)]" />

                        {ev.isOnline ? "Online" : ev.location ?? "Por confirmar"}

                      </span>

                      {duration ? (

                        <span className="inline-flex items-center gap-1">

                          <Clock className="h-3 w-3 shrink-0 text-[var(--aws-orange)]" />

                          {duration}

                        </span>

                      ) : null}

                    </div>

                  </div>



                  {registrationUrl ? (

                    <a

                      href={registrationUrl}

                      target="_blank"

                      rel="noopener noreferrer"

                      onClick={(e) => e.stopPropagation()}

                      className={`pointer-events-auto relative z-[2] mx-3 mb-3 inline-flex items-center justify-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-bold opacity-100 transition-all duration-300 sm:opacity-0 sm:group-hover:opacity-100 ${clubTheme.gradientButton}`}

                      aria-label={`${registrationButtonLabel(ev.registrationType)} — ${ev.title}`}

                    >

                      <ExternalLink className="h-3 w-3" />

                      {registrationButtonLabel(ev.registrationType)}

                    </a>

                  ) : null}

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
        <div className="mt-8 text-center">
          <h3 className={`text-lg font-bold ${clubTheme.textHeading}`}>
            Calendario en Meetup
          </h3>
          <p className={`mt-2 text-sm ${clubTheme.textMuted}`}>
            Fechas, inscripciones y recordatorios del {CLUB.shortName}.
          </p>
          <Link
            href={links.meetupUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex text-sm font-semibold text-[var(--aws-orange)] transition-colors hover:text-[#E88B00]"
          >
            Ver todos en Meetup →
          </Link>
        </div>
      ) : null}

    </div>

  );

}


