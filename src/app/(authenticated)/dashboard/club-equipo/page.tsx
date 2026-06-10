"use client";

import { AdminPageHeader } from "@/components/dashboard/AdminPageHeader";
import { CoreTeamAdminSection } from "@/components/dashboard/CoreTeamAdminSection";
import { useTranslation } from "@/hooks/useTranslation";
import { Users } from "lucide-react";

export default function ClubEquipoAdminPage() {
  const { t } = useTranslation("dashboard");

  return (
    <div className="space-y-6">
      <AdminPageHeader
        icon={Users}
        title={t("clubPublicTeam")}
        description={t("clubPublicTeamDesc")}
      />
      <CoreTeamAdminSection />
    </div>
  );
}
