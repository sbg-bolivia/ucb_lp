import { HomePageContent } from "@/app/(public)/home-page-content";
import { defaultMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = defaultMetadata;

export default function HomePage() {
  return <HomePageContent />;
}
