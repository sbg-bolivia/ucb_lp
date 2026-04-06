"use client";

import { CoreTeamAdminSection } from "@/components/dashboard/CoreTeamAdminSection";
import { useTranslation } from "@/hooks/useTranslation";

export default function ClubEquipoAdminPage() {
  const { t } = useTranslation("dashboard");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          {t("clubPublicTeam")}
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {t("clubPublicTeamDesc")}
        </p>
      </div>
      <CoreTeamAdminSection />
    </div>
  );
}
