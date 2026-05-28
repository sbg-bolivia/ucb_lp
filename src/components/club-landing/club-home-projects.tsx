"use client";

import { clubEase, staggerContainer, staggerItem } from "@/lib/club-motion";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

import { ClubSectionHeader } from "./club-section-header";

const projects = [
  {
    id: "ecotrack",
    title: "EcoTrack",
    description:
      "Monitoreo de huella de carbono en campus con dashboards y alertas en tiempo real.",
    tags: ["React", "Python", "AWS", "PostgreSQL"],
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "uniconnect",
    title: "UniConnect",
    description:
      "Red social universitaria con chat, eventos y perfiles verificados por carrera.",
    tags: ["Next.js", "tRPC", "DynamoDB"],
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "studybuddy",
    title: "StudyBuddy AI",
    description:
      "Asistente de estudio con RAG sobre apuntes y recomendaciones de recursos AWS.",
    tags: ["TypeScript", "Bedrock", "Lambda"],
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=700&q=80",
  },
] as const;

export function ClubHomeProjects() {
  return (
    <section className="border-t border-white/5 bg-[#0a0b10] px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <ClubSectionHeader
          eyebrow="Proyectos"
          title="Ideas que se convierten en impacto"
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
                <h3 className="text-xl font-bold text-white">{p.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-400">
                  {p.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-zinc-300"
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
