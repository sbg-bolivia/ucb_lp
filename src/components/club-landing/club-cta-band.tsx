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
    if (isAuthenticated) router.push("/dashboard");
    else if (links.meetupUrl)
      window.open(links.meetupUrl, "_blank", "noopener,noreferrer");
    else router.push("/unete");
  };

  return (
    <section
      id="cta"
      className="bg-transparent px-4 py-16 sm:px-6 sm:py-24"
      aria-labelledby="cta-heading"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-zinc-950/40 via-zinc-950/20 to-zinc-950/40 px-6 py-16 text-center border border-white/[0.02] sm:px-12 sm:py-20 backdrop-blur-xl"
        >
          {/* Subtle soft glowing backdrops */}
          <div
            className="pointer-events-none absolute -left-10 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-[#00C8FF]/5 blur-3xl animate-pulse"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-10 top-1/3 h-64 w-64 rounded-full bg-[#A855F7]/5 blur-3xl animate-pulse"
            aria-hidden
          />

          <div className="relative z-10">
            <h2
              id="cta-heading"
              className={`mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl ${clubTheme.textHeading}`}
            >
              ¿Listo para construir el futuro?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm text-zinc-400 sm:text-base font-medium">
              Únete a nuestra comunidad y empieza tu viaje en la nube.
            </p>

            <div className="mt-9 flex justify-center">
              <Button
                type="button"
                size="lg"
                onClick={onJoin}
                className={`group h-12 rounded-full px-8 text-xs font-bold text-white shadow-[0_4px_20px_rgba(126,44,255,0.15)] transition duration-350 hover:-translate-y-0.5 hover:shadow-[0_4px_25px_rgba(126,44,255,0.35)] bg-gradient-to-r ${clubTheme.gradientButton} active:scale-[0.98] sm:h-14 sm:text-sm`}
              >
                {isAuthenticated ? "Ir al panel" : "Únete al grupo"}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

