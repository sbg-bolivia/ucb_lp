/**

 * Identidad AWS Student Builder Group UCB

 * Modo claro: pastel institucional · Modo oscuro: azul AWS

 */

export const clubTheme = {

  pageBg:

    "bg-transparent text-[var(--text)] dark:bg-[var(--brand-dark)] dark:text-[var(--text-main)]",

  navBar:

    "border-b border-[var(--border-soft)]/35 bg-white/42 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_8px_32px_rgba(21,38,61,0.05)] dark:border-white/8 dark:bg-[var(--brand-dark)]/40 dark:shadow-none",

  navLinkIdle:

    "text-[var(--text-secondary)] hover:text-[var(--ucb-blue)] dark:text-[var(--text-muted)] dark:hover:text-[var(--text-main)] transition-all duration-300",

  navLinkActive:

    "bg-white/55 text-[var(--ucb-blue)] border border-[var(--border-soft)]/60 shadow-sm backdrop-blur-sm dark:bg-[var(--surface-soft)]/90 dark:text-[var(--text-main)] dark:border-white/12",

  card:

    "rounded-2xl bg-[rgba(255,248,240,0.88)] shadow-[var(--shadow-soft)] border border-[var(--border-soft)]/85 dark:rounded-2xl dark:bg-[var(--surface-soft)] dark:border-[var(--border-soft)] dark:shadow-none",

  cardHover:

    "transition-all duration-400 hover:shadow-[0_20px_48px_rgba(21,38,61,0.12)] hover:border-[var(--aws-orange)]/35 dark:hover:border-[var(--aws-orange)]/30",

  textMuted: "text-[var(--muted)] dark:text-[var(--text-muted)]",

  textHeading: "text-[var(--text)] dark:text-[var(--text-main)]",

  accentLine: "bg-[var(--aws-orange)]",

  gradientHeroOverlay:

    "from-[var(--brand-dark)]/95 via-transparent to-[var(--brand-dark)]/95",

  gradientButton:

    "bg-gradient-to-br from-[var(--aws-orange)] to-[var(--aws-orange-soft)] hover:from-[#E88B00] hover:to-[var(--aws-orange)] text-[var(--ucb-blue-dark)] font-bold shadow-[0_14px_30px_rgba(255,153,0,0.24)]",

  gradientCta:

    "border border-[var(--border-soft)] bg-[rgba(255,248,240,0.78)] shadow-lg dark:border-[var(--border-soft)] dark:bg-[var(--surface)]",

  meetupHighlight:

    "bg-[#F05663] hover:bg-[#e04552] text-white shadow-md",

  sectionSoft: "bg-transparent dark:bg-[var(--brand-dark)]",

  sectionTint:

    "bg-[rgba(255,244,228,0.55)] dark:bg-[var(--surface)]",

  sectionDark:

    "bg-transparent text-[var(--text)] dark:bg-[var(--aws-ink)] dark:text-[var(--text-main)]",

  container: "mx-auto w-full max-w-7xl px-4 sm:px-6",

  sectionY: "px-4 py-10 sm:px-6 sm:py-14",

  sectionYCompact: "px-4 py-8 sm:px-6 sm:py-10",

  ctaButtonLong:

    "bg-[length:320%_100%] bg-gradient-to-r from-[#E88B00] via-[#FF9900] via-[#FFAD33] via-[#FFC966] to-[#E88B00] text-[#15263D] font-bold transition-[background-position,transform,box-shadow] duration-700 ease-in-out hover:bg-[position:100%_0] hover:shadow-[0_8px_28px_rgba(255,153,0,0.35)]",

  /** Tarjeta destacada con tinte violeta pastel */

  featuredCard:

    "rounded-[2rem] border border-[var(--pastel-violet)]/40 bg-gradient-to-br from-[var(--pastel-violet-soft)] via-[rgba(255,248,240,0.95)] to-[var(--bg-soft-blue)] dark:from-[var(--surface-soft)] dark:via-[var(--surface)] dark:to-[var(--surface-soft)] dark:border-[var(--border-soft)]",

} as const;

