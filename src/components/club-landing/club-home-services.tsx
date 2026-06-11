"use client";

import { UNIVERSITY_IMAGES } from "@/lib/university-assets";
import { motion } from "motion/react";
import Image from "next/image";
import { BookOpen, Code2, Users } from "lucide-react";
import { clubTheme } from "./club-theme";

const services = [
  {
    icon: Users,
    title: "Comunidad",
    text: "Conectamos estudiantes apasionados por la tecnología para colaborar, compartir y crecer juntos.",
    accent: "from-[var(--aws-orange)]/15 to-[var(--aws-orange)]/5",
    iconColor: "text-[var(--aws-orange)]",
    image: UNIVERSITY_IMAGES.communityDay2,
    imagePosition: "object-center",
  },
  {
    icon: BookOpen,
    title: "Aprendizaje",
    text: "Organizamos workshops, charlas y sesiones prácticas para aprender las tecnologías de AWS.",
    accent: "from-slate-200/80 to-slate-100/60 dark:from-[var(--aws-ink)]/20 dark:to-[var(--surface-soft)]/30",
    iconColor: "text-[var(--aws-ink)] dark:text-[var(--text-main)]",
    image: UNIVERSITY_IMAGES.auditorio,
    imagePosition: "object-center",
  },
  {
    icon: Code2,
    title: "Proyectos",
    text: "Desarrollamos soluciones reales en la nube que generan impacto en nuestra comunidad y más allá.",
    accent: "from-[var(--aws-orange)]/10 to-slate-100/60 dark:to-[var(--aws-ink)]/15",
    iconColor: "text-[var(--aws-orange)]",
    image: UNIVERSITY_IMAGES.awsUgLeads,
    imagePosition: "object-[center_25%]",
  },
] as const;

const containerVariants: import("motion/react").Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.06 },
  },
};

const cardVariants: import("motion/react").Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export function ClubHomeServices() {
  return (
    <section className={`relative overflow-hidden pt-6 pb-8 sm:pt-8 sm:pb-10 ${clubTheme.pageBg}`}>
      <div className={clubTheme.container}>
        <motion.header
          className="mb-5 max-w-2xl"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--aws-orange)]">
            Qué hacemos
          </p>
          <h2 className={`mt-1.5 text-2xl font-bold tracking-tight sm:text-3xl ${clubTheme.textHeading}`}>
            Aprender. Construir. Impactar.
          </h2>
        </motion.header>

        <motion.div
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.article
                key={service.title}
                variants={cardVariants}
                className={`group overflow-hidden ${clubTheme.card} ${clubTheme.cardHover}`}
              >
                <div className="relative h-36 w-full overflow-hidden sm:h-50">
                  <Image
                    src={service.image}
                    alt=""
                    fill
                    className={`object-cover ${service.imagePosition} transition-transform duration-500 group-hover:scale-[1.03]`}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-4 sm:p-5 ">
                  <span
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${service.accent} ${service.iconColor}`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={2} />
                  </span>
                  <h3 className={`mt-2.5 text-base font-bold ${clubTheme.textHeading}`}>
                    {service.title}
                  </h3>
                  <p className={`mt-1.5 text-sm leading-relaxed ${clubTheme.textMuted}`}>
                    {service.text}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
