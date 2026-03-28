"use client";

import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";
import { Building2, ExternalLink, Shield, Users } from "lucide-react";
import Link from "next/link";
import TenantInfo from "./TenantInfo";

interface AdminDashboardProps {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    tenantId?: string;
  } | null;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const { t } = useTranslation("dashboard");

  const adminSections = [
    {
      title: t("users"),
      description: t("usersDescription"),
      icon: <Users className="h-5 w-5" />,
      iconColor: "text-primary",
      bgColor: "bg-primary/10",
      href: "/dashboard/users",
    },
    {
      title: t("rolesPermissions"),
      description: t("rolesDescription"),
      icon: <Shield className="h-5 w-5" />,
      iconColor: "text-accent-foreground",
      bgColor: "bg-accent/20",
      href: "/dashboard/roles",
    },
    {
      title: t("companyInfo"),
      description: t("companyDescription"),
      icon: <Building2 className="h-5 w-5" />,
      iconColor: "text-secondary",
      bgColor: "bg-secondary/10",
      href: "/dashboard/company-info",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {t("adminPanel")}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5 mr-8">
            {t("adminWelcome", { name: user?.name || "Administrador" })}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <span className="text-sm font-medium text-foreground">
            {t("superAdmin")}
          </span>
        </div>
      </div>

      {/* Main Content - Vertical Layout */}
      <div className="space-y-6">
        {/* Tenant Information - Full Width */}
        {user?.tenantId && (
          <div className="w-full">
            <TenantInfo />
          </div>
        )}

        {/* Admin Sections - Grid below */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group relative overflow-hidden bg-card rounded-xl border border-border p-6 transition-all hover:border-primary/20 hover:shadow-md"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-start space-x-4 mb-4">
                  <div
                    className={`flex-shrink-0 rounded-lg p-3 ${section.bgColor}`}
                  >
                    <div className={section.iconColor}>{section.icon}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary mb-1 transition-colors">
                      {section.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {section.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-secondary/20">
                  <div className="flex items-center text-xs text-secondary/70">
                    <span>{t("manage")}</span>
                  </div>
                  <ExternalLink className="h-4 w-4 text-secondary group-hover:text-primary transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
