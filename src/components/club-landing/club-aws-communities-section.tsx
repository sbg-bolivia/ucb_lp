"use client";

import { isClubFeatureEnabled } from "@/lib/club-features";
import { fadeUpProps } from "@/lib/club-motion";
import { trpc } from "@/utils/trpc";
import { Globe2 } from "lucide-react";
import { motion } from "motion/react";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

import { ClubCommunitiesList } from "./club-communities-list";
import type { AwsCommunityPublic } from "./club-communities-types";
import { clubTheme } from "./club-theme";

const ClubCommunitiesMapInner = dynamic(
  () => import("./club-communities-map-inner"),
  {
    ssr: false,
    loading: () => (
      <div
        className={`flex h-full min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-slate-300 dark:border-[var(--border-soft)] ${clubTheme.textMuted}`}
      >
        Cargando mapa…
      </div>
    ),
  }
);

export function ClubAwsCommunitiesSection() {
  const enabled = isClubFeatureEnabled("awsCommunitiesMap");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: communities, isLoading } =
    trpc.awsCommunities.listPublic.useQuery(undefined, { enabled });

  const list = useMemo(
    () => (communities ?? []) as AwsCommunityPublic[],
    [communities]
  );

  if (!enabled) return null;

  if (isLoading) {
    return (
      <section
        className={`border-t border-slate-200 px-4 py-14 sm:px-6 dark:border-[var(--border-soft)] ${clubTheme.sectionSoft}`}
      >
        <p className={`text-center text-sm ${clubTheme.textMuted}`}>
          Cargando comunidades…
        </p>
      </section>
    );
  }

  if (!communities?.length) return null;

  return (
    <section
      id="comunidades-aws"
      className={`border-t border-slate-200 py-8 sm:py-10 dark:border-[var(--border-soft)] ${clubTheme.sectionSoft}`}
    >
      <div className={clubTheme.container}>
        <motion.div className="mb-8 max-w-2xl" {...fadeUpProps}>
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--aws-orange)]">
            Ecosistema AWS en Bolivia
          </p>
          <h2 className={`mt-2 text-2xl font-bold tracking-tight sm:text-3xl ${clubTheme.textHeading}`}>
            Otras comunidades AWS
          </h2>
          <p className={`mt-3 text-sm sm:text-base ${clubTheme.textMuted}`}>
            Student Builder Groups, User Groups y Cloud Clubs con los que
            colaboramos o nos inspiran en el país.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-stretch lg:gap-8">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="h-[min(360px,50vh)] lg:h-[min(520px,calc(100vh-9rem))]">
              <ClubCommunitiesMapInner
                communities={list}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            </div>
          </div>

          <div className="flex min-h-0 flex-col">
            <div className="mb-4 flex items-center gap-2">
              <Globe2 className="h-5 w-5 text-[var(--aws-orange)]" />
              <h3 className={`text-base font-bold ${clubTheme.textHeading}`}>
                Listado por región
              </h3>
            </div>
            <p className={`mb-4 text-sm ${clubTheme.textMuted}`}>
              Haz clic en una comunidad para centrarla en el mapa.
            </p>
            <ClubCommunitiesList
              communities={list}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
