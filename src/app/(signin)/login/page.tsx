"use client";

import {
  AuthDivider,
  AuthGoogleButton,
  AuthPageShell,
  AuthPrimaryButton,
  AUTH_INPUT_CLASS,
} from "@/components/auth/AuthPageShell";
import GoogleIcon from "@/components/icons/GoogleIcon";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/hooks/useTranslation";
import { authClient } from "@/lib/auth-client";
import { CLUB } from "@/lib/club-brand";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

type LoginFormValues = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const { t } = useTranslation("common");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    defaultValues: { email: "", password: "" },
  });

  const { control, handleSubmit, setError, clearErrors } = form;

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    clearErrors();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      setError("email", { type: "manual", message: t("validEmail") });
      toast.error(t("validEmail"));
      setLoading(false);
      return;
    }

    if (!data.password) {
      setError("password", { type: "manual", message: t("enterPassword") });
      toast.error(t("enterPassword"));
      setLoading(false);
      return;
    }

    try {
      const { error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: "/dashboard",
        rememberMe: true,
      });

      if (error) {
        toast.error(t("errorSignIn") || "Error al iniciar sesión", {
          description: error.message,
        });
      } else {
        toast.success(t("welcome") || "Bienvenido", {
          description: t("sessionStarted") || "Sesión iniciada correctamente",
        });
        router.push("/dashboard");
      }
    } catch {
      toast.error(t("networkError") || "Error de red o servidor");
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
        errorCallbackURL: "/login",
        newUserCallbackURL: "/dashboard",
      });
    } catch {
      toast.error(t("googleRedirectError") || "No se pudo redirigir a Google");
      setLoading(false);
    }
  };

  return (
    <AuthPageShell
      title={`${t("welcomeTo")} ${CLUB.shortName}`}
      subtitle={
        <>
          {t("noAccount")}{" "}
          <Link
            href="/signup"
            className="font-medium text-primary hover:text-primary/80"
          >
            {t("registerHere")}
          </Link>
        </>
      }
    >
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            name="email"
            control={control}
            rules={{ required: t("emailRequired") }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("email")}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    className={AUTH_INPUT_CLASS}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Controller
            name="password"
            control={control}
            rules={{ required: t("passwordRequired") }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("password")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder={t("yourPassword") || "Tu contraseña"}
                      className={`pr-10 ${AUTH_INPUT_CLASS}`}
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="text-sm">
            <Link
              href="/forgot-password"
              className="font-medium text-primary hover:text-primary/80"
            >
              {t("forgotPassword")}
            </Link>
          </div>

          <AuthPrimaryButton loading={loading}>
            {loading ? t("signingIn") : t("signInButton")}
          </AuthPrimaryButton>
        </form>
      </Form>

      <AuthDivider text={t("continueWith")} />

      <AuthGoogleButton
        onClick={() => void handleGoogleSignIn()}
        loading={loading}
        icon={<GoogleIcon className="mr-2 h-5 w-5" />}
      >
        {loading ? t("redirecting") : "Google"}
      </AuthGoogleButton>
    </AuthPageShell>
  );
}
