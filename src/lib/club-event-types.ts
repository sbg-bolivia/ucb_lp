import type { EventStatus, RegistrationType } from "@prisma/client";

/** Evento publicado tal como lo consumen las páginas públicas (fechas pueden serializarse como string). */
export type ClubEventPublic = {
  id: string;
  tenantId: string;
  title: string;
  description: string | null;
  startsAt: Date | string | null;
  endsAt: Date | string | null;
  location: string | null;
  imageUrl: string | null;
  externalUrl: string | null;
  registrationUrl: string | null;
  registrationType: RegistrationType;
  status: EventStatus;
  isOnline: boolean;
  isFeatured: boolean;
  promoVideoUrl: string | null;
  pastFlyerUrl: string | null;
  recapGallery?: unknown;
  isPublished: boolean;
  category: string | null;
  sortOrder: number;
};

/** Fila del panel admin (mismos campos editables + metadatos básicos). */
export type ClubEventAdmin = ClubEventPublic;
