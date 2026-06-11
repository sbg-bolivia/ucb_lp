"use client";

import { useClubLinks } from "@/hooks/useClubLinks";
import { CLUB } from "@/lib/club-brand";
import {
  clubEase,
  staggerContainer,
  staggerItem,
} from "@/lib/club-motion";
import { UNIVERSITY_IMAGES } from "@/lib/university-assets";
import { CalendarDays, Code2, GraduationCap, PartyPopper } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

import { ClubMeetupButton } from "./club-meetup-button";
import { ClubSiteBanners } from "./club-site-banners";
import { ClubPublishedEvents } from "./club-published-events";
import { clubTheme } from "./club-theme";

const blocks = [
  {
    icon: Code2,
    title: "Labs y talleres",
    description:
      "Práctica guiada con consola AWS, arquitecturas sencillas y retos por niveles.",
    image: UNIVERSITY_IMAGES.auditorio,
  },
  {
    icon: GraduationCap,
    title: "Ruta hacia certificaciones",
    description:
      "Grupos de estudio, recursos y simulacros para acercarte a exámenes como Cloud Practitioner.",
    image: UNIVERSITY_IMAGES.goldenJackets,
  },
  {
    icon: CalendarDays,
    title: "Eventos y charlas",
    description:
      "Invitados de la industria, sesiones en vivo y espacios para preguntar sin filtro.",
    image: UNIVERSITY_IMAGES.awsCommunityDay2024,
  },
  {
    icon: PartyPopper,
    title: "Comunidad y networking",
    description:
      "Conoce a otros clubs, participa en hackathons y suma experiencia en equipo.",
    image: UNIVERSITY_IMAGES.communityDay2,
  },
] as const;

export function ClubActivities() {
  const links = useClubLinks();

  return (
    <>
      <ClubSiteBanners placement="EVENTS_PAGE" variant="page" />
      <section
        id="actividades"
        className={`relative overflow-hidden ${clubTheme.sectionY} ${clubTheme.sectionDark}`}
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <Image
            src={UNIVERSITY_IMAGES.communityDay}
            alt=""
            fill
            className="object-cover opacity-[0.12] dark:opacity-[0.08]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-[var(--bg)]/98 to-slate-100 dark:from-[var(--aws-ink)] dark:via-[var(--aws-ink)]/95 dark:to-[var(--brand-dark)]" />
        </div>

        <div className={`relative ${clubTheme.container}`}>
          <ClubPublishedEvents />

          <motion.div
            className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
          >
            {blocks.map((b) => (
              <motion.article
                key={b.title}
                variants={staggerItem}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.35, ease: clubEase }}
                className={`group relative overflow-hidden rounded-xl ${clubTheme.card} ${clubTheme.cardHover}`}
              >
                <div className="relative h-32 w-full overflow-hidden">
                  <Image
                    src={b.image}
                    alt=""
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                </div>
                <div className="p-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--aws-orange)]/15 text-[var(--aws-orange)]">
                    <b.icon className="h-4 w-4" strokeWidth={1.5} />
                  </div>
                  <h3 className={`mt-3 text-base font-bold ${clubTheme.textHeading}`}>
                    {b.title}
                  </h3>
                  <p className={`mt-1.5 text-sm leading-relaxed ${clubTheme.textMuted}`}>
                    {b.description}
                  </p>
                </div>
              </motion.article>
            ))}
          </motion.div>

          <motion.div
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: clubEase }}
          >
            {links.meetupUrl ? (
              <ClubMeetupButton href={links.meetupUrl} size="lg" showExternal>
                Meetup — eventos del {CLUB.shortName}
              </ClubMeetupButton>
            ) : (
              <Link
                href="/unete"
                className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-bold text-white ${clubTheme.meetupHighlight}`}
              >
                Ver enlace Meetup en Únete
              </Link>
            )}
            <Link
              href="/unete"
              className={`inline-flex items-center rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors duration-300 hover:border-[var(--aws-orange)]/40 ${clubTheme.card} ${clubTheme.textHeading}`}
            >
              WhatsApp, TikTok y más redes
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
