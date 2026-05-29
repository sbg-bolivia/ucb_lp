"use client";

import { clubEase, staggerContainer, staggerItem } from "@/lib/club-motion";
import { BookOpen, Code2, Users } from "lucide-react";
import { motion } from "motion/react";

const services = [
  {
    icon: Users,
    title: "Comunidad",
    text: "Conectamos estudiantes apasionados por la tecnología para colaborar, compartir y crecer juntos.",
    accent: "from-[#00C8FF]/20 to-[#00C8FF]/5",
    iconColor: "text-[#00C8FF]",
  },
  {
    icon: BookOpen,
    title: "Aprendizaje",
    text: "Organizamos workshops, charlas y sesiones prácticas para aprender las tecnologías de AWS.",
    accent: "from-[#7E2CFF]/20 to-[#7E2CFF]/5",
    iconColor: "text-[#A855F7]",
  },
  {
    icon: Code2,
    title: "Proyectos",
    text: "Desarrollamos soluciones reales en la nube que generan impacto en nuestra comunidad y más allá.",
    accent: "from-[#A855F7]/20 to-[#A855F7]/5",
    iconColor: "text-[#A855F7]",
  },
] as const;

export function ClubHomeServices() {
  return (
    <section className="relative border-t border-slate-100 bg-slate-50 px-4 py-16 dark:border-white/5 dark:bg-[#0C0D12] sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <motion.header
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, ease: clubEase }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#A855F7]">
            Qué hacemos
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl">
            Aprender. Construir. Impactar.
          </h2>
        </motion.header>

        <motion.div
          className="mt-14 grid gap-6 md:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
          {services.map((s) => (
            <motion.article
              key={s.title}
              variants={staggerItem}
              whileHover={{ y: -6, transition: { duration: 0.25, ease: clubEase } }}
              className="club-glass group relative overflow-hidden rounded-3xl p-8"
            >
              <div
                className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${s.accent} blur-2xl transition-opacity duration-300 group-hover:opacity-100`}
                aria-hidden
              />
              <span
                className={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${s.accent} ${s.iconColor} shadow-[0_0_24px_rgba(126,44,255,0.18)]`}
              >
                <s.icon className="h-7 w-7" strokeWidth={1.75} />
              </span>
              <h3 className="relative mt-6 text-xl font-bold text-slate-900 dark:text-white">
                {s.title}
              </h3>
              <p className="relative mt-3 text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
                {s.text}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
