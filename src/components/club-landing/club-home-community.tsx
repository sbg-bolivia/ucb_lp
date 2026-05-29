"use client";

import { useClubLinks } from "@/hooks/useClubLinks";
import { clubEase, fadeUpProps, staggerContainer, staggerItem } from "@/lib/club-motion";
import { Instagram, Linkedin, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

import { ClubSectionHeader } from "./club-section-header";
import { TiktokGlyph } from "./club-social-icons";

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
    <section className="border-t border-slate-100 bg-white px-4 py-16 dark:border-white/5 dark:bg-[#0C0D12] sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
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
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#7E2CFF]/30 bg-[#7E2CFF]/10 text-[#A855F7] transition hover:scale-110 hover:bg-[#7E2CFF]/20"
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
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#7E2CFF]/30 bg-[#7E2CFF]/10 transition hover:scale-110"
                  aria-label="TikTok"
                >
                  <TiktokGlyph className="h-5 w-5" />
                </Link>
              ) : null}
            </motion.div>

            <motion.div className="mt-10 flex flex-wrap gap-8" {...fadeUpProps}>
              <div>
                <p className="text-4xl font-bold text-slate-900 dark:text-white">120+</p>
                <p className="text-sm text-slate-600 dark:text-zinc-400">miembros activos</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-slate-900 dark:text-white">6+</p>
                <p className="text-sm text-slate-600 dark:text-zinc-400">universidades</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-slate-900 dark:text-white">3</p>
                <p className="text-sm text-slate-600 dark:text-zinc-400">ciudades</p>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="club-glass rounded-3xl p-6 sm:p-8"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: clubEase }}
          >
            <p className="text-sm font-semibold text-[#00C8FF]">Nuestra comunidad</p>
            <motion.div
              className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {members.map((n) => (
                <motion.div
                  key={n}
                  variants={staggerItem}
                  className="aspect-square overflow-hidden rounded-full border-2 border-[#7E2CFF]/30"
                >
                  <Image
                    src={`https://i.pravatar.cc/128?img=${n + 30}`}
                    alt=""
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                </motion.div>
              ))}
            </motion.div>

            <blockquote className="club-glass mt-8 rounded-2xl border-l-2 border-[#7E2CFF] p-5">
              <p className="text-sm italic leading-relaxed text-slate-700 dark:text-zinc-300">
                “Entré sin saber nada de cloud y en tres meses ya tenía un proyecto en
                producción. La comunidad te empuja a shippear.”
              </p>
              <footer className="mt-4 flex items-center gap-3">
                <Image
                  src="https://i.pravatar.cc/64?img=47"
                  alt=""
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full"
                />
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Camila R.</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-500">
                    Miembro · Ing. de Sistemas
                  </p>
                </div>
              </footer>
            </blockquote>

            <Link
              href="/equipo"
              className="mt-6 inline-block text-sm font-semibold text-[#00C8FF] hover:underline"
            >
              Conoce al equipo →
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
