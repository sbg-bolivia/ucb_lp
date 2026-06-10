import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = generateSEOMetadata({
  title: "Login",
  description:
    "Accede a tu cuenta del AWS Student Builder Group UCB para gestionar eventos, servicios y contenido del club.",
  keywords: ["login", "iniciar sesión", "acceso", "autenticación"],
});

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
