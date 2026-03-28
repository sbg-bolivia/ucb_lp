import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../../lib/db";
import {
  calculateOffset,
  createPaginatedResponse,
  createSearchFilter,
  createSortOrder,
  paginationInputSchema,
} from "../../lib/pagination";
import {
  UserUncheckedCreateInputObjectZodSchema,
  UserUncheckedUpdateInputObjectZodSchema,
} from "../../lib/zod/schemas";
import { hasPermissionOrManage } from "../../services/rbacService";
import { PermissionAction, PermissionResource } from "../../types/rbac";
import { validateEmail } from "../../utils/validate";
import { protectedProcedure, router } from "../trpc";

export const userRouter = router({
  getAll: protectedProcedure
    .input(paginationInputSchema.optional())
    .query(async ({ input, ctx }) => {
      if (!ctx.user?.tenantId) {
        throw new Error("User tenant not found");
      }

      const {
        page = 1,
        limit = 100,
        search,
        sortBy,
        sortOrder = "desc",
      } = input || {};
      const offset = calculateOffset(page, limit);

      const searchFilter = createSearchFilter(search, ["email", "name"]);
      const orderBy = createSortOrder(sortBy, sortOrder);

      // Add tenant filter
      const whereClause = {
        ...searchFilter,
        tenantId: ctx.user.tenantId,
      };

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where: whereClause,
          select: {
            id: true,
            email: true,
            name: true,
            emailVerified: true,
            image: true,
            tenantId: true,
            createdAt: true,
            updatedAt: true,
            userRoles: {
              where: {
                OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
              },
              include: {
                role: true,
              },
              orderBy: {
                assignedAt: "desc",
              },
            },
          },
          orderBy,
          skip: offset,
          take: limit,
        }),
        prisma.user.count({
          where: whereClause,
        }),
      ]);

      return createPaginatedResponse(users, total, page, limit);
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user?.tenantId) {
        throw new Error("User tenant not found");
      }

      const user = await prisma.user.findUnique({
        where: {
          id: input.id,
          tenantId: ctx.user.tenantId,
        },
        select: {
          id: true,
          email: true,
          name: true,
          emailVerified: true,
          image: true,
          phone: true,
          language: true,
          tenantId: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      if (!user) throw new Error("Usuario no encontrado");
      return user;
    }),

  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const user = await prisma.user.findUnique({
      where: { id: ctx.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        image: true,
        phone: true,
        language: true,
        tenantId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) throw new Error("Usuario no encontrado");
    return user;
  }),

  update: protectedProcedure
    .input(
      z
        .object({
          id: z.string().optional(), // If not provided, updates current user
          password: z.string().min(6).optional(),
        })
        .merge(
          UserUncheckedUpdateInputObjectZodSchema.pick({
            name: true,
            email: true,
            phone: true,
            language: true,
          }).partial()
        )
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user?.tenantId) {
        throw new Error("User tenant not found");
      }

      const targetUserId = input.id || ctx.user.id;

      // Check permissions: users can edit themselves, admins can edit anyone
      if (input.id && input.id !== ctx.user.id) {
        const canManageUsers = await hasPermissionOrManage(
          ctx.user.id,
          PermissionAction.UPDATE,
          PermissionResource.USER,
          ctx.user.tenantId
        );

        if (!canManageUsers) {
          throw new Error("No tienes permisos para editar este usuario");
        }
      }

      const user = await prisma.user.findUnique({
        where: {
          id: targetUserId,
          tenantId: ctx.user.tenantId,
        },
      });
      if (!user) throw new Error("Usuario no encontrado");

      // Extract string values from input (handle union types from generated schema)
      const emailValue =
        typeof input.email === "string" ? input.email : undefined;
      const nameValue = typeof input.name === "string" ? input.name : undefined;
      const phoneValue =
        typeof input.phone === "string" ? input.phone : undefined;
      const languageValue =
        typeof input.language === "string" ? input.language : input.language;

      if (emailValue && !validateEmail(emailValue))
        throw new Error("Email inválido");

      // Check if email is already taken by another user in the same tenant
      if (emailValue && emailValue !== user.email) {
        const existingUser = await prisma.user.findFirst({
          where: {
            email: emailValue,
            tenantId: ctx.user.tenantId,
            id: { not: targetUserId },
          },
        });
        if (existingUser) throw new Error("Email ya registrado en este tenant");
      }

      // Prepare update data (exclude password - it's handled separately in Account table)
      const updateData: Prisma.UserUpdateInput = {};
      if (nameValue !== undefined) updateData.name = nameValue;
      if (emailValue !== undefined) updateData.email = emailValue;
      if (phoneValue !== undefined) updateData.phone = phoneValue;
      if (languageValue !== undefined) updateData.language = languageValue;

      // Handle password update if provided - passwords are stored in Account table
      if (input.password && input.password.trim() !== "") {
        const bcrypt = await import("bcryptjs");
        const hashedPassword = await bcrypt.hash(input.password, 10);

        // Update password in Account table (Better Auth stores passwords there)
        await prisma.account.updateMany({
          where: {
            userId: targetUserId,
            providerId: "credential",
          },
          data: {
            password: hashedPassword,
          },
        });
      }

      const updated = await prisma.user.update({
        where: { id: targetUserId },
        data: updateData,
        select: {
          id: true,
          email: true,
          name: true,
          emailVerified: true,
          image: true,
          phone: true,
          language: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return updated;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user?.tenantId) {
        throw new Error("User tenant not found");
      }

      // Check permissions: users can delete themselves, admins can delete anyone
      if (input.id !== ctx.user.id) {
        const canManageUsers = await hasPermissionOrManage(
          ctx.user.id,
          PermissionAction.DELETE,
          PermissionResource.USER,
          ctx.user.tenantId
        );

        if (!canManageUsers) {
          throw new Error("No tienes permisos para eliminar este usuario");
        }
      }

      const user = await prisma.user.findUnique({
        where: {
          id: input.id,
          tenantId: ctx.user.tenantId,
        },
      });
      if (!user) throw new Error("Usuario no encontrado");

      await prisma.user.delete({ where: { id: input.id } });
      return true;
    }),

  create: protectedProcedure
    .input(
      z
        .object({
          password: z
            .string()
            .min(6, "Contraseña debe tener al menos 6 caracteres"),
        })
        .merge(
          UserUncheckedCreateInputObjectZodSchema.pick({
            email: true,
            name: true,
            phone: true,
            language: true,
          })
        )
        .refine((data) => data.email && data.name, {
          message: "Email y nombre son requeridos",
        })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user?.tenantId) {
        throw new Error("User tenant not found");
      }

      // Check permissions: only admins can create users
      const canManageUsers = await hasPermissionOrManage(
        ctx.user.id,
        PermissionAction.CREATE,
        PermissionResource.USER,
        ctx.user.tenantId
      );

      if (!canManageUsers) {
        throw new Error("No tienes permisos para crear usuarios");
      }

      // Validate email format
      if (!validateEmail(input.email)) {
        throw new Error("Email inválido");
      }

      // Check if email already exists in this tenant
      const existingUser = await prisma.user.findFirst({
        where: {
          email: input.email,
          tenantId: ctx.user.tenantId,
        },
      });
      if (existingUser) {
        throw new Error("Email ya registrado en este tenant");
      }

      // Hash password
      const bcrypt = await import("bcryptjs");
      const hashedPassword = await bcrypt.hash(input.password, 10);

      // Create user
      const newUser = await prisma.user.create({
        data: {
          email: input.email,
          name: input.name,
          phone: input.phone,
          language: input.language || "ES",
          emailVerified: false, // Admin-created users need to verify email
          tenantId: ctx.user.tenantId,
        },
        select: {
          id: true,
          email: true,
          name: true,
          emailVerified: true,
          image: true,
          phone: true,
          language: true,
          tenantId: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      // Create account record for Better Auth compatibility
      await prisma.account.create({
        data: {
          userId: newUser.id,
          accountId: newUser.email,
          providerId: "credential",
          password: hashedPassword,
        },
      });

      return newUser;
    }),

  // Assign role to user
  assignRole: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        roleId: z.string(),
        expiresAt: z.date().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user?.tenantId) {
        throw new Error("User tenant not found");
      }

      // Check permissions: only admins can assign roles
      const canManageUsers = await hasPermissionOrManage(
        ctx.user.id,
        PermissionAction.UPDATE,
        PermissionResource.USER,
        ctx.user.tenantId
      );

      if (!canManageUsers) {
        throw new Error("No tienes permisos para asignar roles");
      }

      // Verify user exists
      const user = await prisma.user.findUnique({
        where: { id: input.userId },
      });
      if (!user) throw new Error("Usuario no encontrado");

      // Verify role exists
      const role = await prisma.role.findUnique({
        where: { id: input.roleId },
      });
      if (!role) throw new Error("Rol no encontrado");

      // Check if user already has this role
      const existingUserRole = await prisma.userRole.findUnique({
        where: {
          userId_roleId: {
            userId: input.userId,
            roleId: input.roleId,
          },
        },
      });

      if (existingUserRole) {
        throw new Error("El usuario ya tiene este rol asignado");
      }

      // Assign role
      const userRole = await prisma.userRole.create({
        data: {
          userId: input.userId,
          roleId: input.roleId,
          assignedBy: ctx.user.id,
          expiresAt: input.expiresAt,
        },
        include: {
          role: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return userRole;
    }),

  // Remove role from user
  removeRole: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        roleId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user?.tenantId) {
        throw new Error("User tenant not found");
      }

      // Check permissions: only admins can remove roles
      const canManageUsers = await hasPermissionOrManage(
        ctx.user.id,
        PermissionAction.UPDATE,
        PermissionResource.USER,
        ctx.user.tenantId
      );

      if (!canManageUsers) {
        throw new Error("No tienes permisos para remover roles");
      }

      // Verify the user role assignment exists
      const userRole = await prisma.userRole.findUnique({
        where: {
          userId_roleId: {
            userId: input.userId,
            roleId: input.roleId,
          },
        },
        include: {
          role: true,
        },
      });

      if (!userRole) {
        throw new Error("El usuario no tiene este rol asignado");
      }

      // Prevent removing system roles if they're critical
      if (userRole.role.isSystem) {
        // TODO: Add additional checks for critical system roles
        // For now, allow removal but could add restrictions
      }

      // Remove role assignment
      await prisma.userRole.delete({
        where: {
          userId_roleId: {
            userId: input.userId,
            roleId: input.roleId,
          },
        },
      });

      return true;
    }),

  // Get user roles
  getUserRoles: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user?.tenantId) {
        throw new Error("User tenant not found");
      }

      // Users can see their own roles, admins can see any user's roles
      if (input.userId !== ctx.user.id) {
        const canManageUsers = await hasPermissionOrManage(
          ctx.user.id,
          PermissionAction.READ,
          PermissionResource.USER,
          ctx.user.tenantId
        );

        if (!canManageUsers) {
          throw new Error(
            "No tienes permisos para ver los roles de este usuario"
          );
        }
      }

      const userRoles = await prisma.userRole.findMany({
        where: {
          userId: input.userId,
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
        include: {
          role: true,
        },
        orderBy: {
          assignedAt: "desc",
        },
      });

      return userRoles.map((ur) => ({
        id: ur.id,
        roleId: ur.role.id,
        roleName: ur.role.name,
        roleDisplayName: ur.role.displayName,
        roleDescription: ur.role.description,
        isActive: ur.role.isActive,
        isSystem: ur.role.isSystem,
        assignedAt: ur.assignedAt,
        assignedBy: ur.assignedBy,
        expiresAt: ur.expiresAt,
      }));
    }),
});
