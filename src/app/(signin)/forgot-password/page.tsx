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
import { CheckCircle, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

type ForgotPasswordFormValues = {
  email: string;
};

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    defaultValues: { email: "" },
  });

  const { control, handleSubmit, setError, clearErrors } = form;

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setLoading(true);
    clearErrors();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      setError("email", {
        type: "manual",
        message: "Ingresa un correo válido",
      });
      toast.error("Ingresa un correo válido");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/trpc/auth.recoverPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      const result = await res.json();

      if (res.ok) {
        setEmailSent(true);
        toast.success("Email de recuperación enviado exitosamente");
      } else {
        toast.error(
          result.error?.message || "Error al enviar email de recuperación"
        );
      }
    } catch {
      toast.error("Error de red o servidor");
    }
    setLoading(false);
  };

  if (emailSent) {
    return (
      <AuthPageShell
        title="Email enviado"
        backHref="/login"
        backLabel="Volver al login"
        icon={<CheckCircle className="h-8 w-8 text-white" />}
      >
        <p className="text-center text-sm text-muted-foreground">
          Hemos enviado un enlace de recuperación a tu correo. Revisa tu bandeja
          de entrada y sigue las instrucciones.
        </p>

        <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-4 dark:bg-primary/10">
          <div className="flex items-start gap-2 text-sm text-foreground">
            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <span>
              Si no recibes el email en unos minutos, revisa tu carpeta de spam.
            </span>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <AuthPrimaryButton
            type="button"
            onClick={() => setEmailSent(false)}
          >
            Enviar otro email
          </AuthPrimaryButton>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/login">Volver al login</Link>
          </Button>
        </div>
      </AuthPageShell>
    );
  }

  return (
    <AuthPageShell
      title="Recuperar contraseña"
      backHref="/login"
      backLabel="Volver al login"
      subtitle="Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña."
    >
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            name="email"
            control={control}
            rules={{ required: "Correo requerido" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo electrónico</FormLabel>
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

          <AuthPrimaryButton loading={loading}>
            {loading ? "Enviando..." : "Enviar enlace de recuperación"}
          </AuthPrimaryButton>
        </form>
      </Form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        ¿Recordaste tu contraseña?{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:text-primary/80"
        >
          Inicia sesión aquí
        </Link>
      </p>
    </AuthPageShell>
  );
}
