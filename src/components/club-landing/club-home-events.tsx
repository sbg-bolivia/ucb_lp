"use client";

import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Video } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ClubSectionHeader } from "./club-section-header";
import { clubTheme } from "./club-theme";

const events = [
  {
    id: "community-day",
    title: "AWSome Community Day",
    date: "24 MAY",
    mode: "Presencial",
    location: "UCB Sede La Paz",
    time: "09:00 – 18:00",
    image: "https://images.unsplash.com/photo-1540575467067-178ab98d8357?auto=format&fit=crop&w=900&q=80",
    accent: "from-[#00C8FF]/10",
  },
  {
    id: "serverless",
    title: "Serverless Workshop",
    date: "08 JUN",
    mode: "Online",
    location: "Zoom",
    time: "18:30 – 20:30",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80",
    accent: "from-[#7E2CFF]/10",
    lambda: true,
  },
] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, filter: "blur(15px)" },
  visible: { 
    opacity: 1, 
    scale: 1, 
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  },
};

export function ClubHomeEvents() {
  return (
    <section className={`bg-transparent px-4 py-16 sm:px-6 sm:py-24 ${clubTheme.pageBg}`} style={{ perspective: "1500px" }}>
      <div className="mx-auto max-w-7xl">
        <ClubSectionHeader
          eyebrow="Eventos destacados"
          title="Lo que viene"
          description="Talleres presenciales y online con labs reales en AWS."
        />

        <motion.div 
          className="mt-16 grid gap-12 lg:gap-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {events.map((event) => (
            <motion.article
              key={event.id}
              variants={cardVariants}
              className="club-glass group relative flex flex-col overflow-hidden rounded-[2rem] lg:flex-row shadow-2xl border border-white/5 bg-slate-50 dark:bg-[#0C0D12]"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${event.accent} to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
              
              <div className="relative h-64 w-full shrink-0 overflow-hidden lg:h-auto lg:w-2/5 block">
                <Link href={`/eventos/${event.id}`}>
                  <div className="h-full w-full">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0C0D12] via-transparent to-transparent opacity-60 lg:bg-gradient-to-r" />
                  
                  <div className="absolute left-6 top-6 flex h-16 w-16 flex-col items-center justify-center rounded-2xl bg-white/10 text-white shadow-xl backdrop-blur-md">
                    <span className="text-xl font-bold leading-none">{event.date.split(" ")[0]}</span>
                    <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[#00C8FF]">
                      {event.date.split(" ")[1]}
                    </span>
                  </div>
                </Link>
              </div>

              <div className="relative flex flex-1 flex-col justify-center p-8 sm:p-10 lg:pl-12">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-zinc-300">
                    {event.mode === "Online" ? <Video className="h-3.5 w-3.5" /> : <MapPin className="h-3.5 w-3.5" />}
                    {event.mode}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-zinc-300">
                    <Calendar className="h-3.5 w-3.5" />
                    {event.time}
                  </span>
                </div>

                <h3 className="mt-6 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                  <Link href={`/eventos/${event.id}`} className="hover:text-[#00C8FF] transition-colors">
                    {event.title}
                  </Link>
                </h3>
                
                <div className="mt-4 flex items-center gap-2 text-zinc-400">
                  <MapPin className="h-4 w-4 shrink-0 text-[#7E2CFF]" />
                  <span className="text-sm">{event.location}</span>
                </div>

                <div className="mt-10 flex flex-wrap gap-4 relative z-20">
                  <Button asChild className="rounded-full bg-white px-8 text-black hover:bg-zinc-200">
                    <Link href={`/eventos/${event.id}`}>Ver detalles</Link>
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
