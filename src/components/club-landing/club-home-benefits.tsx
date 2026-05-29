"use client";

import { clubEase, staggerContainer, staggerItem } from "@/lib/club-motion";
import { Award, CalendarDays, Cloud, Network, Rocket } from "lucide-react";
import { motion } from "motion/react";

import { ClubSectionHeader } from "./club-section-header";

const benefits = [
  {
    icon: Cloud,
    title: "Aprende con AWS",
    text: "Labs, créditos y rutas de aprendizaje alineadas a la industria.",
  },
  {
    icon: Rocket,
    title: "Proyectos reales",
    text: "Construye portafolio con arquitecturas que puedes mostrar en entrevistas.",
  },
  {
    icon: Network,
    title: "Red y networking",
    text: "Mentores, alumni y conexión con la red global de Student Builder Groups.",
  },
  {
    icon: CalendarDays,
    title: "Eventos exclusivos",
    text: "Talleres, hackathons y community days con cupos para miembros.",
  },
  {
    icon: Award,
    title: "Certificaciones",
    text: "Preparación y acompañamiento para certificaciones AWS.",
  },
] as const;

export function ClubHomeBenefits() {
  return (
    <section className="border-t border-white/5 bg-[#0a0b10] px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <ClubSectionHeader
          eyebrow="Beneficios"
          title="Beneficios que impulsan tu crecimiento"
          align="center"
        />

        <motion.div
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
          {benefits.map((b) => (
            <motion.div
              key={b.title}
              variants={staggerItem}
              whileHover={{
                y: -4,
                transition: { duration: 0.25, ease: clubEase },
              }}
              className="club-glass flex flex-col items-center rounded-2xl p-6 text-center"
            >
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#00C8FF]/20 to-[#7E2CFF]/20 text-[#00C8FF] shadow-[0_0_24px_rgba(0,200,255,0.15)]">
                <b.icon className="h-6 w-6" strokeWidth={1.75} />
              </span>
              <h3 className="text-sm font-bold text-white">{b.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                {b.text}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

