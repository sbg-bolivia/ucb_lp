"use client";

import { staggerContainer, staggerItem } from "@/lib/club-motion";
import { Calendar, Cloud, Code2, Users } from "lucide-react";
import { motion } from "motion/react";

const stats = [
  { icon: Users, value: "120+", label: "Miembros activos" },
  { icon: Calendar, value: "25+", label: "Eventos realizados" },
  { icon: Code2, value: "18+", label: "Proyectos construidos" },
  { icon: Cloud, value: "4", label: "Años de impacto" },
] as const;

export function ClubHomeStats() {
  return (
    <section className="relative -mt-8 border-t border-slate-100 bg-white px-4 py-10 dark:border-white/5 dark:bg-[#0C0D12] sm:px-6 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="club-glass grid grid-cols-2 gap-2 rounded-3xl p-2 sm:gap-3 lg:grid-cols-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-30px" }}
        >
          {stats.map((s) => (
            <motion.div
              key={s.label}
              variants={staggerItem}
              className="flex items-center gap-3 rounded-2xl px-4 py-5 text-left sm:px-5"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#00C8FF]/15 to-[#7E2CFF]/20 text-[#00C8FF] shadow-[0_0_20px_rgba(0,200,255,0.12)]">
                <s.icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                  {s.value}
                </p>
                <p className="mt-0.5 text-[11px] leading-snug text-slate-600 dark:text-zinc-400 sm:text-xs">
                  {s.label}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
