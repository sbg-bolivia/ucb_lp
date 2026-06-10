"use client";

import { ClubMeetupButton } from "@/components/club-landing/club-meetup-button";
import { useClubLinks } from "@/hooks/useClubLinks";
import { CLUB } from "@/lib/club-brand";
import { fadeUpProps } from "@/lib/club-motion";
import { UNIVERSITY_IMAGES } from "@/lib/university-assets";
import { Eye, Target } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";

import { clubTheme } from "./club-theme";

const STATS = [
  { value: "4+", label: "Años de trayectoria" },
  { value: "120+", label: "Miembros activos" },
  { value: "25+", label: "Eventos realizados" },
  { value: "15+", label: "Talleres AWS" },
] as const;

const GALLERY = [
  { src: UNIVERSITY_IMAGES.communityDay, alt: "Community Day en el campus" },
  { src: UNIVERSITY_IMAGES.awsCommunityDay2024, alt: "AWS Community Day 2024" },
  { src: UNIVERSITY_IMAGES.goldenJackets, alt: "Golden Jackets del club" },
  { src: UNIVERSITY_IMAGES.awsUgLeads, alt: "Líderes AWS User Group" },
  { src: UNIVERSITY_IMAGES.auditorio, alt: "Auditorio UCB" },
  { src: UNIVERSITY_IMAGES.communityDay2, alt: "Actividad en comunidad" },
] as const;

export function ClubAboutPage() {
  const links = useClubLinks();

  return (
    <>
      <section
        className={`relative overflow-hidden border-b border-[var(--border-soft)] ${clubTheme.sectionSoft}`}
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute inset-y-0 right-0 w-1/2 bg-[var(--bg)] dark:bg-[var(--surface)]" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:gap-16">
          <motion.div {...fadeUpProps} className="relative z-10">
            <p className="text-sm font-bold uppercase tracking-widest text-[var(--aws-orange)]">
              Sobre nosotros
            </p>
            <h2
              className={`mt-3 text-3xl font-bold tracking-tight sm:text-4xl md:text-[2.75rem] md:leading-tight ${clubTheme.textHeading}`}
            >
              El puente entre la universidad y el{" "}
              <span className="text-[var(--aws-orange)]">ecosistema cloud</span>
            </h2>
            <p className={`mt-6 text-lg leading-relaxed ${clubTheme.textMuted}`}>
              Somos el {CLUB.shortName} en {CLUB.city}: estudiantes que exploran
              AWS, construyen portafolio y se preparan para oportunidades reales
              en tecnología — sin importar la carrera.
            </p>
          </motion.div>

          <motion.div
            className="relative mx-auto w-full max-w-lg lg:max-w-none"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="absolute -right-2 top-8 hidden h-[88%] w-[88%] rounded-[3rem] border-2 border-[var(--aws-orange)]/70 lg:block"
              aria-hidden
            />
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-[var(--border-soft)] shadow-2xl sm:rounded-[2.5rem]">
              <Image
                src={UNIVERSITY_IMAGES.entrada}
                alt="Campus UCB La Paz"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className={`${clubTheme.sectionTint} px-4 py-14 sm:px-6 sm:py-16`}>
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2">
          <motion.article className={`p-8 ${clubTheme.card}`} {...fadeUpProps}>
            <Target className="h-8 w-8 text-[var(--aws-orange)]" />
            <h3 className={`mt-4 text-xl font-bold ${clubTheme.textHeading}`}>
              Nuestra misión
            </h3>
            <p className={`mt-3 text-sm leading-relaxed sm:text-base ${clubTheme.textMuted}`}>
              Empoderar a estudiantes para construir soluciones reales en la nube,
              con práctica guiada, mentoría entre pares y proyectos que suman al
              portafolio profesional.
            </p>
          </motion.article>
          <motion.article
            className={`p-8 ${clubTheme.card}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.08 }}
          >
            <Eye className="h-8 w-8 text-[var(--aws-orange)]" />
            <h3 className={`mt-4 text-xl font-bold ${clubTheme.textHeading}`}>
              Nuestra visión
            </h3>
            <p className={`mt-3 text-sm leading-relaxed sm:text-base ${clubTheme.textMuted}`}>
              Ser la comunidad estudiantil de referencia en cloud computing en
              Bolivia, conectada al ecosistema global de AWS y a las oportunidades
              del mercado tecnológico.
            </p>
          </motion.article>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-5xl rounded-3xl bg-[var(--aws-ink)] px-6 py-10 sm:px-10 sm:py-12">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold text-[var(--aws-orange)] sm:text-4xl">
                  {s.value}
                </p>
                <p className="mt-1 text-sm text-[var(--text-muted)]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6">
        <div className="mx-auto mb-8 max-w-6xl">
          <h3 className={`text-2xl font-bold ${clubTheme.textHeading}`}>
            Vida en el campus
          </h3>
          <p className={`mt-2 text-sm ${clubTheme.textMuted}`}>
            Talleres, community days y momentos del {CLUB.shortName}.
          </p>
        </div>
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 md:grid-cols-3 sm:gap-4">
          {GALLERY.map((item) => (
            <div
              key={item.src}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-[var(--aws-ink)]/0 transition-colors duration-500 group-hover:bg-[var(--aws-ink)]/20" />
            </div>
          ))}
        </div>
      </section>

      <section className="relative mx-4 mb-16 overflow-hidden rounded-3xl sm:mx-6">
        <div className="relative min-h-[300px] sm:min-h-[340px]">
          <Image
            src={UNIVERSITY_IMAGES.enComunidad}
            alt="Estudiantes del club trabajando juntos"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[var(--aws-ink)]/82" />
          <div className="relative z-10 flex flex-col items-start justify-center px-6 py-16 sm:px-12 sm:py-20 lg:max-w-xl">
            <h3 className="text-2xl font-bold text-white sm:text-3xl">
              ¿Quieres ser parte del cambio?
            </h3>
            <p className="mt-3 text-sm text-[var(--text-muted)] sm:text-base">
              Únete a nuestra comunidad y empieza tu viaje en la nube con el
              equipo del campus.
            </p>
            {links.meetupUrl ? (
              <div className="mt-8">
                <ClubMeetupButton href={links.meetupUrl} size="lg" showExternal>
                  Únete en Meetup
                </ClubMeetupButton>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
