import { redirect } from "next/navigation";

/** Ruta legada: redirige a /login */
export default function SignInRedirectPage() {
  redirect("/login");
}
