import type { CoreTeamMember } from "@/lib/club-core-team-schema";

export type { CoreTeamMember };

/** Valores por defecto si el admin aún no guardó el equipo en la base de datos. */
export const CORE_TEAM_MEMBERS: CoreTeamMember[] = [
  {
    id: "1",
    name: "Nombre 1",
    role: "Presidente · Liderazgo",
    linkedin: "",
    instagram: "",
    github: "",
  },
  {
    id: "2",
    name: "Nombre 2",
    role: "Vicepresidente · Operaciones",
    linkedin: "",
    instagram: "",
    github: "",
  },
  {
    id: "3",
    name: "Nombre 3",
    role: "Lead técnico · Talleres",
    linkedin: "",
    instagram: "",
    github: "",
  },
  {
    id: "4",
    name: "Nombre 4",
    role: "Comunicación · Redes",
    linkedin: "",
    instagram: "",
    github: "",
  },
  {
    id: "5",
    name: "Nombre 5",
    role: "Eventos · Comunidad",
    linkedin: "",
    instagram: "",
    github: "",
  },
];
