"use client";

import { AWS_COMMUNITY_TYPE_LABELS } from "@/lib/aws-labels";
import { safeExternalHref } from "@/lib/event-registration-url";
import { cn } from "@/lib/utils";
import { ExternalLink, MapPin } from "lucide-react";

import type { AwsCommunityPublic } from "./club-communities-types";
import { clubTheme } from "./club-theme";

export function ClubCommunitiesList({
  communities,
  selectedId,
  onSelect,
}: {
  communities: AwsCommunityPublic[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <ul className="space-y-3">
      {communities.map((c) => {
        const isSelected = c.id === selectedId;
        const hasCoords = c.latitude != null && c.longitude != null;
        const website = safeExternalHref(c.websiteUrl);
        const meetup = safeExternalHref(c.meetupUrl);

        return (
          <li key={c.id}>
            <button
              type="button"
              onClick={() => {
                if (hasCoords) onSelect(c.id);
              }}
              disabled={!hasCoords}
              className={cn(
                `w-full text-left p-4 sm:p-5 transition-all ${clubTheme.card}`,
                c.isOwnGroup && "ring-2 ring-[#00C8FF]/30",
                isSelected &&
                  "ring-2 ring-[#3b41ff]/50 shadow-md shadow-[#3b41ff]/10",
                hasCoords
                  ? "cursor-pointer hover:shadow-md"
                  : "cursor-default opacity-90"
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#3b41ff] dark:text-violet-300">
                    {AWS_COMMUNITY_TYPE_LABELS[c.communityType]}
                    {c.isOwnGroup ? " · Tu comunidad" : ""}
                  </p>
                  <h3
                    className={`mt-1 text-base font-bold sm:text-lg ${clubTheme.textHeading}`}
                  >
                    {c.name}
                  </h3>
                </div>
                <p
                  className={`flex items-center gap-1 text-xs ${clubTheme.textMuted}`}
                >
                  <MapPin className="h-3.5 w-3.5" />
                  {c.city}
                  {c.department ? `, ${c.department}` : ""}
                </p>
              </div>
              {c.university ? (
                <p className={`mt-1.5 text-sm ${clubTheme.textMuted}`}>
                  {c.university}
                </p>
              ) : null}
              {c.description ? (
                <p
                  className={`mt-1.5 line-clamp-2 text-sm leading-relaxed ${clubTheme.textMuted}`}
                >
                  {c.description}
                </p>
              ) : null}
              <div
                className="mt-2.5 flex flex-wrap gap-3"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              >
                {website ? (
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#3b41ff] hover:underline dark:text-violet-300"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Sitio web
                  </a>
                ) : null}
                {meetup ? (
                  <a
                    href={meetup}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#F05663] hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Meetup
                  </a>
                ) : null}
                {hasCoords ? (
                  <span className="text-[10px] font-medium uppercase tracking-wide text-[#3b41ff]/70">
                    Ver en mapa
                  </span>
                ) : null}
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
