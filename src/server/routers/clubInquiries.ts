import { CLUB } from "@/lib/club-brand";
import { prisma } from "@/lib/db";
import { sendMail } from "@/lib/mailer";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

const INTENT_LABELS = {
  join: "Quiero unirme a la comunidad",
  idea: "Tengo una idea o sugerencia",
  event: "Quiero proponer un evento",
} as const;

const inquirySchema = z.object({
  name: z.string().min(2).max(120).trim(),
  email: z.string().email().max(200).trim(),
  intent: z.enum(["join", "idea", "event"]),
  message: z.string().min(10).max(5000).trim(),
});

export const clubInquiriesRouter = router({
  submit: publicProcedure.input(inquirySchema).mutation(async ({ input }) => {
    const tenant = await prisma.tenant.findFirst({
      where: { isActive: true },
      select: { email: true },
    });
    const to = tenant?.email?.trim() || CLUB.email;

    const body = [
      `Nombre: ${input.name}`,
      `Correo: ${input.email}`,
      `Motivo: ${INTENT_LABELS[input.intent]}`,
      "",
      "Mensaje:",
      input.message,
    ].join("\n");

    try {
      await sendMail(
        to,
        `[${CLUB.shortName}] ${INTENT_LABELS[input.intent]} — ${input.name}`,
        body
      );
      return { ok: true as const };
    } catch {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `No pudimos enviar tu mensaje. Escríbenos a ${to}.`,
      });
    }
  }),
});
