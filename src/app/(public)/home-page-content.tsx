"use client";

import { CasesSection } from "@/components/axium/cases-section";
import { ContactSection } from "@/components/axium/contact-section";
import { HeroSection } from "@/components/axium/hero-section";
import { InspirationalSection } from "@/components/axium/inspirational-section";
import { ProcessSection } from "@/components/axium/process-section";
import { ServicesSection } from "@/components/axium/services-section";

export function HomePageContent() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <ServicesSection />
      <ProcessSection />
      <CasesSection />
      <ContactSection />
      <InspirationalSection />
    </div>
  );
}
