"use client";

import { useClubLinks } from "@/hooks/useClubLinks";
import { fadeUpProps } from "@/lib/club-motion";
import { UNIVERSITY_IMAGES } from "@/lib/university-assets";
import { Instagram, Linkedin, MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

import { ClubSectionHeader } from "./club-section-header";
import { TiktokGlyph } from "./club-social-icons";
import { clubTheme } from "./club-theme";

const COMMUNITY_PHOTOS = [
  {
    src: UNIVERSITY_IMAGES.communityDay2,
    alt: "Grupo del AWS Student Builder Group",
    position: "object-[center_35%]",
  },
  {
    src: UNIVERSITY_IMAGES.goldenJackets,
    alt: "Golden Jackets del club",
    position: "object-[center_60%]",
  },
] as const;

export function ClubHomeCommunity() {
  const L = useClubLinks();

  const socials = [
    { href: L.whatsappUrl, icon: MessageCircle, label: "WhatsApp" },
    { href: L.linkedinUrl, icon: Linkedin, label: "LinkedIn" },
    { href: L.instagramUrl, icon: Instagram, label: "Instagram" },
  ].filter(
    (s): s is { href: string; icon: typeof MessageCircle; label: string } =>
      Boolean(s.href)
  );

  return (
    <section className="bg-transparent pt-2 pb-5 sm:pt-2 sm:pb-2">
      <div className={clubTheme.container}>
        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-10">
          <div className="flex flex-col">
            <ClubSectionHeader
              eyebrow="Nuestra comunidad"
              title="Más que código, conectamos personas"
              description="Conecta con builders de distintas carreras, comparte aprendizajes y crece en equipo."
            />

            <motion.div
              className="mt-6 flex flex-wrap gap-2.5"
              {...fadeUpProps}
              transition={{ delay: 0.1 }}
            >
              {socials.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-[var(--aws-orange)] transition-all duration-300 hover:scale-105 hover:border-[var(--aws-orange)]/30 hover:bg-[var(--aws-orange)]/10 dark:border-[var(--border-soft)] dark:bg-[var(--surface-soft)]"
                  aria-label={s.label}
                >
                  <s.icon className="h-4 w-4" />
                </Link>
              ))}
              {L.tiktokUrl ? (
                <Link
                  href={L.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white transition-all duration-300 hover:scale-105 hover:border-[var(--aws-orange)]/30 hover:bg-[var(--aws-orange)]/10 dark:border-[var(--border-soft)] dark:bg-[var(--surface-soft)]"
                  aria-label="TikTok"
                >
                  <TiktokGlyph className="h-4 w-4" />
                </Link>
              ) : null}
            </motion.div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              {COMMUNITY_PHOTOS.map((photo) => (
                <div
                  key={photo.src}
                  className="relative aspect-[4/3] overflow-hidden rounded-xl"
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className={`object-cover ${photo.position}`}
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
