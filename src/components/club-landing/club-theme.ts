/**
 * Paleta landing (SBG builder):
 * - Cyan: #00C8FF
 * - Purple: #7E2CFF
 * - Magenta: #A855F7
 * - Dark: #0C0D12
 * Modo claro: se mantiene, pero el foco del marketing es dark.
 * Modo oscuro vía clase `dark` en <html> (next-themes).
 */
export const clubTheme = {
  pageBg:
    "bg-[#cfe8f6] text-slate-900 dark:bg-[#0C0D12] dark:text-white",
  navBar:
    "border-b border-sky-300/50 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/72 dark:border-white/10 dark:bg-[#0C0D12]/80 dark:supports-[backdrop-filter]:bg-[#0C0D12]/70",
  navLinkIdle:
    "text-slate-700 hover:bg-sky-100/90 hover:text-[#1e3a8a] dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-white",
  navLinkActive:
    "bg-[#7E2CFF] text-white shadow-md shadow-[#7E2CFF]/25 dark:shadow-[#7E2CFF]/20",
  card:
    "rounded-3xl border border-sky-200/90 bg-white/92 shadow-md shadow-sky-900/[0.06] dark:border-white/10 dark:bg-[#12131a]/70 dark:shadow-black/40",
  cardHover:
    "transition-all duration-300 hover:border-[#00C8FF]/35 hover:shadow-lg hover:shadow-[#7E2CFF]/10 hover:-translate-y-0.5 dark:hover:border-[#7E2CFF]/40 dark:hover:shadow-[#7E2CFF]/15",
  textMuted: "text-slate-600 dark:text-zinc-400",
  textHeading: "text-slate-900 dark:text-white",
  accentLine: "bg-[#00C8FF]",
  /** Capa sobre imagen hero: dark + halo cyan/purple. */
  gradientHeroOverlay:
    "from-[#0C0D12]/90 via-[#0C0D12]/85 to-[#0C0D12]/92",
  /** Botones primarios: cyan → purple. */
  gradientButton: "from-[#00C8FF] via-[#7E2CFF] to-[#A855F7]",
  /** Banda CTA: gradiente suave. */
  gradientCta:
    "bg-gradient-to-r from-[#00C8FF]/15 via-[#7E2CFF]/15 to-[#A855F7]/15 border border-white/10",
  meetupHighlight:
    "bg-[#F05663] hover:bg-[#e04552] text-white shadow-lg shadow-rose-500/30 ring-2 ring-white/40 dark:ring-white/20",
  sectionSoft: "bg-sky-50/75 dark:bg-zinc-900/45",
  sectionTint: "bg-[#d4e9f7]/80 dark:bg-zinc-900/55",
} as const;
