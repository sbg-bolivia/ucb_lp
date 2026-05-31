/**
 * Datos de demostración del AWS Student Builder Group UCB.
 * Usados por prisma/seed.ts — IDs fijos para URLs estables (/eventos/[id], /proyectos/[id]).
 */

export const CLUB_TENANT_ID = "tenant-aws-sbg-ucb";

export const CLUB_EVENT_IDS = {
  workshopIntro: "11111111-1111-4111-8111-111111111101",
  buildathon: "11111111-1111-4111-8111-111111111102",
  certification: "11111111-1111-4111-8111-111111111103",
  networking: "11111111-1111-4111-8111-111111111104",
  gameDay: "11111111-1111-4111-8111-111111111105",
} as const;

export const CLUB_PROJECT_IDS = {
  serverlessApi: "22222222-2222-4222-8222-222222222201",
  iotDashboard: "22222222-2222-4222-8222-222222222202",
  mlPipeline: "22222222-2222-4222-8222-222222222203",
  staticSite: "22222222-2222-4222-8222-222222222204",
  chatbot: "22222222-2222-4222-8222-222222222205",
} as const;

const U = "https://images.unsplash.com";

export const CLUB_UNSPLASH = {
  eventWorkshop: `${U}/photo-1516321318423-f06f0e504b6e?auto=format&fit=crop&w=1200&q=80`,
  eventBuild: `${U}/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80`,
  eventCert: `${U}/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80`,
  eventNetwork: `${U}/photo-1540575467067-178ab98d8357?auto=format&fit=crop&w=1200&q=80`,
  eventGame: `${U}/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80`,
  projApi: `${U}/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80`,
  projIot: `${U}/photo-1518432031356-d46fc7c0e6e0?auto=format&fit=crop&w=1200&q=80`,
  projMl: `${U}/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80`,
  projWeb: `${U}/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80`,
  projBot: `${U}/photo-1535378917042-10a22a959e9a?auto=format&fit=crop&w=1200&q=80`,
} as const;

export function daysFromNow(days: number, hour = 18, minute = 0): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d;
}

export function hoursAfter(start: Date, hours: number): Date {
  return new Date(start.getTime() + hours * 60 * 60 * 1000);
}

export const SEED_USERS = [
  {
    name: "Super Admin SBG",
    email: "superadmin@awscloudclub.ucb",
    password: "ClubSuper123!@#",
    phone: "+591 70000001",
    language: "ES" as const,
    roleName: "super_admin",
  },
  {
    name: "Admin Cloud Club",
    email: "admin@awscloudclub.ucb",
    password: "ClubAdmin123!@#",
    phone: "+591 70000002",
    language: "ES" as const,
    roleName: "admin",
  },
  {
    name: "Moderador Eventos",
    email: "moderador@awscloudclub.ucb",
    password: "ClubMod123!@#",
    phone: "+591 70000003",
    language: "ES" as const,
    roleName: "moderator",
  },
  {
    name: "Luan García",
    email: "miembro@awscloudclub.ucb",
    password: "ClubUser123!@#",
    phone: "+591 70000004",
    language: "ES" as const,
    roleName: "user",
  },
  {
    name: "María Fernández",
    email: "maria@awscloudclub.ucb",
    password: "ClubUser123!@#",
    phone: "+591 70000005",
    language: "ES" as const,
    roleName: "user",
  },
  {
    name: "Carlos Mendoza",
    email: "carlos@awscloudclub.ucb",
    password: "ClubUser123!@#",
    phone: "+591 70000006",
    language: "EN" as const,
    roleName: "user",
  },
  {
    name: "Visitante Solo Lectura",
    email: "viewer@awscloudclub.ucb",
    password: "ClubViewer123!@#",
    phone: "+591 70000007",
    language: "ES" as const,
    roleName: "viewer",
  },
] as const;

export const CORE_TEAM_SEED = [
  {
    id: "core-1",
    name: "Luan García",
    role: "Presidente · AWS Student Builder",
    image: "https://i.pravatar.cc/256?u=sbg-luan",
    linkedin: "https://www.linkedin.com/in/",
    github: "https://github.com/",
    instagram: null,
  },
  {
    id: "core-2",
    name: "María Fernández",
    role: "Vicepresidenta · Comunidad",
    image: "https://i.pravatar.cc/256?u=sbg-maria",
    linkedin: "https://www.linkedin.com/in/",
    github: "https://github.com/",
    instagram: null,
  },
  {
    id: "core-3",
    name: "Carlos Mendoza",
    role: "Líder técnico · Workshops",
    image: "https://i.pravatar.cc/256?u=sbg-carlos",
    linkedin: "https://www.linkedin.com/in/",
    github: "https://github.com/",
    instagram: null,
  },
  {
    id: "core-4",
    name: "Ana Quispe",
    role: "Coordinación de eventos",
    image: "https://i.pravatar.cc/256?u=sbg-ana",
    linkedin: null,
    github: "https://github.com/",
    instagram: null,
  },
  {
    id: "core-5",
    name: "Diego Rojas",
    role: "Proyectos en la nube",
    image: "https://i.pravatar.cc/256?u=sbg-diego",
    linkedin: "https://www.linkedin.com/in/",
    github: "https://github.com/",
    instagram: null,
  },
  {
    id: "core-6",
    name: "Sofía Vargas",
    role: "Diseño y comunicación",
    image: "https://i.pravatar.cc/256?u=sbg-sofia",
    linkedin: null,
    github: null,
    instagram: "https://www.instagram.com/",
  },
] as const;
