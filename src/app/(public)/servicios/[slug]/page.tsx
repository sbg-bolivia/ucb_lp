"use client";

import { clubTheme } from "@/components/club-landing/club-theme";
import { Button } from "@/components/ui/button";
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
  Hash,
  Layers,
  Lightbulb,
  Link2,
  Server,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

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

  const { data: allServices } = trpc.awsServices.listPublic.useQuery(undefined, {
    enabled: isClubFeatureEnabled("awsServices"),
  });

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

  const related = (allServices ?? [])
    .filter((s) => s.slug !== service.slug && s.category === service.category)
    .slice(0, 4);

  return (
    <article className={`${clubTheme.sectionY} ${clubTheme.pageBg}`}>
      <div className={clubTheme.container}>
        <nav className={`mb-6 text-xs ${clubTheme.textMuted}`} aria-label="Ruta">
          <Link href="/" className="hover:text-[var(--aws-orange)]">
            Inicio
          </Link>
          <span className="mx-2">/</span>
          <Link href="/servicios" className="hover:text-[var(--aws-orange)]">
            Servicios
          </Link>
          <span className="mx-2">/</span>
          <span className={clubTheme.textHeading}>{service.name}</span>
        </nav>

        <Link
          href="/servicios"
          className={`mb-8 inline-flex items-center gap-2 text-sm font-medium ${clubTheme.textMuted} transition-colors hover:text-[var(--aws-orange)]`}
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al catálogo
        </Link>

        <header className={`mb-8 rounded-2xl border p-6 sm:p-8 ${clubTheme.card}`}>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-1 gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[var(--aws-orange)]/15 text-[var(--aws-orange)] sm:h-20 sm:w-20">
                {service.iconUrl ? (
                  <Image
                    src={service.iconUrl}
                    alt=""
                    width={40}
                    height={40}
                    className="h-10 w-10 object-contain"
                  />
                ) : (
                  <Server className="h-9 w-9" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--aws-orange)]">
                  {AWS_SERVICE_CATEGORY_LABELS[service.category]}
                </p>
                <h1 className={`mt-1 text-2xl font-bold tracking-tight sm:text-3xl ${clubTheme.textHeading}`}>
                  {service.name}
                </h1>
                <p className={`mt-2 text-sm leading-relaxed sm:text-base ${clubTheme.textMuted}`}>
                  {service.shortDescription}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col">
              {service.officialDocsUrl ? (
                <Button asChild className="rounded-full">
                  <a
                    href={service.officialDocsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Documentación
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              ) : null}
              <Button asChild variant="outline" className="rounded-full">
                <a
                  href="https://aws.amazon.com/pricing/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Precios AWS
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="space-y-6 lg:col-span-2">
            {service.technicalExplanation ? (
              <section className={`rounded-2xl p-6 sm:p-7 ${clubTheme.card}`}>
                <div className="mb-3 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-[var(--aws-orange)]" />
                  <h2 className={`text-lg font-bold ${clubTheme.textHeading}`}>
                    Explicación sencilla
                  </h2>
                </div>
                <p
                  className={`whitespace-pre-wrap text-sm leading-relaxed sm:text-base ${clubTheme.textMuted}`}
                >
                  {service.technicalExplanation}
                </p>
              </section>
            ) : null}

            {(service.whenToUse || service.whenNotToUse) && (
              <div className="grid gap-4 sm:grid-cols-2">
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
            )}

            {service.cards.length > 0 ? (
              <section>
                <h2 className={`mb-4 text-lg font-bold ${clubTheme.textHeading}`}>
                  Tarjetas del club
                </h2>
                <ul className="grid gap-4 sm:grid-cols-2">
                  {service.cards.map((card) => {
                    const style = CARD_STYLES[card.cardType];
                    const Icon = style.icon;
                    return (
                      <li
                        key={card.id}
                        className={`rounded-2xl border bg-white/60 p-5 dark:bg-white/[0.02] ${style.border} ${clubTheme.card}`}
                      >
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[var(--aws-orange)]">
                          <Icon className="h-4 w-4" />
                          {AWS_SERVICE_CARD_TYPE_LABELS[card.cardType]}
                        </div>
                        {card.title ? (
                          <h3 className={`mt-2 font-bold ${clubTheme.textHeading}`}>
                            {card.title}
                          </h3>
                        ) : null}
                        <p className={`mt-2 text-sm leading-relaxed ${clubTheme.textMuted}`}>
                          {card.content}
                        </p>
                        {card.linkUrl ? (
                          <a
                            href={card.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[var(--aws-orange)] hover:underline"
                          >
                            {card.linkLabel ?? "Ver más"}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </section>
            ) : null}
          </div>

          <aside className="space-y-5">
            {related.length > 0 ? (
              <section className={`rounded-2xl p-5 sm:p-6 ${clubTheme.card}`}>
                <div className="mb-4 flex items-center gap-2">
                  <Layers className="h-5 w-5 text-[var(--aws-orange)]" />
                  <h2 className={`text-base font-bold ${clubTheme.textHeading}`}>
                    Servicios relacionados
                  </h2>
                </div>
                <ul className="space-y-3">
                  {related.map((rel) => (
                    <li key={rel.id}>
                      <Link
                        href={`/servicios/${rel.slug}`}
                        className="flex items-start gap-3 rounded-xl border border-slate-200 p-3 transition-colors hover:border-[var(--aws-orange)]/40 dark:border-[var(--border-soft)]"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--aws-orange)]/10 text-[var(--aws-orange)]">
                          <Server className="h-4 w-4" />
                        </span>
                        <span>
                          <span className={`block text-sm font-semibold ${clubTheme.textHeading}`}>
                            {rel.name}
                          </span>
                          <span className="text-xs text-[var(--aws-orange)]">
                            {AWS_SERVICE_CATEGORY_LABELS[rel.category]}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section className={`rounded-2xl p-5 sm:p-6 ${clubTheme.card}`}>
              <div className="mb-4 flex items-center gap-2">
                <Hash className="h-5 w-5 text-[var(--aws-orange)]" />
                <h2 className={`text-base font-bold ${clubTheme.textHeading}`}>
                  Info rápida
                </h2>
              </div>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className={`text-xs font-semibold uppercase tracking-wide ${clubTheme.textMuted}`}>
                    Categoría
                  </dt>
                  <dd className={`mt-0.5 font-medium ${clubTheme.textHeading}`}>
                    {AWS_SERVICE_CATEGORY_LABELS[service.category]}
                  </dd>
                </div>
                {service.difficultyLevel ? (
                  <div>
                    <dt className={`text-xs font-semibold uppercase tracking-wide ${clubTheme.textMuted}`}>
                      Nivel
                    </dt>
                    <dd className="mt-0.5 font-medium text-[var(--aws-orange)]">
                      {AWS_DIFFICULTY_LABELS[service.difficultyLevel]}
                    </dd>
                  </div>
                ) : null}
                {service.pricingNote ? (
                  <div>
                    <dt className={`text-xs font-semibold uppercase tracking-wide ${clubTheme.textMuted}`}>
                      Precios
                    </dt>
                    <dd className={`mt-0.5 leading-relaxed ${clubTheme.textMuted}`}>
                      {service.pricingNote}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </section>
          </aside>
        </div>
      </div>
    </article>
  );
}
