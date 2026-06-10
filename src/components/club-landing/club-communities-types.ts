import type { AwsCommunityType } from "@prisma/client";

export type AwsCommunityPublic = {
  id: string;
  name: string;
  communityType: AwsCommunityType;
  university: string | null;
  department: string | null;
  city: string;
  description: string | null;
  meetupUrl: string | null;
  websiteUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  isOwnGroup: boolean;
};
