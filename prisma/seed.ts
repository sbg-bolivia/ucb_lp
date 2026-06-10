import {
  PermissionAction,
  PermissionResource,
  PrismaClient,
} from "@prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import {
  AWS_COMMUNITIES_SEED,
  AWS_SERVICES_SEED,
  CLUB_EVENT_IDS,
  CLUB_PROJECT_IDS,
  CLUB_TENANT_ID,
  CLUB_UNSPLASH,
  CORE_TEAM_SEED,
  SEED_USERS,
  daysFromNow,
  hoursAfter,
} from "./seed-data";

const prisma = new PrismaClient();

const seedAuth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  emailVerification: {
    sendOnSignUp: false,
    autoSignInAfterVerification: true,
  },
  session: {
    strategy: "jwt",
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  logger: { level: "error" },
});

const PERMISSION_DEFS = [
  { action: PermissionAction.READ, resource: PermissionResource.DASHBOARD },
  { action: PermissionAction.CREATE, resource: PermissionResource.USER },
  { action: PermissionAction.READ, resource: PermissionResource.USER },
  { action: PermissionAction.UPDATE, resource: PermissionResource.USER },
  { action: PermissionAction.DELETE, resource: PermissionResource.USER },
  { action: PermissionAction.MANAGE, resource: PermissionResource.USER },
  { action: PermissionAction.CREATE, resource: PermissionResource.ROLE },
  { action: PermissionAction.READ, resource: PermissionResource.ROLE },
  { action: PermissionAction.UPDATE, resource: PermissionResource.ROLE },
  { action: PermissionAction.DELETE, resource: PermissionResource.ROLE },
  { action: PermissionAction.MANAGE, resource: PermissionResource.ROLE },
  { action: PermissionAction.CREATE, resource: PermissionResource.PERMISSION },
  { action: PermissionAction.READ, resource: PermissionResource.PERMISSION },
  { action: PermissionAction.UPDATE, resource: PermissionResource.PERMISSION },
  { action: PermissionAction.DELETE, resource: PermissionResource.PERMISSION },
  { action: PermissionAction.MANAGE, resource: PermissionResource.PERMISSION },
  { action: PermissionAction.READ, resource: PermissionResource.ADMIN },
  { action: PermissionAction.UPDATE, resource: PermissionResource.ADMIN },
  { action: PermissionAction.MANAGE, resource: PermissionResource.ADMIN },
  { action: PermissionAction.CREATE, resource: PermissionResource.CONTENT },
  { action: PermissionAction.READ, resource: PermissionResource.CONTENT },
  { action: PermissionAction.UPDATE, resource: PermissionResource.CONTENT },
  { action: PermissionAction.DELETE, resource: PermissionResource.CONTENT },
  { action: PermissionAction.MANAGE, resource: PermissionResource.CONTENT },
];

const ROLE_NAME_MAP = {
  super_admin: "superAdmin",
  admin: "admin",
  moderator: "moderator",
  user: "user",
  viewer: "viewer",
} as const;

async function clearDatabase() {
  await prisma.userRole.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.verification.deleteMany({});
  await prisma.clubEventVersion.deleteMany({});
  await prisma.eventCollaboration.deleteMany({});
  await prisma.awsServiceCard.deleteMany({});
  await prisma.awsService.deleteMany({});
  await prisma.awsCommunity.deleteMany({});
  await prisma.siteBanner.deleteMany({});
  await prisma.coreTeamMember.deleteMany({});
  await prisma.clubProject.deleteMany({});
  await prisma.clubEvent.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.translation.deleteMany({});
  await prisma.rolePermission.deleteMany({});
  await prisma.role.deleteMany({});
  await prisma.permission.deleteMany({});
  await prisma.tenant.deleteMany({});
}

async function createRolesAndPermissions(tenantId: string) {
  const createdPermissions = [];
  for (const perm of PERMISSION_DEFS) {
    const permission = await prisma.permission.create({
      data: {
        action: perm.action,
        resource: perm.resource,
        description: `${perm.action} · ${perm.resource}`,
        tenantId,
      },
    });
    createdPermissions.push(permission);
  }

  const tenantRoles = {
    superAdmin: await prisma.role.create({
      data: {
        name: "super_admin",
        displayName: "Super Admin",
        description: "Acceso total al sistema y al panel del club",
        isSystem: true,
        tenantId,
      },
    }),
    admin: await prisma.role.create({
      data: {
        name: "admin",
        displayName: "Administrador",
        description: "Gestión de usuarios, eventos, proyectos y ajustes",
        isSystem: true,
        tenantId,
      },
    }),
    moderator: await prisma.role.create({
      data: {
        name: "moderator",
        displayName: "Moderador",
        description: "Gestión de contenido del club y usuarios",
        isSystem: true,
        tenantId,
      },
    }),
    user: await prisma.role.create({
      data: {
        name: "user",
        displayName: "Miembro",
        description: "Acceso al dashboard y recursos del club",
        isSystem: true,
        tenantId,
      },
    }),
    viewer: await prisma.role.create({
      data: {
        name: "viewer",
        displayName: "Solo lectura",
        description: "Consulta básica sin edición",
        isSystem: true,
        tenantId,
      },
    }),
  };

  for (const permission of createdPermissions) {
    await prisma.rolePermission.create({
      data: {
        roleId: tenantRoles.superAdmin.id,
        permissionId: permission.id,
      },
    });
  }

  const adminPermissions = createdPermissions.filter(
    (p) =>
      p.resource !== PermissionResource.ROLE ||
      p.action !== PermissionAction.MANAGE
  );
  for (const permission of adminPermissions) {
    await prisma.rolePermission.create({
      data: { roleId: tenantRoles.admin.id, permissionId: permission.id },
    });
  }

  const moderatorPermissions = createdPermissions.filter(
    (p) =>
      (p.resource === PermissionResource.USER &&
        (p.action === PermissionAction.READ ||
          p.action === PermissionAction.UPDATE)) ||
      p.resource === PermissionResource.DASHBOARD ||
      p.resource === PermissionResource.CONTENT
  );
  for (const permission of moderatorPermissions) {
    await prisma.rolePermission.create({
      data: { roleId: tenantRoles.moderator.id, permissionId: permission.id },
    });
  }

  const userPermissions = createdPermissions.filter(
    (p) => p.resource === PermissionResource.DASHBOARD
  );
  for (const permission of userPermissions) {
    await prisma.rolePermission.create({
      data: { roleId: tenantRoles.user.id, permissionId: permission.id },
    });
  }

  const viewerPermissions = createdPermissions.filter(
    (p) =>
      p.resource === PermissionResource.DASHBOARD &&
      p.action === PermissionAction.READ
  );
  for (const permission of viewerPermissions) {
    await prisma.rolePermission.create({
      data: { roleId: tenantRoles.viewer.id, permissionId: permission.id },
    });
  }

  return tenantRoles;
}

async function seedLocales() {
  const locales = [
    {
      languageCode: "es",
      name: "Spanish",
      nativeName: "Español",
      locale: "es_BO",
      isDefault: true,
      displayOrder: 0,
    },
    {
      languageCode: "en",
      name: "English",
      nativeName: "English",
      locale: "en_US",
      isDefault: false,
      displayOrder: 1,
    },
    {
      languageCode: "pt",
      name: "Portuguese",
      nativeName: "Português",
      locale: "pt_BR",
      isDefault: false,
      displayOrder: 2,
    },
  ];

  for (const localeData of locales) {
    await prisma.locale.upsert({
      where: { languageCode: localeData.languageCode },
      update: localeData,
      create: {
        ...localeData,
        direction: "ltr",
        currencySymbol: "Bs.",
        isActive: true,
      },
    });
  }
}

async function seedSiteBanners(tenantId: string) {
  const banners = [
    {
      title: "Únete al AWS Student Builder Group UCB",
      subtitle:
        "Talleres, labs reales y comunidad tech en la Universidad Católica Boliviana.",
      imageUrl: CLUB_UNSPLASH.eventWorkshop,
      linkUrl: "/unete",
      placement: "HOME_HERO" as const,
      sortOrder: 0,
    },
    {
      title: "Próximo workshop en la nube",
      subtitle: "Explora la consola AWS y despliega tu primer recurso.",
      imageUrl: CLUB_UNSPLASH.eventCert,
      linkUrl: "/eventos",
      placement: "HOME_HERO" as const,
      sortOrder: 1,
    },
    {
      title: "Certifícate con el club",
      subtitle: "Ruta Cloud Practitioner con simulacros y mentoría.",
      imageUrl: CLUB_UNSPLASH.eventNetwork,
      linkUrl: "/eventos",
      placement: "HOME_SECONDARY" as const,
      sortOrder: 0,
    },
    {
      title: "Catálogo de servicios AWS",
      subtitle: "Guías del club: cuándo usar cada servicio y por dónde empezar.",
      imageUrl: CLUB_UNSPLASH.projApi,
      linkUrl: "/servicios",
      placement: "HOME_SECONDARY" as const,
      sortOrder: 1,
    },
    {
      title: "Calendario de eventos",
      subtitle: "Labs, charlas y networking durante todo el año.",
      imageUrl: CLUB_UNSPLASH.eventBuild,
      linkUrl: "/eventos",
      placement: "EVENTS_PAGE" as const,
      sortOrder: 0,
    },
    {
      title: "Aprende servicios AWS paso a paso",
      subtitle: "Contenido curado por estudiantes para estudiantes.",
      imageUrl: CLUB_UNSPLASH.projWeb,
      linkUrl: "/servicios",
      placement: "SERVICES_PAGE" as const,
      sortOrder: 0,
    },
  ];

  for (const b of banners) {
    await prisma.siteBanner.create({
      data: {
        tenantId,
        title: b.title,
        subtitle: b.subtitle,
        imageUrl: b.imageUrl,
        linkUrl: b.linkUrl,
        placement: b.placement,
        isActive: true,
        sortOrder: b.sortOrder,
      },
    });
  }
}

async function seedClubEvents(tenantId: string) {
  const w1 = daysFromNow(7, 17);
  const b1 = daysFromNow(21, 9);
  const c1 = daysFromNow(35, 18);
  const n1 = daysFromNow(-14, 18);
  const g1 = daysFromNow(49, 10);

  const events = [
    {
      id: CLUB_EVENT_IDS.workshopIntro,
      title: "Workshop: Primeros pasos en AWS",
      description:
        "Sesión hands-on para crear tu cuenta AWS, explorar la consola y desplegar tu primer recurso en la nube. Ideal para quienes recién se unen al club.",
      startsAt: w1,
      endsAt: hoursAfter(w1, 2),
      location: "Campus UCB La Paz · Aula Cloud",
      imageUrl: CLUB_UNSPLASH.eventWorkshop,
      externalUrl:
        "https://www.meetup.com/aws-cloud-club-at-universidad-catolica-boliviana-san-pablo/",
      sortOrder: 0,
    },
    {
      id: CLUB_EVENT_IDS.buildathon,
      title: "Buildathon Serverless UCB",
      description:
        "48 horas para armar un MVP con Lambda, API Gateway y DynamoDB. Equipos multidisciplinarios y mentoría del core team.",
      startsAt: b1,
      endsAt: hoursAfter(b1, 48),
      location: "Laboratorio de innovación UCB",
      imageUrl: CLUB_UNSPLASH.eventBuild,
      externalUrl: null,
      sortOrder: 1,
    },
    {
      id: CLUB_EVENT_IDS.certification,
      title: "Ruta Cloud Practitioner",
      description:
        "Plan de estudio grupal, simulacros y tips para la certificación AWS Cloud Practitioner. Material compartido en el drive del club.",
      startsAt: c1,
      endsAt: hoursAfter(c1, 3),
      location: "Virtual · Zoom",
      imageUrl: CLUB_UNSPLASH.eventCert,
      externalUrl: null,
      sortOrder: 2,
    },
    {
      id: CLUB_EVENT_IDS.networking,
      title: "Networking con builders alumni",
      description:
        "Charla con egresados que trabajan en la nube: preguntas abiertas, CV review rápido y café.",
      startsAt: n1,
      endsAt: hoursAfter(n1, 2),
      location: "Campus UCB · Hall central",
      imageUrl: CLUB_UNSPLASH.eventNetwork,
      externalUrl: null,
      sortOrder: 3,
      isPublished: true,
    },
    {
      id: CLUB_EVENT_IDS.gameDay,
      title: "AWS GameDay: Operaciones en la nube",
      description:
        "Competencia por equipos con escenarios reales de operaciones. Premios para el squad ganador.",
      startsAt: g1,
      endsAt: hoursAfter(g1, 6),
      location: "Por confirmar",
      imageUrl: CLUB_UNSPLASH.eventGame,
      externalUrl: null,
      sortOrder: 4,
    },
  ];

  for (const ev of events) {
    await prisma.clubEvent.create({
      data: {
        tenantId,
        isPublished: ev.isPublished ?? true,
        ...ev,
      },
    });
  }
}

async function seedClubProjects(tenantId: string) {
  const projects = [
    {
      id: CLUB_PROJECT_IDS.serverlessApi,
      title: "API de inscripciones serverless",
      description:
        "Backend sin servidor para registrar asistentes a eventos del club. Lambda, API Gateway, DynamoDB y notificaciones por SNS.",
      tags: "AWS Lambda,API Gateway,DynamoDB,TypeScript",
      imageUrl: CLUB_UNSPLASH.projApi,
      projectUrl: "https://github.com/",
      sortOrder: 0,
    },
    {
      id: CLUB_PROJECT_IDS.iotDashboard,
      title: "Dashboard IoT campus",
      description:
        "Métricas en tiempo real desde sensores simulados con IoT Core y visualización en Amplify.",
      tags: "IoT Core,Amplify,React,CloudWatch",
      imageUrl: CLUB_UNSPLASH.projIot,
      projectUrl: "https://github.com/",
      sortOrder: 1,
    },
    {
      id: CLUB_PROJECT_IDS.mlPipeline,
      title: "Pipeline ML con SageMaker",
      description:
        "Experimento de clasificación con datos abiertos y despliegue de endpoint para demo en feria UCB.",
      tags: "SageMaker,Python,S3,ML",
      imageUrl: CLUB_UNSPLASH.projMl,
      projectUrl: null,
      sortOrder: 2,
    },
    {
      id: CLUB_PROJECT_IDS.staticSite,
      title: "Sitio estático del club",
      description:
        "Landing y blog del SBG desplegados en S3 + CloudFront con CI desde GitHub Actions.",
      tags: "S3,CloudFront,Next.js,GitHub Actions",
      imageUrl: CLUB_UNSPLASH.projWeb,
      projectUrl: "https://github.com/",
      sortOrder: 3,
    },
    {
      id: CLUB_PROJECT_IDS.chatbot,
      title: "Asistente FAQ del club",
      description:
        "Chatbot con Amazon Bedrock que responde dudas sobre eventos, membresía y rutas de certificación.",
      tags: "Bedrock,Lambda,Next.js",
      imageUrl: CLUB_UNSPLASH.projBot,
      projectUrl: null,
      sortOrder: 4,
    },
  ];

  for (const p of projects) {
    await prisma.clubProject.create({
      data: { tenantId, isPublished: true, ...p },
    });
  }
}

async function seedUsers(
  tenantId: string,
  tenantRoles: Awaited<ReturnType<typeof createRolesAndPermissions>>
) {
  const createdUsers: { email: string; password: string }[] = [];

  for (const userData of SEED_USERS) {
    const existing = await prisma.user.findUnique({
      where: { email: userData.email },
    });
    if (existing) {
      console.log(`   ⚠️ ${userData.email} ya existe, omitido`);
      continue;
    }

    const result = await seedAuth.api.signUpEmail({
      body: {
        email: userData.email,
        password: userData.password,
        name: userData.name,
      },
    });

    if (!result.user) {
      console.error(`   ❌ No se creó ${userData.email}`);
      continue;
    }

    await prisma.user.update({
      where: { id: result.user.id },
      data: {
        phone: userData.phone,
        language: userData.language,
        emailVerified: true,
        tenantId,
      },
    });

    const roleKey =
      ROLE_NAME_MAP[userData.roleName as keyof typeof ROLE_NAME_MAP];
    const role = tenantRoles[roleKey];
    if (role) {
      await prisma.userRole.create({
        data: {
          userId: result.user.id,
          roleId: role.id,
          assignedBy: "seed",
        },
      });
    }

    createdUsers.push({
      email: userData.email,
      password: userData.password,
    });
    console.log(`   ✅ ${userData.email} (${userData.roleName})`);
  }

  return createdUsers;
}

async function main() {
  console.log("🌱 Seed AWS Student Builder Group UCB\n");

  await prisma.$connect();
  console.log("🗑️ Limpiando base de datos...");
  await clearDatabase();

  console.log("🏢 Creando tenant del club...");
  const clubTenant = await prisma.tenant.create({
    data: {
      id: CLUB_TENANT_ID,
      name: "aws-sbg-ucb",
      displayName: "AWS Student Builder Group UCB",
      description:
        "Comunidad estudiantil en la Universidad Católica Boliviana San Pablo. Aprendemos AWS, construimos proyectos en la nube y nos preparamos para la industria tech.",
      email: "awscloudclubucblapaz@gmail.com",
      phone: "+591 2 0000000",
      address: "Campus UCB",
      city: "La Paz",
      country: "Bolivia",
      website: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3060",
      meetupUrl:
        "https://www.meetup.com/aws-cloud-club-at-universidad-catolica-boliviana-san-pablo/",
      whatsappUrl: "https://chat.whatsapp.com/IeSOHxTKg0UFbH8HBAvKwo",
      tiktokUrl: "https://www.tiktok.com/@aws_cc_ucb_lpz",
      linkedinUrl: "https://www.linkedin.com/company/aws-cloud-club-ucb",
      instagramUrl: "https://www.instagram.com/aws_cc_ucb_lpz",
      youtubeUrl: "https://www.youtube.com/@AWSCloudClubUCB",
      foundedYear: 2024,
      logoUrl: "/logo/AWS SBG UCB - La Paz - Negro.png",
      faviconUrl: "/favicon.ico",
      metaTitle: "AWS Student Builder Group UCB | La Paz",
      metaDescription:
        "Únete a estudiantes que aprenden AWS, construyen en la nube y lanzan proyectos reales en la UCB San Pablo.",
      metaKeywords:
        "AWS, cloud, UCB, La Paz, Bolivia, estudiantes, certificación, serverless",
      coreTeam: CORE_TEAM_SEED,
      isActive: true,
    },
  });

  console.log("🔐 Roles y permisos...");
  const tenantRoles = await createRolesAndPermissions(clubTenant.id);

  console.log("🌍 Locales i18n...");
  await seedLocales();

  console.log("👥 Usuarios de prueba...");
  const users = await seedUsers(clubTenant.id, tenantRoles);

  console.log("🖼️ Banners promocionales...");
  await seedSiteBanners(clubTenant.id);

  console.log("📅 Eventos del club...");
  await seedClubEvents(clubTenant.id);

  console.log("🚀 Proyectos del club...");
  await seedClubProjects(clubTenant.id);

  console.log("☁️ Catálogo de servicios AWS...");
  for (const svc of AWS_SERVICES_SEED) {
    const { cards, ...serviceData } = svc;
    await prisma.awsService.create({
      data: {
        ...serviceData,
        tenantId: clubTenant.id,
        cards: {
          create: cards.map((card) => ({
            cardType: card.cardType,
            title: card.title,
            content: card.content,
            sortOrder: card.sortOrder,
            isPublished: true,
          })),
        },
      },
    });
  }

  console.log("🌎 Otras comunidades AWS (Bolivia)...");
  for (const c of AWS_COMMUNITIES_SEED) {
    await prisma.awsCommunity.create({
      data: {
        id: c.id,
        tenantId: clubTenant.id,
        name: c.name,
        communityType: c.communityType,
        university: "university" in c ? (c.university ?? null) : null,
        department: c.department,
        city: c.city,
        latitude: c.latitude,
        longitude: c.longitude,
        description: c.description,
        meetupUrl: c.meetupUrl,
        websiteUrl: c.websiteUrl,
        isOwnGroup: c.isOwnGroup,
        isPublished: true,
        sortOrder: c.sortOrder,
      },
    });
  }

  const eventCount = await prisma.clubEvent.count({
    where: { tenantId: clubTenant.id },
  });
  const projectCount = await prisma.clubProject.count({
    where: { tenantId: clubTenant.id },
  });
  const communityCount = await prisma.awsCommunity.count({
    where: { tenantId: clubTenant.id },
  });
  const serviceCount = await prisma.awsService.count({
    where: { tenantId: clubTenant.id, isPublished: true },
  });

  console.log(`
✅ Seed completado

📊 Resumen
- Tenant: ${clubTenant.displayName} (${clubTenant.id})
- Roles: super_admin, admin, moderator, user, viewer
- Permisos: ${PERMISSION_DEFS.length}
- Usuarios: ${users.length}
- Eventos publicados: ${eventCount}
- Proyectos publicados: ${projectCount}
- Comunidades AWS: ${communityCount}
- Servicios AWS publicados: ${serviceCount}
- Core team: ${CORE_TEAM_SEED.length} miembros

🌐 Sitio público (primer tenant activo)
- Inicio: /
- Eventos: /eventos · ejemplo: /eventos/${CLUB_EVENT_IDS.workshopIntro}
- Proyectos: ocultos (CLUB_FEATURES.projects = false)
- Equipo: /equipo
- Servicios AWS: /servicios
- Mapa comunidades: /nosotros
- Comunidad enlazada vía Meetup, WhatsApp y TikTok en el tenant

🔐 Credenciales (desarrollo)
- Super Admin: superadmin@awscloudclub.ucb / ClubSuper123!@#
- Admin:       admin@awscloudclub.ucb / ClubAdmin123!@#
- Moderador:   moderador@awscloudclub.ucb / ClubMod123!@#
- Miembro:     miembro@awscloudclub.ucb / ClubUser123!@#
- María:       maria@awscloudclub.ucb / ClubUser123!@#
- Carlos:      carlos@awscloudclub.ucb / ClubUser123!@#
- Viewer:      viewer@awscloudclub.ucb / ClubViewer123!@#

Panel admin: /dashboard/club-eventos · /dashboard/club-servicios · /dashboard/club-comunidades · Ajustes
`);
}

main()
  .catch((e) => {
    console.error("❌ Seed falló:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
