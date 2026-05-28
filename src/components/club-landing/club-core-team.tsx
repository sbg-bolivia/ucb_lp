"use client";

import { CORE_TEAM_MEMBERS } from "@/data/club-core-team";
import { CLUB } from "@/lib/club-brand";
import type { CoreTeamMember } from "@/lib/club-core-team-schema";
import { parseCoreTeamJson } from "@/lib/club-core-team-schema";
import { fadeUpProps, staggerContainer, staggerItem } from "@/lib/club-motion";
import { getInitials } from "@/lib/utils/avatar";
import { trpc } from "@/utils/trpc";
import { Github, Instagram, Linkedin } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { clubTheme } from "./club-theme";

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  if (!href?.trim()) return null;
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-violet-200 bg-white text-slate-600 transition hover:border-[#3b41ff] hover:bg-violet-50 hover:text-[#3b41ff] hover:scale-110 active:scale-95 dark:border-violet-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-violet-400 dark:hover:bg-zinc-700 dark:hover:text-violet-200"
    >
      {children}
    </Link>
  );
}

function MemberCard({ member }: { member: CoreTeamMember }) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = Boolean(member.image?.trim()) && !imgFailed;
  const initials = getInitials(member.name) || "?";

  return (
    <motion.article
      variants={staggerItem}
      className={`flex flex-col items-center text-center ${clubTheme.card} ${clubTheme.cardHover} p-6 sm:p-7`}
    >
      <div className="relative h-28 w-28 overflow-hidden rounded-2xl border-2 border-violet-200/80 shadow-inner shadow-violet-500/10 dark:border-violet-600/50 sm:h-32 sm:w-32">
        {showImage ? (
          <Image
            src={member.image as string}
            alt={member.name}
            fill
            className="object-cover"
            sizes="128px"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${clubTheme.gradientButton} text-xl font-bold text-white sm:text-2xl`}
          >
            {initials}
          </div>
        )}
      </div>
      <h3
        className={`mt-4 text-lg font-bold sm:text-xl ${clubTheme.textHeading}`}
      >
        {member.name}
      </h3>
      <p className="text-sm font-medium text-[#5c27c4] dark:text-violet-300">
        {member.role}
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <SocialLink href={member.linkedin ?? ""} label={`LinkedIn de ${member.name}`}>
          <Linkedin className="h-4 w-4" />
        </SocialLink>
        <SocialLink href={member.instagram ?? ""} label={`Instagram de ${member.name}`}>
          <Instagram className="h-4 w-4" />
        </SocialLink>
        <SocialLink href={member.github ?? ""} label={`GitHub de ${member.name}`}>
          <Github className="h-4 w-4" />
        </SocialLink>
      </div>
    </motion.article>
  );
}

export function ClubCoreTeam() {
  const { data: tenant } = trpc.companyInfo.get.useQuery();

  const members = useMemo(() => {
    const fromDb = tenant
      ? parseCoreTeamJson((tenant as { coreTeam?: unknown }).coreTeam)
      : null;
    if (fromDb && fromDb.length > 0) return fromDb;
    return CORE_TEAM_MEMBERS;
  }, [tenant]);

  return (
    <section
      id="equipo"
      className={`relative px-4 py-20 sm:px-6 sm:py-28 ${clubTheme.sectionSoft}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(59,65,255,0.07),transparent)]" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div className="mx-auto mb-14 max-w-3xl text-center" {...fadeUpProps}>
          <p className="text-sm font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#3b41ff] to-[#6a11cb]">
            Core team
          </p>
          <h2
            className={`mt-3 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl ${clubTheme.textHeading}`}
          >
            Quién impulsa el {CLUB.shortName}
          </h2>
          <p className={`mt-4 text-lg ${clubTheme.textMuted}`}>
            {members.length === 1
              ? "Quien coordina talleres, eventos y la comunidad del club."
              : `Un equipo de ${members.length} personas que coordina talleres, eventos y la comunidad del club.`}
          </p>
        </motion.div>

        <motion.div
          className={`grid gap-6 sm:grid-cols-2 ${
            members.length <= 2
              ? "lg:grid-cols-2"
              : members.length <= 3
                ? "lg:grid-cols-3"
                : members.length === 4
                  ? "lg:grid-cols-4"
                  : "lg:grid-cols-5"
          }`}
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
          {members.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
