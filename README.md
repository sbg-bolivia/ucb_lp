# AWS Student Builder Group UCB — La Paz

Sitio web y panel de administración del **AWS Student Builder Group UCB** en la Universidad Católica Boliviana (La Paz).

## Qué incluye

- **Landing pública:** home, eventos, proyectos, equipo, beneficios, contacto
- **Panel admin:** gestión de eventos, proyectos, equipo core, usuarios y configuración del tenant
- **Auth:** Better Auth con roles (superadmin, admin, viewer)

## Stack

- Next.js 15, React 19, TypeScript
- Tailwind CSS 4, tRPC, Prisma, PostgreSQL
- Motion, Three.js (modelo 3D del hero)

## Desarrollo local

```bash
pnpm install
cp .env.example .env   # ajusta SITE_URL y secrets
pnpm dev             # Docker + Prisma + Next.js
```

```bash
pnpm db:seed   # datos demo del club
pnpm validate  # lint + typecheck
```

## Despliegue (AWS Amplify + RDS)

1. **RDS PostgreSQL** (`db.t4g.micro` o Lightsail DB) y anota `DATABASE_URL`.
2. **Amplify Hosting**: conecta el repo GitHub, build con `amplify.yml`.
3. **Variables en Amplify** (mismas que `.env.example`): `DATABASE_URL`, `BETTER_AUTH_SECRET`, `SITE_URL`, `NEXT_PUBLIC_SITE_URL`, Google OAuth, SMTP.
4. **DNS Namecheap** → CNAME del dominio `sbgbo.com` al hosting Amplify.
5. Tras el primer deploy: `pnpm prisma migrate deploy` corre en `preBuild` si `DATABASE_URL` está configurada.

Panel admin tras seed: `/dashboard/club-eventos`, `/dashboard/club-servicios`, `/dashboard/club-comunidades`.

## Estructura principal

```
src/
├── app/(public)/          # Páginas del club
├── app/(authenticated)/   # Dashboard admin
├── components/club-landing/
├── lib/club-brand.ts      # Textos de marca
└── prisma/                # Esquema y seed
```

## Contacto

- Email: awscloudclubucblapaz@gmail.com
- Ciudad: La Paz, Bolivia
