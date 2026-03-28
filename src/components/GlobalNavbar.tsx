"use client";

import { useAuthContext } from "@/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageSelector } from "@/components/ui/language-selector";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useTranslation } from "@/hooks/useTranslation";
import { useUser } from "@/hooks/useUser";
import { getInitials } from "@/lib/utils/avatar";
import {
  ChevronDown,
  Cloud,
  Code,
  Grid,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Shield,
  Smartphone,
  User,
  Workflow,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const services = [
  {
    icon: Smartphone,
    title: "Aplicaciones Móviles",
    description:
      "Apps nativas e híbridas para iOS y Android con soporte offline.",
  },
  {
    icon: Cloud,
    title: "Aplicaciones Web",
    description:
      "Plataformas cloud-native con alta disponibilidad y seguridad enterprise.",
  },
  {
    icon: Code,
    title: "Software a Medida",
    description:
      "Soluciones enterprise-grade adaptadas a tu arquitectura de negocio.",
  },
  {
    icon: Workflow,
    title: "Automatización de Procesos",
    description:
      "Workflows inteligentes que reducen tareas manuales hasta en un 80%.",
  },
];

export default function GlobalNavbar() {
  const _pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const servicesTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { user, isAuthenticated, signOut } = useAuthContext();
  const { primaryRole } = useUser();
  const router = useRouter();
  const { t } = useTranslation("common");

  const handleServicesMouseEnter = useCallback(() => {
    if (servicesTimeoutRef.current) {
      clearTimeout(servicesTimeoutRef.current);
      servicesTimeoutRef.current = null;
    }
    setIsServicesOpen(true);
  }, []);

  const handleServicesMouseLeave = useCallback(() => {
    servicesTimeoutRef.current = setTimeout(() => {
      setIsServicesOpen(false);
    }, 200);
  }, []);

  const handleSignOut = useCallback(async () => {
    await signOut();
    setIsMenuOpen(false);
  }, [signOut]);

  const handleSignIn = useCallback(() => {
    router.push("/signin");
    setIsMenuOpen(false);
  }, [router]);

  const getDashboardUrl = useCallback(() => {
    switch (primaryRole) {
      case "admin":
      case "super_admin":
      case "user":
      case "viewer":
        return "/dashboard";
      default:
        return "/dashboard";
    }
  }, [primaryRole]);

  const userInitials = useMemo(() => getInitials(user?.name), [user?.name]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const viewportHeight = window.innerHeight;
      setIsScrolled(scrollPosition > viewportHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (servicesTimeoutRef.current) {
        clearTimeout(servicesTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
          isScrolled
            ? "backdrop-blur-md bg-card/80 border-b border-border/50 shadow-sm"
            : "bg-transparent border-b border-transparent backdrop-blur-md"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center h-14 md:h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <img
                  src={isScrolled ? "/logo2.png" : "/logo3.png"}
                  alt="AXIUM"
                  className="h-8 w-auto md:h-9 transition-all duration-300"
                />
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-6 flex-1 justify-center ml-8">
              <Link
                href="#casos"
                className={`text-sm font-medium transition-colors ${
                  isScrolled
                    ? "text-foreground hover:text-secondary"
                    : "text-white hover:text-white/80"
                }`}
              >
                Casos de Éxito
              </Link>

              {/* Services Dropdown */}
              <div
                className="relative"
                onMouseEnter={handleServicesMouseEnter}
                onMouseLeave={handleServicesMouseLeave}
              >
                <button
                  type="button"
                  className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                    isScrolled
                      ? "text-foreground hover:text-secondary"
                      : "text-white hover:text-white/80"
                  }`}
                >
                  Servicios
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${isServicesOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Services Mega Menu */}
                {isServicesOpen && (
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 p-6 z-[60]"
                    onMouseEnter={handleServicesMouseEnter}
                    onMouseLeave={handleServicesMouseLeave}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Grid className="h-5 w-5 text-secondary" />
                      <h3 className="font-semibold text-gray-900">Servicios</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {services.map((service) => (
                        <Link
                          key={service.title}
                          href="#servicios"
                          className="block group hover:bg-gray-50 p-3 rounded-lg transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/20 transition-colors">
                              <service.icon className="w-4 h-4 text-secondary" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 text-sm mb-1 group-hover:text-secondary transition-colors">
                                {service.title}
                              </h4>
                              <p className="text-xs text-gray-600 leading-relaxed">
                                {service.description}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="#como-trabajamos"
                className={`text-sm font-medium transition-colors ${
                  isScrolled
                    ? "text-foreground hover:text-secondary"
                    : "text-white hover:text-white/80"
                }`}
              >
                Cómo Trabajamos
              </Link>

              <Link
                href="#contacto"
                className={`text-sm font-medium transition-colors ${
                  isScrolled
                    ? "text-foreground hover:text-secondary"
                    : "text-white hover:text-white/80"
                }`}
              >
                Contacto
              </Link>
            </div>

            {/* Desktop Auth Section */}
            <div className="hidden lg:block">
              <div className="ml-4 flex items-center md:ml-6 gap-4">
                <LanguageSelector isTransparent={!isScrolled} />
                {isAuthenticated ? (
                  <div className="flex items-center space-x-4">
                    {/* User Name */}
                    <span
                      className={`font-medium text-sm transition-colors ${
                        isScrolled ? "text-foreground" : "text-white"
                      }`}
                    >
                      {user?.name || t("user")}
                    </span>

                    {/* User Avatar Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                          <Avatar className="h-7 w-7 md:h-8 md:w-8">
                            {user?.image ? (
                              <AvatarImage
                                src={user.image}
                                alt={user?.name || "Usuario"}
                              />
                            ) : (
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                {userInitials}
                              </AvatarFallback>
                            )}
                          </Avatar>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56" align="end">
                        <DropdownMenuLabel className="font-normal">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {user?.name || t("user")}
                            </p>
                            <p className="text-xs leading-none text-muted-foreground">
                              {user?.email || ""}
                            </p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => router.push(getDashboardUrl())}
                        >
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          <span>{t("dashboard")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push("/dashboard/profile")}
                        >
                          <User className="mr-2 h-4 w-4" />
                          <span>{t("profile")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push("/dashboard/settings")}
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          <span>{t("settings")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleSignOut}>
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>{t("signOut")}</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      onClick={handleSignIn}
                      className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors shadow-sm ${
                        isScrolled
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "bg-white text-gray-900 hover:bg-white/90 border border-white/20"
                      }`}
                    >
                      {t("signIn")}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <button
                    type="button"
                    className={`inline-flex items-center justify-center p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-inset ${
                      isScrolled
                        ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-400"
                        : "text-white/90 hover:text-white hover:bg-white/10 focus:ring-white/50"
                    }`}
                  >
                    <span className="sr-only">{t("openMenu")}</span>
                    <Menu
                      className="block h-5 w-5 md:h-6 md:w-6"
                      aria-hidden="true"
                    />
                  </button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-96 bg-white border-gray-200"
                >
                  <SheetHeader className="px-2">
                    <SheetTitle className="text-white text-lg">
                      {t("mainMenu")}
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 px-2">
                    <div className="mb-4 px-2">
                      <LanguageSelector />
                    </div>
                    {isAuthenticated ? (
                      <div className="space-y-4">
                        {/* User Info */}
                        <div className="flex items-center space-x-3 px-3 py-2">
                          <Avatar>
                            {user?.image ? (
                              <AvatarImage
                                src={user.image}
                                alt={user?.name || t("user")}
                              />
                            ) : (
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                {userInitials}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-white">
                              {user?.name || t("user")}
                            </span>
                            <span className="text-xs text-gray-300">
                              {user?.email || ""}
                            </span>
                          </div>
                        </div>

                        {/* Dashboard Link */}
                        <button
                          type="button"
                          onClick={() => {
                            router.push(getDashboardUrl());
                            setIsMenuOpen(false);
                          }}
                          className="group flex items-center px-5 py-4 rounded-xl text-sm font-medium transition-all duration-200 text-gray-300 hover:text-white hover:bg-accent w-full"
                        >
                          <LayoutDashboard className="mr-3 h-5 w-5 text-gray-400 group-hover:text-white" />
                          <div className="flex-1 text-left">
                            <div className="font-medium text-white">
                              {t("dashboard")}
                            </div>
                            <div className="text-xs text-gray-400">
                              {t("mainPanel")}
                            </div>
                          </div>
                        </button>

                        {/* Settings Link */}
                        <button
                          type="button"
                          onClick={() => {
                            router.push("/dashboard/settings");
                            setIsMenuOpen(false);
                          }}
                          className="group flex items-center px-5 py-4 rounded-xl text-sm font-medium transition-all duration-200 text-gray-300 hover:text-white hover:bg-accent w-full"
                        >
                          <Settings className="mr-3 h-5 w-5 text-gray-400 group-hover:text-white" />
                          <div className="flex-1 text-left">
                            <div className="font-medium text-white">
                              {t("settings")}
                            </div>
                            <div className="text-xs text-gray-400">
                              {t("accountSettings")}
                            </div>
                          </div>
                        </button>

                        {/* Profile Link */}
                        <button
                          type="button"
                          onClick={() => {
                            router.push("/dashboard/profile");
                            setIsMenuOpen(false);
                          }}
                          className="group flex items-center px-5 py-4 rounded-xl text-sm font-medium transition-all duration-200 text-gray-300 hover:text-white hover:bg-accent w-full"
                        >
                          <User className="mr-3 h-5 w-5 text-gray-400 group-hover:text-white" />
                          <div className="flex-1 text-left">
                            <div className="font-medium text-white">
                              {t("profile")}
                            </div>
                            <div className="text-xs text-gray-400">
                              {t("personalInfo")}
                            </div>
                          </div>
                        </button>

                        {/* Logout Button */}
                        <div className="pt-4 border-t border-gray-700">
                          <button
                            type="button"
                            onClick={handleSignOut}
                            className="group flex items-center px-5 py-4 rounded-xl text-sm font-medium transition-all duration-200 text-red-400 hover:text-red-300 hover:bg-red-900/20 w-full"
                          >
                            <LogOut className="mr-3 h-5 w-5" />
                            <div className="flex-1 text-left">
                              <div className="font-medium">{t("signOut")}</div>
                            </div>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <button
                          type="button"
                          onClick={handleSignIn}
                          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          {t("signIn")}
                        </button>
                        <Link
                          href="/signup"
                          onClick={() => setIsMenuOpen(false)}
                          className="w-full bg-transparent border border-gray-600 text-white hover:bg-gray-700 px-4 py-2 rounded-lg font-medium transition-colors block text-center"
                        >
                          {t("signUp")}
                        </Link>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
