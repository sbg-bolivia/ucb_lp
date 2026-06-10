import { hashPassword } from "better-auth/crypto";
import { prisma } from "@/lib/db";

const CREDENTIAL_PROVIDER = "credential";

/** Hash compatible con Better Auth (scrypt). */
export async function hashAuthPassword(password: string): Promise<string> {
  return hashPassword(password);
}

/** Actualiza o crea la cuenta credential de un usuario. */
export async function upsertCredentialPassword(
  userId: string,
  password: string
): Promise<void> {
  const hashedPassword = await hashAuthPassword(password);

  const existing = await prisma.account.findFirst({
    where: { userId, providerId: CREDENTIAL_PROVIDER },
  });

  if (existing) {
    await prisma.account.update({
      where: { id: existing.id },
      data: { password: hashedPassword },
    });
    return;
  }

  await prisma.account.create({
    data: {
      userId,
      providerId: CREDENTIAL_PROVIDER,
      accountId: userId,
      password: hashedPassword,
    },
  });
}
