"use client";

import { Button } from "@/components/ui/button";
import { clubTheme } from "@/components/club-landing/club-theme";
import { useClubLinks } from "@/hooks/useClubLinks";
import {
  EVENT_CATEGORY_LABELS,
  inferEventCategory,
} from "@/lib/event-category";
import { registrationButtonLabel } from "@/lib/event-labels";
import { resolveEventRegistrationUrl } from "@/lib/event-registration-url";
import { trpc } from "@/utils/trpc";
import {
  ArrowLeft,
  Calendar,
  Clock,
  ExternalLink,
  MapPin,
  Video,
} from "lucide-react";
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
      <section className={`${clubTheme.sectionY} text-center ${clubTheme.pageBg}`}>
        <p className={clubTheme.textMuted}>Cargando evento…</p>
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
  const registrationUrl = resolveEventRegistrationUrl(event, links.meetupUrl);
  const duration = formatDuration(event.startsAt, event.endsAt);
  const locationLabel = event.isOnline
    ? "En línea"
    : event.location?.trim() || "Por confirmar";

  return (
    <article className={`${clubTheme.pageBg} pb-16 pt-6 sm:pb-20`}>
      <div className={clubTheme.container}>
        <Link
          href="/eventos"
          className={`mb-6 inline-flex items-center gap-2 text-sm font-medium ${clubTheme.textMuted} transition-colors hover:text-[var(--aws-orange)]`}
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a eventos
        </Link>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-10">
          {/* Columna principal */}
          <div className="min-w-0 space-y-6">
            <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-[var(--surface)]">
              <Image
                src={event.imageUrl?.trim() || FALLBACK_IMAGE}
                alt={event.title}
                fill
                className="object-cover object-center"
                priority
                sizes="(max-width: 1024px) 100vw, 70vw"
              />
              <span className="absolute right-4 top-4 rounded-full border border-white/30 bg-black/45 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
                {categoryLabel}
              </span>
            </div>

            <header className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--aws-orange)]">
                {categoryLabel}
              </p>
              <h1
                className={`text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.5rem] lg:leading-tight ${clubTheme.textHeading}`}
              >
                {event.title}
              </h1>
            </header>

            {event.description ? (
              <section className={`rounded-2xl border p-6 sm:p-8 ${clubTheme.card}`}>
                <h2 className={`mb-4 text-lg font-semibold ${clubTheme.textHeading}`}>
                  Acerca de este evento
                </h2>
                <div
                  className={`whitespace-pre-wrap text-base leading-relaxed ${clubTheme.textMuted}`}
                >
                  {event.description}
                </div>
              </section>
            ) : null}

            {event.promoVideoUrl?.trim() ? (
              <section className={`rounded-2xl border p-6 ${clubTheme.card}`}>
                <h2 className={`mb-3 text-lg font-semibold ${clubTheme.textHeading}`}>
                  Video promocional
                </h2>
                <a
                  href={event.promoVideoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--aws-orange)] hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  Ver video
                </a>
              </section>
            ) : null}
          </div>

          {/* Sidebar estilo Meetup */}
          <aside className="lg:sticky lg:top-24">
            <div className={`space-y-5 rounded-2xl border p-6 ${clubTheme.card}`}>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--aws-orange)]/15 text-[var(--aws-orange)]">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${clubTheme.textHeading}`}>
                      {formatDateLong(event.startsAt)}
                    </p>
                    <p className={`mt-0.5 text-sm ${clubTheme.textMuted}`}>
                      {formatTimeRange(event.startsAt, event.endsAt)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#7E2CFF]/15 text-[#7E2CFF]">
                    {event.isOnline ? (
                      <Video className="h-5 w-5" />
                    ) : (
                      <MapPin className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${clubTheme.textHeading}`}>
                      {event.isOnline ? "Evento en línea" : "Ubicación"}
                    </p>
                    <p className={`mt-0.5 text-sm leading-snug ${clubTheme.textMuted}`}>
                      {locationLabel}
                    </p>
                  </div>
                </div>

                {duration ? (
                  <div className="flex gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-500/15 text-sky-500">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${clubTheme.textHeading}`}>
                        Duración
                      </p>
                      <p className={`mt-0.5 text-sm ${clubTheme.textMuted}`}>
                        {duration}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>

              {registrationUrl ? (
                <Button asChild className="h-11 w-full rounded-full text-sm font-bold">
                  <a
                    href={registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    {registrationButtonLabel(event.registrationType)}
                  </a>
                </Button>
              ) : (
                <p className={`text-center text-xs ${clubTheme.textMuted}`}>
                  Inscripción próximamente
                </p>
              )}

              {links.meetupUrl ? (
                <Button
                  asChild
                  variant="outline"
                  className="h-10 w-full rounded-full text-sm"
                >
                  <a
                    href={links.meetupUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver más en Meetup
                  </a>
                </Button>
              ) : null}
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
