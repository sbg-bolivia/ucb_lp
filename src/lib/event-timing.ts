import type { EventStatus } from "@prisma/client";

type EventTimingInput = {
  status: EventStatus;
  endsAt: Date | string | null;
  startsAt: Date | string | null;
};

export function isEventPast(event: EventTimingInput): boolean {
  if (event.status === "PAST") return true;
  if (event.status === "CANCELLED" || event.status === "DRAFT") return false;

  const ref = event.endsAt ?? event.startsAt;
  if (!ref) return false;

  return new Date(ref).getTime() < Date.now();
}

export function isEventCancelled(event: { status: EventStatus }): boolean {
  return event.status === "CANCELLED";
}
