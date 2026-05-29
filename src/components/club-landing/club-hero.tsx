"use client";

import { useAuthContext } from "@/AuthContext";
import { Button } from "@/components/ui/button";
import { useClubLinks } from "@/hooks/useClubLinks";
import { CLUB } from "@/lib/club-brand";
import { clubEase } from "@/lib/club-motion";
import { ArrowRight, Rotate3d } from "lucide-react";
import { motion } from "motion/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { clubTheme } from "./club-theme";

// El visor 3D se carga solo en cliente (WebGL).
const ClubHeroModel = dynamic(
  () => import("./club-hero-model").then((m) => m.ClubHeroModel),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-24 w-24 animate-pulse rounded-3xl bg-gradient-to-br from-[#00C8FF]/30 to-[#7E2CFF]/30 blur-md" />
      </div>
    ),
  }
);

export function ClubHero() {
  const { isAuthenticated } = useAuthContext();
  const router = useRouter();
  const links = useClubLinks();
  const [autoRotate, setAutoRotate] = useState(true);

  const primaryJoin = () => {
    if (isAuthenticated) router.push("/dashboard");
    else if (links.meetupUrl)
      window.open(links.meetupUrl, "_blank", "noopener,noreferrer");
    else router.push("/unete");
  };

  return (
    <section className="relative -mt-16 overflow-hidden bg-[#050608] pb-12 pt-20 sm:pb-16 sm:pt-24">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="club-aurora opacity-90" />
        <div className="absolute inset-0 club-grid opacity-50" />
        <div
          className={`absolute inset-0 bg-gradient-to-b from-[#050608]/40 via-transparent to-[#0C0D12] ${clubTheme.gradientHeroOverlay}`}
        />
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid w-full items-center gap-6 lg:grid-cols-12 lg:items-center lg:gap-6">
          {/* Texto */}
          <motion.div
            className="order-2 flex flex-col text-center lg:order-1 lg:col-span-5 lg:text-left"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: clubEase }}
          >
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-[#00C8FF]">
              {CLUB.heroLine1}
            </p>

            <h1 className="text-[2.5rem] font-bold leading-[1.04] tracking-tight text-white sm:text-5xl md:text-[3.5rem] xl:text-[4rem]">
              Construye en comunidad.
              <br />
              <span className="bg-gradient-to-r from-[#00C8FF] via-[#7E2CFF] to-[#A855F7] bg-clip-text text-transparent">
                Aprende en la nube.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-zinc-400 sm:text-lg lg:mx-0">
              Somos estudiantes que construyen, aprenden y se apoyan para crear
              soluciones en AWS que impactan.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Button
                type="button"
                size="lg"
                onClick={primaryJoin}
                className={`group h-12 rounded-full bg-gradient-to-r px-8 text-base font-semibold text-white shadow-[0_0_32px_rgba(126,44,255,0.35)] sm:h-14 ${clubTheme.gradientButton}`}
              >
                {isAuthenticated ? "Ir al panel" : "Únete al grupo"}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
              <Button
                type="button"
                size="lg"
                variant="outline"
                asChild
                className="h-12 rounded-full border-white/20 bg-transparent px-8 text-base font-semibold text-white hover:bg-white/5 sm:h-14"
              >
                <Link href="/nosotros">Conoce más</Link>
              </Button>
            </div>

            {/* Toggle animación en bucle */}
            <div className="mt-8 flex items-center justify-center gap-3 lg:justify-start">
              <button
                type="button"
                role="switch"
                aria-checked={autoRotate}
                onClick={() => setAutoRotate((v) => !v)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full border transition-colors ${
                  autoRotate
                    ? "border-[#7E2CFF]/50 bg-[#7E2CFF]/30"
                    : "border-white/15 bg-white/5"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    autoRotate ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className="inline-flex items-center gap-1.5 text-sm text-zinc-400">
                <Rotate3d className="h-4 w-4 text-[#A855F7]" />
                Animación en bucle
              </span>
            </div>
          </motion.div>

          {/* Modelo 3D interactivo */}
          <motion.div
            className="order-1 lg:order-2 lg:col-span-7"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.08, ease: clubEase }}
          >
            <div className="relative mx-auto aspect-square h-[56vw] max-h-[620px] w-full max-w-[680px]">
              <div
                className="club-stage-glow pointer-events-none absolute inset-0"
                aria-hidden
              />
              <ClubHeroModel autoRotate={autoRotate} />
              <p className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-600">
                Arrastra para rotar
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
