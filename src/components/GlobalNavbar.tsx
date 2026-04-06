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
import { ClubNavLogo } from "@/components/club-landing/club-logo";
import { ClubThemeToggle } from "@/components/club-landing/club-theme-toggle";
import { useTranslation } from "@/hooks/useTranslation";
import { SHOW_PUBLIC_LOGIN } from "@/lib/public-auth";
import { useUser } from "@/hooks/useUser";
import { getInitials } from "@/lib/utils/avatar";
import { LayoutDashboard, LogOut, Menu, Settings, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

export default function GlobalNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  /** Navbar solo en páginas distintas al landing: siempre estilo sólido */
  const isScrolled = true;
  const { user, isAuthenticated, signOut } = useAuthContext();
  const { primaryRole } = useUser();
  const router = useRouter();
  const { t } = useTranslation("common");

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
              <ClubNavLogo />
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex flex-1 flex-wrap items-center justify-center gap-x-3 gap-y-1 px-2 xl:gap-x-5">
              <Link
                href="/"
                className="whitespace-nowrap text-xs font-medium text-foreground transition-colors hover:text-secondary xl:text-sm"
              >
                Inicio
              </Link>
              <Link
                href="/nosotros"
                className="whitespace-nowrap text-xs font-medium text-foreground transition-colors hover:text-secondary xl:text-sm"
              >
                Nosotros
              </Link>
              <Link
                href="/beneficios"
                className="whitespace-nowrap text-xs font-medium text-foreground transition-colors hover:text-secondary xl:text-sm"
              >
                Beneficios
              </Link>
              <Link
                href="/eventos"
                className="whitespace-nowrap text-xs font-medium text-foreground transition-colors hover:text-secondary xl:text-sm"
              >
                Eventos
              </Link>
              <Link
                href="/equipo"
                className="whitespace-nowrap text-xs font-medium text-foreground transition-colors hover:text-secondary xl:text-sm"
              >
                Equipo
              </Link>
              <Link
                href="/unete"
                className="whitespace-nowrap text-xs font-medium text-foreground transition-colors hover:text-secondary xl:text-sm"
              >
                Únete
              </Link>
              <Link
                href="/contacto"
                className="whitespace-nowrap text-xs font-medium text-foreground transition-colors hover:text-secondary xl:text-sm"
              >
                Contacto
              </Link>
            </div>

            {/* Desktop Auth Section */}
            <div className="hidden lg:block">
              <div className="ml-4 flex items-center md:ml-6 gap-3">
                <ClubThemeToggle />
                <LanguageSelector isTransparent={false} />
                {isAuthenticated ? (
                  <div className="flex items-center space-x-4">
                    <span
                      className={`font-medium text-sm transition-colors ${
                        isScrolled ? "text-foreground" : "text-white"
                      }`}
                    >
                      {user?.name || t("user")}
                    </span>

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
                ) : SHOW_PUBLIC_LOGIN ? (
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
                ) : null}
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
                    <SheetTitle className="text-lg text-foreground">
                      {t("mainMenu")}
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 px-2">
                    <div className="mb-4 flex items-center justify-between gap-2 px-2">
                      <ClubThemeToggle />
                      <LanguageSelector />
                    </div>
                    <nav className="mb-6 flex flex-col gap-1 border-b border-border pb-4">
                      <Link
                        href="/"
                        onClick={() => setIsMenuOpen(false)}
                        className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                      >
                        Inicio
                      </Link>
                      <Link
                        href="/nosotros"
                        onClick={() => setIsMenuOpen(false)}
                        className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                      >
                        Nosotros
                      </Link>
                      <Link
                        href="/beneficios"
                        onClick={() => setIsMenuOpen(false)}
                        className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                      >
                        Beneficios
                      </Link>
                      <Link
                        href="/eventos"
                        onClick={() => setIsMenuOpen(false)}
                        className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                      >
                        Eventos
                      </Link>
                      <Link
                        href="/equipo"
                        onClick={() => setIsMenuOpen(false)}
                        className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                      >
                        Equipo
                      </Link>
                      <Link
                        href="/unete"
                        onClick={() => setIsMenuOpen(false)}
                        className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                      >
                        Únete
                      </Link>
                      <Link
                        href="/contacto"
                        onClick={() => setIsMenuOpen(false)}
                        className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                      >
                        Contacto
                      </Link>
                    </nav>
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
                            <span className="text-sm font-medium text-foreground">
                              {user?.name || t("user")}
                            </span>
                            <span className="text-xs text-muted-foreground">
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
                          className="group flex w-full items-center rounded-xl px-5 py-4 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground"
                        >
                          <LayoutDashboard className="mr-3 h-5 w-5" />
                          <div className="flex-1 text-left">
                            <div className="font-medium text-foreground">
                              {t("dashboard")}
                            </div>
                            <div className="text-xs text-muted-foreground">
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
                          className="group flex w-full items-center rounded-xl px-5 py-4 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground"
                        >
                          <Settings className="mr-3 h-5 w-5" />
                          <div className="flex-1 text-left">
                            <div className="font-medium text-foreground">
                              {t("settings")}
                            </div>
                            <div className="text-xs text-muted-foreground">
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
                          className="group flex w-full items-center rounded-xl px-5 py-4 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground"
                        >
                          <User className="mr-3 h-5 w-5" />
                          <div className="flex-1 text-left">
                            <div className="font-medium text-foreground">
                              {t("profile")}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {t("personalInfo")}
                            </div>
                          </div>
                        </button>

                        {/* Logout Button */}
                        <div className="border-t border-border pt-4">
                          <button
                            type="button"
                            onClick={handleSignOut}
                            className="group flex w-full items-center rounded-xl px-5 py-4 text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-950/30"
                          >
                            <LogOut className="mr-3 h-5 w-5" />
                            <div className="flex-1 text-left">
                              <div className="font-medium">{t("signOut")}</div>
                            </div>
                          </button>
                        </div>
                      </div>
                    ) : SHOW_PUBLIC_LOGIN ? (
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
                          className="block w-full rounded-lg border border-border bg-transparent px-4 py-2 text-center font-medium text-foreground transition-colors hover:bg-muted"
                        >
                          {t("signUp")}
                        </Link>
                      </div>
                    ) : null}
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
