"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslation } from "@/hooks/useTranslation";

export function FAQSection() {
  const { t, locale } = useTranslation("landing");

  // Get FAQ items directly from translations
  interface FAQItem {
    q: string;
    a: string;
  }
  const getFAQItems = (): FAQItem[] => {
    const translations: Record<string, FAQItem[]> = {
      es: [
        {
          q: "¿Cómo funciona la gestión de usuarios?",
          a: "Nuestro sistema permite crear, gestionar y organizar usuarios con diferentes roles y permisos de manera sencilla y eficiente.",
        },
        {
          q: "¿Qué integraciones están disponibles?",
          a: "Soportamos más de 50 integraciones populares incluyendo APIs de terceros, servicios de autenticación, y herramientas de análisis.",
        },
        {
          q: "¿Cuál es el rendimiento de la plataforma?",
          a: "Nuestra plataforma ofrece un rendimiento optimizado con tiempos de respuesta menores a 100ms en planes Básico y menores a 50ms en planes superiores.",
        },
        {
          q: "¿Puedo gestionar permisos de equipo?",
          a: "Sí, nuestro sistema RBAC (Control de Acceso Basado en Roles) permite configurar permisos granulares para miembros del equipo.",
        },
        {
          q: "¿Hay prueba gratuita?",
          a: "Sí, todos los planes incluyen 14 días de prueba gratuita sin tarjeta de crédito. Puedes cancelar cuando quieras.",
        },
        {
          q: "¿Qué opciones de soporte están disponibles?",
          a: "Ofrecemos soporte por email en Básico, soporte prioritario en Profesional, y soporte dedicado 24/7 en planes Empresarial.",
        },
      ],
      en: [
        {
          q: "How does user management work?",
          a: "Our system allows you to create, manage and organize users with different roles and permissions easily and efficiently.",
        },
        {
          q: "What integrations are available?",
          a: "We support over 50 popular integrations including third-party APIs, authentication services, and analytics tools.",
        },
        {
          q: "What is the platform performance?",
          a: "Our platform offers optimized performance with response times under 100ms on Basic plans and under 50ms on higher plans.",
        },
        {
          q: "Can I manage team permissions?",
          a: "Yes, our RBAC (Role-Based Access Control) system allows you to configure granular permissions for team members.",
        },
        {
          q: "Is there a free trial?",
          a: "Yes, all plans include a 14-day free trial with no credit card required. You can cancel anytime.",
        },
        {
          q: "What support options are available?",
          a: "We offer email support on Basic, priority support on Professional, and dedicated 24/7 support on Enterprise plans.",
        },
      ],
      pt: [
        {
          q: "Como funciona o gerenciamento de usuários?",
          a: "Nosso sistema permite criar, gerenciar e organizar usuários com diferentes funções e permissões de forma simples e eficiente.",
        },
        {
          q: "Quais integrações estão disponíveis?",
          a: "Suportamos mais de 50 integrações populares, incluindo APIs de terceiros, serviços de autenticação e ferramentas de análise.",
        },
        {
          q: "Qual é o desempenho da plataforma?",
          a: "Nossa plataforma oferece desempenho otimizado com tempos de resposta inferiores a 100ms em planos Básicos e inferiores a 50ms em planos superiores.",
        },
        {
          q: "Posso gerenciar permissões da equipe?",
          a: "Sim, nosso sistema RBAC (Controle de Acesso Baseado em Funções) permite configurar permissões granulares para membros da equipe.",
        },
        {
          q: "Há teste gratuito?",
          a: "Sim, todos os planos incluem 14 dias de teste gratuito sem cartão de crédito. Você pode cancelar a qualquer momento.",
        },
        {
          q: "Quais opções de suporte estão disponíveis?",
          a: "Oferecemos suporte por email no Básico, suporte prioritário no Profissional e suporte dedicado 24/7 em planos Empresariais.",
        },
      ],
    };
    return translations[locale] ?? translations.es ?? [];
  };

  const faqs = getFAQItems() || [];

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-16 md:py-20 lg:py-24 bg-white dark:bg-background">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12 md:mb-16 lg:mb-20">
          {/* Subtle accent line */}
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6 md:mb-8" />

          <h2 className="text-gray-900 dark:text-foreground text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-tight mb-4 md:mb-6 tracking-tight">
            {t("faq.title")}
            <br />
            <span className="font-medium text-primary">
              {t("faq.titleHighlight")}
            </span>
          </h2>
          <p className="text-gray-600 dark:text-muted-foreground text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-light">
            {t("faq.subtitle")}
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-3">
          {faqs.map((faq: FAQItem) => (
            <AccordionItem
              key={faq.q}
              value={faq.q}
              className="bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl px-4 sm:px-6 py-2 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-200"
            >
              <AccordionTrigger className="text-gray-900 dark:text-foreground hover:text-primary transition-colors text-left font-medium py-3 sm:py-4 hover:no-underline text-sm sm:text-base">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 dark:text-muted-foreground pb-3 sm:pb-4 leading-relaxed text-sm sm:text-base">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
