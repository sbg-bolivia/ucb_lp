"use client";

import { useAuthContext } from "@/AuthContext";
import { FeedbackDialog } from "@/components/dashboard/FeedbackDialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useRBAC } from "@/hooks/useRBAC";
import { useTranslation } from "@/hooks/useTranslation";
import { useUser } from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Plus,
  Settings,
  Shield,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  badge?: string;
  requiredRoles?: string[];
  requiredPermissions?: Array<{ action: string; resource: string }>;
}

export function AppSidebar() {
  const { t } = useTranslation("dashboard");
  const { t: tCommon } = useTranslation("common");
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuthContext();
  const { primaryRole } = useUser();
  const { isSuperAdmin, isAdmin, hasRole } = useRBAC();

  // Configuración de navegación por rol
  const getNavItems = (): NavItem[] => {
    const baseItems: NavItem[] = [
      {
        title: t("mainPanel2"),
        href: "/dashboard",
        icon: LayoutDashboard,
        description: t("systemOverview"),
      },
    ];

    // Super Admin y Admin - acceso completo
    if (isSuperAdmin || isAdmin) {
      return [
        ...baseItems,
        {
          title: t("users"),
          href: "/dashboard/users",
          icon: Users,
          description: t("manageUsers"),
        },
        {
          title: t("rolesPermissions"),
          href: "/dashboard/roles",
          icon: Shield,
          description: t("configureRBAC"),
        },
        {
          title: t("settings2"),
          href: "/dashboard/settings",
          icon: Settings,
          description: t("systemSettings"),
        },
      ];
    }

    // Viewer - acceso de solo lectura
    if (hasRole("viewer")) {
      return [
        ...baseItems,
        {
          title: t("users"),
          href: "/dashboard/users",
          icon: Users,
          description: t("viewUsers"),
        },
        {
          title: t("settings2"),
          href: "/dashboard/settings",
          icon: Settings,
          description: t("viewSettings"),
        },
      ];
    }

    // Usuario sin permisos específicos
    return baseItems;
  };

  const navItems = getNavItems();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Sidebar collapsible="icon" className="border-r bg-sidebar overflow-hidden">
      <SidebarHeader
        className={cn("border-b border-border/30", isCollapsed ? "p-2" : "p-3")}
      >
        <div
          className={cn(
            "rounded-lg bg-gradient-to-br from-secondary/50 via-secondary/3 to-transparent   dark:from-secondary/20 dark:via-secondary/5  border",
            isCollapsed ? "p-2 flex justify-center items-center" : "p-3"
          )}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(
                  "flex items-center justify-center hover:opacity-80 transition-opacity rounded-md w-full",
                  isCollapsed ? "h-8 px-2" : "h-auto gap-3"
                )}
              >
                <div className="relative shrink-0 flex items-center justify-center">
                  <Avatar
                    className={cn(
                      "shrink-0",
                      isCollapsed ? "h-8 w-8" : "h-10 w-10"
                    )}
                  >
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm border-2 border-primary-foreground flex items-center justify-center">
                      {user?.name
                        ? user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span
                    className={cn(
                      "absolute bottom-0 right-0 bg-secondary rounded-full",
                      isCollapsed
                        ? "h-2 w-2 border border-card"
                        : "h-3 w-3 border-2 border-card"
                    )}
                  />
                </div>
                {!isCollapsed && (
                  <>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {user?.name || tCommon("user")}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        Online
                      </p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-secondary/70 shrink-0" />
                  </>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56" side="right">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.name || tCommon("user")}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || ""}
                  </p>
                  {primaryRole && (
                    <p className="text-xs leading-none text-muted-foreground capitalize mt-1">
                      {primaryRole.replace("_", " ")}
                    </p>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/profile")}
              >
                <User className="mr-2 h-4 w-4" />
                <span>{tCommon("profile")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/settings")}
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>{tCommon("settings")}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>{tCommon("signOut")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarHeader>

      <SidebarContent
        className={cn(
          "flex-1 overflow-y-auto overflow-x-hidden",
          isCollapsed ? "px-2 py-2" : "px-3 py-4"
        )}
      >
        <SidebarGroup className="w-full">
          <SidebarGroupLabel
            className={cn(
              "text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 mb-2",
              isCollapsed ? "hidden" : "px-2"
            )}
          >
            {t("navigation")}
          </SidebarGroupLabel>
          <SidebarGroupContent className="w-full">
            <SidebarMenu
              className={cn(
                "w-full flex flex-col",
                isCollapsed ? "space-y-1" : "space-y-0.5"
              )}
            >
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" &&
                    pathname.startsWith(item.href));

                return (
                  <SidebarMenuItem
                    key={item.href}
                    className="w-full flex justify-center"
                  >
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={cn(
                        "group/item relative transition-all duration-200",
                        isCollapsed
                          ? "h-9 w-full justify-center items-center px-2 rounded-lg"
                          : "h-9 w-full px-3 rounded-lg",
                        isActive
                          ? cn(
                              isCollapsed
                                ? "bg-primary/15 text-primary"
                                : "bg-primary/10 text-primary shadow-sm shadow-primary/10 before:absolute before:left-0 before:top-1/2 before:h-5 before:w-0.5 before:-translate-y-1/2 before:rounded-r-full before:bg-primary before:transition-all"
                            )
                          : "text-sidebar-foreground/70 hover:bg-accent/30 hover:text-foreground"
                      )}
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center w-full min-w-0",
                          isCollapsed ? "justify-center" : "gap-3"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "shrink-0 transition-all duration-200",
                            isCollapsed ? "size-4" : "size-5",
                            isActive
                              ? "text-primary"
                              : "text-muted-foreground group-hover/item:text-primary"
                          )}
                        />
                        {!isCollapsed && (
                          <span className="font-medium truncate">
                            {item.title}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter
        className={cn(
          "border-t border-border/30",
          isCollapsed ? "p-2 space-y-1" : "p-3 space-y-3"
        )}
      >
        <SidebarMenu className="w-full flex flex-col">
          <SidebarMenuItem className="w-full flex justify-center">
            <SidebarMenuButton
              onClick={() => router.push("/dashboard/settings")}
              tooltip={tCommon("settings")}
              className={cn(
                "group/item rounded-lg text-sidebar-foreground/70 transition-all duration-200 hover:bg-accent/30 hover:text-foreground",
                isCollapsed
                  ? "h-9 w-full justify-center items-center px-2"
                  : "h-9 w-full px-3"
              )}
            >
              <Settings
                className={cn(
                  "shrink-0 transition-transform duration-200 group-hover/item:scale-110",
                  isCollapsed ? "size-4" : "size-5"
                )}
              />
              {!isCollapsed && (
                <span className="font-medium truncate">
                  {tCommon("settings")}
                </span>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Promotional Card */}
        {!isCollapsed ? (
          <div className="rounded-lg p-4 bg-gradient-to-br from-primary/15 to-background border border-border/50 shadow-sm shadow-primary/10">
            <p className="mb-4 text-sm leading-relaxed">
              {t("feedbackDialog.promotionalCardText")}
            </p>
            <Button
              onClick={() => setIsFeedbackDialogOpen(true)}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/0 shadow-sm transition-all duration-300 font-medium"
              size="sm"
            >
              <Plus className="mr-2 h-4 w-4" />
              {t("feedbackDialog.promotionalButton")}
            </Button>
          </div>
        ) : (
          <div className="flex justify-center w-full">
            <Button
              onClick={() => setIsFeedbackDialogOpen(true)}
              title={t("feedbackDialog.promotionalButton")}
              className="h-9 w-full max-w-[calc(100%-0.5rem)] text-white shadow-lg transition-all duration-300 rounded-lg flex items-center justify-center px-2 font-medium bg-gradient-to-br from-primary via-secondary hover:from-primary/90 hover:via-secondary/90 hover:to-accent/90"
              size="icon"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </SidebarFooter>
      <FeedbackDialog
        isOpen={isFeedbackDialogOpen}
        onClose={() => setIsFeedbackDialogOpen(false)}
      />
    </Sidebar>
  );
}
