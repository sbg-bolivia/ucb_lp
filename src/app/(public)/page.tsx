import { HomePageContent } from "@/app/(public)/home-page-content";
import { homePageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = homePageMetadata;

export default function HomePage() {
  return <HomePageContent />;
}
