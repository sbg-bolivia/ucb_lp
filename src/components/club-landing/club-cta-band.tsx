"use client";

import { useAuthContext } from "@/AuthContext";
import { Button } from "@/components/ui/button";
import { useClubLinks } from "@/hooks/useClubLinks";
import { clubEase, fadeUpProps } from "@/lib/club-motion";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

import { ClubPortalVisual } from "./club-portal-visual";
import { clubTheme } from "./club-theme";

const perks = [
  "Comunidad activa de builders",
  "Aprendizaje práctico en AWS",
  "Proyectos para tu portafolio",
  "Eventos y mentorías exclusivas",
] as const;

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
      className="relative overflow-hidden border-t border-white/5 bg-[#050608] px-4 py-20 sm:px-6 sm:py-28"
      aria-labelledby="cta-heading"
    >
      <div className="pointer-events-none absolute inset-0 club-aurora opacity-50" aria-hidden />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div {...fadeUpProps}>
            <h2
              id="cta-heading"
              className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl"
            >
              ¿Listo para construir el futuro?
            </h2>
            <p className="mt-4 max-w-lg text-lg text-zinc-400">
              Únete al capítulo de La Paz y empieza a shippear en la nube con una
              comunidad que te impulsa.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                onClick={onJoin}
                className={`h-12 rounded-full bg-gradient-to-r px-8 font-semibold text-white sm:h-14 ${clubTheme.gradientButton}`}
              >
                Únete ahora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-full border-white/20 bg-transparent text-white hover:bg-white/5 sm:h-14"
              >
                <Link href="/beneficios">Explorar proyectos</Link>
              </Button>
            </div>
          </motion.div>

          <motion.ul
            className="space-y-4"
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: clubEase }}
          >
            {perks.map((p) => (
              <li key={p} className="flex items-start gap-3 text-zinc-300">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#00C8FF] to-[#7E2CFF] text-white">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                <span className="text-base">{p}</span>
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          className="mt-16 flex justify-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: clubEase }}
        >
          <ClubPortalVisual variant="cta" />
        </motion.div>
      </div>
    </section>
  );
}
