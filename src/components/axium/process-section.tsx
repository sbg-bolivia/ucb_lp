"use client";

import { Code2, Lightbulb, Rocket } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useRef, useState } from "react";

const steps = [
  {
    id: "definir",
    icon: Lightbulb,
    title: "Definir",
    fullTitle: "Definir lo que Importa",
    description:
      "No preguntamos qué quieres construir. Preguntamos qué vale la pena construir. Desde nuevos productos hasta migraciones de plataforma, nos enfocamos en lo que realmente impulsa resultados.",
  },
  {
    id: "construir",
    icon: Code2,
    title: "Construir",
    fullTitle: "Construir para Escalar",
    description:
      "La estética importa, pero la función importa más. Diseñamos, codificamos y conectamos sistemas que tu equipo puede usar con facilidad. Escalable, rápido y listo para crecer contigo.",
  },
  {
    id: "lanzar",
    icon: Rocket,
    title: "Lanzar",
    fullTitle: "Lanzar con Confianza",
    description:
      "Sin entregas silenciosas. Testeamos fuerte, lanzamos inteligente, y nos quedamos en el ciclo, listos para arreglar, mejorar o escalar según tus necesidades cambien.",
  },
];

const secondaryBadges = [
  { label: "Diseño Detallado" },
  { label: "Arquitectura Escalable" },
  { label: "Sistema Modular" },
];

const detailCards = [
  {
    title: "Revisión de Calidad",
    tag: "QA Testing",
    tagColor: "bg-accent",
  },
  {
    title: "Lanzamiento Seguro",
    tag: "Deploy",
    tagColor: "bg-secondary",
  },
  {
    title: "Soporte Continuo",
    tag: "24/7",
    tagColor: "bg-accent",
  },
];

// Smooth easing curve for all animations (cubic-bezier)
const smoothEase = [0.4, 0, 0.2, 1] as const;

export function ProcessSection() {
  const [activeStep, setActiveStep] = useState(0);
  const prevStepRef = useRef(0);

  // Determine direction: 1 = forward, -1 = backward
  const direction = activeStep >= prevStepRef.current ? 1 : -1;

  const handleStepChange = (newStep: number) => {
    prevStepRef.current = activeStep;
    setActiveStep(newStep);
  };

  return (
    <section
      id="como-trabajamos"
      className="py-16 md:py-24 md:pt-16 bg-white relative overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
          <span className="text-secondary font-semibold text-sm uppercase tracking-wide">
            Proceso que Entrega Resultados
          </span>
          <h2 className="text-heading-2 text-gray-900 mb-4 mt-3">
            Inteligente, Preciso y{" "}
            <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
              Exitoso
            </span>
          </h2>
          <p className="text-body text-gray-600">
            En Axium, creamos soluciones que capturan la atención del cliente,
            ganan su confianza y construyen relaciones duraderas basadas en
            innovación y éxito medible.
          </p>
        </div>

        {/* Mobile Tabs - Top */}
        <div className="md:hidden mb-6">
          <div className="flex gap-2 justify-center">
            {steps.map((step, index) => (
              <button
                key={step.id}
                type="button"
                onClick={() => handleStepChange(index)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300 ${
                  activeStep === index
                    ? "bg-secondary text-white shadow-lg"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <step.icon className="w-4 h-4" />
                <span className="text-sm font-semibold">{step.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area - Fixed Height */}
        <div className="h-[480px] md:h-[420px] lg:h-[380px] relative mb-8 md:mb-16">
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-center gap-6 lg:gap-8 h-full">
            {/* Image with animation */}
            <motion.div
              className="relative w-[220px] h-[280px] lg:w-[260px] lg:h-[320px] rounded-2xl overflow-hidden flex-shrink-0"
              animate={{
                scale: 1 + activeStep * 0.02,
                x: activeStep * 3,
              }}
              transition={{
                duration: 0.6,
                ease: smoothEase,
              }}
            >
              <motion.div
                className="absolute inset-0"
                animate={{
                  scale: 1 + activeStep * 0.05,
                }}
                transition={{
                  duration: 0.7,
                  ease: smoothEase,
                }}
              >
                <Image
                  src="/process.png"
                  alt="Proceso de trabajo"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 220px, 260px"
                  priority
                />
              </motion.div>
              {/* Subtle overlay that changes with step */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-tr from-secondary/10 to-transparent"
                animate={{
                  opacity: activeStep * 0.15,
                }}
                transition={{ duration: 0.5, ease: smoothEase }}
              />
            </motion.div>

            {/* Primary Badge */}
            <div className="flex items-center flex-shrink-0">
              <motion.div
                className="w-3 h-3 rounded-full bg-secondary"
                animate={{ scale: activeStep === 0 ? 1.2 : 1 }}
                transition={{ duration: 0.3, ease: smoothEase }}
              />
              <div className="w-4 h-0.5 bg-secondary" />
              <motion.div
                className="bg-white rounded-full px-4 py-2.5 shadow-md border border-gray-200"
                animate={{
                  scale: activeStep === 0 ? 1.02 : 1,
                  boxShadow:
                    activeStep === 0
                      ? "0 8px 25px -5px rgba(0, 0, 0, 0.15)"
                      : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                transition={{ duration: 0.4, ease: smoothEase }}
              >
                <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">
                  Workshop Estratégico
                </span>
              </motion.div>

              {/* Connection line to secondary - unified AnimatePresence */}
              <AnimatePresence mode="popLayout">
                {activeStep >= 1 && (
                  <motion.div
                    key="connection-line-1"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 24, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{
                      duration: 0.35,
                      ease: smoothEase,
                    }}
                    className="h-0.5 bg-secondary origin-left"
                  />
                )}
              </AnimatePresence>
              <AnimatePresence mode="popLayout">
                {activeStep >= 1 && (
                  <motion.div
                    key="dot-1"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: direction > 0 ? 0.1 : 0,
                      ease: smoothEase,
                    }}
                    className="w-3 h-3 rounded-full bg-secondary flex-shrink-0"
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Secondary Badges */}
            <AnimatePresence mode="popLayout">
              {activeStep >= 1 && (
                <motion.div
                  key="secondary-badges"
                  initial={{
                    opacity: 0,
                    x: direction > 0 ? -40 : 40,
                    scale: 0.95,
                  }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{
                    opacity: 0,
                    x: direction > 0 ? 40 : -40,
                    scale: 0.95,
                  }}
                  transition={{
                    duration: 0.4,
                    ease: smoothEase,
                  }}
                  className="flex flex-col gap-2 flex-shrink-0"
                >
                  {secondaryBadges.map((badge, index) => (
                    <motion.div
                      key={badge.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: 0.05 + index * 0.06,
                        ease: smoothEase,
                      }}
                      className="bg-white rounded-lg px-4 py-2.5 shadow-md border border-gray-200"
                    >
                      <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">
                        {badge.label}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Connection to cards */}
            <AnimatePresence mode="popLayout">
              {activeStep >= 2 && (
                <motion.div
                  key="connection-line-2"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 24, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{
                    duration: 0.35,
                    ease: smoothEase,
                  }}
                  className="h-0.5 bg-secondary flex-shrink-0 origin-left"
                />
              )}
            </AnimatePresence>
            <AnimatePresence mode="popLayout">
              {activeStep >= 2 && (
                <motion.div
                  key="dot-2"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: direction > 0 ? 0.1 : 0,
                    ease: smoothEase,
                  }}
                  className="w-3 h-3 rounded-full bg-secondary flex-shrink-0"
                />
              )}
            </AnimatePresence>

            {/* Detail Cards */}
            <AnimatePresence mode="popLayout">
              {activeStep >= 2 && (
                <motion.div
                  key="detail-cards"
                  initial={{
                    opacity: 0,
                    x: direction > 0 ? -40 : 40,
                    scale: 0.95,
                  }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{
                    opacity: 0,
                    x: direction > 0 ? 40 : -40,
                    scale: 0.95,
                  }}
                  transition={{
                    duration: 0.4,
                    ease: smoothEase,
                  }}
                  className="flex flex-col gap-3 flex-shrink-0"
                >
                  {detailCards.map((card, index) => (
                    <motion.div
                      key={card.title}
                      initial={{ opacity: 0, y: 15, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.05 + index * 0.07,
                        ease: smoothEase,
                      }}
                      className="bg-white rounded-xl p-3 shadow-md border border-gray-200 w-[180px]"
                    >
                      <h4 className="text-sm font-bold text-gray-900 mb-1.5">
                        {card.title}
                      </h4>
                      <span
                        className={`inline-block px-2 py-0.5 text-xs font-medium text-white rounded ${card.tagColor}`}
                      >
                        {card.tag}
                      </span>
                      <div className="mt-2 space-y-1.5">
                        <div className="h-1.5 bg-gray-200 rounded-full w-full" />
                        <div className="h-1.5 bg-gray-200 rounded-full w-4/5" />
                        <div className="flex gap-1.5">
                          <div className="h-1.5 bg-gray-100 rounded-full w-3/5" />
                          <div className="h-1.5 bg-gray-100 rounded-full w-2/5" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden flex flex-col items-center h-full">
            {/* Image + Badge row */}
            <div className="flex items-center gap-4 mb-6">
              <motion.div
                className="relative w-[140px] h-[180px] rounded-xl overflow-hidden flex-shrink-0"
                animate={{
                  scale: 1 + activeStep * 0.02,
                }}
                transition={{ duration: 0.5, ease: smoothEase }}
              >
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    scale: 1 + activeStep * 0.04,
                  }}
                  transition={{ duration: 0.6, ease: smoothEase }}
                >
                  <Image
                    src="/process.png"
                    alt="Proceso de trabajo"
                    fill
                    className="object-cover object-center"
                    sizes="140px"
                    priority
                  />
                </motion.div>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-tr from-secondary/10 to-transparent"
                  animate={{ opacity: activeStep * 0.15 }}
                  transition={{ duration: 0.4, ease: smoothEase }}
                />
              </motion.div>

              <div className="flex flex-col gap-2">
                {/* Primary Badge */}
                <div className="flex items-center">
                  <motion.div
                    className="w-2.5 h-2.5 rounded-full bg-secondary"
                    animate={{ scale: activeStep === 0 ? 1.2 : 1 }}
                    transition={{ duration: 0.3, ease: smoothEase }}
                  />
                  <div className="w-3 h-0.5 bg-secondary" />
                  <motion.div
                    className="bg-white rounded-full px-3 py-2 shadow-md border border-gray-200"
                    animate={{
                      scale: activeStep === 0 ? 1.02 : 1,
                    }}
                    transition={{ duration: 0.3, ease: smoothEase }}
                  >
                    <span className="text-xs font-semibold text-gray-800">
                      Workshop Estratégico
                    </span>
                  </motion.div>
                </div>

                {/* Secondary Badges - Mobile */}
                <AnimatePresence mode="popLayout">
                  {activeStep >= 1 && (
                    <motion.div
                      key="mobile-secondary-badges"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease: smoothEase }}
                      className="flex flex-col gap-1.5 pl-5 overflow-hidden"
                    >
                      {secondaryBadges.map((badge, index) => (
                        <motion.div
                          key={badge.label}
                          initial={{ opacity: 0, x: direction > 0 ? -15 : 15 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.35,
                            delay: 0.05 + index * 0.06,
                            ease: smoothEase,
                          }}
                          className="bg-white rounded-lg px-3 py-1.5 shadow-sm border border-gray-200"
                        >
                          <span className="text-xs font-medium text-gray-700">
                            {badge.label}
                          </span>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Detail Cards - Mobile */}
            <AnimatePresence mode="popLayout">
              {activeStep >= 2 && (
                <motion.div
                  key="mobile-detail-cards"
                  initial={{
                    opacity: 0,
                    y: direction > 0 ? 25 : -25,
                    scale: 0.95,
                  }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{
                    opacity: 0,
                    y: direction > 0 ? -25 : 25,
                    scale: 0.95,
                  }}
                  transition={{ duration: 0.4, ease: smoothEase }}
                  className="grid grid-cols-3 gap-2 w-full"
                >
                  {detailCards.map((card, index) => (
                    <motion.div
                      key={card.title}
                      initial={{ opacity: 0, scale: 0.92, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: 0.05 + index * 0.06,
                        ease: smoothEase,
                      }}
                      className="bg-white rounded-lg p-2.5 shadow-md border border-gray-200"
                    >
                      <h4 className="text-xs font-bold text-gray-900 mb-1 line-clamp-1">
                        {card.title}
                      </h4>
                      <span
                        className={`inline-block px-1.5 py-0.5 text-[10px] font-medium text-white rounded ${card.tagColor}`}
                      >
                        {card.tag}
                      </span>
                      <div className="mt-2 space-y-1">
                        <div className="h-1 bg-gray-200 rounded-full w-full" />
                        <div className="h-1 bg-gray-100 rounded-full w-3/4" />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step Description - Mobile */}
            <AnimatePresence mode="popLayout">
              <motion.div
                key={`desc-${activeStep}`}
                initial={{ opacity: 0, y: direction > 0 ? 15 : -15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: direction > 0 ? -15 : 15 }}
                transition={{ duration: 0.4, ease: smoothEase }}
                className="mt-6 text-center px-4"
              >
                <p className="text-sm text-gray-600 leading-relaxed">
                  {steps[activeStep]?.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Desktop Steps Navigation - Bottom */}
        <div className="hidden md:block border-t border-gray-200 pt-10">
          <div className="grid grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <button
                key={step.id}
                type="button"
                onClick={() => handleStepChange(index)}
                className="text-left group relative"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                      activeStep === index
                        ? "bg-secondary text-white shadow-md shadow-secondary/25"
                        : "bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-600"
                    }`}
                  >
                    <step.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`text-base font-semibold mb-1 transition-colors duration-500 ${
                        activeStep === index
                          ? "text-gray-900"
                          : "text-gray-500 group-hover:text-gray-700"
                      }`}
                    >
                      {step.fullTitle}
                    </h4>
                    <p
                      className={`text-sm line-clamp-3 transition-colors duration-500 ${
                        activeStep === index
                          ? "text-gray-600"
                          : "text-gray-400 group-hover:text-gray-500"
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
