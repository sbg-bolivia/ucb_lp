"use client";



import { useClubLinks } from "@/hooks/useClubLinks";

import { CLUB } from "@/lib/club-brand";

import {

  clubEase,

  fadeUpProps,

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

    image: UNIVERSITY_IMAGES.biblioteca,

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

            className="object-cover opacity-[0.07]"

            sizes="100vw"

          />

          <div className="absolute inset-0 bg-gradient-to-b from-[var(--aws-ink)] via-[var(--aws-ink)]/95 to-[var(--brand-dark)]" />

        </div>



        <div className="relative mx-auto max-w-7xl">

          <ClubPublishedEvents />



          <motion.div

            className="mt-16 grid gap-5 sm:grid-cols-2 lg:gap-6"

            variants={staggerContainer}

            initial="hidden"

            whileInView="show"

            viewport={{ once: true, margin: "-50px" }}

          >

            {blocks.map((b) => (

              <motion.article

                key={b.title}

                variants={staggerItem}

                whileHover={{ y: -4 }}

                transition={{ duration: 0.35, ease: clubEase }}

                className="group relative overflow-hidden rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-soft)]/90 transition-all duration-500 hover:border-[var(--aws-orange)]/30"

              >

                <div className="relative h-28 overflow-hidden">

                  <Image

                    src={b.image}

                    alt=""

                    fill

                    className="object-cover opacity-40 transition-transform duration-700 group-hover:scale-105"

                    sizes="(max-width: 640px) 100vw, 50vw"

                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-soft)] to-transparent" />

                </div>

                <div className="relative p-7 sm:p-8">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--aws-orange)]/15 text-[var(--aws-orange)]">

                    <b.icon className="h-5 w-5" strokeWidth={1.5} />

                  </div>

                  <h3 className="mt-4 text-xl font-bold text-[var(--text-main)]">

                    {b.title}

                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)] sm:text-base">

                    {b.description}

                  </p>

                </div>

              </motion.article>

            ))}

          </motion.div>



          <motion.div
            className="mt-14 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: clubEase }}
          >

            {links.meetupUrl ? (

              <ClubMeetupButton href={links.meetupUrl} size="lg" showExternal>

                Únete en Meetup — eventos del {CLUB.shortName}

              </ClubMeetupButton>

            ) : (

              <Link

                href="/unete"

                className={`inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-8 py-3.5 text-base font-bold text-white ${clubTheme.meetupHighlight}`}

              >

                Ver enlace Meetup en Únete

              </Link>

            )}

            <Link

              href="/unete"

              className="inline-flex items-center rounded-full border border-[var(--border-soft)] bg-[var(--surface-soft)] px-6 py-3 text-sm font-semibold text-[var(--text-main)] transition-colors duration-300 hover:border-[var(--aws-orange)]/40"

            >

              WhatsApp, TikTok y más redes

            </Link>

          </motion.div>

        </div>

      </section>

    </>

  );

}

