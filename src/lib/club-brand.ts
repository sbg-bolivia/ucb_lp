/** Marca y enlaces del AWS Student Builder Group UCB — ajusta NEXT_PUBLIC_* en .env */

export const CLUB = {
  shortName: "AWS Student Builder Group UCB",
  fullUniversity: 'Universidad Católica Boliviana "San Pablo"',
  heroLine1: "AWS Student Builder Group",
  tagline:
    "Únete a estudiantes universitarios en Bolivia que aprenden AWS, construyen proyectos reales en la nube y preparan su carrera en tecnología. ¡Todas las carreras son bienvenidas!",
  city: "La Paz, Bolivia",
  country: "BO",
  email: "awscloudclubucblapaz@gmail.com",
} as const;

export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "http://localhost:3000"
  );
}
