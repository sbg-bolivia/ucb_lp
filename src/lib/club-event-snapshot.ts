import type { ClubEvent } from "@prisma/client";

export type ClubEventSnapshot = {
  title: string;
  description: string | null;
  startsAt: string | null;
  endsAt: string | null;
  location: string | null;
  imageUrl: string | null;
  externalUrl: string | null;
  registrationUrl: string | null;
  registrationType: string;
  status: string;
  isOnline: boolean;
  isFeatured: boolean;
  promoVideoUrl: string | null;
  isPublished: boolean;
  category: string | null;
  sortOrder: number;
};

export function eventToSnapshot(event: ClubEvent): ClubEventSnapshot {
  return {
    title: event.title,
    description: event.description,
    startsAt: event.startsAt?.toISOString() ?? null,
    endsAt: event.endsAt?.toISOString() ?? null,
    location: event.location,
    imageUrl: event.imageUrl,
    externalUrl: event.externalUrl,
    registrationUrl: event.registrationUrl,
    registrationType: event.registrationType,
    status: event.status,
    isOnline: event.isOnline,
    isFeatured: event.isFeatured,
    promoVideoUrl: event.promoVideoUrl,
    isPublished: event.isPublished,
    category: event.category,
    sortOrder: event.sortOrder,
  };
}

export function snapshotToEventData(snapshot: ClubEventSnapshot) {
  return {
    title: snapshot.title,
    description: snapshot.description,
    startsAt: snapshot.startsAt ? new Date(snapshot.startsAt) : null,
    endsAt: snapshot.endsAt ? new Date(snapshot.endsAt) : null,
    location: snapshot.location,
    imageUrl: snapshot.imageUrl,
    externalUrl: snapshot.externalUrl,
    registrationUrl: snapshot.registrationUrl,
    registrationType: snapshot.registrationType as ClubEvent["registrationType"],
    status: snapshot.status as ClubEvent["status"],
    isOnline: snapshot.isOnline,
    isFeatured: snapshot.isFeatured,
    promoVideoUrl: snapshot.promoVideoUrl,
    isPublished: snapshot.isPublished,
    category: snapshot.category ?? null,
    sortOrder: snapshot.sortOrder,
  };
}
