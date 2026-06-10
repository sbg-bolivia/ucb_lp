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
  Rotate3d,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import { isClubFeatureEnabled } from "@/lib/club-features";

import { clubTheme } from "./club-theme";
import { ClubCursorField } from "./club-cursor-field";

const ClubHeroModel = dynamic(
  () => import("./club-hero-model").then((m) => m.ClubHeroModel),
  { ssr: false }
);

const SLIDE_COUNT = 2;
const SLIDE_KEYS = ["slide-3d", "slide-portal"] as const;
const AUTO_INTERVAL_MS = 9000;
/** Mismo recuadro en ambos slides; solo se anima posición con spring. */
const MODEL_BOX_LG = {
  width: "min(540px, 42vw)",
  height: "min(84vh, 800px)",
} as const;
const MODEL_BOX_SM = {
  width: "min(300px, 88vw)",
  height: "min(42vh, 380px)",
} as const;
const MODEL_TRANSITION = {
  type: "spring" as const,
  stiffness: 72,
  damping: 24,
  mass: 0.85,
};

const textVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? 32 : -32,
    filter: "blur(6px)",
  }),
  center: { opacity: 1, x: 0, filter: "blur(0px)" },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? -32 : 32,
    filter: "blur(6px)",
  }),
};

export function ClubHero() {
  const { isAuthenticated } = useAuthContext();
  const router = useRouter();
  const links = useClubLinks();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [isLg, setIsLg] = useState(false);
  const [modelPaused, setModelPaused] = useState(false);
  const [enable3d, setEnable3d] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection?.saveData;
    if (reduced || saveData) return;

    let cancelled = false;
    const run = () => {
      if (!cancelled) setEnable3d(true);
    };
    const idleId =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(run, { timeout: 3000 })
        : null;
    const timerId =
      idleId === null ? window.setTimeout(run, 1800) : null;
    return () => {
      cancelled = true;
      if (idleId !== null) window.cancelIdleCallback(idleId);
      if (timerId !== null) window.clearTimeout(timerId);
    };
  }, [mounted]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsLg(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const isLight = mounted && resolvedTheme === "light";

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > activeSlide ? 1 : -1);
      setActiveSlide(((index % SLIDE_COUNT) + SLIDE_COUNT) % SLIDE_COUNT);
    },
    [activeSlide]
  );

  const goPrev = () => goTo(activeSlide - 1);
  const goNext = () => goTo(activeSlide + 1);

  useEffect(() => {
    if (paused || modelPaused) return;
    const id = window.setInterval(() => {
      setDirection(1);
      setActiveSlide((s) => (s + 1) % SLIDE_COUNT);
    }, AUTO_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [paused, modelPaused]);

  const primaryJoin = () => {
    if (isAuthenticated) router.push("/dashboard");
    else if (links.meetupUrl)
      window.open(links.meetupUrl, "_blank", "noopener,noreferrer");
    else router.push("/unete");
  };

  const modelBox = isLg ? MODEL_BOX_LG : MODEL_BOX_SM;

  const modelLayout =
    activeSlide === 0
      ? {
          ...modelBox,
          top: isLg ? "54%" : "50%",
          left: "50%",
          right: "auto",
          x: "-50%",
          y: isLg ? "-46%" : "-48%",
        }
      : isLg
        ? {
            ...modelBox,
            top: "42%",
            left: "auto",
            right: "12%",
            x: 0,
            y: "-58%",
          }
        : {
            ...modelBox,
            top: "38%",
            left: "50%",
            right: "auto",
            x: "-50%",
            y: "-52%",
          };

  const navBtnClass = isLight
    ? "border-black/10 bg-white/80 text-slate-800 shadow-lg backdrop-blur-md hover:border-[#00C8FF]/50 hover:bg-white"
    : "border-white/15 bg-black/40 text-white backdrop-blur-sm hover:border-[#00C8FF]/40 hover:bg-black/60";

  return (
    <section
      className={`relative z-25 isolate h-[calc(100dvh-4rem)] max-h-[calc(100dvh-4rem)] overflow-hidden transition-colors duration-700 ${
        isLight
          ? "bg-gradient-to-b from-[#f5f5f7] via-[#eef2ff] to-[#f5f5f7] text-slate-900"
          : "bg-[#050608] text-white"
      }`}
      aria-roledescription="carousel"
      aria-label="Hero principal"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <ClubCursorField className="club-cursor-field-hero" />

      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className={`club-aurora ${isLight ? "club-aurora-light opacity-80" : "opacity-70"}`}
        />
        <div
          className={`absolute inset-0 club-grid ${isLight ? "opacity-35" : "opacity-30"}`}
        />
        <div
          className={`absolute inset-0 bg-gradient-to-b ${
            isLight
              ? "from-white/60 via-transparent to-[#f5f5f7]/90"
              : "from-transparent via-[#050608]/50 to-[#0C0D12]"
          }`}
        />
      </div>

      {/* Modelo 3D — delante del fondo, con espacio para no recortar */}
      <motion.div
        className="pointer-events-none absolute z-20"
        initial={false}
        animate={modelLayout}
        transition={MODEL_TRANSITION}
      >
        <div className="club-hero-model-stage pointer-events-auto flex h-full w-full flex-col items-center justify-center py-1">
          <div className="club-hero-model-canvas min-h-0 w-full flex-1">
            {mounted && enable3d ? (
              <ClubHeroModel
                autoRotate={!modelPaused}
                lightMode={isLight ? "light" : "dark"}
                onInteractingChange={setModelPaused}
              />
            ) : (
              <div className="flex h-full min-h-[200px] items-center justify-center">
                <Cloud className="h-14 w-14 animate-pulse text-[#7E2CFF]/35" />
              </div>
            )}
          </div>
          <p
            className={`pointer-events-none mt-2 shrink-0 flex items-center justify-center gap-2 pb-1 text-xs font-medium uppercase tracking-[0.18em] ${
              isLight ? "text-slate-500" : "text-zinc-400"
            }`}
          >
            <Rotate3d className="h-3 w-3 text-[#A855F7]" />
            Arrastra para rotar
          </p>
        </div>
      </motion.div>

      {/* Texto */}
      <div className="pointer-events-none relative z-30 mx-auto flex h-full w-full max-w-7xl flex-col px-4 pb-8 pt-4 sm:px-6">
        <AnimatePresence mode="wait" custom={direction}>
          {activeSlide === 0 ? (
            <motion.div
              key="slide-3d"
              custom={direction}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.65, ease: clubEase }}
              className="flex h-full w-full flex-col items-center justify-between text-center"
            >
              <div className="relative z-30 w-full max-w-4xl shrink-0 pt-2">
                <p className="mb-3 text-sm font-bold uppercase tracking-[0.35em] text-[#00C8FF] sm:text-base">
                  {CLUB.heroLine1}
                </p>
                <h1
                  className={`text-5xl font-extrabold leading-[0.92] tracking-tighter sm:text-7xl lg:text-8xl ${
                    isLight ? "text-slate-900" : "text-white"
                  }`}
                >
                  Construye.
                  <br />
                  <span className="bg-gradient-to-br from-[#00C8FF] via-[#7E2CFF] to-[#A855F7] bg-clip-text text-transparent">
                    Aprende.
                  </span>
                </h1>
              </div>

              <div className="min-h-0 flex-1 w-full" aria-hidden />

              <div className="pointer-events-auto relative z-30 shrink-0 pb-2">
                <Button
                  size="lg"
                  onClick={primaryJoin}
                  className="group h-14 rounded-full border-none bg-gradient-to-r from-[#FF512F] to-[#DD2476] px-10 text-base font-bold text-white shadow-[0_0_32px_rgba(221,36,118,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] sm:px-12 sm:text-lg"
                >
                  {isAuthenticated ? "Ir al panel" : "Únete a la élite"}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="slide-portal"
              custom={direction}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.65, ease: clubEase }}
              className={`grid h-full w-full max-w-7xl items-center gap-6 ${
                isLg
                  ? "grid-cols-[1fr_min(480px,40vw)] lg:gap-10"
                  : "grid-cols-1"
              }`}
            >
              <div
                className={`flex w-full flex-col justify-center ${
                  isLg
                    ? "items-start text-left"
                    : "order-1 items-center text-center"
                }`}
              >
                <div
                  className={`mb-5 inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] ${
                    isLight
                      ? "bg-white/70 text-slate-600"
                      : "bg-white/5 text-zinc-300"
                  } ${isLg ? "" : "mx-auto"}`}
                >
                  <Cloud className="h-4 w-4 text-[#00C8FF]" strokeWidth={2} />
                  AWS Student Builder Group
                </div>

                <h1
                  className={`text-4xl font-bold leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl ${
                    isLight ? "text-slate-900" : "text-white"
                  } ${isLg ? "" : "text-center"}`}
                >
                  Construye. Aprende.{" "}
                  <span className="bg-gradient-to-r from-[#00C8FF] via-[#7E2CFF] to-[#A855F7] bg-clip-text text-transparent">
                    Lanza.
                  </span>
                </h1>

                <p
                  className={`mt-5 max-w-lg text-base leading-relaxed sm:text-lg ${
                    isLight ? "text-slate-600" : "text-zinc-400"
                  } ${isLg ? "" : "mx-auto text-center"}`}
                >
                  Somos el {CLUB.heroLine1} en la {CLUB.fullUniversity}.
                  Aprendemos haciendo, construimos en la nube y compartimos lo
                  que lanzamos.
                </p>

                <div
                  className={`pointer-events-auto mt-8 flex flex-col gap-3 sm:flex-row ${
                    isLg ? "justify-start" : "items-center justify-center"
                  }`}
                >
                  <Button
                    type="button"
                    size="lg"
                    onClick={primaryJoin}
                    className={`group h-12 rounded-full bg-gradient-to-r px-8 text-base font-semibold text-white sm:h-14 ${clubTheme.gradientButton}`}
                  >
                    {isAuthenticated ? "Ir al panel" : "Únete a la comunidad"}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    asChild
                    className={`h-12 rounded-full px-8 text-base font-semibold sm:h-14 ${
                      isLight
                        ? "border-black/15 bg-white/70 text-slate-800 hover:bg-white"
                        : "border-white/20 bg-transparent text-white hover:bg-white/5"
                    }`}
                  >
                    <Link
                      href={
                        isClubFeatureEnabled("projects")
                          ? "/proyectos"
                          : "/eventos"
                      }
                      className="inline-flex items-center"
                    >
                      <Code2 className="mr-2 h-4 w-4" />
                      {isClubFeatureEnabled("projects")
                        ? "Explorar proyectos"
                        : "Ver eventos"}
                    </Link>
                  </Button>
                </div>
              </div>

              <div
                className={
                  isLg ? "min-h-0" : "order-2 min-h-[min(68vh,640px)] shrink-0"
                }
                aria-hidden
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-30 flex items-center justify-between px-3 sm:px-6">
        <motion.button
          type="button"
          onClick={goPrev}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          className={`pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border transition sm:h-11 sm:w-11 ${navBtnClass}`}
          aria-label="Slide anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </motion.button>
        <motion.button
          type="button"
          onClick={goNext}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          className={`pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border transition sm:h-11 sm:w-11 ${navBtnClass}`}
          aria-label="Slide siguiente"
        >
          <ChevronRight className="h-5 w-5" />
        </motion.button>
      </div>

      <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2.5">
        {SLIDE_KEYS.map((slideKey, i) => (
          <button
            key={slideKey}
            type="button"
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === activeSlide
                ? "w-7 bg-[#00C8FF]"
                : isLight
                  ? "w-1.5 bg-black/20 hover:bg-black/30"
                  : "w-1.5 bg-white/30 hover:bg-white/45"
            }`}
            aria-label={`Ir al slide ${i + 1}`}
            aria-current={i === activeSlide ? "true" : undefined}
          />
        ))}
      </div>
    </section>
  );
}
