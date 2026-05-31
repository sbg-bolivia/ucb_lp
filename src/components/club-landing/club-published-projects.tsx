"use client";

import { trpc } from "@/utils/trpc";
import { ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ClubSectionHeader } from "./club-section-header";
import { clubTheme } from "./club-theme";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80";

function parseTags(tags: string | null | undefined): string[] {
  if (!tags?.trim()) return [];
  return tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export function ClubPublishedProjects() {
  const { data: projects, isLoading } = trpc.clubProjects.listPublic.useQuery();

  if (isLoading) {
    return (
      <div className="mx-auto mb-14 max-w-3xl text-center">
        <p className={`text-sm ${clubTheme.textMuted}`}>Cargando proyectos…</p>
      </div>
    );
  }

  if (!projects?.length) {
    return (
      <motion.div
        className={`mx-auto mb-14 max-w-3xl rounded-2xl border border-dashed px-6 py-10 text-center ${clubTheme.card}`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className={`text-lg font-semibold ${clubTheme.textHeading}`}>
          Pronto publicaremos proyectos
        </p>
        <p className={`mt-2 text-sm sm:text-base ${clubTheme.textMuted}`}>
          Los proyectos del club se gestionan desde el panel de administración.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="mb-14">
      <div className="mb-12">
        <ClubSectionHeader
          eyebrow="Proyectos"
          title="Lo que estamos construyendo"
          description="Productos reales desplegados en AWS por miembros del grupo."
        />
      </div>

      <ul className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const tags = parseTags(project.tags);
          return (
            <li key={project.id}>
              <article
                className={`flex h-full flex-col overflow-hidden ${clubTheme.card} ${clubTheme.cardHover}`}
              >
                <Link
                  href={`/proyectos/${project.id}`}
                  className="relative block aspect-[16/10] w-full bg-sky-100 dark:bg-zinc-800"
                >
                  <Image
                    src={project.imageUrl?.trim() || FALLBACK_IMAGE}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </Link>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className={`text-xl font-bold ${clubTheme.textHeading}`}>
                    <Link
                      href={`/proyectos/${project.id}`}
                      className="hover:text-[#00C8FF] transition-colors"
                    >
                      {project.title}
                    </Link>
                  </h3>
                  {project.description ? (
                    <p
                      className={`mt-2 line-clamp-4 text-sm leading-relaxed ${clubTheme.textMuted}`}
                    >
                      {project.description}
                    </p>
                  ) : null}
                  {tags.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md border border-[#00C8FF]/20 bg-[#00C8FF]/10 px-2 py-0.5 text-xs font-semibold text-[#00C8FF]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  {project.projectUrl?.trim() ? (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#3b41ff] hover:underline dark:text-violet-300"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Ver proyecto
                    </a>
                  ) : null}
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
