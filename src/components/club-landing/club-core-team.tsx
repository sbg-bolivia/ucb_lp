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

function isLeaderRole(role: string) {
  return /presidente|presidenta|líder|lider|lead/i.test(role);
}

function pickLeader(members: CoreTeamMember[]) {
  return members.find((m) => isLeaderRole(m.role)) ?? members[0];
}

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
      className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-[var(--aws-orange)] hover:bg-[var(--aws-orange)]/10 hover:text-[var(--aws-orange)] dark:border-[var(--border-soft)] dark:bg-[var(--surface)] dark:text-zinc-300"
    >
      {children}
    </Link>
  );
}

function MemberCard({
  member,
  featured = false,
}: {
  member: CoreTeamMember;
  featured?: boolean;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = Boolean(member.image?.trim()) && !imgFailed;
  const initials = getInitials(member.name) || "?";

  const photoSize = featured
    ? "h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem]"
    : "h-12 w-12 sm:h-14 sm:w-14";

  return (
    <motion.article
      variants={staggerItem}
      className={`flex flex-col items-center text-center ${clubTheme.card} ${clubTheme.cardHover} ${
        featured ? "p-3 sm:p-3.5" : "p-2.5 sm:p-3"
      }`}
    >
      <div
        className={`relative overflow-hidden rounded-2xl border-2 border-[var(--aws-orange)]/30 shadow-sm ${photoSize}`}
      >
        {showImage ? (
          <Image
            src={member.image as string}
            alt={member.name}
            fill
            className="object-cover object-[center_25%]"
            sizes={featured ? "72px" : "56px"}
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${clubTheme.gradientButton} text-xl font-bold text-white`}
          >
            {initials}
          </div>
        )}
      </div>
      <h3
        className={`mt-1.5 font-bold ${featured ? "text-sm sm:text-base" : "text-xs sm:text-sm"} ${clubTheme.textHeading}`}
      >
        {member.name}
      </h3>
      <p className="text-[10px] font-medium leading-tight text-[var(--aws-orange)] sm:text-xs">
        {member.role}
      </p>
      <div className="mt-1.5 flex flex-wrap justify-center gap-1">
        <SocialLink href={member.linkedin ?? ""} label={`LinkedIn de ${member.name}`}>
          <Linkedin className="h-3 w-3" />
        </SocialLink>
        <SocialLink href={member.instagram ?? ""} label={`Instagram de ${member.name}`}>
          <Instagram className="h-3 w-3" />
        </SocialLink>
        <SocialLink href={member.github ?? ""} label={`GitHub de ${member.name}`}>
          <Github className="h-3 w-3" />
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

  const leader = useMemo(() => pickLeader(members), [members]);
  const rest = useMemo(
    () => members.filter((m) => m.id !== leader?.id),
    [members, leader]
  );

  return (
    <section
      id="equipo"
      className={`relative pt-8 pb-10 sm:pt-10 sm:pb-12 ${clubTheme.sectionSoft}`}
    >
      <div className={`relative ${clubTheme.container}`}>
        <motion.div className="mx-auto mb-6 max-w-2xl text-center" {...fadeUpProps}>
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--aws-orange)]">
            Core team
          </p>
          <h2 className={`mt-2 text-2xl font-bold tracking-tight sm:text-3xl ${clubTheme.textHeading}`}>
            Quién impulsa el {CLUB.shortName}
          </h2>
          <p className={`mt-2 text-sm sm:text-base ${clubTheme.textMuted}`}>
            {members.length === 1
              ? "Quien coordina talleres, eventos y la comunidad del club."
              : `Un equipo de ${members.length} personas que coordina talleres, eventos y la comunidad del club.`}
          </p>
        </motion.div>

        {leader ? (
          <motion.div
            className="mb-4 flex justify-center"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-full max-w-[160px] sm:max-w-[180px]">
              <MemberCard member={leader} featured />
            </div>
          </motion.div>
        ) : null}

        {rest.length > 0 ? (
          <motion.div
            className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5 lg:grid-cols-5"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
          >
            {rest.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}
