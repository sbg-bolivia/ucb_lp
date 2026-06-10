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

// Password rules will be translated dynamically

type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  repeatPassword: string;
};

export default function SignUpPage() {
  const { t } = useTranslation("common");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const passwordRules = [
    {
      label: t("passwordRuleMin") || "Mínimo 8 caracteres",
      test: (v: string) => v.length >= 8,
    },
    {
      label: t("passwordRuleUpper") || "Una mayúscula",
      test: (v: string) => /[A-Z]/.test(v),
    },
    {
      label: t("passwordRuleNumber") || "Un número",
      test: (v: string) => /[0-9]/.test(v),
    },
    {
      label: t("passwordRuleSpecial") || "Un carácter especial",
      test: (v: string) => /[^A-Za-z0-9]/.test(v),
    },
  ];

  const form = useForm<RegisterFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      repeatPassword: "",
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    setError: setFormError,
    clearErrors,
    formState: { errors: _errors },
  } = form;

  const password = watch("password");
  const repeatPassword = watch("repeatPassword");

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    clearErrors();

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      setFormError("email", {
        type: "manual",
        message: t("validEmail"),
      });
      toast.error(t("validEmail"));
      setLoading(false);
      return;
    }

    // Validación de contraseñas
    if (data.password !== data.repeatPassword) {
      setFormError("repeatPassword", {
        type: "manual",
        message: t("passwordNoMatch"),
      });
      setLoading(false);
      return;
    }

    // Validación de reglas de contraseña
    const failedRule = passwordRules.find((rule) => !rule.test(data.password));
    if (failedRule) {
      setFormError("password", {
        type: "manual",
        message: `${t("passwordMustContain")}: ${failedRule.label}`,
      });
      setLoading(false);
      return;
    }

    try {
      const { error } = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
        callbackURL: "/", // Let RoleBasedRedirect handle the redirection
      });

      if (error) {
        toast.error(t("errorCreatingAccount") || "Error al crear cuenta", {
          description: error.message,
        });
      } else {
        toast.success(
          t("accountCreatedSuccess") || "¡Cuenta creada exitosamente!",
          {
            description:
              t("checkEmailToConfirm") ||
              "Revisa tu email para confirmar tu cuenta.",
          }
        );
        // Let RoleBasedRedirect handle the redirection based on user role
        router.push("/");
      }
    } catch (_error) {
      toast.error(t("networkError") || "Error de red o servidor");
    }
    setLoading(false);
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
        errorCallbackURL: "/signup",
        newUserCallbackURL: "/dashboard",
      });
    } catch (_error) {
      toast.error(t("googleRedirectError") || "No se pudo redirigir a Google");
      setLoading(false);
    }
  };

  return (
    <AuthPageShell
      title={`${t("join")} ${CLUB.shortName}`}
      subtitle={
        <>
          {t("hasAccount")}{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:text-primary/80"
          >
            {t("signInHere")}
          </Link>
        </>
      }
    >
      <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Controller
                name="name"
                control={control}
                rules={{ required: t("nameRequired") }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fullName")}</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={t("yourFullName") || "Tu nombre completo"}
                        className={AUTH_INPUT_CLASS}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                          {...field}
                          className={`pr-10 ${AUTH_INPUT_CLASS}`}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword(!showPassword)}
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

              {/* Password Rules */}
              <ul className="text-sm space-y-1">
                {passwordRules.map((rule) => {
                  const valid = rule.test(password);
                  return (
                    <li
                      key={rule.label}
                      className={
                        valid
                          ? "flex items-center gap-1 text-emerald-600 dark:text-emerald-400"
                          : "flex items-center gap-1 text-muted-foreground"
                      }
                    >
                      <span
                        className="inline-block w-2 h-2 rounded-full"
                        style={{ background: valid ? "#22c55e" : "#d1d5db" }}
                      />
                      {rule.label}
                    </li>
                  );
                })}
              </ul>

              <Controller
                name="repeatPassword"
                control={control}
                rules={{ required: t("repeatPasswordRequired") }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("repeatPassword")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showRepeatPassword ? "text" : "password"}
                          placeholder={
                            t("repeatYourPassword") || "Repite tu contraseña"
                          }
                          {...field}
                          className={`pr-10 ${AUTH_INPUT_CLASS}`}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() =>
                            setShowRepeatPassword(!showRepeatPassword)
                          }
                        >
                          {showRepeatPassword ? (
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

              {repeatPassword.length > 0 && (
                <div
                  className={
                    password === repeatPassword
                      ? "text-sm text-emerald-600 dark:text-emerald-400"
                      : "text-sm text-destructive"
                  }
                >
                  {password === repeatPassword
                    ? t("passwordMatch")
                    : t("passwordNoMatch")}
                </div>
              )}

              <AuthPrimaryButton loading={loading}>
                {loading ? t("creatingAccount") : t("createAccount")}
              </AuthPrimaryButton>
            </form>
          </Form>

      <AuthDivider text={t("continueWith")} />

      <AuthGoogleButton
        onClick={() => void handleGoogleSignUp()}
        loading={loading}
        icon={<GoogleIcon className="mr-2 h-5 w-5" />}
      >
        {loading ? t("redirecting") : "Google"}
      </AuthGoogleButton>
    </AuthPageShell>
  );
}
