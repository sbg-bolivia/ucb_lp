"use client";

import { useAuthContext } from "@/AuthContext";
import { Button } from "@/components/ui/button";
import { useClubLinks } from "@/hooks/useClubLinks";
import { fadeUpProps } from "@/lib/club-motion";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

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
      className="border-t border-slate-100 bg-slate-50 px-4 py-16 dark:border-white/5 dark:bg-[#0C0D12] sm:px-6 sm:py-24"
      aria-labelledby="cta-heading"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          {...fadeUpProps}
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#3D1F8F] via-[#7E2CFF] to-[#A855F7] px-6 py-16 text-center shadow-[0_30px_80px_-30px_rgba(126,44,255,0.6)] sm:px-12 sm:py-20"
        >
          {/* Decoración: rejilla + silueta de ciudad pixel */}
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.18) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
              maskImage:
                "radial-gradient(circle at 50% 30%, black 0%, transparent 75%)",
            }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -left-10 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-[#00C8FF]/30 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-10 top-1/3 h-64 w-64 rounded-full bg-[#A855F7]/40 blur-3xl"
            aria-hidden
          />
          <CityscapeSilhouette />

          <div className="relative">
            <h2
              id="cta-heading"
              className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl"
            >
              ¿Listo para construir el futuro?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-white/80 sm:text-lg">
              Únete a nuestra comunidad y empieza tu viaje en la nube.
            </p>

            <div className="mt-9 flex justify-center">
              <Button
                type="button"
                size="lg"
                onClick={onJoin}
                className="group h-12 rounded-full bg-white px-8 text-base font-semibold text-[#3D1F8F] shadow-lg transition hover:bg-white/90 sm:h-14"
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

function CityscapeSilhouette() {
  return (
    <svg
      className="pointer-events-none absolute inset-x-0 bottom-0 h-24 w-full text-white/10"
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      fill="currentColor"
      role="img"
      aria-label="Silueta de ciudad"
    >
      <title>Silueta de ciudad</title>
      <rect x="40" y="70" width="46" height="50" />
      <rect x="96" y="50" width="34" height="70" />
      <rect x="150" y="80" width="40" height="40" />
      <rect x="210" y="40" width="30" height="80" />
      <rect x="258" y="64" width="48" height="56" />
      <rect x="330" y="54" width="36" height="66" />
      <rect x="392" y="78" width="44" height="42" />
      <rect x="470" y="46" width="32" height="74" />
      <rect x="520" y="68" width="50" height="52" />
      <rect x="600" y="36" width="34" height="84" />
      <rect x="654" y="60" width="42" height="60" />
      <rect x="720" y="78" width="40" height="42" />
      <rect x="784" y="50" width="34" height="70" />
      <rect x="842" y="70" width="48" height="50" />
      <rect x="916" y="44" width="32" height="76" />
      <rect x="970" y="66" width="46" height="54" />
      <rect x="1044" y="78" width="40" height="42" />
      <rect x="1106" y="56" width="34" height="64" />
    </svg>
  );
}
