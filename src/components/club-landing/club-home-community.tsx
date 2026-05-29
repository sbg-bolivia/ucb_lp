"use client";

import { useClubLinks } from "@/hooks/useClubLinks";
import { fadeUpProps } from "@/lib/club-motion";
import { Instagram, Linkedin, MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

import { ClubSectionHeader } from "./club-section-header";
import { TiktokGlyph } from "./club-social-icons";
import { clubTheme } from "./club-theme";

const members = Array.from({ length: 12 }, (_, i) => i + 1);

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
    <section className="bg-transparent px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="flex flex-col justify-center">
            <ClubSectionHeader
              eyebrow="Nuestra comunidad"
              title="Más que código, conectamos personas"
              description="Conecta con builders de distintas carreras, comparte aprendizajes y crece en equipo."
            />

            <motion.div
              className="mt-8 flex flex-wrap gap-3"
              {...fadeUpProps}
              transition={{ delay: 0.1 }}
            >
              {socials.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.05] bg-white/[0.02] text-[#A855F7] transition-all hover:scale-110 hover:bg-[#7E2CFF]/10 hover:border-[#7E2CFF]/20"
                  aria-label={s.label}
                >
                  <s.icon className="h-5 w-5" />
                </Link>
              ))}
              {L.tiktokUrl ? (
                <Link
                  href={L.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.05] bg-white/[0.02] transition-all hover:scale-110 hover:bg-[#7E2CFF]/10 hover:border-[#7E2CFF]/20"
                  aria-label="TikTok"
                >
                  <TiktokGlyph className="h-5 w-5" />
                </Link>
              ) : null}
            </motion.div>

            <motion.div
              className="mt-12 flex flex-wrap gap-10"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {[
                {
                  val: "120+",
                  lbl: "miembros activos",
                  color: "text-[#00C8FF]",
                },
                { val: "6+", lbl: "universidades", color: "text-[#7E2CFF]" },
                { val: "3", lbl: "ciudades", color: "text-[#A855F7]" },
              ].map((item) => (
                <motion.div
                  key={item.lbl}
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                    },
                  }}
                >
                  <p className={`text-4xl font-bold tracking-tight sm:text-5xl font-sans ${clubTheme.textHeading}`}>
                    {item.val}
                  </p>
                  <p
                    className={`mt-1 text-[10px] font-semibold uppercase tracking-widest ${item.color}`}
                  >
                    {item.lbl}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Column: Premium Apple-style Testimonial block */}
          <div
            className={`flex flex-col justify-between p-8 sm:p-10 ${clubTheme.card}`}
          >
            {/* Large Quote Marks Icon / Indicator */}
            <span className="text-6xl text-[#00C8FF]/20 font-serif leading-none select-none">
              “
            </span>

            <blockquote className="mt-2 text-lg sm:text-xl font-medium text-zinc-100 leading-relaxed text-left">
              Entré sin saber nada de cloud y en tres meses ya tenía un proyecto
              en producción. La comunidad te empuja a shippear y aprender
              rápido.
            </blockquote>

            <div className="mt-8 flex items-center gap-4 text-left">
              <Image
                src="https://i.pravatar.cc/128?img=47"
                alt="Camila R."
                width={48}
                height={48}
                className="rounded-full border border-white/[0.05]"
              />
              <div>
                <cite className={`not-italic text-sm font-bold block ${clubTheme.textHeading}`}>
                  Camila R.
                </cite>
                <span className="text-[10px] font-semibold text-[#00C8FF] uppercase tracking-wider block mt-0.5">
                  Estudiante y Builder Cloud
                </span>
              </div>
            </div>

            {/* Micro Team list at bottom */}
            <div className="mt-8 border-t border-white/[0.03] pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-left">
                <div className="flex -space-x-2">
                  {members.slice(0, 5).map((n) => (
                    <div
                      key={n}
                      className="h-8 w-8 overflow-hidden rounded-full border border-[#050608]"
                    >
                      <Image
                        src={`https://i.pravatar.cc/128?img=${n + 30}`}
                        alt=""
                        width={32}
                        height={32}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">
                  +120 Builders
                </span>
              </div>

              <Link
                href="/equipo"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#00C8FF] hover:underline uppercase tracking-wider group/team"
              >
                Conoce al equipo
                <span className="inline-block transition-transform duration-200 group-hover/team:translate-x-0.5">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

