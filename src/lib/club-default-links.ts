/**
 * Valores por defecto cuando el tenant aún no tiene URLs en la base de datos.
 * El panel Admin (Ajustes → Redes sociales) puede sobrescribirlos.
 *
 * LinkedIn e Instagram: no nos pasaste URLs válidas (coincidían con TikTok);
 * complétalas en el admin cuando las tengas.
 */
export const CLUB_LINK_DEFAULTS = {
  meetupUrl:
    "https://www.meetup.com/aws-cloud-club-at-universidad-catolica-boliviana-san-pablo/",
  whatsappUrl: "https://chat.whatsapp.com/IeSOHxTKg0UFbH8HBAvKwo",
  tiktokUrl: "https://www.tiktok.com/@aws_cc_ucb_lpz",
  linkedinUrl: "",
  instagramUrl: "",
} as const;
