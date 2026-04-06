/** Valor para input `datetime-local` en zona local del navegador. */
export function toDatetimeLocalValue(
  d: Date | string | null | undefined
): string {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** Convierte valor de `datetime-local` a `Date` o `null` si está vacío. */
export function parseDatetimeLocal(value: string): Date | null {
  const t = value?.trim();
  if (!t) return null;
  const d = new Date(t);
  return Number.isNaN(d.getTime()) ? null : d;
}
