"use client";

import { ClubEventPastBanner } from "@/components/club-landing/club-event-past-banner";
import { ClubEventRecapGallery } from "@/components/club-landing/club-event-recap-gallery";
import { ClubEventVideo } from "@/components/club-landing/club-event-video";
import { clubTheme } from "@/components/club-landing/club-theme";
import { ClubPageLoading } from "@/components/club-landing/club-page-loading";
import { ClubPastelBlobs } from "@/components/club-landing/club-pastel-blobs";
import { Button } from "@/components/ui/button";
import { useClubLinks } from "@/hooks/useClubLinks";
import { fadeUpProps } from "@/lib/club-motion";
import {
  EVENT_CATEGORY_LABELS,
  inferEventCategory,
} from "@/lib/event-category";
import { parseRecapGallery } from "@/lib/event-recap";
import { registrationButtonLabel } from "@/lib/event-labels";
import { isEventPast } from "@/lib/event-timing";
import { resolveEventRegistrationUrl } from "@/lib/event-registration-url";
import { cn } from "@/lib/utils";
import { trpc } from "@/utils/trpc";
import {
  ArrowLeft,
  Calendar,
  Clock,
  ExternalLink,
  MapPin,
  Video,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1540575467067-178ab98d8357?auto=format&fit=crop&w=1200&q=80";

function formatDateLong(startsAt: Date | string | null) {
  if (!startsAt) return "Fecha por confirmar";
  return new Intl.DateTimeFormat("es-BO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(startsAt));
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

export default function EventoDetallePage() {
  const links = useClubLinks();
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";

  const { data: event, isLoading } = trpc.clubEvents.getPublic.useQuery(
    { id },
    { enabled: Boolean(id) }
  );

  if (isLoading) {
    return (
      <section className={`relative overflow-hidden ${clubTheme.pageBg}`}>
        <ClubPastelBlobs subtle />
        <ClubPageLoading label="Cargando evento…" />
      </section>
    );
  }

  if (!event) {
    return (
      <section className={`${clubTheme.sectionY} text-center ${clubTheme.pageBg}`}>
        <h1 className={`text-2xl font-bold ${clubTheme.textHeading}`}>
          Evento no encontrado
        </h1>
        <p className={`mt-2 ${clubTheme.textMuted}`}>
          El evento no existe o ya no está publicado.
        </p>
        <Button asChild className="mt-6 rounded-full">
          <Link href="/eventos">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a eventos
          </Link>
        </Button>
      </section>
    );
  }

  const category = inferEventCategory(event);
  const categoryLabel = EVENT_CATEGORY_LABELS[category];
  const past = isEventPast(event);
  const registrationUrl = past
    ? null
    : resolveEventRegistrationUrl(event, links.meetupUrl);
  const duration = formatDuration(event.startsAt, event.endsAt);
  const locationLabel = event.isOnline
    ? "En línea"
    : event.location?.trim() || "Por confirmar";
  const hasVideo = Boolean(event.promoVideoUrl?.trim());
  const hasDescription = Boolean(event.description?.trim());
  const recapItems = parseRecapGallery(event.recapGallery);
  const posterSrc = event.imageUrl?.trim() || FALLBACK_IMAGE;

  return (
    <article className={`relative overflow-hidden pb-14 pt-5 sm:pb-16 ${clubTheme.pageBg}`}>
      <ClubPastelBlobs subtle />
      <div className={`relative ${clubTheme.container}`}>
        <Link
          href="/eventos"
          className={`mb-5 inline-flex items-center gap-2 text-sm font-medium ${clubTheme.textMuted} transition-colors hover:text-[var(--aws-orange)]`}
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a eventos
        </Link>

        {past ? (
          <motion.div className="mb-5 flex flex-wrap items-center gap-4" {...fadeUpProps}>
            <ClubEventPastBanner pastFlyerUrl={event.pastFlyerUrl} />
            {!event.pastFlyerUrl?.trim() ? (
              <p className={`max-w-md text-sm ${clubTheme.textMuted}`}>
                Este evento ya se realizó. Puedes ver fotos y el video más abajo.
              </p>
            ) : null}
          </motion.div>
        ) : null}

        <div
          className={cn(
            "grid gap-6 lg:gap-8",
            hasVideo && "lg:grid-cols-[minmax(0,1fr)_250px] xl:grid-cols-[minmax(0,1fr)_270px] lg:items-start"
          )}
        >
          <div className="min-w-0 space-y-6">
            <motion.div
              className="overflow-hidden rounded-2xl border border-[var(--border-soft)] shadow-[var(--shadow-soft)] dark:border-white/10"
              {...fadeUpProps}
            >
              <div className="grid lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
                <div className="relative aspect-[16/10] min-h-[200px] bg-[var(--bg-soft-blue)] dark:bg-[var(--surface)] lg:aspect-auto lg:min-h-[240px]">
                  <Image
                    src={posterSrc}
                    alt={event.title}
                    fill
                    className={cn(
                      "object-cover object-center",
                      past && "brightness-[0.88] saturate-[0.92]"
                    )}
                    priority
                    sizes="(max-width: 1024px) 100vw, 42vw"
                  />
                  {past ? (
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  ) : null}
                </div>

                <div className="flex flex-col justify-center border-t border-[var(--border-soft)] bg-[rgba(255,248,240,0.92)] p-5 sm:p-6 dark:border-white/10 dark:bg-[var(--surface-soft)] lg:border-t-0 lg:border-l">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex w-fit rounded-full bg-[var(--aws-orange)] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[var(--ucb-blue-dark)]">
                      {categoryLabel}
                    </span>
                    {past ? (
                      <span className="inline-flex rounded-full border border-[var(--border-soft)] bg-white/70 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--ucb-blue)] dark:bg-[var(--surface)] dark:text-[var(--aws-orange)]">
                        Pasado
                      </span>
                    ) : null}
                  </div>
                  <h1 className={`mt-3 text-2xl font-bold leading-tight sm:text-3xl ${clubTheme.textHeading}`}>
                    {event.title}
                  </h1>
                  {hasDescription ? (
                    <p className={`mt-3 line-clamp-3 text-sm leading-relaxed ${clubTheme.textMuted}`}>
                      {event.description}
                    </p>
                  ) : null}
                </div>
              </div>
            </motion.div>

            <motion.div
              className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
              {...fadeUpProps}
              transition={{ delay: 0.05 }}
            >
              <ul className="flex flex-wrap gap-2">
                <li
                  className={`inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-[rgba(255,248,240,0.85)] px-3 py-1.5 text-xs font-medium dark:border-white/10 dark:bg-[var(--surface-soft)] ${clubTheme.textHeading}`}
                >
                  <Calendar className="h-3.5 w-3.5 text-[var(--aws-orange)]" />
                  {formatDateLong(event.startsAt)}
                </li>
                <li
                  className={`inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-[rgba(255,248,240,0.85)] px-3 py-1.5 text-xs font-medium dark:border-white/10 dark:bg-[var(--surface-soft)] ${clubTheme.textMuted}`}
                >
                  <Clock className="h-3.5 w-3.5 text-[var(--aws-orange)]" />
                  {formatTimeRange(event.startsAt, event.endsAt)}
                  {duration ? ` · ${duration}` : ""}
                </li>
                <li
                  className={`inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-[rgba(255,248,240,0.85)] px-3 py-1.5 text-xs font-medium dark:border-white/10 dark:bg-[var(--surface-soft)] ${clubTheme.textMuted}`}
                >
                  {event.isOnline ? (
                    <Video className="h-3.5 w-3.5 text-[var(--aws-orange)]" />
                  ) : (
                    <MapPin className="h-3.5 w-3.5 text-[var(--aws-orange)]" />
                  )}
                  {locationLabel}
                </li>
              </ul>

              {!past && registrationUrl ? (
                <Button asChild className="h-10 shrink-0 rounded-full px-5 text-sm font-bold">
                  <a href={registrationUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    {registrationButtonLabel(event.registrationType)}
                  </a>
                </Button>
              ) : null}
            </motion.div>

            {hasDescription ? (
              <motion.section {...fadeUpProps} transition={{ delay: 0.08 }}>
                <h2 className={`mb-3 text-lg font-bold ${clubTheme.textHeading}`}>
                  Sobre este evento
                </h2>
                <div
                  className={`whitespace-pre-wrap text-base leading-relaxed ${clubTheme.textMuted}`}
                >
                  {event.description}
                </div>
              </motion.section>
            ) : null}

            {recapItems.length > 0 ? (
              <ClubEventRecapGallery items={recapItems} />
            ) : null}
          </div>

          {hasVideo ? (
            <motion.aside
              className="w-full lg:sticky lg:top-20 lg:self-start"
              {...fadeUpProps}
              transition={{ delay: 0.04 }}
            >
              <div className="flex w-full flex-col rounded-2xl border border-[var(--border-soft)] bg-[rgba(255,248,240,0.55)] p-3 dark:bg-[var(--surface-soft)]/90">
                <h2 className={`mb-2.5 text-sm font-bold ${clubTheme.textHeading}`}>
                  Video del evento
                </h2>
                <ClubEventVideo
                  url={event.promoVideoUrl as string}
                  preferPortrait
                  size="lg"
                />
              </div>
            </motion.aside>
          ) : null}
        </div>
      </div>
    </article>
  );
}
