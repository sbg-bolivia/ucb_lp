/**
 * Login/registro visibles en navbar y menús públicos.
 * Por defecto oculto (sitio informativo). Activa con NEXT_PUBLIC_SHOW_PUBLIC_LOGIN=true
 */
export const SHOW_PUBLIC_LOGIN =
  process.env.NEXT_PUBLIC_SHOW_PUBLIC_LOGIN === "true";
