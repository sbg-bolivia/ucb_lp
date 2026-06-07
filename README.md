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
pnpm dev
```

Variables de entorno: copia `.env.example` a `.env` y configura `DATABASE_URL`, `BETTER_AUTH_SECRET`, etc.

```bash
pnpm db:seed   # datos demo del club
pnpm validate  # lint + typecheck
```

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
