"use client";

import { useAuthContext } from "@/AuthContext";
import { Button } from "@/components/ui/button";
import { useClubLinks } from "@/hooks/useClubLinks";
import { ClubMeetupButton } from "@/components/club-landing/club-meetup-button";
import { UNIVERSITY_IMAGES } from "@/lib/university-assets";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { clubTheme } from "./club-theme";

export function ClubCtaBand() {
  const { isAuthenticated } = useAuthContext();
  const router = useRouter();
  const links = useClubLinks();

  const onJoin = () => {
    if (links.meetupUrl) {
      window.open(links.meetupUrl, "_blank", "noopener,noreferrer");
      return;
    }
    if (isAuthenticated) router.push("/dashboard");
    else router.push("/unete");
  };

  const joinLabel = links.meetupUrl
    ? null
    : isAuthenticated
      ? "Ir al panel"
      : "Forma parte del club";

  return (
    <section
      id="cta"
      className={`bg-transparent ${clubTheme.sectionY}`}
      aria-labelledby="cta-heading"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`relative overflow-hidden rounded-[2.5rem] px-6 py-16 text-center sm:px-12 sm:py-20 ${clubTheme.gradientCta}`}
        >
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <Image
              src={UNIVERSITY_IMAGES.goldenJackets}
              alt=""
              fill
              className="object-cover opacity-[0.06] dark:opacity-[0.12]"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--aws-orange)]/5 via-transparent to-[var(--aws-ink)]/10 dark:from-[var(--aws-orange)]/8 dark:to-[var(--brand-dark)]/40" />
          </div>
          <div
            className="pointer-events-none absolute inset-0 club-grid opacity-[0.15] dark:opacity-[0.22]"
            aria-hidden
          />

          <div className="relative z-10">
            <h2
              id="cta-heading"
              className={`mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl ${clubTheme.textHeading}`}
            >
              ¿Listo para construir el futuro?
            </h2>
            <p
              className={`mx-auto mt-4 max-w-lg text-sm font-medium sm:text-base ${clubTheme.textMuted}`}
            >
              Forma parte del club y empieza tu camino en la nube con talleres,
              proyectos y comunidad.
            </p>

            <div className="mt-9 flex justify-center">
              {links.meetupUrl ? (
                <ClubMeetupButton href={links.meetupUrl} size="lg" showExternal>
                  Únete en Meetup
                </ClubMeetupButton>
              ) : (
                <Button
                  type="button"
                  size="lg"
                  onClick={onJoin}
                  className={`group h-12 rounded-full px-8 text-xs font-bold sm:h-14 sm:text-sm ${clubTheme.ctaButtonLong}`}
                >
                  {joinLabel}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-500 ease-out group-hover:translate-x-0.5" />
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
