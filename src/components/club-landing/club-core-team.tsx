"use client";

import { CORE_TEAM_MEMBERS } from "@/data/club-core-team";
import { CLUB } from "@/lib/club-brand";
import type { CoreTeamMember } from "@/lib/club-core-team-schema";
import { parseCoreTeamJson } from "@/lib/club-core-team-schema";
import { fadeUpProps, staggerContainer, staggerItem } from "@/lib/club-motion";
import { getInitials } from "@/lib/utils/avatar";
import { trpc } from "@/utils/trpc";
import {
  ArrowRight,
  Github,
  Instagram,
  Linkedin,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";

import { clubTheme } from "./club-theme";
import { ClubPastelBlobs } from "./club-pastel-blobs";

const BLOB_COLORS = [
  "bg-[var(--pastel-blue)]/70",
  "bg-[var(--pastel-pink)]/65",
  "bg-[var(--aws-orange-pastel)]/75",
  "bg-[var(--ucb-yellow-soft)]/80",
  "bg-[var(--pastel-violet)]/55",
] as const;

const ROLE_BLURBS: Record<string, string> = {
  default:
    "Impulsa iniciativas del club, conecta con la comunidad y comparte conocimiento en la nube.",
  presidente:
    "Coordina la estrategia del club, talleres y la comunidad del campus.",
  vicepresidente:
    "Apoya la operación del club, eventos y la experiencia de los miembros.",
  técnico:
    "Lidera talleres prácticos, labs y proyectos con servicios AWS.",
  comunicación:
    "Gestiona la presencia del club en redes y la comunicación con la comunidad.",
  eventos:
    "Organiza meetups, workshops y actividades para la comunidad estudiantil.",
};

function isLeaderRole(role: string) {
  return /presidente|presidenta|líder|lider|lead|coordinador/i.test(role);
}

function pickLeader(members: CoreTeamMember[]) {
  return members.find((m) => isLeaderRole(m.role)) ?? members[0];
}

function roleBlurb(role: string) {
  const lower = role.toLowerCase();
  if (/presidente|presidenta/.test(lower)) return ROLE_BLURBS.presidente;
  if (/vicepresidente/.test(lower)) return ROLE_BLURBS.vicepresidente;
  if (/técnico|tecnico|talleres|workshop/.test(lower)) return ROLE_BLURBS.técnico;
  if (/comunicación|comunicacion|redes/.test(lower)) return ROLE_BLURBS.comunicación;
  if (/eventos|comunidad/.test(lower)) return ROLE_BLURBS.eventos;
  return ROLE_BLURBS.default;
}

function SocialLink({
  href,
  label,
  children,
  size = "sm",
}: {
  href: string;
  label: string;
  children: React.ReactNode;
  size?: "sm" | "md";
}) {
  if (!href?.trim()) return null;
  const dim = size === "md" ? "h-8 w-8" : "h-7 w-7";
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`flex ${dim} items-center justify-center rounded-full border border-[var(--border-soft)] bg-white/80 text-[var(--text-secondary)] transition hover:border-[var(--aws-orange)] hover:bg-[var(--aws-orange)]/10 hover:text-[var(--aws-orange)] dark:border-white/15 dark:bg-white/10 dark:text-zinc-200 dark:hover:border-[var(--aws-orange)]/50 dark:hover:bg-[var(--aws-orange)]/15 dark:hover:text-[var(--aws-orange)]`}
    >
      {children}
    </Link>
  );
}

const PHOTO_SIZES = {
  md: {
    photo: "h-[5.25rem] w-[5.25rem] border-[3px] text-base",
    oval: "h-[4.25rem] w-12 -bottom-0.5",
    sizes: "84px",
  },
} as const;

function PhotoWithOval({
  member,
  size = "md",
  blobClass,
}: {
  member: CoreTeamMember;
  size?: "md";
  blobClass?: string;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = Boolean(member.image?.trim()) && !imgFailed;
  const initials = getInitials(member.name) || "?";
  const { photo, oval, sizes } = PHOTO_SIZES[size];

  return (
    <div className="relative mx-auto flex items-end justify-center">
      <div
        className={cn(
          "absolute left-1/2 -translate-x-1/2 rounded-[50%] blur-[3px]",
          blobClass ??
            "bg-gradient-to-b from-black/10 to-black/5 dark:from-black/35 dark:to-black/20",
          oval
        )}
        aria-hidden
      />
      <div
        className={cn(
          "relative overflow-hidden rounded-full border-white shadow-md dark:border-[var(--surface-soft)]",
          photo
        )}
      >
        {showImage ? (
          <Image
            src={member.image as string}
            alt={member.name}
            fill
            className="object-cover object-[center_22%]"
            sizes={sizes}
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--ucb-blue-soft)] to-[var(--pastel-violet)] font-bold text-[var(--ucb-blue-dark)] dark:from-[var(--ucb-blue)] dark:to-[var(--pastel-violet)] dark:text-white">
            {initials}
          </div>
        )}
      </div>
    </div>
  );
}

function MemberSocialLinks({
  member,
  size = "sm",
  className,
  onClickStop,
}: {
  member: CoreTeamMember;
  size?: "sm" | "md";
  className?: string;
  onClickStop?: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      className={cn("flex flex-wrap justify-center gap-1.5", className)}
      onClick={onClickStop}
      onKeyDown={(e) => onClickStop?.(e as unknown as React.MouseEvent)}
    >
      <SocialLink href={member.linkedin ?? ""} label={`LinkedIn de ${member.name}`} size={size}>
        <Linkedin className={size === "md" ? "h-4 w-4" : "h-3.5 w-3.5"} />
      </SocialLink>
      <SocialLink href={member.github ?? ""} label={`GitHub de ${member.name}`} size={size}>
        <Github className={size === "md" ? "h-4 w-4" : "h-3.5 w-3.5"} />
      </SocialLink>
      <SocialLink href={member.instagram ?? ""} label={`Instagram de ${member.name}`} size={size}>
        <Instagram className={size === "md" ? "h-4 w-4" : "h-3.5 w-3.5"} />
      </SocialLink>
    </div>
  );
}

function LeaderSpotlightCard({ member }: { member: CoreTeamMember }) {
  return (
    <motion.article
      className={`mx-auto w-full max-w-sm rounded-2xl px-4 py-4 ${clubTheme.featuredCard} shadow-[var(--shadow-soft)]`}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
    >
      <div className="flex flex-col items-center text-center">
        <PhotoWithOval
          member={member}
          size="md"
          blobClass="bg-[var(--pastel-violet)]/45 dark:bg-[var(--pastel-violet)]/30"
        />
        <span className="mt-3 inline-flex rounded-full bg-[var(--pastel-violet)]/30 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[var(--ucb-blue)] dark:bg-[var(--aws-orange)]/15 dark:text-[var(--aws-orange)]">
          Team lead
        </span>
        <h3 className={`mt-1.5 text-base font-bold ${clubTheme.textHeading}`}>
          {member.name}
        </h3>
        <p className="mt-0.5 text-xs font-semibold text-[var(--aws-orange)]">
          {member.role}
        </p>
        <p className={`mt-2 line-clamp-2 text-[11px] leading-relaxed ${clubTheme.textMuted}`}>
          {roleBlurb(member.role)}
        </p>
        <MemberSocialLinks member={member} className="mt-2.5" />
      </div>
    </motion.article>
  );
}

function FlipMemberCard({
  member,
  blobIndex,
}: {
  member: CoreTeamMember;
  blobIndex: number;
}) {
  const [flipped, setFlipped] = useState(false);
  const blob = BLOB_COLORS[blobIndex % BLOB_COLORS.length];

  const toggleFlip = () => setFlipped((f) => !f);

  const flipLabel = `${member.name} — ${member.role}. Toca para ${flipped ? "ver el frente" : "ver más detalles"}.`;

  return (
    <motion.article
      variants={staggerItem}
      className="h-[210px] w-full [perspective:1000px]"
    >
      <div className="relative h-full w-full [transform-style:preserve-3d]">
        <div
          className={cn(
            "relative h-full w-full transition-transform duration-500 ease-out [transform-style:preserve-3d]",
            flipped && "[transform:rotateY(180deg)]"
          )}
        >
          <div
            className={cn(
              "absolute inset-0 flex flex-col items-center px-2.5 py-3.5 text-center",
              "[backface-visibility:hidden] [-webkit-backface-visibility:hidden]",
              clubTheme.card
            )}
          >
            <button
              type="button"
              aria-pressed={flipped}
              aria-label={flipLabel}
              onClick={toggleFlip}
              className="flex w-full flex-1 cursor-pointer flex-col items-center border-0 bg-transparent p-0 text-inherit"
            >
              <PhotoWithOval member={member} size="md" blobClass={cn(blob, "blur-[2px]")} />
              <h3 className={`mt-2 w-full truncate text-sm font-bold ${clubTheme.textHeading}`}>
                {member.name}
              </h3>
              <p className="mt-0.5 line-clamp-2 text-[10px] font-semibold leading-snug text-[var(--aws-orange)]">
                {member.role}
              </p>
              <p className="mt-auto pt-1 text-[9px] text-[var(--text-muted)] dark:text-zinc-500">
                Toca para más info
              </p>
            </button>
            <MemberSocialLinks
              member={member}
              className="mt-2"
              onClickStop={(e) => e.stopPropagation()}
            />
          </div>

          <div
            className={cn(
              "absolute inset-0 flex flex-col items-center justify-center px-3 py-4 text-center",
              "[backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateY(180deg)]",
              clubTheme.card,
              "border-[var(--aws-orange)]/30 dark:border-[var(--aws-orange)]/25"
            )}
          >
            <button
              type="button"
              aria-pressed={flipped}
              aria-label={flipLabel}
              onClick={toggleFlip}
              className="flex w-full flex-1 cursor-pointer flex-col items-center justify-center border-0 bg-transparent p-0 text-inherit"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--aws-orange)]">
                {member.role}
              </p>
              <p className={`mt-2 line-clamp-5 text-[11px] leading-relaxed ${clubTheme.textMuted}`}>
                {roleBlurb(member.role)}
              </p>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFlipped(false);
              }}
              className="mt-3 rounded-full border border-[var(--border-soft)] px-3 py-1 text-[10px] font-semibold text-[var(--aws-orange)] transition hover:bg-[var(--aws-orange)]/10"
            >
              Volver
            </button>
          </div>
        </div>
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
      className={`relative overflow-hidden pt-8 pb-12 sm:pt-10 sm:pb-16 ${clubTheme.sectionSoft}`}
    >
      <ClubPastelBlobs />
      <div className={`relative ${clubTheme.container}`}>
        <motion.div className="mx-auto mb-10 max-w-3xl text-center" {...fadeUpProps}>
          <span className="inline-flex rounded-full border border-[var(--border-soft)] bg-white/85 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[var(--ucb-blue)] shadow-sm dark:bg-[var(--surface-soft)] dark:text-[var(--text-main)]">
            Core team
          </span>
          <h2 className={`mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.65rem] ${clubTheme.textHeading}`}>
            Quién impulsa el AWS Student Builder Group{" "}
            <span className="text-[var(--aws-orange)]">UCB</span>
          </h2>
          <p className={`mt-3 text-base sm:text-lg ${clubTheme.textMuted}`}>
            Un equipo de {members.length} personas que coordina talleres, eventos
            y la comunidad del club.
          </p>
        </motion.div>

        <div className="mx-auto max-w-5xl space-y-5">
          {leader ? (
            <div className="flex justify-center">
              <LeaderSpotlightCard member={leader} />
            </div>
          ) : null}

          {rest.length > 0 ? (
            <motion.div
              className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5"
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
            >
              {rest.map((member, index) => (
                <FlipMemberCard
                  key={member.id}
                  member={member}
                  blobIndex={index}
                />
              ))}
            </motion.div>
          ) : null}
        </div>

        <motion.div
          className="mt-10 flex flex-col items-center justify-between gap-4 rounded-[1.75rem] border border-[var(--border-soft)] bg-gradient-to-r from-[var(--bg-cream)] via-[rgba(255,248,240,0.95)] to-[var(--bg-soft-blue)] p-6 sm:flex-row sm:p-8 dark:border-white/10 dark:from-[var(--surface)] dark:via-[var(--surface-soft)] dark:to-[var(--surface)]"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--aws-orange)]/15 text-[var(--aws-orange)] dark:bg-[var(--aws-orange)]/20">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className={`text-lg font-bold ${clubTheme.textHeading}`}>
                ¿Únete a nuestra comunidad!
              </p>
              <p className={`mt-1 text-sm ${clubTheme.textMuted}`}>
                Siempre buscamos nuevos miembros y voluntarios.
              </p>
            </div>
          </div>
          <Link
            href="/#unete"
            className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold ${clubTheme.gradientButton}`}
          >
            Quiero participar
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
