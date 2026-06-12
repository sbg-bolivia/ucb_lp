"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CLUB } from "@/lib/club-brand";
import { fadeUpProps } from "@/lib/club-motion";
import { trpc } from "@/utils/trpc";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

import { ClubPastelBlobs } from "./club-pastel-blobs";
import { clubTheme } from "./club-theme";

type Intent = "join" | "idea" | "event";

const INTENT_OPTIONS: { value: Intent; label: string }[] = [
  { value: "join", label: "Quiero unirme a la comunidad" },
  { value: "idea", label: "Tengo una idea o sugerencia" },
  { value: "event", label: "Quiero proponer un evento" },
];

export function ClubHomeJoin() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [intent, setIntent] = useState<Intent>("join");
  const [message, setMessage] = useState("");

  const submitMut = trpc.clubInquiries.submit.useMutation({
    onSuccess: () => {
      toast.success("¡Mensaje enviado! Te contactaremos pronto.");
      setName("");
      setEmail("");
      setIntent("join");
      setMessage("");
    },
    onError: (err) => {
      toast.error(err.message || "No se pudo enviar el mensaje.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMut.mutate({ name, email, intent, message });
  };

  return (
    <section
      id="unete"
      className={`relative scroll-mt-24 overflow-hidden ${clubTheme.sectionY} ${clubTheme.sectionSoft}`}
    >
      <ClubPastelBlobs subtle />
      <div className={`relative ${clubTheme.container}`}>
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-10 xl:gap-14">
          <motion.div className="lg:pt-2" {...fadeUpProps}>
            <span className="inline-flex rounded-full border border-[var(--border-soft)] bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[var(--ucb-blue)] dark:bg-[var(--surface-soft)] dark:text-[var(--aws-orange)]">
              Únete
            </span>
            <h2 className={`mt-4 text-3xl font-bold tracking-tight sm:text-4xl ${clubTheme.textHeading}`}>
              Forma parte del club
            </h2>
            <p className={`mt-3 max-w-lg text-base leading-relaxed sm:text-lg ${clubTheme.textMuted}`}>
              Cuéntanos si quieres participar, compartir una idea o sumarte a la
              comunidad del {CLUB.shortName}.
            </p>

            <ul className={`mt-6 space-y-3 text-sm ${clubTheme.textMuted}`}>
              <li className="flex items-start gap-2.5">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[var(--aws-orange)]" />
                Talleres, labs y proyectos con AWS en el campus.
              </li>
              <li className="flex items-start gap-2.5">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[var(--aws-orange)]" />
                Comunidad activa por Meetup, WhatsApp y redes.
              </li>
              <li className="flex items-start gap-2.5">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[var(--aws-orange)]" />
                Todas las carreras son bienvenidas — no hace falta experiencia previa.
              </li>
            </ul>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className={`rounded-[1.75rem] border border-[var(--border-soft)] p-5 shadow-[var(--shadow-soft)] sm:p-6 ${clubTheme.card}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="join-name" className="text-[11px] font-semibold uppercase tracking-wide">
                  Nombre completo
                </Label>
                <Input
                  id="join-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  required
                  maxLength={120}
                  className="rounded-xl border-[var(--border-soft)] bg-white/70 dark:bg-[var(--surface)]"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="join-email" className="text-[11px] font-semibold uppercase tracking-wide">
                  Correo
                </Label>
                <Input
                  id="join-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  required
                  maxLength={200}
                  className="rounded-xl border-[var(--border-soft)] bg-white/70 dark:bg-[var(--surface)]"
                />
              </div>
            </div>

            <div className="mt-3 space-y-1.5">
              <Label htmlFor="join-intent" className="text-[11px] font-semibold uppercase tracking-wide">
                ¿Qué te interesa?
              </Label>
              <Select value={intent} onValueChange={(v) => setIntent(v as Intent)}>
                <SelectTrigger
                  id="join-intent"
                  className="rounded-xl border-[var(--border-soft)] bg-white/70 dark:bg-[var(--surface)]"
                >
                  <SelectValue placeholder="Elige una opción" />
                </SelectTrigger>
                <SelectContent>
                  {INTENT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mt-3 space-y-1.5">
              <Label htmlFor="join-message" className="text-[11px] font-semibold uppercase tracking-wide">
                Mensaje
              </Label>
              <Textarea
                id="join-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Cuéntanos un poco sobre ti, tu idea o cómo te gustaría participar…"
                required
                minLength={10}
                maxLength={5000}
                rows={4}
                className="resize-none rounded-xl border-[var(--border-soft)] bg-white/70 dark:bg-[var(--surface)]"
              />
            </div>

            <Button
              type="submit"
              disabled={submitMut.isPending}
              className={`mt-5 h-11 w-full rounded-full text-sm font-bold ${clubTheme.gradientButton}`}
            >
              {submitMut.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="mr-2 h-4 w-4" />
              )}
              Enviar mensaje
            </Button>

            <p className={`mt-3 text-xs ${clubTheme.textMuted}`}>
              Tu mensaje llega al equipo del club. Solo lo usamos para responderte.
            </p>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
