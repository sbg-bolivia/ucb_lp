"use client";

import { Button } from "@/components/ui/button";
import { trpc } from "@/utils/trpc";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { clubTheme } from "@/components/club-landing/club-theme";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80";

function parseTags(tags: string | null | undefined): string[] {
  if (!tags?.trim()) return [];
  return tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export default function ProyectoDetallePage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const { data: project, isLoading } = trpc.clubProjects.getPublic.useQuery(
    { id },
    { enabled: Boolean(id) }
  );

  if (isLoading) {
    return (
      <section className={`${clubTheme.sectionY} text-center ${clubTheme.pageBg}`}>
        <p className={clubTheme.textMuted}>Cargando proyecto…</p>
      </section>
    );
  }

  if (!project) {
    return (
      <section className={`${clubTheme.sectionY} text-center ${clubTheme.pageBg}`}>
        <h1 className={`text-2xl font-bold ${clubTheme.textHeading}`}>
          Proyecto no encontrado
        </h1>
        <p className={`mt-2 ${clubTheme.textMuted}`}>
          El proyecto no existe o ya no está publicado.
        </p>
        <Button asChild className="mt-6 rounded-full">
          <Link href="/proyectos">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a proyectos
          </Link>
        </Button>
      </section>
    );
  }

  const tags = parseTags(project.tags);

  return (
    <article className={`${clubTheme.sectionY} ${clubTheme.pageBg}`}>
      <div className="mx-auto max-w-4xl">
        <Link
          href="/proyectos"
          className={`mb-8 inline-flex items-center gap-2 text-sm font-medium ${clubTheme.textMuted} hover:text-[#00C8FF] transition-colors`}
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a proyectos
        </Link>

        <div className={`overflow-hidden rounded-3xl ${clubTheme.card}`}>
          <div className="relative aspect-[21/9] w-full">
            <Image
              src={project.imageUrl?.trim() || FALLBACK_IMAGE}
              alt={project.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 896px) 100vw, 896px"
            />
          </div>

          <div className="p-8 sm:p-10">
            <h1
              className={`text-3xl font-bold tracking-tight sm:text-4xl ${clubTheme.textHeading}`}
            >
              {project.title}
            </h1>

            {project.description ? (
              <p
                className={`mt-6 whitespace-pre-wrap text-base leading-relaxed ${clubTheme.textMuted}`}
              >
                {project.description}
              </p>
            ) : null}

            {tags.length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-[#00C8FF]/20 bg-[#00C8FF]/10 px-2.5 py-1 text-xs font-semibold text-[#00C8FF]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            {project.projectUrl?.trim() ? (
              <Button asChild className="mt-8 rounded-full">
                <a
                  href={project.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Ver repositorio / demo
                </a>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
