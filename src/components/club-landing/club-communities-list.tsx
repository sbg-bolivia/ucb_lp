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
    <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
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
                `w-full text-left p-3 transition-all ${clubTheme.card}`,
                c.isOwnGroup && "ring-2 ring-[var(--aws-orange)]/30",
                isSelected &&
                  "ring-2 ring-[var(--aws-orange)]/50 shadow-md shadow-[var(--aws-orange)]/10",
                hasCoords
                  ? "cursor-pointer hover:shadow-md"
                  : "cursor-default opacity-90"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--aws-orange)]">
                    {AWS_COMMUNITY_TYPE_LABELS[c.communityType]}
                    {c.isOwnGroup ? " · Tu comunidad" : ""}
                  </p>
                  <h3
                    className={`mt-0.5 line-clamp-2 text-sm font-bold leading-snug ${clubTheme.textHeading}`}
                  >
                    {c.name}
                  </h3>
                </div>
                <p
                  className={`flex shrink-0 items-center gap-0.5 text-[10px] ${clubTheme.textMuted}`}
                >
                  <MapPin className="h-3 w-3" />
                  {c.city}
                </p>
              </div>
              {c.description ? (
                <p
                  className={`mt-1.5 line-clamp-1 text-xs leading-relaxed ${clubTheme.textMuted}`}
                >
                  {c.description}
                </p>
              ) : null}
              <div
                className="mt-2 flex flex-wrap gap-2"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              >
                {website ? (
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[var(--aws-orange)] hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Web
                  </a>
                ) : null}
                {meetup ? (
                  <a
                    href={meetup}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#F05663] hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Meetup
                  </a>
                ) : null}
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
