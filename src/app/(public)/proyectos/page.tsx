import { ClubPublishedProjects } from "@/components/club-landing/club-published-projects";
import { clubTheme } from "@/components/club-landing/club-theme";
import { clubPageMeta } from "@/lib/club-page-meta";
import type { Metadata } from "next";

export const metadata: Metadata = clubPageMeta(
  "Proyectos",
  "Proyectos reales construidos y desplegados en AWS por miembros del AWS Student Builder Group UCB La Paz."
);

export default function ProyectosPage() {
  return (
    <>
      <h1 className="sr-only">Proyectos del club</h1>
      <section className={clubTheme.sectionY}>
        <ClubPublishedProjects />
      </section>
    </>
  );
}
