"use client";

import { CLUB } from "@/lib/club-brand";
import { fadeUpProps, staggerContainer, staggerItem } from "@/lib/club-motion";
import { BookOpen, HeartHandshake, Shield } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";

import { clubTheme } from "./club-theme";

const pillars = [
  {
    icon: BookOpen,
    title: "Aprendizaje guiado",
    text: "Sesiones prácticas alineadas con servicios AWS y buenas prácticas de la industria.",
  },
  {
    icon: HeartHandshake,
    title: "Mentoría y pares",
    text: "Acompañamiento de la comunidad para resolver dudas y avanzar en equipo.",
  },
  {
    icon: Shield,
    title: "Ética y seguridad",
    text: "Fomentamos el uso responsable de la nube y la seguridad desde el primer día.",
  },
] as const;

export function ClubAboutBanner() {
  return (
    <section
      id="sobre"
      className={`relative border-t border-violet-200/60 px-4 py-20 sm:px-6 sm:py-28 dark:border-white/10 ${clubTheme.sectionSoft}`}
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <motion.div {...fadeUpProps}>
            <p className="text-sm font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#3b41ff] to-[#6a11cb]">
              Quiénes somos
            </p>
            <h2
              className={`mt-3 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl ${clubTheme.textHeading}`}
            >
              El puente entre la universidad y el ecosistema cloud
            </h2>
            <p
              className={`mt-6 text-lg leading-relaxed ${clubTheme.textMuted}`}
            >
              Somos el {CLUB.shortName} en {CLUB.city}: un espacio donde
              estudiantes de cualquier carrera exploran AWS, construyen
              portafolio y se preparan para oportunidades reales en tecnología.
            </p>
            <motion.ul
              className="mt-10 space-y-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-30px" }}
            >
              {pillars.map(({ icon: Icon, title, text }) => (
                <motion.li
                  key={title}
                  variants={staggerItem}
                  className="flex gap-4"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3b41ff]/15 to-[#6a11cb]/15 text-[#5c27c4]">
                    <Icon className="h-6 w-6" strokeWidth={1.5} />
                  </span>
                  <div>
                    <h3
                      className={`text-lg font-bold ${clubTheme.textHeading}`}
                    >
                      {title}
                    </h3>
                    <p
                      className={`mt-1 text-sm leading-relaxed ${clubTheme.textMuted}`}
                    >
                      {text}
                    </p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div
            className="relative mx-auto w-full max-w-lg lg:mx-0"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-[#3b41ff]/15 via-transparent to-[#6a11cb]/15 blur-2xl"
              aria-hidden
            />
            <div
              className={`relative overflow-hidden rounded-[2rem] ${clubTheme.card} p-10 sm:p-12`}
            >
              <Image
                src="/logo.png"
                alt={`Marca ${CLUB.shortName}`}
                width={400}
                height={160}
                className="mx-auto h-auto w-full max-w-xs object-contain sm:max-w-sm"
              />
              <p className={`mt-8 text-center text-sm ${clubTheme.textMuted}`}>
                Comunidad estudiantil vinculada a la red global de Student
                Builder Groups y al aprendizaje con Amazon Web Services.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
