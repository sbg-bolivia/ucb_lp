import { CLUB } from "@/lib/club-brand";
import type { Metadata } from "next";

export function clubPageMeta(title: string, description?: string): Metadata {
  const desc =
    description ??
    `${CLUB.shortName} en ${CLUB.city}: comunidad estudiantil AWS, talleres y eventos en la ${CLUB.fullUniversity}.`;
  return {
    title: `${title} | ${CLUB.shortName}`,
    description: desc,
  };
}
