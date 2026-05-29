"use client";

import { clubEase, staggerContainer, staggerItem } from "@/lib/club-motion";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

import { ClubSectionHeader } from "./club-section-header";

const projects = [
  {
    id: "campus-connect",
    title: "Campus Connect",
    description:
      "Plataforma de conexión estudiantil para eventos y recursos universitarios.",
    tags: ["React", "AWS Amplify", "DynamoDB"],
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "ecoride",
    title: "EcoRide",
    description:
      "Solución para compartir viajes de forma segura y sostenible en la ciudad.",
    tags: ["AWS Lambda", "API Gateway", "S3"],
    image:
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "studybuddy",
    title: "StudyBuddy",
    description:
      "App móvil que ayuda a estudiantes a organizar su aprendizaje con IA.",
    tags: ["Flutter", "AWS Cognito", "S3"],
    image:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=700&q=80",
  },
] as const;

export function ClubHomeProjects() {
  return (
    <section className="border-t border-slate-100 bg-slate-50 px-4 py-16 dark:border-white/5 dark:bg-[#0a0b10] sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <ClubSectionHeader
          eyebrow="Proyectos destacados"
          title="Construyendo el futuro"
          description="Productos reales que nuestros miembros construyen y despliegan en la nube."
        />

        <motion.div
          className="mt-12 grid gap-6 md:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
          {projects.map((p) => (
            <motion.article
              key={p.id}
              variants={staggerItem}
              whileHover={{ y: -6, transition: { duration: 0.25, ease: clubEase } }}
              className="club-glass flex flex-col overflow-hidden rounded-3xl"
            >
              <div className="relative h-44 border-b border-white/10">
                <Image
                  src={p.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 33vw, 100vw"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {p.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
                  {p.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <Link
                  href="/beneficios"
                  className="mt-4 text-sm font-semibold text-[#00C8FF] hover:underline"
                >
                  Ver proyecto →
                </Link>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
