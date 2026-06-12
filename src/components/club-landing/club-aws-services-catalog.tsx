"use client";

import { ClubFilterPills } from "@/components/club-landing/club-filter-pills";
import { ClubPaginationBar } from "@/components/club-landing/club-pagination-bar";
import {
  AWS_DIFFICULTY_LABELS,
  AWS_SERVICE_CATEGORY_LABELS,
} from "@/lib/aws-labels";
import {
  SERVICE_FILTER_LABELS,
  type ServiceFilterKey,
  matchesServiceFilter,
} from "@/lib/aws-service-filters";
import { fadeUpProps } from "@/lib/club-motion";
import { trpc } from "@/utils/trpc";
import type { AwsDifficultyLevel } from "@prisma/client";
import {
  BarChart3,
  ChevronRight,
  Cloud,
  Database,
  HardDrive,
  Lightbulb,
  Network,
  Server,
  Shield,
  Sparkles,
  Sprout,
  Workflow,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { ClubPageLoading } from "./club-page-loading";
import { clubTheme } from "./club-theme";

const PAGE_SIZE = 9;

const FILTER_OPTIONS = (
  Object.keys(SERVICE_FILTER_LABELS) as ServiceFilterKey[]
).map((value) => ({ value, label: SERVICE_FILTER_LABELS[value] }));

const CATEGORY_ICONS = {
  COMPUTE: Server,
  STORAGE: HardDrive,
  DATABASE: Database,
  NETWORKING: Network,
  SECURITY: Shield,
  ANALYTICS: Sparkles,
  MACHINE_LEARNING: Sparkles,
  INTEGRATION: Workflow,
  MANAGEMENT: Cloud,
  OTHER: Cloud,
} as const;

const IDEAL_FOR: Partial<Record<ServiceFilterKey, string>> = {
  all: "Explorar el catálogo completo",
  fundamentals: "Empezar en AWS y entender la nube",
  compute: "Aplicaciones, servidores y cargas de trabajo",
  serverless: "APIs, funciones y arquitecturas sin servidores",
  data: "Almacenamiento, bases de datos y analytics",
  ml: "Modelos, predicciones e inteligencia artificial",
  devops: "Despliegue, integración y operaciones",
};

function DifficultyBadge({ level }: { level: AwsDifficultyLevel }) {
  const isBeginner = level === "BEGINNER";
  const isAdvanced = level === "ADVANCED";
  const Icon = isBeginner ? Sprout : isAdvanced ? BarChart3 : BarChart3;
  const colors = isBeginner
    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300"
    : isAdvanced
      ? "bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300"
      : "bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${colors}`}
    >
      <Icon className="h-3 w-3" aria-hidden />
      {AWS_DIFFICULTY_LABELS[level]}
    </span>
  );
}

export function ClubAwsServicesCatalog() {
  const [filter, setFilter] = useState<ServiceFilterKey>("all");
  const [page, setPage] = useState(1);
  const { data: services, isLoading } = trpc.awsServices.listPublic.useQuery();

  const filtered = useMemo(
    () =>
      (services ?? []).filter((svc) =>
        matchesServiceFilter(svc.category, svc.slug, filter)
      ),
    [services, filter]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const onFilterChange = (value: ServiceFilterKey) => {
    setFilter(value);
    setPage(1);
  };

  if (isLoading) {
    return <ClubPageLoading label="Cargando servicios…" />;
  }

  if (!services?.length) {
    return (
      <motion.div
        className="mx-auto mb-14 max-w-3xl rounded-2xl border border-dashed border-[var(--border-soft)] px-6 py-10 text-center dark:border-white/15"
        {...fadeUpProps}
      >
        <Cloud className="mx-auto h-10 w-10 text-[var(--aws-orange)]" />
        <p className={`mt-4 text-lg font-semibold ${clubTheme.textHeading}`}>
          Pronto publicaremos el catálogo
        </p>
        <p className={`mt-2 text-sm sm:text-base ${clubTheme.textMuted}`}>
          El core team está preparando guías curadas de servicios AWS.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="mb-14">
      <motion.div className="mb-8 w-full" {...fadeUpProps}>
        <h2
          className={`text-3xl font-bold tracking-tight sm:text-4xl ${clubTheme.textHeading}`}
        >
          Explora{" "}
          <span className="text-[var(--aws-orange)]">AWS</span>
        </h2>
        <p className={`mt-3 text-base sm:text-lg ${clubTheme.textMuted}`}>
          Servicios y rutas de aprendizaje para construir en la nube.
        </p>
        <div className="mt-6">
          <ClubFilterPills
            options={FILTER_OPTIONS}
            value={filter}
            onChange={onFilterChange}
          />
        </div>
        {IDEAL_FOR[filter] ? (
          <p className="mt-4 flex items-center gap-2 text-sm font-medium text-[var(--aws-orange)]">
            <Lightbulb className="h-4 w-4 shrink-0" aria-hidden />
            <span>
              Ideal para:{" "}
              <span className="font-semibold">{IDEAL_FOR[filter]}</span>
            </span>
          </p>
        ) : null}
      </motion.div>

      {pageItems.length === 0 ? (
        <p className={`py-12 text-center ${clubTheme.textMuted}`}>
          No hay servicios en esta categoría.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((svc) => {
            const Icon =
              CATEGORY_ICONS[svc.category as keyof typeof CATEGORY_ICONS] ??
              Cloud;
            return (
              <li key={svc.id}>
                <Link
                  href={`/servicios/${svc.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-[var(--border-soft)]/80 bg-[var(--card)] p-5 shadow-[var(--shadow-soft)] transition-all duration-300 hover:border-[var(--aws-orange)]/40 hover:shadow-[0_16px_40px_rgba(21,38,61,0.12)] dark:border-white/10 dark:bg-[var(--surface-soft)] dark:shadow-none dark:hover:border-[var(--aws-orange)]/35"
                >
                  <div className="flex gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--bg-soft-blue)]/60 text-[var(--ucb-blue)] dark:bg-white/8 dark:text-[var(--aws-orange)]">
                      <Icon className="h-6 w-6" strokeWidth={1.5} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3
                        className={`text-base font-bold ${clubTheme.textHeading} transition-colors group-hover:text-[var(--aws-orange)]`}
                      >
                        {svc.name}
                      </h3>
                      <p
                        className={`mt-1.5 line-clamp-2 text-sm leading-relaxed ${clubTheme.textMuted}`}
                      >
                        {svc.shortDescription}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-2 border-t border-[var(--border-soft)]/60 pt-3 dark:border-white/8">
                    {svc.difficultyLevel ? (
                      <DifficultyBadge level={svc.difficultyLevel} />
                    ) : (
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wide ${clubTheme.textMuted}`}
                      >
                        {AWS_SERVICE_CATEGORY_LABELS[svc.category]}
                      </span>
                    )}
                    <span className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--ucb-blue)] transition group-hover:bg-[var(--aws-orange)]/10 group-hover:text-[var(--aws-orange)] dark:text-zinc-300">
                      <ChevronRight className="h-4 w-4" aria-hidden />
                    </span>
                  </div>
                </Link>
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

      {filtered.length > PAGE_SIZE ? (
        <p className={`mt-4 text-center text-xs ${clubTheme.textMuted}`}>
          Mostrando {pageItems.length} de {filtered.length} servicios en esta
          categoría.
        </p>
      ) : null}
    </div>
  );
}
