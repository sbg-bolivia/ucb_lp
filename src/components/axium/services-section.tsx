"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { useState } from "react";

const services = [
  {
    id: "software",
    label: "Software a Medida",
    title: "Software a Medida",
    description:
      "Desarrollamos soluciones enterprise-grade adaptadas a tu arquitectura de negocio, con integraciones nativas y escalabilidad garantizada.",
    benefits: [
      "Arquitectura personalizada",
      "Escalabilidad horizontal",
      "APIs integradas",
    ],
    image: "/service1.png",
    whatsappMessage:
      "Hola, me interesa conocer más sobre Software a Medida. Necesito una solución enterprise adaptada a mi negocio.",
  },
  {
    id: "web",
    label: "Aplicaciones Web",
    title: "Aplicaciones Web",
    description:
      "Construimos plataformas cloud-native con alta disponibilidad, seguridad de nivel enterprise y rendimiento optimizado para miles de usuarios concurrentes.",
    benefits: [
      "99.9% uptime garantizado",
      "Seguridad multi-capa",
      "Escalado automático",
    ],
    image: "/service2.png",
    whatsappMessage:
      "Hola, me interesa conocer más sobre Aplicaciones Web. Busco una plataforma cloud-native con alta disponibilidad.",
  },
  {
    id: "moviles",
    label: "Aplicaciones Móviles",
    title: "Aplicaciones Móviles",
    description:
      "Desarrollamos apps nativas e híbridas con tecnologías modernas que ofrecen experiencias fluidas en iOS y Android, con soporte offline completo.",
    benefits: [
      "Cross-platform optimizado",
      "UX/UI de clase mundial",
      "Sincronización offline",
    ],
    image: "/service3.png",
    whatsappMessage:
      "Hola, me interesa conocer más sobre Aplicaciones Móviles. Necesito una app para iOS y Android.",
  },
  {
    id: "automatizacion",
    label: "Automatización de Procesos",
    title: "Automatización de Procesos",
    description:
      "Implementamos workflows inteligentes que reducen tareas manuales hasta en un 80%, optimizando recursos y eliminando errores humanos.",
    benefits: [
      "Reducción de costos operativos",
      "Eficiencia aumentada",
      "Precisión del 99.9%",
    ],
    image: "/service4.png",
    whatsappMessage:
      "Hola, me interesa conocer más sobre Automatización de Procesos. Me gustaría saber cómo pueden ayudar a optimizar nuestros workflows.",
  },
  {
    id: "analitica-ia",
    label: "Analítica Predictiva e IA",
    title: "Analítica Predictiva e IA",
    description:
      "Transformamos tus datos en ventajas competitivas mediante modelos de machine learning que anticipan tendencias, optimizan decisiones estratégicas y maximizan el ROI con precisión del 85-95%.",
    benefits: [
      "Predicción de tendencias de mercado",
      "Optimización de decisiones estratégicas",
      "ROI medible desde el primer trimestre",
    ],
    image: "/service5.png",
    whatsappMessage:
      "Hola, me interesa conocer más sobre Analítica Predictiva e IA. Necesito convertir mis datos en ventaja competitiva.",
  },
  {
    id: "decisiones-ia",
    label: "Decisiones Inteligentes",
    title: "Decisiones Inteligentes",
    description:
      "Implementamos sistemas de inteligencia artificial que automatizan decisiones complejas, optimizan operaciones en tiempo real y generan ahorros del 30-50% mediante algoritmos de optimización avanzados.",
    benefits: [
      "Automatización de decisiones estratégicas",
      "Optimización en tiempo real",
      "Ahorros del 30-50% comprobables",
    ],
    image: "/service6.png",
    whatsappMessage:
      "Hola, me interesa conocer más sobre Decisiones Inteligentes. Busco optimizar decisiones complejas con IA.",
  },
];

export function ServicesSection() {
  const [activeTab, setActiveTab] = useState(services[0]?.id ?? "software");

  const handleWhatsApp = (message: string) => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/51991285679?text=${encodedMessage}`, "_blank");
  };

  return (
    <section
      id="servicios"
      className="py-20 md:py-28 md:pb-16 bg-white relative overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-secondary font-semibold text-sm uppercase tracking-wide">
            Nuestros Servicios
          </span>
          <h2 className="text-heading-2 text-gray-900 mt-3 mb-4">
            Soluciones Tecnológicas que{" "}
            <span className="bg-gradient-to-r from-[#0072CF] to-[#7ECFC3] bg-clip-text text-transparent">
              Transforman
            </span>{" "}
            Negocios
          </h2>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start bg-transparent p-0 h-auto border-b border-gray-200 rounded-none mb-12 overflow-x-auto scrollbar-hide">
            {services.map((service) => (
              <TabsTrigger
                key={service.id}
                value={service.id}
                className="relative px-3 sm:px-4 md:px-6 py-4 text-sm sm:text-base font-medium text-gray-700 data-[state=active]:text-gray-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-0 border-b-2 border-transparent data-[state=active]:border-b-secondary data-[state=active]:border-b-2 whitespace-nowrap flex-shrink-0"
              >
                {service.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tab Content */}
          {services.map((service) => (
            <TabsContent key={service.id} value={service.id} className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center">
                {/* Left Column - Text */}
                <div>
                  <h3 className="text-heading-2 text-gray-900 mb-6">
                    {service.title}
                  </h3>
                  <p className="text-body text-gray-600 mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-4 mb-8">
                    {service.benefits.map((benefit) => (
                      <li
                        key={benefit}
                        className="flex items-start text-body text-gray-700"
                      >
                        <svg
                          className="w-6 h-6 text-secondary mr-3 mt-0.5 flex-shrink-0"
                          fill="none"
                          strokeWidth="2"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          role="img"
                          aria-label="Check icon"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => handleWhatsApp(service.whatsappMessage)}
                    className="relative inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-[#0072CF] to-[#7ECFC3] text-white font-semibold rounded-lg overflow-hidden group transition-all duration-300 hover:shadow-xl hover:scale-105 hover:shadow-[#0072CF]/50"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-[#7ECFC3] to-[#0072CF] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10">
                      Consulta con un asesor
                    </span>
                  </button>
                </div>

                {/* Right Column - Image */}
                <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-lg overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
