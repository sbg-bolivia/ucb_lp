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

/** Otras comunidades AWS en Bolivia (SBG, User Groups por departamento, etc.) */
export const AWS_COMMUNITIES_SEED = [
  {
    id: "comm-sbg-ucb-lpz",
    name: "AWS Student Builder Group UCB La Paz",
    communityType: "STUDENT_BUILDER_GROUP" as const,
    university: 'Universidad Católica Boliviana "San Pablo"',
    department: "La Paz",
    city: "La Paz",
    latitude: -16.5,
    longitude: -68.15,
    description:
      "Comunidad estudiantil oficial en la UCB. Talleres, certificaciones y proyectos en AWS.",
    meetupUrl:
      "https://www.meetup.com/aws-cloud-club-at-universidad-catolica-boliviana-san-pablo/",
    websiteUrl: "https://www.sbgbo.com",
    isOwnGroup: true,
    sortOrder: 0,
  },
  {
    id: "comm-ug-la-paz",
    name: "AWS User Group La Paz",
    communityType: "USER_GROUP" as const,
    department: "La Paz",
    city: "La Paz",
    latitude: -16.49,
    longitude: -68.12,
    description:
      "Comunidad abierta de profesionales y estudiantes apasionados por AWS en La Paz.",
    meetupUrl: null,
    websiteUrl: null,
    isOwnGroup: false,
    sortOrder: 1,
  },
  {
    id: "comm-ug-santa-cruz",
    name: "AWS User Group Santa Cruz",
    communityType: "USER_GROUP" as const,
    department: "Santa Cruz",
    city: "Santa Cruz de la Sierra",
    latitude: -17.78,
    longitude: -63.18,
    description: "User Group de la región oriental — charlas, networking y labs.",
    meetupUrl: null,
    websiteUrl: null,
    isOwnGroup: false,
    sortOrder: 2,
  },
  {
    id: "comm-ug-cochabamba",
    name: "AWS User Group Cochabamba",
    communityType: "USER_GROUP" as const,
    department: "Cochabamba",
    city: "Cochabamba",
    latitude: -17.39,
    longitude: -66.16,
    description: "Comunidad AWS en el valle — eventos técnicos y mentoría.",
    meetupUrl: null,
    websiteUrl: null,
    isOwnGroup: false,
    sortOrder: 3,
  },
  {
    id: "comm-sbg-umsa",
    name: "AWS Cloud Club UMSA",
    communityType: "CLOUD_CLUB" as const,
    university: "Universidad Mayor de San Andrés",
    department: "La Paz",
    city: "La Paz",
    latitude: -16.53,
    longitude: -68.08,
    description: "Iniciativa estudiantil cloud en la UMSA.",
    meetupUrl: null,
    websiteUrl: null,
    isOwnGroup: false,
    sortOrder: 4,
  },
] as const;
