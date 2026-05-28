"use client";

import { staggerContainer, staggerItem } from "@/lib/club-motion";
import { Calendar, Cloud, Code2, Globe2, Users } from "lucide-react";
import { motion } from "motion/react";

const stats = [
  { icon: Users, value: "275+", label: "Miembros activos" },
  { icon: Code2, value: "40+", label: "Proyectos construidos" },
  { icon: Calendar, value: "25", label: "Eventos impartidos" },
  { icon: Cloud, value: "15+", label: "Servicios de AWS" },
  { icon: Globe2, value: "20+", label: "Universidades en la red" },
] as const;

export function ClubHomeStats() {
  return (
    <section className="relative border-t border-white/5 bg-[#0C0D12] px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-30px" }}
        >
          {stats.map((s) => (
            <motion.div
              key={s.label}
              variants={staggerItem}
              className="club-glass flex flex-col items-center rounded-2xl px-3 py-6 text-center sm:px-4"
            >
              <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#00C8FF]/15 to-[#7E2CFF]/20 text-[#00C8FF] shadow-[0_0_20px_rgba(0,200,255,0.12)]">
                <s.icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <p className="text-2xl font-bold text-white sm:text-3xl">{s.value}</p>
              <p className="mt-1 text-[11px] leading-snug text-zinc-400 sm:text-xs">
                {s.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
