"use client";

import {
  AWS_DIFFICULTY_LABELS,
  AWS_SERVICE_CATEGORY_LABELS,
} from "@/lib/aws-labels";
import { fadeUpProps, staggerContainer, staggerItem } from "@/lib/club-motion";
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

import { clubTheme } from "./club-theme";

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

export function ClubAwsServicesCatalog() {
  const { data: services, isLoading } = trpc.awsServices.listPublic.useQuery();

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
        className="mx-auto mb-14 max-w-3xl rounded-2xl border border-dashed border-sky-300/70 bg-white/50 px-6 py-10 text-center dark:border-white/15 dark:bg-zinc-900/40"
        {...fadeUpProps}
      >
        <Cloud className="mx-auto h-10 w-10 text-[#3b41ff] dark:text-violet-400" />
        <p className={`mt-4 text-lg font-semibold ${clubTheme.textHeading}`}>
          Pronto publicaremos el catálogo
        </p>
        <p className={`mt-2 text-sm sm:text-base ${clubTheme.textMuted}`}>
          El core team está preparando guías curadas de servicios AWS para el
          club.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="mb-14"
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
    >
      <motion.div
        className="mx-auto mb-10 max-w-3xl text-center"
        {...fadeUpProps}
      >
        <p className="text-sm font-bold uppercase tracking-widest text-[#3b41ff] dark:text-violet-300">
          Aprende AWS
        </p>
        <h2
          className={`mt-3 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl ${clubTheme.textHeading}`}
        >
          Servicios explicados para estudiantes
        </h2>
        <p className={`mt-3 text-base sm:text-lg ${clubTheme.textMuted}`}>
          Contenido curado por el equipo — cuándo usarlo, cuándo no, y tips del
          club.
        </p>
      </motion.div>

      <ul className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((svc) => {
          const Icon =
            CATEGORY_ICONS[svc.category as keyof typeof CATEGORY_ICONS] ??
            Cloud;
          return (
            <motion.li key={svc.id} variants={staggerItem}>
              <Link
                href={`/servicios/${svc.slug}`}
                className={`group flex h-full flex-col p-6 sm:p-7 ${clubTheme.card} ${clubTheme.cardHover}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${clubTheme.gradientButton} text-white shadow-md`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  {svc.isPopular ? (
                    <span className="rounded-full bg-[#00C8FF]/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#0077a8] dark:text-cyan-300">
                      Popular
                    </span>
                  ) : null}
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-[#3b41ff] dark:text-violet-300">
                  {AWS_SERVICE_CATEGORY_LABELS[svc.category]}
                </p>
                <h3
                  className={`mt-1 text-xl font-bold group-hover:text-[#00C8FF] transition-colors ${clubTheme.textHeading}`}
                >
                  {svc.name}
                </h3>
                <p
                  className={`mt-2 line-clamp-3 flex-1 text-sm leading-relaxed ${clubTheme.textMuted}`}
                >
                  {svc.shortDescription}
                </p>
                {svc.difficultyLevel ? (
                  <p className={`mt-4 text-xs font-medium ${clubTheme.textMuted}`}>
                    Nivel: {AWS_DIFFICULTY_LABELS[svc.difficultyLevel]}
                  </p>
                ) : null}
              </Link>
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
}
