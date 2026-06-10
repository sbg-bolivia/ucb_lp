"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

function ConfirmEmailFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
        <p className="text-gray-600">Cargando confirmación...</p>
      </div>
    </div>
  );
}

function ConfirmEmailContent() {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const confirmEmail = useCallback(
    async (token: string) => {
      try {
        const response = await fetch("/api/trpc/auth.confirmEmail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const result = await response.json();

        if (response.ok && result.result?.data === true) {
          setSuccess(true);
          toast.success("¡Email confirmado exitosamente!");

          setTimeout(() => {
            router.push("/");
          }, 3000);
        } else {
          setError("Token inválido o expirado");
          toast.error("Error al confirmar el email");
        }
      } catch (_err) {
        setError("Error de conexión");
        toast.error("Error de conexión al confirmar el email");
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  useEffect(() => {
    if (!token) {
      setError("Token de confirmación no encontrado");
      setLoading(false);
      return;
    }

    confirmEmail(token);
  }, [token, confirmEmail]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
          <p className="text-gray-600">Confirmando tu email...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-md">
        {success ? (
          <div>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-label="Checkmark icon"
              >
                <title>Checkmark icon</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="mb-2 text-2xl font-bold text-gray-900">
              ¡Email Confirmado!
            </h1>
            <p className="mb-6 text-gray-600">
              Tu cuenta ha sido confirmada exitosamente. Serás redirigido al
              inicio en unos segundos.
            </p>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
            >
              Ir al inicio
            </button>
          </div>
        ) : (
          <div>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-8 w-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-label="Error icon"
              >
                <title>Error icon</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="mb-2 text-2xl font-bold text-gray-900">
              Error de Confirmación
            </h1>
            <p className="mb-6 text-gray-600">
              {error ||
                "No se pudo confirmar tu email. El enlace puede ser inválido o haber expirado."}
            </p>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="w-full rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
              >
                Ir al inicio
              </button>
              <button
                type="button"
                onClick={() => router.push("/?show=register")}
                className="w-full rounded-lg bg-gray-200 px-6 py-2 text-gray-800 transition-colors hover:bg-gray-300"
              >
                Registrarse nuevamente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={<ConfirmEmailFallback />}>
      <ConfirmEmailContent />
    </Suspense>
  );
}
