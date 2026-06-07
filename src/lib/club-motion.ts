/** Curva suave para transiciones (Apple style ease). */
export const clubEase = [0.16, 1, 0.3, 1] as const;

export const fadeUpProps = {
  initial: { opacity: 0, y: 30, scale: 0.98 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: clubEase },
} as const;

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
} as const;

export const staggerItem = {
  hidden: { opacity: 0, y: 25, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: clubEase },
  },
} as const;
