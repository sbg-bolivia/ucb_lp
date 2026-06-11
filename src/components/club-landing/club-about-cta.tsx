"use client";

import { ClubMeetupButton } from "@/components/club-landing/club-meetup-button";
import { useClubLinks } from "@/hooks/useClubLinks";
import { UNIVERSITY_IMAGES } from "@/lib/university-assets";
import Image from "next/image";
import { clubTheme } from "./club-theme";

export function ClubAboutCta() {
  const links = useClubLinks();

  return (
    <section className={`${clubTheme.container} pb-10 sm:pb-12`}>
      <div className="relative min-h-[260px] overflow-hidden rounded-2xl sm:min-h-[280px]">
        <Image
          src={UNIVERSITY_IMAGES.enComunidad}
          alt="Estudiantes del club trabajando juntos"
          fill
          className="object-cover object-[center_40%]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[var(--aws-ink)]/55 dark:bg-[var(--aws-ink)]/65" />
        <div className="relative z-10 flex flex-col items-start justify-center px-6 py-10 sm:px-10 sm:py-12 lg:max-w-xl">
          <h3 className="text-xl font-bold text-white sm:text-2xl">
            ¿Quieres ser parte del cambio?
          </h3>
          <p className="mt-2 text-sm text-[var(--text-muted)] sm:text-base">
            Únete a nuestra comunidad y empieza tu viaje en la nube con el
            equipo del campus.
          </p>
          {links.meetupUrl ? (
            <div className="mt-6">
              <ClubMeetupButton href={links.meetupUrl} size="lg" showExternal />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
