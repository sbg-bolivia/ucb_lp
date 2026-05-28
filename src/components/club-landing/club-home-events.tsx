"use client";

import { Button } from "@/components/ui/button";
import {
  clubEase,
  staggerContainer,
  staggerItem,
} from "@/lib/club-motion";
import { Calendar, MapPin, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

import { ClubSectionHeader } from "./club-section-header";

const events = [
  {
    id: "community-day",
    title: "AWSome Community Day",
    date: "24 MAY",
    mode: "Presencial",
    location: "UCB Sede La Paz",
    time: "09:00 – 18:00",
    image:
      "https://images.unsplash.com/photo-1540575467067-178ab98d8357?auto=format&fit=crop&w=900&q=80",
    accent: "from-[#00C8FF]/10",
  },
  {
    id: "serverless",
    title: "Serverless Workshop",
    date: "08 JUN",
    mode: "Online",
    location: "Zoom",
    time: "18:30 – 20:30",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80",
    accent: "from-[#7E2CFF]/10",
    lambda: true,
  },
] as const;

export function ClubHomeEvents() {
  return (
    <section className="border-t border-white/5 bg-[#0C0D12] px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <ClubSectionHeader
          eyebrow="Eventos"
          title="Aprende en comunidad"
          description="Talleres presenciales y online con labs reales en AWS."
        />

        <motion.div
          className="mt-12 grid gap-6 lg:grid-cols-2"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
          {events.map((ev) => (
            <motion.article
              key={ev.id}
              variants={staggerItem}
              whileHover={{ y: -4, transition: { duration: 0.25, ease: clubEase } }}
              className="club-glass group relative flex flex-col overflow-hidden rounded-3xl"
            >
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${ev.accent} to-transparent`}
                aria-hidden
              />
              <div className="relative flex flex-1 flex-col p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-[#00C8FF]/30 bg-[#00C8FF]/10 px-3 py-1 text-xs font-bold text-[#00C8FF]">
                    {ev.date}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400">
                    {ev.mode === "Online" ? (
                      <Video className="h-3.5 w-3.5" />
                    ) : (
                      <MapPin className="h-3.5 w-3.5" />
                    )}
                    {ev.mode}
                  </span>
                </div>

                <h3 className="mt-4 text-2xl font-bold text-white">{ev.title}</h3>

                <div className="mt-3 flex flex-wrap gap-4 text-sm text-zinc-400">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-[#7E2CFF]" />
                    {ev.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-[#00C8FF]" />
                    {ev.time}
                  </span>
                </div>

                <div className="relative mt-6 h-40 overflow-hidden rounded-2xl border border-white/10 sm:h-48">
                  <Image
                    src={ev.image}
                    alt=""
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                  {"lambda" in ev && ev.lambda ? (
                    <div className="absolute right-4 top-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FF9900]/90 text-lg font-black text-[#232F3E] shadow-lg">
                      λ
                    </div>
                  ) : null}
                  <div className="absolute bottom-3 left-3 flex -space-x-2">
                    {[1, 2, 3, 4].map((n) => (
                      <div
                        key={n}
                        className="h-8 w-8 overflow-hidden rounded-full border-2 border-[#12131a]"
                      >
                        <Image
                          src={`https://i.pravatar.cc/64?img=${n + 20}`}
                          alt=""
                          width={32}
                          height={32}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button
                    asChild
                    className="rounded-full bg-gradient-to-r from-[#00C8FF] via-[#7E2CFF] to-[#A855F7] font-semibold text-white"
                  >
                    <Link href="/eventos">Reservar mi lugar</Link>
                  </Button>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
