"use client";

import { trpc } from "@/utils/trpc";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ClubSectionHeader } from "./club-section-header";
import { clubTheme } from "./club-theme";

const containerVariants: import("motion/react").Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const cardVariants: import("motion/react").Variants = {
  hidden: { opacity: 0, scale: 0.9, filter: "blur(15px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80";

function parseTags(tags: string | null | undefined): string[] {
  if (!tags?.trim()) return [];
  return tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 6);
}

export function ClubHomeProjects() {
  const { data: projects, isLoading } = trpc.clubProjects.listPublic.useQuery();
  const featured = (projects ?? []).slice(0, 3);

  return (
    <section
      className={`bg-transparent ${clubTheme.sectionY} ${clubTheme.pageBg}`}
    >
      <div className="mx-auto max-w-7xl">
        <ClubSectionHeader
          eyebrow="Proyectos destacados"
          title="Construyendo el futuro"
          description="Productos reales que nuestros miembros construyen y despliegan en la nube."
        />

        {isLoading ? (
          <p className={`mt-10 text-center text-sm ${clubTheme.textMuted}`}>
            Cargando proyectos…
          </p>
        ) : featured.length === 0 ? (
          <div
            className={`mt-10 rounded-2xl border border-dashed px-6 py-12 text-center ${clubTheme.card}`}
          >
            <p className={`text-lg font-semibold ${clubTheme.textHeading}`}>
              Pronto publicaremos proyectos
            </p>
            <p className={`mt-2 text-sm ${clubTheme.textMuted}`}>
              Gestiona los proyectos desde el panel de administración.
            </p>
            <Link
              href="/proyectos"
              className="mt-6 inline-flex rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-black"
            >
              Ver proyectos
            </Link>
          </div>
        ) : (
          <motion.div
            className="mt-10 grid gap-8 md:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {featured.map((project) => {
              const tags = parseTags(project.tags);
              return (
                <motion.div
                  key={project.id}
                  variants={cardVariants}
                  className={`club-glass group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-[#0C0D12] ${clubTheme.cardHover}`}
                >
                  <Link
                    href={`/proyectos/${project.id}`}
                    className="relative block h-56 w-full overflow-hidden"
                  >
                    <Image
                      src={project.imageUrl?.trim() || FALLBACK_IMAGE}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-90 dark:from-[#0C0D12]" />
                  </Link>
                  <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
                    <div>
                      <h3
                        className={`text-xl font-bold transition-colors group-hover:text-[#00C8FF] ${clubTheme.textHeading}`}
                      >
                        <Link href={`/proyectos/${project.id}`}>
                          {project.title}
                        </Link>
                      </h3>
                      {project.description ? (
                        <p
                          className={`mt-3 line-clamp-3 text-sm leading-relaxed ${clubTheme.textMuted}`}
                        >
                          {project.description}
                        </p>
                      ) : null}
                    </div>
                    {tags.length > 0 ? (
                      <div className="mt-6 flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex rounded-md border border-[#00C8FF]/20 bg-[#00C8FF]/10 px-2.5 py-1 text-xs font-semibold text-[#00C8FF]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
