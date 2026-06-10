/**
 * Identidad AWS Student Builder Group UCB
 * Proporción: 70% azul oscuro · 20% neutros claros · 10% naranja AWS
 */
export const clubTheme = {
  pageBg:
    "bg-[var(--bg)] text-[var(--text)] dark:bg-[var(--brand-dark)] dark:text-[var(--text-main)]",
  navBar:
    "border-b border-slate-200/80 bg-white/85 backdrop-blur-xl dark:border-[var(--border-soft)] dark:bg-[var(--aws-ink)]/90",
  navLinkIdle:
    "text-slate-600 hover:text-[var(--aws-ink)] dark:text-[var(--text-muted)] dark:hover:text-[var(--text-main)] transition-all duration-300",
  navLinkActive:
    "bg-slate-100 text-[var(--aws-ink)] border border-slate-200 dark:bg-[var(--surface-soft)] dark:text-[var(--text-main)] dark:border-[var(--border-soft)]",
  card: "rounded-2xl bg-[var(--card)] shadow-sm border border-slate-200/80 dark:rounded-2xl dark:bg-[var(--surface-soft)] dark:border-[var(--border-soft)] dark:shadow-none",
  cardHover:
    "transition-all duration-400 hover:shadow-md hover:border-[var(--aws-orange)]/25 dark:hover:border-[var(--aws-orange)]/30",
  textMuted: "text-[var(--muted)] dark:text-[var(--text-muted)]",
  textHeading: "text-[var(--text)] dark:text-[var(--text-main)]",
  accentLine: "bg-[var(--aws-orange)]",
  gradientHeroOverlay:
    "from-[var(--brand-dark)]/95 via-transparent to-[var(--brand-dark)]/95",
  /** Botón primario — naranja AWS sólido */
  gradientButton:
    "bg-[var(--aws-orange)] hover:bg-[#E88B00] text-[#0F172A] font-bold",
  /** Banda CTA */
  gradientCta:
    "border border-slate-200 bg-[var(--bg)] shadow-lg dark:border-[var(--border-soft)] dark:bg-[var(--surface)]",
  meetupHighlight:
    "bg-[#F05663] hover:bg-[#e04552] text-white shadow-md",
  sectionSoft: "bg-[var(--bg)] dark:bg-[var(--brand-dark)]",
  sectionTint: "bg-slate-50 dark:bg-[var(--surface)]",
  sectionDark: "bg-[var(--aws-ink)] text-[var(--text-main)]",
  sectionY: "px-4 py-10 sm:px-6 sm:py-14",
  sectionYCompact: "px-4 py-8 sm:px-6 sm:py-10",
  /** Botón CTA con gradiente naranja animado al hover */
  ctaButtonLong:
    "bg-[length:320%_100%] bg-gradient-to-r from-[#E88B00] via-[#FF9900] via-[#FFAD33] via-[#FFC966] to-[#E88B00] text-[#0F172A] font-bold transition-[background-position,transform,box-shadow] duration-700 ease-in-out hover:bg-[position:100%_0] hover:shadow-[0_8px_28px_rgba(255,153,0,0.35)]",
} as const;
