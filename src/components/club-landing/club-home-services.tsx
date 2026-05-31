"use client";

import { motion } from "motion/react";
import { BookOpen, Code2, Users } from "lucide-react";
import { clubTheme } from "./club-theme";

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

const Icon0 = services[0].icon;
const Icon1 = services[1].icon;
const Icon2 = services[2].icon;

const containerVariants: import("motion/react").Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const cardVariants: import("motion/react").Variants = {
  hidden: { opacity: 0, scale: 0.9, filter: "blur(15px)" },
  visible: { 
    opacity: 1, 
    scale: 1, 
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  },
};

export function ClubHomeServices() {
  return (
    <section className={`relative overflow-hidden ${clubTheme.sectionY} ${clubTheme.pageBg}`}>
      <div className="mx-auto max-w-7xl flex flex-col items-center">
        
        <motion.header
          className="text-center mb-10"
          initial={{ opacity: 0, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#A855F7]">
            Qué hacemos
          </p>
          <h2 className="mt-4 text-4xl font-extrabold tracking-tighter text-slate-900 dark:text-white sm:text-5xl md:text-6xl">
            Aprender. Construir. Impactar.
          </h2>
        </motion.header>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          
          {/* Card 1 */}
          <motion.article
            variants={cardVariants}
            className="club-glass group relative flex flex-col justify-between p-8 overflow-hidden shadow-2xl rounded-3xl border border-white/5 bg-slate-50 dark:bg-[#0C0D12]"
          >
            <div className={`pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br ${services[0].accent} blur-2xl transition-opacity group-hover:opacity-100 opacity-50`} />
            <span className={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${services[0].accent} ${services[0].iconColor} mb-6`}>
              <Icon0 className="h-6 w-6" strokeWidth={2} />
            </span>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{services[0].title}</h3>
              <p className="mt-3 text-base text-slate-600 dark:text-zinc-400">{services[0].text}</p>
            </div>
          </motion.article>

          {/* Card 2 */}
          <motion.article
            variants={cardVariants}
            className="club-glass group relative flex flex-col justify-between p-8 overflow-hidden shadow-2xl rounded-3xl border border-white/5 bg-slate-50 dark:bg-[#0C0D12]"
          >
            <div className={`pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br ${services[1].accent} blur-2xl transition-opacity group-hover:opacity-100 opacity-50`} />
            <span className={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${services[1].accent} ${services[1].iconColor} mb-6`}>
              <Icon1 className="h-6 w-6" strokeWidth={2} />
            </span>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{services[1].title}</h3>
              <p className="mt-3 text-base text-slate-600 dark:text-zinc-400">{services[1].text}</p>
            </div>
          </motion.article>

          {/* Card 3 */}
          <motion.article
            variants={cardVariants}
            className="club-glass group relative flex flex-col justify-between p-8 overflow-hidden shadow-2xl rounded-3xl border border-white/5 bg-slate-50 dark:bg-[#0C0D12]"
          >
            <div className={`pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br ${services[2].accent} blur-2xl transition-opacity group-hover:opacity-100 opacity-50`} />
            <span className={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${services[2].accent} ${services[2].iconColor} mb-6`}>
              <Icon2 className="h-6 w-6" strokeWidth={2} />
            </span>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{services[2].title}</h3>
              <p className="mt-3 text-base text-slate-600 dark:text-zinc-400">{services[2].text}</p>
            </div>
          </motion.article>

        </motion.div>
      </div>
    </section>
  );
}
