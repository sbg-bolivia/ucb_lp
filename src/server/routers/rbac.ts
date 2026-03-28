import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  calculateOffset,
  createPaginatedResponse,
  paginationInputSchema,
} from "../../lib/pagination";
import {
  PermissionUncheckedCreateInputObjectZodSchema,
  RoleUncheckedCreateInputObjectZodSchema,
  RoleUncheckedUpdateInputObjectZodSchema,
} from "../../lib/zod/schemas";
import {
  assignPermissionToRole,
  assignRole,
  canAccessAdmin,
  canManageRoles,
  canManageUsers,
  canViewDashboard,
  createPermission,
  createRole,
  deleteRole,
  getAllPermissions,
  getAllRoles,
  getPermissionByActionAndResource,
  getRBACContext,
  getRoleByName,
  getRolePermissions,
  getUserPermissions,
  getUserRoles,
  hasPermission,
  hasPermissionOrManage,
  hasRole,
  isAdmin,
  isSuperAdmin,
  removePermissionFromRole,
  removeRole,
  updateRole,
} from "../../services/rbacService";
import { PermissionAction, PermissionResource } from "../../types/rbac";
import { adminProcedure, publicProcedure, router } from "../trpc";

export const rbacRouter = router({
  // Get all roles (simple array without pagination)
  getRoles: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user?.tenantId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User tenant not found",
      });
    }
    return await getAllRoles(ctx.user.tenantId);
  }),

  // Get all roles (with pagination)
  getAllRoles: publicProcedure
    .input(paginationInputSchema.optional())
    .query(async ({ input, ctx }) => {
      if (!ctx.user?.tenantId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User tenant not found",
        });
      }
      const roles = await getAllRoles(ctx.user.tenantId);

      if (!input) {
        // Si no hay paginación, devolver todos los roles en formato compatible
        return createPaginatedResponse(roles, roles.length, 1, roles.length);
      }

      const { page = 1, limit = 100 } = input;
      const offset = calculateOffset(page, limit);
      const paginatedRoles = roles.slice(offset, offset + limit);

      return createPaginatedResponse(paginatedRoles, roles.length, page, limit);
    }),

  // Get all permissions
  getAllPermissions: publicProcedure
    .input(paginationInputSchema.optional())
    .query(async ({ input, ctx }) => {
      if (!ctx.user?.tenantId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User tenant not found",
        });
      }
      const permissions = await getAllPermissions(ctx.user.tenantId);

      if (!input) {
        return createPaginatedResponse(
          permissions,
          permissions.length,
          1,
          permissions.length
        );
      }

      const { page = 1, limit = 100 } = input;
      const offset = calculateOffset(page, limit);
      const paginatedPermissions = permissions.slice(offset, offset + limit);

      return createPaginatedResponse(
        paginatedPermissions,
        permissions.length,
        page,
        limit
      );
    }),

  // Get permissions for a specific role
  getRolePermissions: publicProcedure
    .input(z.object({ roleId: z.string() }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user?.tenantId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User tenant not found",
        });
      }
      return await getRolePermissions(input.roleId, ctx.user.tenantId);
    }),

  // Get user roles
  getUserRoles: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user?.tenantId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User tenant not found",
        });
      }
      return await getUserRoles(input.userId, ctx.user.tenantId);
    }),

  // Get user permissions
  getUserPermissions: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user?.tenantId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User tenant not found",
        });
      }
      return await getUserPermissions(input.userId, ctx.user.tenantId);
    }),

  // Check user permission
  checkPermission: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        action: z.nativeEnum(PermissionAction),
        resource: z.nativeEnum(PermissionResource),
      })
    )
    .query(async ({ input, ctx }) => {
      if (!ctx.user?.tenantId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User tenant not found",
        });
      }
      return await hasPermission(
        input.userId,
        input.action,
        input.resource,
        ctx.user.tenantId
      );
    }),

  // Check user role
  checkRole: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        roleName: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      if (!ctx.user?.tenantId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User tenant not found",
        });
      }
      return await hasRole(input.userId, input.roleName, ctx.user.tenantId);
    }),

  // Create role
  createRole: adminProcedure
    .input(
      RoleUncheckedCreateInputObjectZodSchema.pick({
        name: true,
        displayName: true,
        description: true,
        isSystem: true,
      }).extend({
        name: z.string().min(1),
        displayName: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user?.tenantId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User tenant not found",
        });
      }

      // Check if user has permission to create roles
      if (ctx.user?.id) {
        const canCreateRole = await hasPermissionOrManage(
          ctx.user.id,
          PermissionAction.CREATE,
          PermissionResource.ROLE,
          ctx.user.tenantId
        );
        if (!canCreateRole) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Insufficient permissions to create roles",
          });
        }
      }

      return await createRole(
        {
          name: input.name,
          displayName: input.displayName,
          description: input.description ?? undefined,
          isSystem: input.isSystem ?? false,
        },
        ctx.user.tenantId
      );
    }),

  // Update role
  updateRole: adminProcedure
    .input(
      z
        .object({
          id: z.string(),
        })
        .merge(
          RoleUncheckedUpdateInputObjectZodSchema.pick({
            name: true,
            displayName: true,
            description: true,
            isSystem: true,
          }).partial()
        )
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user?.tenantId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User tenant not found",
        });
      }

      // Check if user has permission to update roles
      if (ctx.user?.id) {
        const canUpdateRole = await hasPermissionOrManage(
          ctx.user.id,
          PermissionAction.UPDATE,
          PermissionResource.ROLE,
          ctx.user.tenantId
        );
        if (!canUpdateRole) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Insufficient permissions to update roles",
          });
        }
      }

      const { id, ...updateData } = input;
      const processedData: {
        id: string;
        name?: string;
        displayName?: string;
        description?: string;
        isSystem?: boolean;
      } = {
        id,
      };

      if (updateData.name !== undefined) {
        processedData.name =
          typeof updateData.name === "string"
            ? updateData.name
            : updateData.name.set;
      }
      if (updateData.displayName !== undefined) {
        processedData.displayName =
          typeof updateData.displayName === "string"
            ? updateData.displayName
            : updateData.displayName.set;
      }
      if (updateData.description !== undefined) {
        if (updateData.description === null) {
          processedData.description = undefined;
        } else if (typeof updateData.description === "string") {
          processedData.description = updateData.description;
        } else if (updateData.description.set !== null) {
          processedData.description = updateData.description.set ?? undefined;
        } else {
          processedData.description = undefined;
        }
      }
      if (updateData.isSystem !== undefined) {
        processedData.isSystem =
          typeof updateData.isSystem === "boolean"
            ? updateData.isSystem
            : updateData.isSystem.set;
      }

      return await updateRole(processedData, ctx.user.tenantId);
    }),

  // Delete role
  deleteRole: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user?.tenantId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User tenant not found",
        });
      }

      // Check if user has permission to delete roles
      if (ctx.user?.id) {
        const canDeleteRole = await hasPermissionOrManage(
          ctx.user.id,
          PermissionAction.DELETE,
          PermissionResource.ROLE,
          ctx.user.tenantId
        );
        if (!canDeleteRole) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Insufficient permissions to delete roles",
          });
        }
      }

      return await deleteRole(input.id, ctx.user.tenantId);
    }),

  // Create permission
  createPermission: adminProcedure
    .input(
      PermissionUncheckedCreateInputObjectZodSchema.pick({
        action: true,
        resource: true,
        description: true,
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user?.tenantId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User tenant not found",
        });
      }

      // Check if user has permission to create permissions
      if (ctx.user?.id) {
        const canCreatePermission = await hasPermissionOrManage(
          ctx.user.id,
          PermissionAction.CREATE,
          PermissionResource.PERMISSION,
          ctx.user.tenantId
        );
        if (!canCreatePermission) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Insufficient permissions to create permissions",
          });
        }
      }

      return await createPermission(
        {
          action: input.action as PermissionAction,
          resource: input.resource as PermissionResource,
          description: input.description ?? undefined,
        },
        ctx.user.tenantId
      );
    }),

  // Assign role to user
  assignRole: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        roleId: z.string(),
        assignedBy: z.string().optional(),
        expiresAt: z.date().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user?.tenantId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User tenant not found",
        });
      }

      // Check if user has permission to assign roles
      if (ctx.user?.id) {
        const canAssignRole = await hasPermissionOrManage(
          ctx.user.id,
          PermissionAction.UPDATE,
          PermissionResource.ROLE,
          ctx.user.tenantId
        );
        if (!canAssignRole) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Insufficient permissions to assign roles",
          });
        }
      }

      return await assignRole(
        input.userId,
        input.roleId,
        input.assignedBy,
        input.expiresAt,
        ctx.user.tenantId
      );
    }),

  // Remove role from user
  removeRole: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        roleId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user?.tenantId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User tenant not found",
        });
      }

      // Check if user has permission to remove roles
      if (ctx.user?.id) {
        const canRemoveRole = await hasPermissionOrManage(
          ctx.user.id,
          PermissionAction.UPDATE,
          PermissionResource.ROLE,
          ctx.user.tenantId
        );
        if (!canRemoveRole) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Insufficient permissions to remove roles",
          });
        }
      }

      await removeRole(input.userId, input.roleId, ctx.user.tenantId);
      return { success: true };
    }),

  // Assign permission to role
  assignPermissionToRole: adminProcedure
    .input(
      z.object({
        roleId: z.string(),
        permissionId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user?.tenantId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User tenant not found",
        });
      }

      // Check if user has permission to manage roles
      if (ctx.user?.id) {
        const canManageRole = await hasPermissionOrManage(
          ctx.user.id,
          PermissionAction.UPDATE,
          PermissionResource.ROLE,
          ctx.user.tenantId
        );
        if (!canManageRole) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Insufficient permissions to manage role permissions",
          });
        }
      }

      await assignPermissionToRole(
        input.roleId,
        input.permissionId,
        ctx.user.tenantId
      );
      return { success: true };
    }),

  // Remove permission from role
  removePermissionFromRole: adminProcedure
    .input(
      z.object({
        roleId: z.string(),
        permissionId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user?.tenantId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User tenant not found",
        });
      }

      // Check if user has permission to manage roles
      if (ctx.user?.id) {
        const canManageRole = await hasPermissionOrManage(
          ctx.user.id,
          PermissionAction.UPDATE,
          PermissionResource.ROLE,
          ctx.user.tenantId
        );
        if (!canManageRole) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Insufficient permissions to manage role permissions",
          });
        }
      }

      await removePermissionFromRole(
        input.roleId,
        input.permissionId,
        ctx.user.tenantId
      );
      return { success: true };
    }),

  // Get role by name
  getRoleByName: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user?.tenantId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User tenant not found",
        });
      }
      return await getRoleByName(input.name, ctx.user.tenantId);
    }),

  // Get permission by action and resource
  getPermissionByActionAndResource: publicProcedure
    .input(
      z.object({
        action: z.nativeEnum(PermissionAction),
        resource: z.nativeEnum(PermissionResource),
      })
    )
    .query(async ({ input, ctx }) => {
      if (!ctx.user?.tenantId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User tenant not found",
        });
      }
      return await getPermissionByActionAndResource(
        input.action,
        input.resource,
        ctx.user.tenantId
      );
    }),

  // Check if user is admin
  isAdmin: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user?.tenantId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User tenant not found",
        });
      }
      return await isAdmin(input.userId, ctx.user.tenantId);
    }),

  // Check if user is super admin
  isSuperAdmin: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user?.tenantId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User tenant not found",
        });
      }
      return await isSuperAdmin(input.userId, ctx.user.tenantId);
    }),

  // Check if user can manage users
  canManageUsers: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user?.tenantId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User tenant not found",
        });
      }
      return await canManageUsers(input.userId, ctx.user.tenantId);
    }),

  // Check if user can manage roles
  canManageRoles: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user?.tenantId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User tenant not found",
        });
      }
      return await canManageRoles(input.userId, ctx.user.tenantId);
    }),

  // Check if user can access admin panel
  canAccessAdmin: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user?.tenantId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User tenant not found",
        });
      }
      return await canAccessAdmin(input.userId, ctx.user.tenantId);
    }),

  // Check if user can view dashboard
  canViewDashboard: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user?.tenantId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User tenant not found",
        });
      }
      return await canViewDashboard(input.userId, ctx.user.tenantId);
    }),

  // Get RBAC context for user
  getRBACContext: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user?.tenantId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User tenant not found",
        });
      }
      return await getRBACContext(input.userId, ctx.user.tenantId);
    }),
});
