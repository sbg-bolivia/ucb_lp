"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  ScrollableTable,
  type TableAction,
  type TableColumn,
} from "@/components/ui/scrollable-table";
import { Textarea } from "@/components/ui/textarea";
import { useRBAC } from "@/hooks/useRBAC";
import { trpc } from "@/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Edit,
  Eye,
  Lock,
  Plus,
  Shield,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Schema for role creation/update
const roleSchema = z.object({
  name: z.string().min(2, "Nombre debe tener al menos 2 caracteres"),
  displayName: z
    .string()
    .min(2, "Nombre de visualización debe tener al menos 2 caracteres"),
  description: z.string().optional(),
  isActive: z.boolean(),
});

type RoleFormData = z.infer<typeof roleSchema>;

// Type for the role data
type Role = {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  isActive: boolean;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
  userRoles?: Array<{
    id: string;
    user: {
      name: string;
      email: string;
    };
  }>;
};

// Permission configuration
const permissionConfig = {
  CREATE: {
    label: "Crear",
    color:
      "bg-green-600/15 text-green-600 border-green-600 hover:bg-green-600/20",
  },
  READ: {
    label: "Leer",
    color: "bg-primary/15 text-primary border-primary hover:bg-primary/20",
  },
  UPDATE: {
    label: "Actualizar",
    color:
      "bg-yellow-600/15 text-yellow-600 border-yellow-600 hover:bg-yellow-600/20",
  },
  DELETE: {
    label: "Eliminar",
    color: "bg-red-600/15 text-red-600 border-red-600 hover:bg-red-600/20",
  },
  MANAGE: {
    label: "Gestionar",
    color:
      "bg-purple-600/15 text-purple-600 border-purple-600 hover:bg-purple-600/20",
  },
};

const resourceConfig = {
  USER: { label: "Usuarios", icon: "👤" },
  ROLE: { label: "Roles", icon: "🎭" },
  PERMISSION: { label: "Permisos", icon: "🔐" },
  SUBSCRIPTION: { label: "Suscripciones", icon: "💳" },
  DASHBOARD: { label: "Dashboard", icon: "📊" },
  ADMIN: { label: "Admin", icon: "⚙️" },
};

export default function RolesPage() {
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isManagePermissionsOpen, setIsManagePermissionsOpen] = useState(false);
  const [viewingRole, setViewingRole] = useState<Role | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const { canManageRoles } = useRBAC();

  const form = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
      displayName: "",
      description: "",
      isActive: true,
    },
  });

  const {
    data: roles = [],
    refetch,
    isLoading,
    error,
  } = trpc.rbac.getRoles.useQuery(undefined, {
    staleTime: 60000, // Cache for 1 minute
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });

  const { data: permissionsResponse, isLoading: permissionsLoading } =
    trpc.rbac.getAllPermissions.useQuery(undefined, {
      staleTime: 60000, // Cache for 1 minute
      gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    });

  // Extract permissions from paginated response
  const allPermissions = permissionsResponse?.data || [];

  // Get role permissions when viewing a role
  const {
    data: rolePermissions = [],
    isLoading: rolePermissionsLoading,
    refetch: refetchRolePermissions,
  } = trpc.rbac.getRolePermissions.useQuery(
    { roleId: viewingRole?.id || "" },
    {
      enabled: !!viewingRole?.id,
      staleTime: 30000, // Cache for 30 seconds
      gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    }
  );

  const createRole = trpc.rbac.createRole.useMutation({
    onSuccess: () => {
      refetch();
      setIsCreateDialogOpen(false);
      form.reset();
      // TODO: Add toast notification
    },
    onError: (error) => {
      console.error("Error creating role:", error.message);
      // TODO: Add toast notification
    },
  });

  const updateRole = trpc.rbac.updateRole.useMutation({
    onSuccess: () => {
      refetch();
      setIsEditDialogOpen(false);
      setEditingRole(null);
      form.reset();
      // TODO: Add toast notification
    },
    onError: (error) => {
      console.error("Error updating role:", error.message);
      // TODO: Add toast notification
    },
  });

  const deleteRole = trpc.rbac.deleteRole.useMutation({
    onSuccess: () => {
      refetch();
      // TODO: Add toast notification
    },
    onError: (error) => {
      console.error("Error deleting role:", error.message);
      // TODO: Add toast notification
    },
  });

  const assignPermission = trpc.rbac.assignPermissionToRole.useMutation({
    onSuccess: () => {
      refetchRolePermissions();
      setSelectedPermissions([]);
      // TODO: Add toast notification
    },
    onError: (error) => {
      console.error("Error assigning permission:", error.message);
      // TODO: Add toast notification
    },
  });

  const removePermission = trpc.rbac.removePermissionFromRole.useMutation({
    onSuccess: () => {
      refetchRolePermissions();
      // TODO: Add toast notification
    },
    onError: (error) => {
      console.error("Error removing permission:", error.message);
      // TODO: Add toast notification
    },
  });

  const handleCreate = () => {
    setIsCreateDialogOpen(true);
    form.reset({
      name: "",
      displayName: "",
      description: "",
      isActive: true,
    });
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    form.reset({
      name: role.name,
      displayName: role.displayName,
      description: role.description || "",
      isActive: role.isActive,
    });
    setIsEditDialogOpen(true);
  };

  const handleView = (role: Role) => {
    setViewingRole(role);
    setIsViewDialogOpen(true);
  };

  const handleRemovePermission = (rolePermissionId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este permiso?")) {
      const rolePermission = rolePermissions.find(
        (rp) => rp.id === rolePermissionId
      );
      if (rolePermission && viewingRole) {
        removePermission.mutate({
          roleId: viewingRole.id,
          permissionId: rolePermission.permission.id,
        });
      }
    }
  };

  const handleAssignPermissions = () => {
    if (viewingRole && selectedPermissions.length > 0) {
      selectedPermissions.forEach((permissionId) => {
        assignPermission.mutate({
          roleId: viewingRole.id,
          permissionId: permissionId,
        });
      });
      setIsManagePermissionsOpen(false);
    }
  };

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleDelete = (role: Role) => {
    if (
      confirm(
        `¿Estás seguro de que quieres eliminar el rol "${role.displayName}"?`
      )
    ) {
      deleteRole.mutate({ id: role.id });
    }
  };

  const onSubmit = (data: RoleFormData) => {
    if (editingRole) {
      updateRole.mutate({
        id: editingRole.id,
        ...data,
      });
    } else {
      createRole.mutate(data);
    }
  };

  // Define table columns (memoized to prevent re-creation on each render)
  const columns = useMemo<TableColumn<Role>[]>(
    () => [
      {
        key: "role",
        title: "Rol",
        render: (_, record) => (
          <div className="flex items-center space-x-3">
            <div
              className={`p-2 rounded-lg ${record.isSystem ? "bg-primary/10" : "bg-primary/10"}`}
            >
              {record.isSystem ? (
                <Shield className="h-4 w-4 text-primary" />
              ) : (
                <Users className="h-4 w-4 text-primary" />
              )}
            </div>
            <div>
              <div className="font-medium text-foreground">
                {record.displayName}
              </div>
              <div className="text-xs text-muted-foreground">{record.name}</div>
            </div>
          </div>
        ),
      },
      {
        key: "description",
        title: "Descripción",
        render: (_, record) => (
          <div className="text-sm text-muted-foreground max-w-xs break-words">
            {record.description || "Sin descripción"}
          </div>
        ),
      },
      {
        key: "status",
        title: "Estado",
        render: (_, record) => (
          <Badge
            variant="outline"
            className={`text-xs font-medium border ${
              record.isActive
                ? "bg-green-600/15 text-green-600 border-green-600 hover:bg-green-600/20"
                : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
            }`}
          >
            {record.isActive ? "Activo" : "Inactivo"}
          </Badge>
        ),
      },
      {
        key: "createdAt",
        title: "Creado",
        render: (_, record) => (
          <div className="text-xs text-muted-foreground">
            {new Date(record.createdAt).toLocaleDateString("es-ES")}
          </div>
        ),
      },
    ],
    []
  );

  // Define table actions (memoized to prevent re-creation on each render)
  const actions = useMemo<TableAction<Role>[]>(
    () => [
      {
        label: "Ver Detalles",
        icon: <Eye className="h-4 w-4" />,
        onClick: handleView,
        variant: "default",
      },
      ...(canManageRoles
        ? [
            {
              label: "Editar",
              icon: <Edit className="h-4 w-4" />,
              onClick: handleEdit,
              variant: "default" as const,
            },
          ]
        : []),
      ...(canManageRoles
        ? [
            {
              label: "Eliminar",
              icon: <Trash2 className="h-4 w-4" />,
              onClick: handleDelete,
              variant: "destructive" as const,
              separator: true,
              disabled: (role: Role) => role.isSystem, // Disable for system roles
            },
          ]
        : []),
    ],
    [canManageRoles]
  );

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Error al cargar roles
          </h3>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Gestión de Roles
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5 mr-8">
            Administra roles del sistema y asigna permisos
          </p>
        </div>
        {canManageRoles && (
          <Button size="sm" onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-1.5" />
            <span>Nuevo Rol</span>
          </Button>
        )}
      </div>

      {/* Table with ScrollableTable */}
      <ScrollableTable<Role>
        data={roles}
        columns={columns}
        actions={actions}
        emptyMessage="No se encontraron roles"
        emptyIcon={<Users className="h-12 w-12 text-muted-foreground" />}
        loading={isLoading}
      />

      {/* Create Role Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-2xl border-border">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Rol</DialogTitle>
            <DialogDescription>
              Completa la información para crear un nuevo rol en el sistema.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del Rol *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="admin" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre de Visualización *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Administrador" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Descripción del rol..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Rol Activo</FormLabel>
                      <p className="text-xs text-muted-foreground">
                        Los roles inactivos no se pueden asignar a usuarios
                      </p>
                    </div>
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={createRole.isPending}>
                  {createRole.isPending ? "Creando..." : "Crear Rol"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-2xl border-border">
          <DialogHeader>
            <DialogTitle>Editar Rol - {editingRole?.displayName}</DialogTitle>
            <DialogDescription>
              Modifica la información del rol seleccionado.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del Rol *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="admin"
                          disabled={editingRole?.isSystem}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre de Visualización *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Administrador" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Descripción del rol..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Rol Activo</FormLabel>
                      <p className="text-xs text-muted-foreground">
                        Los roles inactivos no se pueden asignar a usuarios
                      </p>
                    </div>
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={updateRole.isPending}>
                  {updateRole.isPending ? "Actualizando..." : "Actualizar Rol"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* View Role Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto border-border">
          <DialogHeader>
            <DialogTitle>
              Detalles del Rol - {viewingRole?.displayName}
            </DialogTitle>
            <DialogDescription>
              Información completa del rol y sus permisos.
            </DialogDescription>
          </DialogHeader>
          {viewingRole && (
            <div className="space-y-6">
              {/* Role Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">
                      Información Básica
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs text-muted-foreground">
                          Nombre:
                        </span>
                        <div className="font-medium">{viewingRole.name}</div>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">
                          Nombre de Visualización:
                        </span>
                        <div className="font-medium">
                          {viewingRole.displayName}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">
                          Estado:
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-xs font-medium ml-2 border ${
                            viewingRole.isActive
                              ? "bg-green-600/15 text-green-600 border-green-600"
                              : "bg-muted text-muted-foreground border-border"
                          }`}
                        >
                          {viewingRole.isActive ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">
                          Tipo:
                        </span>
                        <Badge
                          variant="secondary"
                          className={`text-xs font-medium ml-2 border ${
                            viewingRole.isSystem
                              ? "bg-primary/15 text-primary border-primary"
                              : "bg-primary/15 text-primary border-primary"
                          }`}
                        >
                          {viewingRole.isSystem ? "Sistema" : "Personalizado"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">
                      Descripción
                    </h4>
                    <p className="text-sm text-muted-foreground break-words whitespace-pre-wrap">
                      {viewingRole.description || "Sin descripción"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">
                      Fechas
                    </h4>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div>
                        Creado:{" "}
                        {new Date(viewingRole.createdAt).toLocaleString(
                          "es-ES"
                        )}
                      </div>
                      <div>
                        Actualizado:{" "}
                        {new Date(viewingRole.updatedAt).toLocaleString(
                          "es-ES"
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Permissions Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-foreground">
                    Permisos Asignados ({rolePermissions.length})
                  </h4>
                  {canManageRoles && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsManagePermissionsOpen(true)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Gestionar
                    </Button>
                  )}
                </div>

                {rolePermissionsLoading ? (
                  <div className="text-center py-6">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto" />
                    <p className="text-xs text-muted-foreground mt-2">
                      Cargando permisos...
                    </p>
                  </div>
                ) : rolePermissions.length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(
                      rolePermissions.reduce(
                        (acc, rolePermission) => {
                          const resource = rolePermission.permission.resource;
                          if (!acc[resource]) acc[resource] = [];
                          acc[resource].push(rolePermission);
                          return acc;
                        },
                        {} as Record<string, typeof rolePermissions>
                      )
                    ).map(([resource, permissions]) => {
                      const resourceInfo =
                        resourceConfig[resource as keyof typeof resourceConfig];

                      return (
                        <div
                          key={resource}
                          className="border border-border rounded-lg p-3"
                        >
                          <h5 className="text-sm font-medium text-foreground mb-2">
                            {resourceInfo?.label || resource}
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {permissions.map((rolePermission) => {
                              const permission = rolePermission.permission;
                              const actionInfo =
                                permissionConfig[
                                  permission.action as keyof typeof permissionConfig
                                ];

                              return (
                                <Badge
                                  key={rolePermission.id}
                                  variant="secondary"
                                  className={`text-xs px-3 py-1.5 pr-2 border ${actionInfo?.color || "bg-muted text-muted-foreground border-border hover:bg-muted/80"} transition-colors group relative`}
                                >
                                  <span className="mr-1">
                                    {actionInfo?.label || permission.action}
                                  </span>
                                  {canManageRoles && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleRemovePermission(
                                          rolePermission.id
                                        )
                                      }
                                      className="ml-1 h-4 w-4 rounded-full hover:bg-black/10 transition-colors flex items-center justify-center text-current hover:text-red-600"
                                    >
                                      <X className="h-2.5 w-2.5" />
                                    </button>
                                  )}
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Lock className="h-8 w-8 text-secondary/60 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">
                      Sin permisos asignados
                    </p>
                    {canManageRoles && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2"
                        onClick={() => setIsManagePermissionsOpen(true)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Agregar Permisos
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="flex justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => setIsViewDialogOpen(false)}
            >
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manage Permissions Dialog */}
      <Dialog
        open={isManagePermissionsOpen}
        onOpenChange={setIsManagePermissionsOpen}
      >
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto border-border">
          <DialogHeader>
            <DialogTitle>
              Gestionar Permisos - {viewingRole?.displayName}
            </DialogTitle>
            <DialogDescription>
              Selecciona los permisos que deseas asignar a este rol.
            </DialogDescription>
          </DialogHeader>

          {permissionsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
              <p className="text-sm text-muted-foreground mt-2">
                Cargando permisos disponibles...
              </p>
            </div>
          ) : allPermissions.length > 0 ? (
            <div className="space-y-4">
              {Object.entries(
                allPermissions.reduce(
                  (acc, permission) => {
                    const resource = permission.resource;
                    if (!acc[resource]) acc[resource] = [];
                    acc[resource].push(permission);
                    return acc;
                  },
                  {} as Record<string, typeof allPermissions>
                )
              ).map(([resource, permissions]) => {
                const resourceInfo =
                  resourceConfig[resource as keyof typeof resourceConfig];
                const currentRolePermissions = rolePermissions.map(
                  (rp) => rp.permission.id
                );

                return (
                  <div
                    key={resource}
                    className="border border-border rounded-lg p-4"
                  >
                    <h5 className="text-sm font-medium text-foreground mb-3">
                      {resourceInfo?.label || resource}
                    </h5>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {permissions.map((permission) => {
                        const actionInfo =
                          permissionConfig[
                            permission.action as keyof typeof permissionConfig
                          ];
                        const isAssigned = currentRolePermissions.includes(
                          permission.id
                        );
                        const isSelected = selectedPermissions.includes(
                          permission.id
                        );

                        return (
                          <button
                            key={permission.id}
                            type="button"
                            disabled={isAssigned}
                            className={`w-full flex items-center space-x-2 p-2 rounded border cursor-pointer transition-colors text-left ${
                              isAssigned
                                ? "bg-green-50 border-green-200 cursor-not-allowed opacity-60"
                                : isSelected
                                  ? "bg-blue-50 border-blue-200"
                                  : "hover:bg-gray-50 border-border"
                            }`}
                            onClick={() =>
                              !isAssigned &&
                              handlePermissionToggle(permission.id)
                            }
                          >
                            <Checkbox
                              checked={isSelected || isAssigned}
                              disabled={isAssigned}
                              onChange={() =>
                                !isAssigned &&
                                handlePermissionToggle(permission.id)
                              }
                            />
                            <Badge
                              variant="secondary"
                              className={`text-xs px-2 py-1 border ${actionInfo?.color || "bg-muted text-muted-foreground border-border hover:bg-muted/80"} transition-colors`}
                            >
                              {actionInfo?.label || permission.action}
                            </Badge>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Lock className="h-12 w-12 text-secondary/60 mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">
                No hay permisos disponibles
              </p>
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t border-border">
            <div className="text-sm text-secondary/80">
              {selectedPermissions.length} permiso(s) seleccionado(s)
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsManagePermissionsOpen(false);
                  setSelectedPermissions([]);
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAssignPermissions}
                disabled={
                  selectedPermissions.length === 0 || assignPermission.isPending
                }
              >
                {assignPermission.isPending
                  ? "Asignando..."
                  : "Asignar Permisos"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
