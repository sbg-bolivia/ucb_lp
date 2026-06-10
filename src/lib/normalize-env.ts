/** Quita comillas accidentales (común al copiar desde .env a la consola de Amplify). */
export function normalizeEnvValue(value: string | undefined): string | undefined {
  if (!value) return value;
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

/** Aplica normalización a variables sensibles al arranque del servidor. */
export function normalizeRuntimeEnv(): void {
  const keys = ["DATABASE_URL", "SITE_URL", "NEXT_PUBLIC_SITE_URL"] as const;
  for (const key of keys) {
    const current = process.env[key];
    const normalized = normalizeEnvValue(current);
    if (normalized && normalized !== current) {
      process.env[key] = normalized;
    }
  }
}
