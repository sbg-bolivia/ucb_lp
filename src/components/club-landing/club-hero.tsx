"use client";

import { useAuthContext } from "@/AuthContext";
import { Button } from "@/components/ui/button";
import { useClubLinks } from "@/hooks/useClubLinks";
import { clubEase } from "@/lib/club-motion";
import { CLUB } from "@/lib/club-brand";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Cloud,
  Code2,
} from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { ClubPortalVisual } from "./club-portal-visual";
import { clubTheme } from "./club-theme";

type HeroSlide = {
  id: string;
  label: string;
  title: string;
  description: string;
};

export function ClubHero() {
  const { isAuthenticated } = useAuthContext();
  const router = useRouter();
  const links = useClubLinks();
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = useMemo<HeroSlide[]>(
    () => [
      {
        id: "community",
        label: "Comunidad",
        title: "275+ builders activos",
        description:
          "Mentorías, demo nights y una red que te acompaña de la idea al deploy.",
      },
      {
        id: "projects",
        label: "Proyectos",
        title: "Ship real en AWS",
        description:
          "EcoTrack, UniConnect y más: aprendemos construyendo productos con impacto.",
      },
      {
        id: "events",
        label: "Eventos",
        title: "AWSome Community Day",
        description:
          "Talleres presenciales y online con speakers de la comunidad cloud.",
      },
    ],
    []
  );

  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveSlide((s) => (s + 1) % slides.length);
    }, 7000);
    return () => window.clearInterval(id);
  }, [slides.length]);

  const firstSlide = slides[0];
  const current = slides[activeSlide] ?? firstSlide;

  const primaryJoin = () => {
    if (isAuthenticated) router.push("/dashboard");
    else if (links.meetupUrl)
      window.open(links.meetupUrl, "_blank", "noopener,noreferrer");
    else router.push("/unete");
  };

  const goPrev = () =>
    setActiveSlide((s) => (s - 1 + slides.length) % slides.length);
  const goNext = () => setActiveSlide((s) => (s + 1) % slides.length);

  return (
    <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[#050608] pt-4 pb-8 sm:pt-6 sm:pb-12">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="club-aurora opacity-90" />
        <div className="absolute inset-0 club-grid opacity-50" />
        <div
          className={`absolute inset-0 bg-gradient-to-b from-[#050608]/40 via-transparent to-[#0C0D12] ${clubTheme.gradientHeroOverlay}`}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-4 xl:gap-6">
          {/* Texto */}
          <motion.div
            className="order-2 flex flex-col text-center lg:order-1 lg:col-span-4 lg:text-left"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: clubEase }}
          >
            <div className="mb-5 inline-flex w-fit items-center gap-2 self-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-300 lg:self-start">
              <Cloud className="h-3.5 w-3.5 text-[#00C8FF]" strokeWidth={2} />
              AWS Student Builder Group
            </div>

            <h1 className="text-[2.35rem] font-bold leading-[1.02] tracking-tight text-white sm:text-5xl md:text-[3.25rem] xl:text-[3.75rem]">
              Construye. Aprende.{" "}
              <span className="bg-gradient-to-r from-[#00C8FF] via-[#7E2CFF] to-[#A855F7] bg-clip-text text-transparent">
                Lanza.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-zinc-400 sm:text-lg lg:mx-0">
              Somos el {CLUB.heroLine1} en la {CLUB.fullUniversity}. Aprendemos haciendo,
              construimos en la nube y compartimos lo que lanzamos.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Button
                type="button"
                size="lg"
                onClick={primaryJoin}
                className={`group h-12 rounded-full bg-gradient-to-r px-8 text-base font-semibold text-white shadow-[0_0_32px_rgba(126,44,255,0.35)] sm:h-14 ${clubTheme.gradientButton}`}
              >
                {isAuthenticated ? "Ir al panel" : "Únete a la comunidad"}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
              <Button
                type="button"
                size="lg"
                variant="outline"
                asChild
                className="h-12 rounded-full border-white/20 bg-transparent px-8 text-base font-semibold text-white hover:bg-white/5 sm:h-14"
              >
                <Link href="/beneficios" className="inline-flex items-center">
                  <Code2 className="mr-2 h-4 w-4" />
                  Explorar proyectos
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Portal 3D */}
          <motion.div
            className="order-1 lg:order-2 lg:col-span-6 xl:col-span-5"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.08, ease: clubEase }}
          >
            <ClubPortalVisual variant="hero" />
          </motion.div>

          {/* Slider lateral */}
          <motion.aside
            className="order-3 hidden flex-col items-end justify-center gap-8 lg:col-span-2 lg:flex xl:col-span-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.15, ease: clubEase }}
          >
            <p className="text-right text-sm font-semibold tracking-[0.2em] text-zinc-500">
              {String(activeSlide + 1).padStart(2, "0")}{" "}
              <span className="text-zinc-600">/ {String(slides.length).padStart(2, "0")}</span>
            </p>

            <div className="club-glass w-full max-w-[240px] rounded-2xl p-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current?.id ?? "slide"}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: clubEase }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#00C8FF]">
                    {current?.label}
                  </p>
                  <p className="mt-2 text-base font-bold text-white">{current?.title}</p>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                    {current?.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={goPrev}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:border-[#00C8FF]/40 hover:bg-white/10"
                aria-label="Slide anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:border-[#00C8FF]/40 hover:bg-white/10"
                aria-label="Slide siguiente"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
