"use client";

import { AWS_COMMUNITY_TYPE_LABELS } from "@/lib/aws-labels";
import { ExternalLink, MapPin } from "lucide-react";

import type { AwsCommunityPublic } from "./club-communities-types";
import { clubTheme } from "./club-theme";

export function ClubCommunitiesList({
  communities,
}: {
  communities: AwsCommunityPublic[];
}) {
  return (
    <ul className="space-y-4">
      {communities.map((c) => (
        <li
          key={c.id}
          className={`p-5 sm:p-6 ${clubTheme.card} ${c.isOwnGroup ? "ring-2 ring-[#00C8FF]/30" : ""}`}
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#3b41ff] dark:text-violet-300">
                {AWS_COMMUNITY_TYPE_LABELS[c.communityType]}
                {c.isOwnGroup ? " · Tu comunidad" : ""}
              </p>
              <h3 className={`mt-1 text-lg font-bold ${clubTheme.textHeading}`}>
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
            <p className={`mt-2 text-sm ${clubTheme.textMuted}`}>{c.university}</p>
          ) : null}
          {c.description ? (
            <p className={`mt-2 text-sm leading-relaxed ${clubTheme.textMuted}`}>
              {c.description}
            </p>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-3">
            {c.websiteUrl ? (
              <a
                href={c.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#3b41ff] hover:underline dark:text-violet-300"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Sitio web
              </a>
            ) : null}
            {c.meetupUrl ? (
              <a
                href={c.meetupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#F05663] hover:underline"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Meetup
              </a>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
