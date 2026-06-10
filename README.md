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
3. **Variables en Amplify** (sin prefijo `AWS_`):

   | Variable | Ejemplo en producción |
   |----------|------------------------|
   | `DATABASE_URL` | `postgresql://user:pass@endpoint.rds.amazonaws.com:5432/sbgbo_prod?sslmode=require` (sin comillas `"` en Amplify) |
   | `SITE_URL` | `https://main.d240jy2g4jz3mm.amplifyapp.com` (o `https://sbgbo.com`) |
   | `NEXT_PUBLIC_SITE_URL` | La misma URL pública |
   | `BETTER_AUTH_SECRET` | Secreto fuerte (32+ bytes) |
   | `S3_REGION`, `S3_BUCKET` | Región y bucket de assets |
   | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Si usas login con Google |
   | SMTP (`NODEMAILER_*`) | Para correos de verificación |

   **Cómo cambiarlas después del primer deploy:** Amplify Console → tu app → **Hosting** → **Environment variables** → editar/añadir → **Save** → **Redeploy this version** (obligatorio para que SSR las vea).

   Verifica con `GET /api/health` → debe responder `{ "ok": true }`.

4. **RDS Security Group:** puerto `5432` abierto a `0.0.0.0/0` (temporal) o VPC peering con Amplify.
5. **DNS Namecheap** → CNAME del dominio `sbgbo.com` al hosting Amplify.
6. `pnpm prisma migrate deploy` corre en `preBuild` si `DATABASE_URL` está configurada.

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
