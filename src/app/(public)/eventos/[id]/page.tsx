"use client";

import { Button } from "@/components/ui/button";
import { trpc } from "@/utils/trpc";
import { ArrowLeft, Calendar, ExternalLink, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { clubTheme } from "@/components/club-landing/club-theme";
import { registrationButtonLabel } from "@/lib/event-labels";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1540575467067-178ab98d8357?auto=format&fit=crop&w=1200&q=80";

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

export default function EventoDetallePage() {
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

  return (
    <article className={`${clubTheme.sectionY} ${clubTheme.pageBg}`}>
      <div className="mx-auto max-w-4xl">
        <Link
          href="/eventos"
          className={`mb-8 inline-flex items-center gap-2 text-sm font-medium ${clubTheme.textMuted} hover:text-[#00C8FF] transition-colors`}
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a eventos
        </Link>

        <div className={`overflow-hidden rounded-3xl ${clubTheme.card}`}>
          <div className="relative aspect-[21/9] w-full">
            <Image
              src={event.imageUrl?.trim() || FALLBACK_IMAGE}
              alt={event.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 896px) 100vw, 896px"
            />
          </div>

          <div className="p-8 sm:p-10">
            <div
              className="flex items-start gap-2 text-sm text-[#3b41ff] dark:text-violet-300"
            >
              <Calendar className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="font-medium">
                {formatRange(event.startsAt, event.endsAt)}
              </span>
            </div>

            <h1
              className={`mt-4 text-3xl font-bold tracking-tight sm:text-4xl ${clubTheme.textHeading}`}
            >
              {event.title}
            </h1>

            {event.description ? (
              <p
                className={`mt-6 whitespace-pre-wrap text-base leading-relaxed ${clubTheme.textMuted}`}
              >
                {event.description}
              </p>
            ) : null}

            {event.location?.trim() ? (
              <p
                className={`mt-6 flex items-start gap-2 text-sm ${clubTheme.textMuted}`}
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#7E2CFF]" />
                <span>{event.location}</span>
              </p>
            ) : null}

            {(event.registrationUrl ?? event.externalUrl)?.trim() ? (
              <Button asChild className="mt-8 rounded-full">
                <a
                  href={(event.registrationUrl ?? event.externalUrl) as string}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {registrationButtonLabel(event.registrationType)}
                </a>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
