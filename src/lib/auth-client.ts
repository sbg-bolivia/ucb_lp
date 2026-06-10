import { getClientSiteUrl } from "@/lib/club-brand";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: getClientSiteUrl(),
});
