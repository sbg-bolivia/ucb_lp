"use client";

import {
  AuthPageShell,
  AuthPrimaryButton,
  AUTH_INPUT_CLASS,
} from "@/components/auth/AuthPageShell";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

type ResetPasswordFormValues = {
  password: string;
  confirmPassword: string;
};

function ResetPasswordFallback() {
  return (
    <AuthPageShell
      title="Restablecer contraseña"
      backHref="/login"
      backLabel="Volver al login"
      subtitle="Cargando enlace de recuperación..."
    >
      <div className="flex justify-center py-8">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
      </div>
    </AuthPageShell>
  );
}

function ResetPasswordContent() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<ResetPasswordFormValues>({
    defaultValues: { password: "", confirmPassword: "" },
  });

  const { control, handleSubmit, setError, clearErrors, watch } = form;
  const password = watch("password");

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      return;
    }
    setTokenValid(true);
  }, [token]);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setLoading(true);
    clearErrors();

    if (data.password.length < 6) {
      setError("password", {
        type: "manual",
        message: "La contraseña debe tener al menos 6 caracteres",
      });
      setLoading(false);
      return;
    }

    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Las contraseñas no coinciden",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/trpc/auth.resetPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: data.password }),
      });

      const result = await response.json();

      if (response.ok && result.result?.data) {
        toast.success("¡Contraseña restablecida exitosamente!");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        toast.error(
          result.error?.message || "Error al restablecer la contraseña"
        );
      }
    } catch {
      toast.error("Error de red o servidor");
    }
    setLoading(false);
  };

  if (!token || tokenValid === false) {
    return (
      <AuthPageShell
        title={!token ? "Token inválido" : "Token expirado"}
        backHref="/login"
        backLabel="Volver al login"
        icon={<AlertCircle className="h-8 w-8 text-white" />}
      >
        <p className="text-center text-sm text-muted-foreground">
          El enlace de recuperación no es válido o ha expirado. Solicita uno
          nuevo.
        </p>
        <Button className="mt-6 w-full" asChild>
          <Link href="/forgot-password">Solicitar nuevo enlace</Link>
        </Button>
      </AuthPageShell>
    );
  }

  return (
    <AuthPageShell
      title="Restablecer contraseña"
      backHref="/login"
      backLabel="Volver al login"
      subtitle="Ingresa tu nueva contraseña"
      icon={<CheckCircle className="h-8 w-8 text-white" />}
    >
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            name="password"
            control={control}
            rules={{ required: "Contraseña requerida" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nueva contraseña</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 6 caracteres"
                      className={`pr-10 ${AUTH_INPUT_CLASS}`}
                      {...field}
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

          <Controller
            name="confirmPassword"
            control={control}
            rules={{
              required: "Confirma tu contraseña",
              validate: (value) =>
                value === password || "Las contraseñas no coinciden",
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar contraseña</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Repite tu contraseña"
                      className={`pr-10 ${AUTH_INPUT_CLASS}`}
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
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

          <AuthPrimaryButton loading={loading}>
            {loading ? "Restableciendo..." : "Restablecer contraseña"}
          </AuthPrimaryButton>
        </form>
      </Form>
    </AuthPageShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
