"use client";

import { useAuthContext } from "@/AuthContext";
import { useUser } from "@/hooks/useUser";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

interface RoleBasedRedirectProps {
  children: React.ReactNode;
}

export function RoleBasedRedirect({ children }: RoleBasedRedirectProps) {
  const pathname = usePathname();
  const { isAuthenticated, loading: authLoading } = useAuthContext();
  const { primaryRole, isLoading: roleLoading } = useUser();

  useEffect(() => {
    // Temporarily disabled all redirections - allow free access to all routes
    console.log("RoleBasedRedirect: All redirections disabled for debugging", {
      primaryRole,
      pathname,
      isAuthenticated,
      authLoading,
      roleLoading,
    });

    // No redirections - allow access to all routes
    return;
  }, [primaryRole, pathname, isAuthenticated, authLoading, roleLoading]);

  // Show loading state while determining role
  if (authLoading || roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
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
    );
  }

  return <>{children}</>;
}
