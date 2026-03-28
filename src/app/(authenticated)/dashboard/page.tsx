"use client";

import { useAuthContext } from "@/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import ViewerDashboard from "@/components/dashboard/ViewerDashboard";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { useUser } from "@/hooks/useUser";
import type { AuthUser } from "@/types/user";
import Image from "next/image";

export default function DashboardPage() {
  const { t } = useTranslation("dashboard");
  const {
    user,
    isSuperAdmin,
    isAdmin,
    hasRole,
    canViewDashboard,
    isLoading,
    userRoles,
    userPermissions,
  } = useUser();

  // Mostrar loading mientras se cargan los permisos y perfil
  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <Image
                src="/logo.png"
                alt="Loading"
                fill
                className="object-contain animate-spin"
                style={{ animationDuration: "2s" }}
              />
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Verificar si el usuario tiene permisos para ver el dashboard
  if (!canViewDashboard && !isAdmin && !isSuperAdmin) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="text-center max-w-2xl w-full">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              {t("accessDenied")}
            </h1>
            <p className="text-muted-foreground mb-6">{t("noPermission")}</p>

            {/* Información del usuario */}
            <Card className="text-left">
              <CardHeader>
                <CardTitle className="text-lg">{t("accountInfo")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Tipo de usuario */}
                <div>
                  <span className="text-sm font-medium text-foreground">
                    {t("userType")}
                  </span>
                  <span className="ml-2 text-sm text-muted-foreground">
                    {t("standardUser")}
                  </span>
                </div>

                {/* Estado de confirmación */}
                <div>
                  <span className="text-sm font-medium text-foreground">
                    {t("accountStatus")}
                  </span>
                  <span
                    className={`ml-2 text-sm ${user?.emailVerified ? "text-secondary" : "text-destructive"}`}
                  >
                    {user?.emailVerified ? t("verified") : t("unverified")}
                  </span>
                </div>

                {/* Roles asignados */}
                <div>
                  <span className="text-sm font-medium text-foreground">
                    {t("assignedRoles")}
                  </span>
                  <div className="mt-1">
                    {userRoles.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {userRoles.map((role) => (
                          <Badge
                            key={role.id}
                            variant="outline"
                            className="rounded-full"
                          >
                            {role.displayName || role.name}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground italic">
                        {t("noRolesAssigned")}
                      </span>
                    )}
                  </div>
                </div>

                {/* Permisos disponibles */}
                <div>
                  <span className="text-sm font-medium text-foreground">
                    {t("availablePermissions")}
                  </span>
                  <div className="mt-1">
                    {userPermissions.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {userPermissions.slice(0, 5).map((permission) => (
                          <Badge
                            key={permission.id}
                            variant="secondary"
                            className="rounded-full"
                          >
                            {permission.action} {permission.resource}
                          </Badge>
                        ))}
                        {userPermissions.length > 5 && (
                          <Badge variant="outline" className="rounded-full">
                            +{userPermissions.length - 5} más
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground italic">
                        {t("noPermissionsAssigned")}
                      </span>
                    )}
                  </div>
                </div>

                {/* Aviso de acceso */}
                <div className="mt-6 p-4 bg-accent/10 border border-accent rounded-lg">
                  <p className="text-sm text-accent-foreground">
                    <strong>{t("needAccess")}</strong> {t("contactAdmin")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Adapter function to convert user data to expected dashboard user format
  const adaptUserForDashboard = (userData: unknown) => {
    if (!userData || typeof userData !== "object") return null;

    const user = userData as Record<string, unknown>;
    return {
      id: user.id as string,
      name: user.name as string,
      email: user.email as string,
      emailVerified: user.emailVerified as boolean,
      tenantId: user.tenantId as string | undefined,
    };
  };

  // Renderizar el dashboard apropiado según el rol del usuario
  if (isSuperAdmin || isAdmin) {
    return (
      <ProtectedRoute>
        <AdminDashboard user={adaptUserForDashboard(user)} />
      </ProtectedRoute>
    );
  }

  if (hasRole("viewer")) {
    return (
      <ProtectedRoute>
        <ViewerDashboard user={adaptUserForDashboard(user)} />
      </ProtectedRoute>
    );
  }

  // Dashboard por defecto para usuarios sin rol específico
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              {t("welcome", { name: user?.name || "Usuario" })}
            </h1>
            <p className="text-muted-foreground mb-8">{t("accountSetup")}</p>
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-lg">
                  {t("accountStatusTitle")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {user?.emailVerified
                    ? t("accountVerified")
                    : t("accountNeedsVerification")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
