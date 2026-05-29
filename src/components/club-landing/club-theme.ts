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
    "bg-[#f5f5f7] text-[#1d1d1f] dark:bg-[#050608] dark:text-zinc-100 selection:bg-cyan-500/10",
  navBar:
    "border-b border-black/[0.04] bg-white/70 backdrop-blur-xl dark:border-white/[0.02] dark:bg-[#050608]/65",
  navLinkIdle:
    "text-slate-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-all duration-300",
  navLinkActive:
    "bg-black/5 text-black border border-black/5 dark:bg-white/10 dark:text-white dark:border-white/5",
  card: "rounded-[2.5rem] bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.06)] border border-transparent dark:border-white/[0.03] dark:bg-white/[0.01] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.01)]",
  cardHover:
    "transition-all duration-400 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:scale-[1.01] dark:hover:border-white/[0.06] dark:hover:bg-white/[0.02] dark:hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]",
  textMuted: "text-slate-500 dark:text-zinc-400",
  textHeading: "text-[#1d1d1f] dark:text-white",
  accentLine: "bg-black dark:bg-white",
  /** Capa sobre imagen hero: dark + halo. Mantenemos oscuro en hero para contraste del 3D */
  gradientHeroOverlay: "from-[#050608]/98 via-transparent to-[#050608]/98",
  /** Botones primarios: clean solid black or gradient button */
  gradientButton: "from-[#00C8FF] via-[#7E2CFF] to-[#A855F7]",
  /** Banda CTA: clean translucent */
  gradientCta:
    "bg-gradient-to-br from-[#f5f5f7]/50 to-[#f5f5f7]/30 dark:from-white/[0.01] dark:to-white/[0.005] border border-black/[0.03] dark:border-white/[0.02] shadow-[inset_0_1px_0px_rgba(255,255,255,0.01)]",
  meetupHighlight:
    "bg-[#F05663] hover:bg-[#e04552] text-white shadow-md ring-1 ring-white/10",
  sectionSoft: "bg-transparent",
  sectionTint: "bg-transparent",
} as const;
