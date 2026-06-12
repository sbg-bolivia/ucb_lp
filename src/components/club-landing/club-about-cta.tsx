"use client";

import { ClubMeetupButton } from "@/components/club-landing/club-meetup-button";
import { useClubLinks } from "@/hooks/useClubLinks";
import { Cloud } from "lucide-react";
import { clubTheme } from "./club-theme";

export function ClubAboutCta() {
  const links = useClubLinks();

  return (
    <section className={`${clubTheme.container} pb-10 sm:pb-12`}>
      <div
        className="relative overflow-hidden rounded-[1.75rem] border border-[var(--border-soft)] bg-gradient-to-r from-[var(--pastel-violet-soft)] via-[rgba(255,248,240,0.95)] to-[var(--bg-soft-blue)] p-8 sm:p-10 dark:from-[var(--surface)] dark:via-[var(--surface-soft)] dark:to-[var(--surface)]"
      >
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--ucb-blue)]/10 text-[var(--ucb-blue)]">
              <Cloud className="h-6 w-6" />
            </div>
            <div>
              <h3 className={`text-xl font-bold sm:text-2xl ${clubTheme.textHeading}`}>
                ¿Quieres ser parte del cambio?
              </h3>
              <p className={`mt-2 text-sm sm:text-base ${clubTheme.textMuted}`}>
                Únete a nuestra comunidad y empieza tu viaje en la nube con el
                equipo del campus.
              </p>
            </div>
          </div>
          {links.meetupUrl ? (
            <ClubMeetupButton href={links.meetupUrl} size="lg" showExternal />
          ) : null}
        </div>
      </div>
    </section>
  );
}
