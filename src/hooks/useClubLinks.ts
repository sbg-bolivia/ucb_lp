"use client";

import { CLUB_LINK_DEFAULTS } from "@/lib/club-default-links";
import { trpc } from "@/utils/trpc";
import { useMemo } from "react";

function pickUrl(
  fromTenant: string | null | undefined,
  fallback: string
): string {
  const t = fromTenant?.trim();
  if (t) return t;
  return fallback;
}

export type ClubLinks = {
  meetupUrl: string;
  whatsappUrl: string;
  tiktokUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
  hasMeetup: boolean;
  hasWhatsapp: boolean;
  hasAnyJoin: boolean;
};

export function useClubLinks(): ClubLinks {
  const { data: tenant } = trpc.companyInfo.get.useQuery();

  return useMemo(() => {
    const meetupUrl = pickUrl(tenant?.meetupUrl, CLUB_LINK_DEFAULTS.meetupUrl);
    const whatsappUrl = pickUrl(
      tenant?.whatsappUrl,
      CLUB_LINK_DEFAULTS.whatsappUrl
    );
    const tiktokUrl = pickUrl(tenant?.tiktokUrl, CLUB_LINK_DEFAULTS.tiktokUrl);
    const linkedinUrl = pickUrl(
      tenant?.linkedinUrl,
      CLUB_LINK_DEFAULTS.linkedinUrl
    );
    const instagramUrl = pickUrl(
      tenant?.instagramUrl,
      CLUB_LINK_DEFAULTS.instagramUrl
    );

    return {
      meetupUrl,
      whatsappUrl,
      tiktokUrl,
      linkedinUrl,
      instagramUrl,
      hasMeetup: Boolean(meetupUrl),
      hasWhatsapp: Boolean(whatsappUrl),
      hasAnyJoin: Boolean(meetupUrl || whatsappUrl),
    };
  }, [tenant]);
}
