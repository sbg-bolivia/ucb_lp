"use client";

import { Calendar, Cloud, Code2, Users } from "lucide-react";

import { isClubFeatureEnabled } from "@/lib/club-features";

function getStats() {
  return [
    { icon: Users, value: "120+", label: "Miembros activos" },
    { icon: Calendar, value: "25+", label: "Eventos realizados" },
    isClubFeatureEnabled("projects")
      ? { icon: Code2, value: "18+", label: "Proyectos construidos" }
      : { icon: Code2, value: "15+", label: "Talleres AWS" },
    { icon: Cloud, value: "4", label: "Años de impacto" },
  ] as const;
}

export function ClubHomeStats() {
  return (
    <section className="relative z-30 -mt-12 bg-transparent px-4 py-6 sm:px-6 sm:py-8 pointer-events-none">
      <div className="mx-auto max-w-6xl pointer-events-auto">
        <div
          className="parallax-stats club-glass grid grid-cols-2 gap-2 rounded-3xl p-2 sm:gap-3 lg:grid-cols-4 shadow-[0_8px_30px_rgb(0,0,0,0.4)] backdrop-blur-xl border border-white/10"
        >
          {getStats().map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-3 rounded-2xl px-4 py-5 text-left sm:px-5 hover:bg-white/5 transition-colors"
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
