"use client";

import { CLUB } from "@/lib/club-brand";
import {
  clubEase,
  fadeUpProps,
  staggerContainer,
  staggerItem,
} from "@/lib/club-motion";
import {
  Award,
  Briefcase,
  Cloud,
  Coins,
  HeartHandshake,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

import { clubTheme } from "./club-theme";

/** Inspirado en la estructura de beneficios de https://awsud.club/benefits */
const benefitBlocks = [
  {
    icon: Award,
    title: "Apoyo a certificaciones AWS",
    description:
      "Materiales de estudio, sesiones grupales y mentoría para acercarte a certificaciones reconocidas.",
    bullets: [
      "Recursos de estudio compartidos",
      "Grupos de estudio periódicos",
      "Orientación sobre exámenes",
      "Mentoría de personas con certificación",
    ],
  },
  {
    icon: Cloud,
    title: "Labs y talleres prácticos",
    description:
      "Construye aplicaciones reales con servicios AWS mediante talleres guiados y proyectos.",
    bullets: [
      "Talleres técnicos mensuales",
      "Sesiones de código en vivo",
      "Talleres de diseño de arquitecturas",
      "Hackatones y retos",
    ],
  },
  {
    icon: Users,
    title: "Networking con la industria",
    description:
      "Conecta con profesionales AWS, ponentes invitados y otros estudiantes.",
    bullets: [
      "Ciclo de invitados y charlas",
      "Programa de mentoría",
      "Ferias y espacios con empresas",
      "Red de exalumnos y aliados",
    ],
  },
  {
    icon: Briefcase,
    title: "Desarrollo profesional",
    description:
      "Habilidades y experiencia que buscan las empresas, con apoyo concreto en tu carrera.",
    bullets: [
      "Revisión de CV",
      "Preparación para entrevistas",
      "Oportunidades de prácticas",
      "Orientación hacia empleo tech",
    ],
  },
  {
    icon: Coins,
    title: "Acceso a créditos y práctica en AWS",
    description:
      "Experimenta con servicios AWS y arma tu portafolio cuando haya créditos o programas disponibles.",
    bullets: [
      "AWS Educate y recursos educativos",
      "Proyectos con presupuesto simbólico",
      "Buenas prácticas de free tier",
      "Introducción a costos en la nube",
    ],
  },
  {
    icon: HeartHandshake,
    title: "Comunidad y mentoría",
    description:
      "Un espacio seguro para aprender, equivocarte y mejorar junto a otros.",
    bullets: [
      "Aprendizaje entre pares",
      "Mentoría uno a uno cuando sea posible",
      "Proyectos colaborativos",
      "Eventos sociales y trabajo en equipo",
    ],
  },
] as const;

export function ClubBenefits() {
  return (
    <section
      id="beneficios"
      className={`relative px-4 py-20 sm:px-6 sm:py-28 ${clubTheme.sectionTint}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(59,65,255,0.08),transparent)]" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          className="mx-auto mb-16 max-w-3xl text-center"
          {...fadeUpProps}
        >
          <p className="text-sm font-bold uppercase tracking-widest bg-gradient-to-r from-[#3b41ff] to-[#6a11cb] bg-clip-text text-transparent">
            Beneficios para miembros
          </p>
          <h2
            className={`mt-3 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl ${clubTheme.textHeading}`}
          >
            Potencia tu camino en la nube
          </h2>
          <p
            className={`mt-5 text-lg leading-relaxed sm:text-xl ${clubTheme.textMuted}`}
          >
            Beneficios pensados para acelerar tu aprendizaje, como en otros
            capítulos de la red de Student Builder Groups. En el{" "}
            {CLUB.shortName} en la {CLUB.fullUniversity} ponemos el foco en
            práctica, comunidad y certificación.
          </p>
        </motion.div>

        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          {benefitBlocks.map((block) => (
            <motion.article
              key={block.title}
              variants={staggerItem}
              className={`flex flex-col ${clubTheme.card} ${clubTheme.cardHover} p-7 sm:p-8`}
            >
              <div
                className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${clubTheme.gradientButton} text-white shadow-md`}
              >
                <block.icon className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <h3
                className={`text-lg font-bold sm:text-xl ${clubTheme.textHeading}`}
              >
                {block.title}
              </h3>
              <p
                className={`mt-2 text-sm leading-relaxed ${clubTheme.textMuted}`}
              >
                {block.description}
              </p>
              <ul className={`mt-4 space-y-2 text-sm ${clubTheme.textMuted}`}>
                {block.bullets.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#3b41ff] dark:bg-violet-400"
                      aria-hidden
                    />
                    <span className="text-slate-700 dark:text-zinc-300">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          className="mt-14 text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: clubEase }}
        >
          <p className={`text-base font-medium ${clubTheme.textMuted}`}>
            ¿Listo para vivir estos beneficios?
          </p>
          <Link
            href="/unete"
            className={`mt-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r px-8 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-95 active:scale-[0.98] ${clubTheme.gradientButton}`}
          >
            Únete por Meetup y redes
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
