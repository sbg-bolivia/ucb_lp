"use client";

import { useAuthContext } from "@/AuthContext";
import { Button } from "@/components/ui/button";
import { useClubLinks } from "@/hooks/useClubLinks";
import { clubEase } from "@/lib/club-motion";
import { CLUB } from "@/lib/club-brand";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

import { ClubMark } from "./club-logo";
import { clubTheme } from "./club-theme";

export function ClubHero() {
  const { isAuthenticated } = useAuthContext();
  const router = useRouter();
  const links = useClubLinks();

  const primaryJoin = () => {
    if (isAuthenticated) router.push("/dashboard");
    else if (links.meetupUrl)
      window.open(links.meetupUrl, "_blank", "noopener,noreferrer");
    else if (links.whatsappUrl)
      window.open(links.whatsappUrl, "_blank", "noopener,noreferrer");
    else router.push("/unete");
  };

  return (
    <section className="relative min-h-[min(100vh,52rem)] overflow-hidden pt-8 pb-20 sm:pt-10 sm:pb-24">
      <div className="absolute inset-0 z-0">
        <Image
          src="/fondo.webp"
          alt=""
          fill
          priority
          className="object-cover object-center opacity-90 dark:opacity-55"
          sizes="100vw"
          aria-hidden
        />
        <div
          className={`absolute inset-0 bg-gradient-to-br ${clubTheme.gradientHeroOverlay}`}
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[#3b41ff]/[0.07] dark:bg-[#3b41ff]/15"
          aria-hidden
        />
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-10 px-4 sm:gap-14 sm:px-6 lg:flex-row lg:items-center lg:gap-10 lg:px-8">
        <motion.div
          className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: clubEase }}
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-4 py-2 text-xs font-medium text-[#5c27c4] shadow-sm backdrop-blur-sm dark:border-white/15 dark:bg-zinc-900/70 dark:text-violet-200 sm:text-sm">
            <span>AWS Student Builder Groups · {CLUB.city}</span>
          </div>

          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-[3.15rem] xl:text-6xl lg:leading-[1.08] dark:text-white">
            <span className="text-[#3b41ff] dark:bg-gradient-to-r dark:from-white dark:via-violet-200 dark:to-violet-300 dark:bg-clip-text dark:text-transparent">
              {CLUB.heroLine1}
            </span>
            <span className="mt-2 block text-slate-900 dark:text-white">
              en la {CLUB.fullUniversity}
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base font-medium leading-relaxed text-slate-600 sm:text-lg lg:text-xl dark:text-zinc-300">
            Únete a estudiantes aprendiendo AWS y construyendo proyectos reales
            en la nube. ¡Todas las carreras son bienvenidas!
          </p>

          <div className="mt-9 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center lg:justify-start">
            <Button
              type="button"
              size="lg"
              onClick={primaryJoin}
              className={`h-12 rounded-full bg-gradient-to-r px-8 text-base font-semibold text-white shadow-lg transition hover:opacity-95 active:scale-[0.98] sm:h-14 sm:px-10 ${clubTheme.gradientButton} shadow-violet-500/25 dark:shadow-violet-900/40`}
            >
              {isAuthenticated ? "Ir al panel" : "Unirme en Meetup"}
              <Sparkles className="ml-2 h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              asChild
              className="h-12 rounded-full border-violet-300 bg-white/90 px-8 text-base font-semibold text-[#5c27c4] shadow-sm backdrop-blur-sm hover:bg-violet-50 dark:border-violet-500/50 dark:bg-zinc-900/80 dark:text-violet-200 dark:hover:bg-zinc-800 sm:h-14 sm:px-10"
            >
              <Link href="/eventos" className="inline-flex items-center">
                Ver eventos
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-1 justify-center lg:justify-end"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.12, ease: clubEase }}
        >
          <div
            className={`relative w-full max-w-md ${clubTheme.card} p-7 shadow-violet-500/15 dark:shadow-black/50 sm:p-9`}
          >
            <div
              className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-[#3b41ff]/20 to-[#6a11cb]/20 blur-2xl dark:opacity-80"
              aria-hidden
            />
            <ClubMark className="mx-auto max-w-[220px] sm:max-w-[260px]" />
            <p className="mt-5 text-center text-sm font-medium leading-relaxed text-slate-600 dark:text-zinc-400">
              Talleres, certificaciones y comunidad con la identidad AWS Cloud
              Clubs.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2 text-xs font-semibold">
              <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-[#5c27c4] dark:border-violet-500/40 dark:bg-violet-950/50 dark:text-violet-200">
                Hands-on labs
              </span>
              <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-[#5c27c4] dark:border-violet-500/40 dark:bg-violet-950/50 dark:text-violet-200">
                Networking
              </span>
              <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-[#5c27c4] dark:border-violet-500/40 dark:bg-violet-950/50 dark:text-violet-200">
                Career ready
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
