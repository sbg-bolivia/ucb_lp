"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ClubSectionHeader } from "./club-section-header";
import { clubTheme } from "./club-theme";

const projects = [
  {
    id: "campus-connect",
    title: "Campus Connect",
    description: "Plataforma de conexión estudiantil para eventos y recursos universitarios.",
    tags: ["React", "AWS Amplify", "DynamoDB"],
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "ecoride",
    title: "EcoRide",
    description: "Solución para compartir viajes de forma segura y sostenible en la ciudad.",
    tags: ["AWS Lambda", "API Gateway", "S3"],
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "studybuddy",
    title: "StudyBuddy",
    description: "App móvil que ayuda a estudiantes a organizar su aprendizaje con IA.",
    tags: ["Flutter", "AWS Cognito", "S3"],
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80",
  },
] as const;

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

export function ClubHomeProjects() {
  return (
    <section className={`bg-transparent px-4 py-16 sm:px-6 sm:py-24 ${clubTheme.pageBg}`}>
      <div className="mx-auto max-w-7xl">
        <ClubSectionHeader
          eyebrow="Proyectos destacados"
          title="Construyendo el futuro"
          description="Productos reales que nuestros miembros construyen y despliegan en la nube."
        />

        <motion.div 
          className="mt-16 grid gap-8 md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={cardVariants}
              className={`club-glass group relative flex flex-col overflow-hidden rounded-3xl shadow-2xl bg-slate-50 dark:bg-[#0C0D12] ${clubTheme.cardHover}`}
            >
              <Link href={`/proyectos/${project.id}`} className="relative h-56 w-full overflow-hidden block">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C0D12] via-transparent to-transparent opacity-80" />
              </Link>
              <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-[#00C8FF] transition-colors">
                    <Link href={`/proyectos/${project.id}`}>{project.title}</Link>
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
                    {project.description}
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex rounded-md bg-[#00C8FF]/10 px-2.5 py-1 text-xs font-semibold text-[#00C8FF] border border-[#00C8FF]/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
