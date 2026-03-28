"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { trpc } from "@/utils/trpc";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

// Footer links will be translated via useTranslation hook

export function Footer() {
  const { data: companyInfo } = trpc.companyInfo.get.useQuery();
  const { locale } = useTranslation("common");
  const { t } = useTranslation("common");

  const footerLinks = {
    legal: [
      {
        name: t("termsAndConditions") || "Términos y Condiciones",
        href: "/legal/terms",
      },
      {
        name: t("privacyPolicy") || "Política de Privacidad",
        href: "/legal/privacy",
      },
      {
        name: t("cookiePolicy") || "Política de Cookies",
        href: "/legal/cookies",
      },
      {
        name: t("complaintsBook") || "Libro de Reclamaciones",
        href: "/legal/complaints",
      },
    ],
    support: [
      { name: t("helpCenter") || "Centro de Ayuda", href: "/help" },
      { name: t("documentation") || "Documentación", href: "/docs" },
      { name: t("api") || "API", href: "/api-docs" },
    ],
  };

  // Get translations for company name, displayName, and description
  const { data: nameTranslation } = trpc.translation.get.useQuery(
    {
      entityType: "tenant",
      entityId: companyInfo?.id || "",
      localeCode: locale,
      fieldName: "name",
    },
    { enabled: !!companyInfo?.id && locale !== "es" }
  );

  const { data: displayNameTranslation } = trpc.translation.get.useQuery(
    {
      entityType: "tenant",
      entityId: companyInfo?.id || "",
      localeCode: locale,
      fieldName: "displayName",
    },
    { enabled: !!companyInfo?.id && locale !== "es" }
  );

  const { data: descriptionTranslation } = trpc.translation.get.useQuery(
    {
      entityType: "tenant",
      entityId: companyInfo?.id || "",
      localeCode: locale,
      fieldName: "description",
    },
    { enabled: !!companyInfo?.id && locale !== "es" }
  );

  // Default values if no company info is available
  const defaultInfo = {
    name: "MyApp",
    displayName: "My Application Platform",
    description:
      "La plataforma líder para gestión de usuarios y autenticación.",
    email: null,
    phone: null,
    address: null,
    city: null,
    country: null,
    website: null,
    facebookUrl: null,
    twitterUrl: null,
    instagramUrl: null,
    linkedinUrl: null,
    youtubeUrl: null,
    foundedYear: null,
    logoUrl: null,
    faviconUrl: null,
    metaTitle: "MyApp - Modern Platform",
    metaDescription: "Plataforma moderna y escalable",
    metaKeywords: "gestión, usuarios, plataforma, moderno, escalable",
    termsUrl: "/legal/terms",
    privacyUrl: "/legal/privacy",
    cookiesUrl: "/legal/cookies",
    complaintsUrl: "/legal/complaints",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const baseInfo = companyInfo || defaultInfo;

  // Use translations if available, otherwise use base values
  const info = useMemo(
    () => ({
      ...baseInfo,
      name: nameTranslation || baseInfo.name,
      displayName: displayNameTranslation || baseInfo.displayName,
      description: descriptionTranslation || baseInfo.description,
    }),
    [baseInfo, nameTranslation, displayNameTranslation, descriptionTranslation]
  );

  const socialLinks = [
    { name: "Facebook", href: info.facebookUrl, icon: Facebook },
    { name: "Twitter", href: info.twitterUrl, icon: Twitter },
    { name: "Instagram", href: info.instagramUrl, icon: Instagram },
    { name: "LinkedIn", href: info.linkedinUrl, icon: Linkedin },
    { name: "YouTube", href: info.youtubeUrl, icon: Youtube },
  ].filter((link) => link.href);

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="AXIUM" className="h-10 w-auto" />
              <span className="text-2xl font-semibold text-white">AXIUM</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              Tu socio tecnológico de confianza. Desarrollamos software a medida
              que transforma procesos manuales en sistemas eficientes y
              escalables.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="h-4 w-4 text-blue-500" />
                <a
                  href="mailto:contacto@axium.com.pe"
                  className="hover:text-blue-400 transition-colors"
                >
                  contacto@axium.com.pe
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="h-4 w-4 text-blue-500" />
                <a
                  href="tel:+51999999999"
                  className="hover:text-blue-400 transition-colors"
                >
                  +51 999 999 999
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="h-4 w-4 text-blue-500" />
                <span>Lima, Perú</span>
              </div>
            </div>

            {/* Social Media */}
            {socialLinks.length > 0 && (
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-700 hover:bg-primary/10 border border-transparent hover:border-primary/20 rounded-lg transition-all duration-200"
                    aria-label={social.name}
                  >
                    <social.icon className="h-4 w-4 text-gray-300 hover:text-primary transition-colors" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#servicios"
                  className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Servicios
                </a>
              </li>
              <li>
                <a
                  href="#casos"
                  className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Casos de Éxito
                </a>
              </li>
              <li>
                <a
                  href="#como-trabajamos"
                  className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Cómo Trabajamos
                </a>
              </li>
              <li>
                <a
                  href="#contacto"
                  className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()}{" "}
              <span className="text-white font-medium">AXIUM</span>. Todos los
              derechos reservados.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link
                href="/legal/terms"
                className="hover:text-blue-400 transition-colors"
              >
                Términos
              </Link>
              <Link
                href="/legal/privacy"
                className="hover:text-blue-400 transition-colors"
              >
                Privacidad
              </Link>
              <Link
                href="/legal/cookies"
                className="hover:text-blue-400 transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
