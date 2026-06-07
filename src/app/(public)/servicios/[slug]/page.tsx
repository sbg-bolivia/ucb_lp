"use client";

import { clubTheme } from "@/components/club-landing/club-theme";
import {
  AWS_DIFFICULTY_LABELS,
  AWS_SERVICE_CARD_TYPE_LABELS,
  AWS_SERVICE_CATEGORY_LABELS,
} from "@/lib/aws-labels";
import { isClubFeatureEnabled } from "@/lib/club-features";
import { trpc } from "@/utils/trpc";
import type { AwsServiceCardType } from "@prisma/client";
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  ExternalLink,
  FlaskConical,
  Lightbulb,
  Link2,
  Server,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

const CARD_STYLES: Record<
  AwsServiceCardType,
  { border: string; icon: typeof Lightbulb }
> = {
  USE_CASE: {
    border: "border-sky-200/80 dark:border-sky-500/25",
    icon: BookOpen,
  },
  TIP: {
    border: "border-emerald-200/80 dark:border-emerald-500/25",
    icon: Lightbulb,
  },
  WARNING: {
    border: "border-amber-200/80 dark:border-amber-500/25",
    icon: AlertTriangle,
  },
  LAB: {
    border: "border-violet-200/80 dark:border-violet-500/25",
    icon: FlaskConical,
  },
  PRICING: {
    border: "border-blue-200/80 dark:border-blue-500/25",
    icon: Server,
  },
  ARCHITECTURE: {
    border: "border-indigo-200/80 dark:border-indigo-500/25",
    icon: Server,
  },
  RELATED_LINK: {
    border: "border-slate-200/80 dark:border-slate-500/25",
    icon: Link2,
  },
  CUSTOM: {
    border: "border-slate-200/80 dark:border-slate-500/25",
    icon: BookOpen,
  },
};

export default function ServicioDetallePage() {
  const router = useRouter();
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";

  useEffect(() => {
    if (!isClubFeatureEnabled("awsServices")) {
      router.replace("/");
    }
  }, [router]);

  const { data: service, isLoading } = trpc.awsServices.getPublicBySlug.useQuery(
    { slug },
    { enabled: Boolean(slug) && isClubFeatureEnabled("awsServices") }
  );

  if (isLoading) {
    return (
      <section className={`${clubTheme.sectionY} text-center ${clubTheme.pageBg}`}>
        <p className={clubTheme.textMuted}>Cargando servicio…</p>
      </section>
    );
  }

  if (!service) {
    return (
      <section className={`${clubTheme.sectionY} text-center ${clubTheme.pageBg}`}>
        <h1 className={`text-2xl font-bold ${clubTheme.textHeading}`}>
          Servicio no encontrado
        </h1>
        <p className={`mt-2 ${clubTheme.textMuted}`}>
          El servicio no existe o aún no está publicado.
        </p>
        <Button asChild className="mt-6 rounded-full">
          <Link href="/servicios">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al catálogo
          </Link>
        </Button>
      </section>
    );
  }

  return (
    <article className={`${clubTheme.sectionY} ${clubTheme.pageBg}`}>
      <div className="mx-auto max-w-4xl">
        <Link
          href="/servicios"
          className={`mb-8 inline-flex items-center gap-2 text-sm font-medium ${clubTheme.textMuted} hover:text-[#00C8FF] transition-colors`}
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al catálogo
        </Link>

        <div className={`overflow-hidden rounded-3xl ${clubTheme.card} p-8 sm:p-10`}>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#3b41ff] dark:text-violet-300">
            {AWS_SERVICE_CATEGORY_LABELS[service.category]}
            {service.difficultyLevel
              ? ` · ${AWS_DIFFICULTY_LABELS[service.difficultyLevel]}`
              : ""}
          </p>
          <h1
            className={`mt-3 text-3xl font-bold tracking-tight sm:text-4xl ${clubTheme.textHeading}`}
          >
            {service.name}
          </h1>
          <p className={`mt-4 text-lg leading-relaxed ${clubTheme.textMuted}`}>
            {service.shortDescription}
          </p>

          {service.technicalExplanation ? (
            <div className="mt-8">
              <h2 className={`text-lg font-bold ${clubTheme.textHeading}`}>
                ¿Qué es?
              </h2>
              <p
                className={`mt-2 whitespace-pre-wrap text-base leading-relaxed ${clubTheme.textMuted}`}
              >
                {service.technicalExplanation}
              </p>
            </div>
          ) : null}

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {service.whenToUse ? (
              <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/50 p-5 dark:border-emerald-500/20 dark:bg-emerald-950/20">
                <h3 className="font-bold text-emerald-800 dark:text-emerald-300">
                  Cuándo usarlo
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-emerald-900/80 dark:text-emerald-100/80">
                  {service.whenToUse}
                </p>
              </div>
            ) : null}
            {service.whenNotToUse ? (
              <div className="rounded-2xl border border-amber-200/60 bg-amber-50/50 p-5 dark:border-amber-500/20 dark:bg-amber-950/20">
                <h3 className="font-bold text-amber-800 dark:text-amber-300">
                  Cuándo no usarlo
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-amber-900/80 dark:text-amber-100/80">
                  {service.whenNotToUse}
                </p>
              </div>
            ) : null}
          </div>

          {service.cards.length > 0 ? (
            <div className="mt-10">
              <h2 className={`text-lg font-bold ${clubTheme.textHeading}`}>
                Tarjetas del club
              </h2>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                {service.cards.map((card) => {
                  const style = CARD_STYLES[card.cardType];
                  const Icon = style.icon;
                  return (
                    <li
                      key={card.id}
                      className={`rounded-2xl border bg-white/60 p-5 dark:bg-white/[0.02] ${style.border}`}
                    >
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#3b41ff] dark:text-violet-300">
                        <Icon className="h-4 w-4" />
                        {AWS_SERVICE_CARD_TYPE_LABELS[card.cardType]}
                      </div>
                      {card.title ? (
                        <h3
                          className={`mt-2 font-bold ${clubTheme.textHeading}`}
                        >
                          {card.title}
                        </h3>
                      ) : null}
                      <p
                        className={`mt-2 text-sm leading-relaxed ${clubTheme.textMuted}`}
                      >
                        {card.content}
                      </p>
                      {card.linkUrl ? (
                        <a
                          href={card.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#3b41ff] hover:underline dark:text-violet-300"
                        >
                          {card.linkLabel ?? "Ver más"}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          {service.officialDocsUrl ? (
            <Button asChild className="mt-10 rounded-full">
              <a
                href={service.officialDocsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Documentación oficial AWS
              </a>
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
