# Seed — AWS Student Builder Group UCB

El seed **borra todos los datos** y crea un entorno de desarrollo completo conectado al sitio público y al panel admin.

## Ejecutar

```bash
pnpm db:seed
```

O reset completo (migraciones + seed):

```bash
pnpm db:reset
```

Requisito: `DATABASE_URL` en `.env` (ver `.env.example`).

## Qué incluye

| Área | Contenido |
|------|-----------|
| **Tenant** | AWS Student Builder Group UCB con redes (Meetup, WhatsApp, TikTok, etc.) y **core team** (6 personas) |
| **RBAC** | 5 roles + 19 permisos |
| **Usuarios** | 7 cuentas de prueba con roles distintos |
| **Eventos** | 5 eventos publicados → `/eventos` y `/eventos/[id]` |
| **Proyectos** | 5 proyectos publicados → `/proyectos` y `/proyectos/[id]` |
| **i18n** | Locales ES (default), EN, PT |

El sitio público usa el **primer tenant activo** (`companyInfo`, `clubEvents`, `clubProjects`). Este seed crea un solo tenant del club.

## Credenciales

| Rol | Email | Contraseña |
|-----|-------|------------|
| Super Admin | `superadmin@awscloudclub.ucb` | `ClubSuper123!@#` |
| Admin | `admin@awscloudclub.ucb` | `ClubAdmin123!@#` |
| Moderador | `moderador@awscloudclub.ucb` | `ClubMod123!@#` |
| Miembro | `miembro@awscloudclub.ucb` | `ClubUser123!@#` |
| Miembro | `maria@awscloudclub.ucb` | `ClubUser123!@#` |
| Miembro | `carlos@awscloudclub.ucb` | `ClubUser123!@#` |
| Solo lectura | `viewer@awscloudclub.ucb` | `ClubViewer123!@#` |

## URLs de ejemplo (IDs fijos)

- Evento: `/eventos/11111111-1111-4111-8111-111111111101`
- Proyecto: `/proyectos/22222222-2222-4222-8222-222222222201`

## Panel admin

- `/dashboard` — inicio
- `/dashboard/club-eventos` — CRUD eventos
- `/dashboard/club-proyectos` — CRUD proyectos
- `/dashboard/club-equipo` — core team (también en Ajustes → `coreTeam`)
- `/dashboard/users` y `/dashboard/roles` — RBAC

## Personalizar

Edita `prisma/seed-data.ts` (eventos, proyectos, usuarios, core team) y vuelve a ejecutar `pnpm db:seed`.

⚠️ Solo para **desarrollo**. No ejecutes en producción sin revisar el impacto.
