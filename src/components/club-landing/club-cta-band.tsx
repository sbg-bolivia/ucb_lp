"use client";

import { useAuthContext } from "@/AuthContext";
import { Button } from "@/components/ui/button";
import { useClubLinks } from "@/hooks/useClubLinks";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
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
    ? "Ir a Meetup"
    : isAuthenticated
      ? "Ir al panel"
      : "Únete al grupo";

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
          <div
            className="pointer-events-none absolute inset-0 club-grid opacity-[0.22] dark:opacity-[0.28]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#00C8FF]/8 via-transparent to-[#7E2CFF]/10 dark:from-[#00C8FF]/12 dark:via-[#050608]/40 dark:to-[#A855F7]/14"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -left-16 top-1/4 h-56 w-56 rounded-full bg-[#00C8FF]/20 blur-3xl dark:bg-[#00C8FF]/25"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-12 bottom-0 h-64 w-64 rounded-full bg-[#A855F7]/18 blur-3xl dark:bg-[#7E2CFF]/22"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute left-1/2 top-0 h-32 w-[80%] -translate-x-1/2 bg-gradient-to-b from-white/60 to-transparent dark:from-white/[0.04]"
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
              Únete a nuestra comunidad y empieza tu viaje en la nube.
            </p>

            <div className="mt-9 flex justify-center">
              <Button
                type="button"
                size="lg"
                onClick={onJoin}
                className={`group h-12 rounded-full px-8 text-xs font-bold text-white shadow-[0_4px_20px_rgba(126,44,255,0.15)] transition duration-350 hover:-translate-y-0.5 hover:shadow-[0_4px_25px_rgba(126,44,255,0.35)] bg-gradient-to-r ${clubTheme.gradientButton} active:scale-[0.98] sm:h-14 sm:text-sm`}
              >
                {joinLabel}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

