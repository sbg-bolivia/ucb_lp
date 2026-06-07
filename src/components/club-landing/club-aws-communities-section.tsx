"use client";

import { isClubFeatureEnabled } from "@/lib/club-features";
import { fadeUpProps } from "@/lib/club-motion";
import { trpc } from "@/utils/trpc";
import { Globe2 } from "lucide-react";
import { motion } from "motion/react";
import dynamic from "next/dynamic";

import {
  ClubCommunitiesList,
  type AwsCommunityPublic,
} from "./club-communities-map-inner";
import { clubTheme } from "./club-theme";

const ClubCommunitiesMapInner = dynamic(
  () => import("./club-communities-map-inner"),
  {
    ssr: false,
    loading: () => (
      <div
        className={`flex h-[min(420px,55vh)] items-center justify-center rounded-[2rem] border border-dashed border-sky-300/50 ${clubTheme.textMuted}`}
      >
        Cargando mapa…
      </div>
    ),
  }
);

export function ClubAwsCommunitiesSection() {
  if (!isClubFeatureEnabled("awsCommunitiesMap")) return null;

  const { data: communities, isLoading } =
    trpc.awsCommunities.listPublic.useQuery();

  if (isLoading) {
    return (
      <section
        className={`border-t border-violet-200/60 px-4 py-16 sm:px-6 dark:border-white/10 ${clubTheme.sectionSoft}`}
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
      className={`border-t border-violet-200/60 px-4 py-20 sm:px-6 sm:py-28 dark:border-white/10 ${clubTheme.sectionSoft}`}
    >
      <div className="mx-auto max-w-7xl">
        <motion.div className="mx-auto mb-12 max-w-3xl text-center" {...fadeUpProps}>
          <p className="text-sm font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#3b41ff] to-[#6a11cb]">
            Ecosistema AWS en Bolivia
          </p>
          <h2
            className={`mt-3 text-3xl font-bold tracking-tight sm:text-4xl ${clubTheme.textHeading}`}
          >
            Otras comunidades AWS
          </h2>
          <p className={`mt-5 text-lg ${clubTheme.textMuted}`}>
            Student Builder Groups, User Groups y Cloud Clubs con los que
            colaboramos o nos inspiran en el país.
          </p>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-12">
          <ClubCommunitiesMapInner
            communities={communities as AwsCommunityPublic[]}
          />
          <div>
            <div className="mb-5 flex items-center gap-2">
              <Globe2 className="h-5 w-5 text-[#7E2CFF]" />
              <h3 className={`text-lg font-bold ${clubTheme.textHeading}`}>
                Listado por región
              </h3>
            </div>
            <ClubCommunitiesList
              communities={communities as AwsCommunityPublic[]}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
