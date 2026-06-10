"use client";

import { useAuthContext } from "@/AuthContext";
import { useUser } from "@/hooks/useUser";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

interface RoleBasedRedirectProps {
  children: React.ReactNode;
}

const AUTH_ROUTES = ["/login", "/signup", "/forgot-password", "/reset-password"];

function isAuthRoute(pathname: string) {
  return AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export function RoleBasedRedirect({ children }: RoleBasedRedirectProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuthContext();
  const { canViewDashboard, isLoading: roleLoading } = useUser();

  useEffect(() => {
    if (authLoading || roleLoading || !pathname) return;

    if (isAuthenticated && isAuthRoute(pathname) && canViewDashboard) {
      router.replace("/dashboard");
    }
  }, [
    pathname,
    isAuthenticated,
    authLoading,
    roleLoading,
    canViewDashboard,
    router,
  ]);

  return <>{children}</>;
}
