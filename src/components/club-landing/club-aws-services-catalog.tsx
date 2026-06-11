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

import {

  Cloud,

  Database,

  HardDrive,

  Network,

  Server,

  Shield,

  Sparkles,

  Workflow,

} from "lucide-react";

import { motion } from "motion/react";

import Link from "next/link";

import { useMemo, useState } from "react";



import { clubTheme } from "./club-theme";



const PAGE_SIZE = 8;



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

    return (

      <div className="mx-auto mb-14 max-w-3xl text-center">

        <p className={`text-sm ${clubTheme.textMuted}`}>Cargando servicios…</p>

      </div>

    );

  }



  if (!services?.length) {

    return (

      <motion.div

        className="mx-auto mb-14 max-w-3xl rounded-2xl border border-dashed border-slate-300 px-6 py-10 text-center dark:border-[var(--border-soft)]"

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

          className={`text-2xl font-bold tracking-tight sm:text-3xl ${clubTheme.textHeading}`}

        >

          Explora AWS

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

          <p className="mt-4 text-sm text-[var(--aws-orange)]">

            Ideal para: {IDEAL_FOR[filter]}

          </p>

        ) : null}

      </motion.div>



      {pageItems.length === 0 ? (

        <p className={`py-12 text-center ${clubTheme.textMuted}`}>

          No hay servicios en esta categoría.

        </p>

      ) : (

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {pageItems.map((svc) => {

            const Icon =

              CATEGORY_ICONS[svc.category as keyof typeof CATEGORY_ICONS] ??

              Cloud;

            return (

              <li key={svc.id}>

                <Link

                  href={`/servicios/${svc.slug}`}

                  className="group flex h-full flex-col rounded-2xl border border-slate-200/80 bg-[var(--card)] p-5 transition-all duration-500 hover:border-[var(--aws-orange)]/35 hover:shadow-md dark:border-[var(--border-soft)] dark:bg-[var(--surface-soft)] dark:shadow-none dark:hover:border-[var(--aws-orange)]/30"

                >

                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-[var(--aws-orange)] dark:bg-[var(--surface)]">

                    <Icon className="h-6 w-6" strokeWidth={1.5} />

                  </span>

                  <h3 className="mt-4 text-center text-base font-bold text-[var(--text)] transition-colors duration-300 group-hover:text-[var(--aws-orange)] dark:text-[var(--text-main)]">

                    {svc.name}

                  </h3>

                  <p className="mt-2 line-clamp-3 flex-1 text-center text-sm leading-relaxed text-[var(--muted)] dark:text-[var(--text-muted)]">

                    {svc.shortDescription}

                  </p>

                  {svc.difficultyLevel ? (

                    <p className="mt-4 text-center text-xs text-[var(--muted)] dark:text-[var(--text-muted)]">

                      <span className="font-semibold text-[var(--aws-orange)]">

                        {AWS_DIFFICULTY_LABELS[svc.difficultyLevel]}

                      </span>

                    </p>

                  ) : (

                    <p className="mt-4 text-center text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)] dark:text-[var(--text-muted)]">

                      {AWS_SERVICE_CATEGORY_LABELS[svc.category]}

                    </p>

                  )}

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

