"use client";

import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { Check } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

export function PricingSection() {
  const { t, locale } = useTranslation("landing");
  const [isAnnual, setIsAnnual] = useState(true);

  // Get pricing plans from translations - need to access directly
  const pricingPlans = useMemo(() => {
    interface PricingPlanData {
      name: string;
      monthlyPrice: string;
      annualPrice: string;
      description: string;
      features: string[];
      buttonText: string;
    }
    interface PricingPlans {
      basic: PricingPlanData;
      professional: PricingPlanData;
      enterprise: PricingPlanData;
    }
    const getPricingPlans = () => {
      const translations: Record<string, PricingPlans> = {
        es: {
          basic: {
            name: "Básico",
            monthlyPrice: "$29",
            annualPrice: "$19",
            description: "Perfecto para usuarios individuales",
            features: [
              "Hasta 100 usuarios",
              "2 integraciones básicas",
              "Dashboard estándar",
              "Soporte por email",
              "Almacenamiento 1GB",
              "API básica",
            ],
            buttonText: "Comenzar",
          },
          professional: {
            name: "Profesional",
            monthlyPrice: "$99",
            annualPrice: "$79",
            description: "Ideal para equipos pequeños",
            features: [
              "Hasta 1,000 usuarios",
              "10 integraciones",
              "Dashboard avanzado",
              "Soporte prioritario",
              "Almacenamiento 10GB",
              "Sistema RBAC básico",
              "Analytics avanzado",
              "API completa",
            ],
            buttonText: "Únete Ahora",
          },
          enterprise: {
            name: "Empresarial",
            monthlyPrice: "$299",
            annualPrice: "$239",
            description: "Para organizaciones grandes",
            features: [
              "Usuarios ilimitados",
              "Integraciones ilimitadas",
              "Dashboard personalizado",
              "Soporte 24/7",
              "Almacenamiento ilimitado",
              "RBAC completo",
              "API personalizada",
              "White-label disponible",
              "SLA garantizado",
            ],
            buttonText: "Contactar Ventas",
          },
        },
        en: {
          basic: {
            name: "Basic",
            monthlyPrice: "$29",
            annualPrice: "$19",
            description: "Perfect for individual users",
            features: [
              "Up to 100 users",
              "2 basic integrations",
              "Standard dashboard",
              "Email support",
              "1GB storage",
              "Basic API",
            ],
            buttonText: "Get Started",
          },
          professional: {
            name: "Professional",
            monthlyPrice: "$99",
            annualPrice: "$79",
            description: "Ideal for small teams",
            features: [
              "Up to 1,000 users",
              "10 integrations",
              "Advanced dashboard",
              "Priority support",
              "10GB storage",
              "Basic RBAC system",
              "Advanced analytics",
              "Full API",
            ],
            buttonText: "Join Now",
          },
          enterprise: {
            name: "Enterprise",
            monthlyPrice: "$299",
            annualPrice: "$239",
            description: "For large organizations",
            features: [
              "Unlimited users",
              "Unlimited integrations",
              "Custom dashboard",
              "24/7 support",
              "Unlimited storage",
              "Full RBAC",
              "Custom API",
              "White-label available",
              "Guaranteed SLA",
            ],
            buttonText: "Contact Sales",
          },
        },
        pt: {
          basic: {
            name: "Básico",
            monthlyPrice: "$29",
            annualPrice: "$19",
            description: "Perfeito para usuários individuais",
            features: [
              "Até 100 usuários",
              "2 integrações básicas",
              "Dashboard padrão",
              "Suporte por email",
              "Armazenamento 1GB",
              "API básica",
            ],
            buttonText: "Começar",
          },
          professional: {
            name: "Profissional",
            monthlyPrice: "$99",
            annualPrice: "$79",
            description: "Ideal para equipes pequenas",
            features: [
              "Até 1.000 usuários",
              "10 integrações",
              "Dashboard avançado",
              "Suporte prioritário",
              "Armazenamento 10GB",
              "Sistema RBAC básico",
              "Análise avançada",
              "API completa",
            ],
            buttonText: "Juntar-se Agora",
          },
          enterprise: {
            name: "Empresarial",
            monthlyPrice: "$299",
            annualPrice: "$239",
            description: "Para grandes organizações",
            features: [
              "Usuários ilimitados",
              "Integrações ilimitadas",
              "Dashboard personalizado",
              "Suporte 24/7",
              "Armazenamento ilimitado",
              "RBAC completo",
              "API personalizada",
              "White-label disponível",
              "SLA garantido",
            ],
            buttonText: "Contatar Vendas",
          },
        },
      };

      const plans = translations[locale] || translations.es;
      if (!plans) {
        return [];
      }

      return [
        {
          name: plans.basic.name,
          monthlyPrice: plans.basic.monthlyPrice,
          annualPrice: plans.basic.annualPrice,
          description: plans.basic.description,
          features: plans.basic.features,
          buttonText: plans.basic.buttonText,
          buttonClass:
            "bg-zinc-300 shadow-[0px_1px_1px_-0.5px_rgba(16,24,40,0.20)] outline outline-0.5 outline-[#1e29391f] outline-offset-[-0.5px] text-gray-800 text-shadow-[0px_1px_1px_rgba(16,24,40,0.08)] hover:bg-zinc-400",
        },
        {
          name: plans.professional.name,
          monthlyPrice: plans.professional.monthlyPrice,
          annualPrice: plans.professional.annualPrice,
          description: plans.professional.description,
          features: plans.professional.features,
          buttonText: plans.professional.buttonText,
          buttonClass:
            "bg-primary-foreground shadow-[0px_1px_1px_-0.5px_rgba(16,24,40,0.20)] text-primary text-shadow-[0px_1px_1px_rgba(16,24,40,0.08)] hover:bg-primary-foreground/90",
          popular: true,
        },
        {
          name: plans.enterprise.name,
          monthlyPrice: plans.enterprise.monthlyPrice,
          annualPrice: plans.enterprise.annualPrice,
          description: plans.enterprise.description,
          features: plans.enterprise.features,
          buttonText: plans.enterprise.buttonText,
          buttonClass:
            "bg-secondary shadow-[0px_1px_1px_-0.5px_rgba(16,24,40,0.20)] text-secondary-foreground text-shadow-[0px_1px_1px_rgba(16,24,40,0.08)] hover:bg-secondary/90",
        },
      ];
    };

    return getPricingPlans();
  }, [locale]);

  return (
    <section className="w-full overflow-hidden flex flex-col justify-start items-center py-16 md:py-20 lg:py-24 bg-gradient-to-br from-[#131B2F] via-[#0F172A] to-[#1E293B] relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('/images/large-card-background.svg')] opacity-5 bg-cover bg-center" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16 lg:mb-20">
          {/* Subtle accent line */}
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto mb-6 md:mb-8" />

          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-tight mb-4 md:mb-6 tracking-tight">
            {t("pricing.title")}
            <br />
            <span className="font-medium text-white">
              {t("pricing.titleHighlight")}
            </span>
          </h2>
          <p className="text-gray-300 text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto font-light">
            {t("pricing.subtitle")}
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex justify-center mb-12">
          <div className="p-1 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isAnnual
                  ? "bg-white text-gray-900 shadow-lg"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              {t("pricing.annual")}
              <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                {t("pricing.discount")}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                !isAnnual
                  ? "bg-white text-gray-900 shadow-lg"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              {t("pricing.monthly")}
            </button>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-6 sm:p-8 rounded-2xl flex flex-col transition-all duration-300 hover:scale-105 ${
                plan.popular
                  ? "bg-gradient-to-br from-primary to-primary/80 shadow-2xl shadow-primary/25 border-2 border-primary/50"
                  : "bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10"
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-primary to-primary/80 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    {t("pricing.mostPopular")}
                  </div>
                </div>
              )}

              {/* Plan name */}
              <div className="text-center mb-6">
                <h3
                  className={`text-2xl font-bold ${plan.popular ? "text-primary-foreground" : "text-white"}`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`mt-2 text-sm ${plan.popular ? "text-primary-foreground/80" : "text-gray-300"}`}
                >
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2">
                  <div
                    className={`relative text-5xl font-bold ${plan.popular ? "text-primary-foreground" : "text-white"}`}
                  >
                    <span className="invisible">
                      {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    <span
                      className="absolute inset-0 flex items-center justify-center transition-all duration-500"
                      style={{
                        opacity: isAnnual ? 1 : 0,
                        transform: `scale(${isAnnual ? 1 : 0.8})`,
                        filter: `blur(${isAnnual ? 0 : 4}px)`,
                      }}
                      aria-hidden={!isAnnual}
                    >
                      {plan.annualPrice}
                    </span>
                    <span
                      className="absolute inset-0 flex items-center justify-center transition-all duration-500"
                      style={{
                        opacity: !isAnnual ? 1 : 0,
                        transform: `scale(${!isAnnual ? 1 : 0.8})`,
                        filter: `blur(${!isAnnual ? 0 : 4}px)`,
                      }}
                      aria-hidden={isAnnual}
                    >
                      {plan.monthlyPrice}
                    </span>
                  </div>
                  <span
                    className={`text-lg ${plan.popular ? "text-primary-foreground/70" : "text-gray-300"}`}
                  >
                    {t("pricing.perMonth")}
                  </span>
                </div>
                {isAnnual && (
                  <p
                    className={`text-sm mt-2 ${plan.popular ? "text-primary-foreground/60" : "text-gray-400"}`}
                  >
                    {t("pricing.billedAnnually")}
                  </p>
                )}
              </div>

              {/* CTA Button */}
              <div className="mb-8">
                <Link href="/signup" className="block">
                  <Button
                    className={`w-full py-4 rounded-xl font-semibold text-base transition-all duration-200 ${
                      plan.popular
                        ? "bg-white text-primary hover:bg-gray-100 shadow-lg"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                  >
                    {plan.buttonText}
                  </Button>
                </Link>
              </div>

              {/* Features */}
              <div className="flex-1">
                <h4
                  className={`text-sm font-semibold mb-4 ${plan.popular ? "text-primary-foreground/80" : "text-gray-300"}`}
                >
                  {plan.name === t("pricing.plans.basic.name") ||
                  plan.name === "Basic" ||
                  plan.name === "Básico"
                    ? t("pricing.includes")
                    : t("pricing.includesMore")}
                </h4>
                <div className="space-y-3">
                  {plan.features.map((feature: string) => (
                    <div key={feature} className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                          plan.popular
                            ? "bg-primary-foreground/20"
                            : "bg-primary/20"
                        }`}
                      >
                        <Check
                          className={`w-3 h-3 ${plan.popular ? "text-primary-foreground" : "text-primary"}`}
                          strokeWidth={2.5}
                        />
                      </div>
                      <span
                        className={`text-sm ${plan.popular ? "text-primary-foreground" : "text-gray-200"}`}
                      >
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
