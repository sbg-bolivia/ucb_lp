/**
 * Paleta marca: azul #3b41ff (acento principal) y violeta #6a11cb (acento secundario).
 * Modo claro: fondo celeste/azul suave (menos blanco-lavanda).
 * Modo oscuro vía clase `dark` en <html> (next-themes).
 */
export const clubTheme = {
  pageBg:
    "bg-[#cfe8f6] text-slate-900 dark:bg-gradient-to-b dark:from-zinc-950 dark:via-[#0f0a1c] dark:to-[#07051a] dark:text-white",
  navBar:
    "border-b border-sky-300/50 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/72 dark:border-white/10 dark:bg-zinc-950/90 dark:supports-[backdrop-filter]:bg-zinc-950/80",
  navLinkIdle:
    "text-slate-700 hover:bg-sky-100/90 hover:text-[#1e3a8a] dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white",
  navLinkActive:
    "bg-[#3b41ff] text-white shadow-md shadow-[#3b41ff]/30 dark:shadow-violet-900/40",
  card:
    "rounded-3xl border border-sky-200/90 bg-white/92 shadow-md shadow-sky-900/[0.06] dark:border-white/10 dark:bg-zinc-900/75 dark:shadow-black/40",
  cardHover:
    "transition-all duration-300 hover:border-[#3b41ff]/35 hover:shadow-lg hover:shadow-[#3b41ff]/10 hover:-translate-y-0.5 dark:hover:border-violet-500/40 dark:hover:shadow-violet-950/30",
  textMuted: "text-slate-600 dark:text-zinc-400",
  textHeading: "text-slate-900 dark:text-white",
  accentLine: "bg-[#3b41ff]",
  /** Capa sobre imagen hero: tono celeste + toque del azul marca (sin degradado pesado). */
  gradientHeroOverlay:
    "from-sky-100/88 via-[#dbeafe]/90 to-[#c7d9f5]/92 dark:from-zinc-950/92 dark:via-zinc-950/90 dark:to-[#0a0718]/95",
  /** Botones primarios: azul marca sólido con ligero brillo en hover (clase extra en componente). */
  gradientButton: "from-[#3b41ff] to-[#3b41ff]",
  /** Banda CTA: superficie plana azul marca. */
  gradientCta: "bg-[#3b41ff] border border-[#2d35cc]/25",
  meetupHighlight:
    "bg-[#F05663] hover:bg-[#e04552] text-white shadow-lg shadow-rose-500/30 ring-2 ring-white/40 dark:ring-white/20",
  sectionSoft: "bg-sky-50/75 dark:bg-zinc-900/45",
  sectionTint: "bg-[#d4e9f7]/80 dark:bg-zinc-900/55",
} as const;
