"use client";

import { CLUB } from "@/lib/club-brand";
import {
  clubEase,
  staggerContainer,
  staggerItem,
} from "@/lib/club-motion";
import { UNIVERSITY_IMAGES } from "@/lib/university-assets";
import { ArrowRight, CalendarDays, Code2, GraduationCap, PartyPopper, Users } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

import { ClubPastelBlobs } from "./club-pastel-blobs";
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
  return (
    <>
      <ClubSiteBanners placement="EVENTS_PAGE" variant="page" />
      <section
        id="actividades"
        className={`relative overflow-hidden ${clubTheme.sectionY} ${clubTheme.sectionSoft}`}
      >
        <ClubPastelBlobs />
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
                className={`group relative overflow-hidden rounded-2xl ${clubTheme.card} ${clubTheme.cardHover}`}
              >
                <div className="relative h-32 w-full overflow-hidden">
                  <Image
                    src={b.image}
                    alt=""
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                </div>
                <div className="p-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--aws-orange)]/15 text-[var(--aws-orange)]">
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
            className="mt-10 flex flex-col items-center justify-between gap-4 rounded-[1.75rem] border border-[var(--border-soft)] bg-gradient-to-r from-[var(--bg-cream)] via-[rgba(255,248,240,0.95)] to-[var(--bg-soft-blue)] p-6 sm:flex-row sm:p-8 dark:from-[var(--surface)] dark:via-[var(--surface-soft)] dark:to-[var(--surface)]"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--aws-orange)]/15 text-[var(--aws-orange)]">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className={`text-lg font-bold ${clubTheme.textHeading}`}>
                  ¿Quieres proponer un evento?
                </p>
                <p className={`mt-1 text-sm ${clubTheme.textMuted}`}>
                  Escríbenos y lo sumamos al calendario del {CLUB.shortName}.
                </p>
              </div>
            </div>
            <Link
              href="/#unete"
              className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--aws-orange)] bg-[rgba(255,248,240,0.9)] px-6 py-3 text-sm font-bold text-[var(--aws-orange)] transition hover:bg-[var(--aws-orange)] hover:text-[var(--ucb-blue-dark)] dark:bg-[var(--surface-soft)]"
            >
              Proponer evento
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
