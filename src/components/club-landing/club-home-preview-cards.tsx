"use client";

import { useAuthContext } from "@/AuthContext";
import { Button } from "@/components/ui/button";
import { useClubLinks } from "@/hooks/useClubLinks";
import {
  clubEase,
  fadeUpProps,
  staggerContainer,
  staggerItem,
} from "@/lib/club-motion";
import { ArrowRight, Calendar, Code2, Rocket, Users } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { clubTheme } from "./club-theme";

const cards = [
  {
    id: "events",
    icon: Calendar,
    title: "Próximos eventos",
    href: "/eventos",
    accent: "from-[#00C8FF]/20 to-transparent",
    content: (
      <>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#00C8FF]">
          24 MAY · Presencial
        </p>
        <p className="mt-1 text-sm font-bold text-white">
          AWSome Community Day
        </p>
        <p className="mt-2 text-xs text-zinc-400">
          Charlas, networking y labs con la comunidad AWS en La Paz.
        </p>
        <div className="relative mt-3 h-20 overflow-hidden rounded-xl border border-white/10">
          <Image
            src="https://images.unsplash.com/photo-1540575467067-178ab98d8357?auto=format&fit=crop&w=600&q=80"
            alt=""
            fill
            className="object-cover"
            sizes="300px"
          />
        </div>
        <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Inscripciones abiertas
        </span>
      </>
    ),
  },
  {
    id: "projects",
    icon: Code2,
    title: "Proyectos destacados",
    href: "/beneficios",
    accent: "from-[#7E2CFF]/20 to-transparent",
    content: (
      <>
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-bold text-white">EcoTrack</p>
            <span className="mt-1 inline-block rounded-full border border-[#7E2CFF]/40 bg-[#7E2CFF]/15 px-2 py-0.5 text-[10px] font-semibold text-violet-200">
              En desarrollo
            </span>
          </div>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-zinc-400">
          Plataforma de huella de carbono para campus universitarios.
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {["React", "Python", "AWS", "PostgreSQL"].map((t) => (
            <span
              key={t}
              className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-zinc-300"
            >
              {t}
            </span>
          ))}
        </div>
      </>
    ),
  },
  {
    id: "community",
    icon: Users,
    title: "Comunidad",
    href: "/equipo",
    accent: "from-[#A855F7]/20 to-transparent",
    content: (
      <>
        <p className="text-2xl font-bold text-white">275+</p>
        <p className="text-xs text-zinc-400">miembros activos</p>
        <div className="mt-3 flex -space-x-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <div
              key={n}
              className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-[#12131a] bg-zinc-700"
            >
              <Image
                src={`https://i.pravatar.cc/64?img=${n + 10}`}
                alt=""
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs font-semibold text-[#00C8FF]">
          Conoce a la comunidad →
        </p>
      </>
    ),
  },
  {
    id: "join",
    icon: Rocket,
    title: "Únete",
    href: "/unete",
    accent: "from-[#00C8FF]/15 via-[#7E2CFF]/15 to-[#A855F7]/15",
    content: (
      <>
        <p className="text-xs leading-relaxed text-zinc-400">
          Lleva tus ideas al siguiente nivel con el respaldo de AWS y mentores
          del club.
        </p>
        <JoinCta />
      </>
    ),
  },
] as const;

function JoinCta() {
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
    <Button
      type="button"
      onClick={onJoin}
      className={`mt-4 w-full rounded-full bg-gradient-to-r py-5 text-sm font-bold text-white ${clubTheme.gradientButton}`}
    >
      Únete ahora
      <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  );
}

export function ClubHomePreviewCards() {
  return (
    <section className="relative border-t border-white/5 bg-[#0C0D12] px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
          {cards.map((card) => (
            <motion.article
              key={card.id}
              variants={staggerItem}
              whileHover={{
                y: -6,
                transition: { duration: 0.25, ease: clubEase },
              }}
              className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-[#12131a]/80 p-5 backdrop-blur-sm ${clubTheme.cardHover}`}
            >
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${card.accent} opacity-80`}
                aria-hidden
              />
              <div className="relative flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-[#00C8FF]">
                  <card.icon className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <h3 className="text-sm font-bold text-white">{card.title}</h3>
              </div>
              <div className="relative mt-4">{card.content}</div>
              <Link
                href={card.href}
                className="absolute inset-0 z-10"
                aria-label={card.title}
              >
                <span className="sr-only">{card.title}</span>
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
