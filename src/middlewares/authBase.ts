import { auth } from "@/lib/auth";
import {
  hasAllPermissions,
  hasAnyPermission,
  hasAnyRole,
  hasPermission,
  hasRole,
} from "@/services/rbacService";
import type {
  PermissionAction,
  PermissionCheck,
  PermissionResource,
} from "@/types/rbac";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Create authentication middleware
 */
export function createAuthMiddleware() {
  return async (req: NextRequest) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers,
      });

      if (!session?.user) {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );
      }

      return { user: session.user };
    } catch (error) {
      console.error("Auth middleware error:", error);
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 }
      );
    }
  };
}

/**
 * Create permission middleware
 */
export function createPermissionMiddleware(
  action: PermissionAction,
  resource: PermissionResource
) {
  return async (req: NextRequest) => {
    const authResult = await createAuthMiddleware()(req);

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;

    try {
      // Extract tenantId from session user (avoids extra DB query)
      const userWithTenant = user as typeof user & { tenantId?: string };
      const tenantId = userWithTenant.tenantId;

      if (!tenantId) {
        return NextResponse.json(
          { error: "User tenant not found" },
          { status: 403 }
        );
      }

      const userHasPermission = await hasPermission(
        user.id,
        action,
        resource,
        tenantId
      );

      if (!userHasPermission) {
        return NextResponse.json(
          { error: "Insufficient permissions" },
          { status: 403 }
        );
      }

      return { user };
    } catch (error) {
      console.error("Permission check error:", error);
      return NextResponse.json(
        { error: "Permission check failed" },
        { status: 500 }
      );
    }
  };
}

/**
 * Create multi-permission middleware
 */
export function createMultiPermissionMiddleware(
  permissionChecks: PermissionCheck[],
  requireAll = false
) {
  return async (req: NextRequest) => {
    const authResult = await createAuthMiddleware()(req);

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;

    try {
      // Extract tenantId from session user (avoids extra DB query)
      const userWithTenant = user as typeof user & { tenantId?: string };
      const tenantId = userWithTenant.tenantId;

      if (!tenantId) {
        return NextResponse.json(
          { error: "User tenant not found" },
          { status: 403 }
        );
      }

      let hasPermission = false;

      if (requireAll) {
        hasPermission = await hasAllPermissions(
          user.id,
          permissionChecks,
          tenantId
        );
      } else {
        hasPermission = await hasAnyPermission(
          user.id,
          permissionChecks,
          tenantId
        );
      }

      if (!hasPermission) {
        return NextResponse.json(
          { error: "Insufficient permissions" },
          { status: 403 }
        );
      }

      return { user };
    } catch (error) {
      console.error("Multi-permission check error:", error);
      return NextResponse.json(
        { error: "Permission check failed" },
        { status: 500 }
      );
    }
  };
}

/**
 * Create role middleware
 */
export function createRoleMiddleware(roleName: string) {
  return async (req: NextRequest) => {
    const authResult = await createAuthMiddleware()(req);

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;

    try {
      // Extract tenantId from session user (avoids extra DB query)
      const userWithTenant = user as typeof user & { tenantId?: string };
      const tenantId = userWithTenant.tenantId;

      if (!tenantId) {
        return NextResponse.json(
          { error: "User tenant not found" },
          { status: 403 }
        );
      }

      const userHasRole = await hasRole(user.id, roleName, tenantId);

      if (!userHasRole) {
        return NextResponse.json(
          { error: "Insufficient role permissions" },
          { status: 403 }
        );
      }

      return { user };
    } catch (error) {
      console.error("Role check error:", error);
      return NextResponse.json({ error: "Role check failed" }, { status: 500 });
    }
  };
}

/**
 * Create any role middleware - checks if user has any of the specified roles
 */
export function createAnyRoleMiddleware(roleNames: string[]) {
  return async (req: NextRequest) => {
    const authResult = await createAuthMiddleware()(req);

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;

    try {
      // Extract tenantId from session user (avoids extra DB query)
      const userWithTenant = user as typeof user & { tenantId?: string };
      const tenantId = userWithTenant.tenantId;

      if (!tenantId) {
        return NextResponse.json(
          { error: "User tenant not found" },
          { status: 403 }
        );
      }

      const userHasRole = await hasAnyRole(user.id, roleNames, tenantId);

      if (!userHasRole) {
        return NextResponse.json(
          { error: "Insufficient role permissions" },
          { status: 403 }
        );
      }

      return { user };
    } catch (error) {
      console.error("Role check error:", error);
      return NextResponse.json({ error: "Role check failed" }, { status: 500 });
    }
  };
}
