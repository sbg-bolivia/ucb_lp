# AWS Student Builder Group UCB — Página Web

## Resumen

Sitio web y panel de administración para el **AWS Student Builder Group UCB - La Paz** de la **Universidad Católica Boliviana (UCB)**. El proyecto combina una **landing pública** orientada a estudiantes con un **dashboard autenticado** para gestionar contenido del grupo (equipo, eventos, usuarios, RBAC).

**Marca actual (código):** `AWS Student Builder Group UCB` — ver `src/lib/club-brand.ts`.

**Referencias de diseño acordadas:**

| Sitio | URL | Rol |
|-------|-----|-----|
| AWS UD (Colombia) | https://www.awsud.group/ | **Inspiración principal** — layout sidebar, dark builder aesthetic, etiquetas `#`, pixel art |
| AWS UPB (Bolivia) | https://main.dwlqhqmsg4skm.amplifyapp.com/ | Referencia regional — tono “ship/build”, timeline, stats, proyectos, FAQ |

## Stack técnico

- **Framework:** Next.js 15 (App Router), React 19, TypeScript
- **Estilos:** Tailwind CSS 4, `next-themes` (claro/oscuro)
- **API:** tRPC 11 + Prisma 6 (PostgreSQL)
- **Auth:** Better Auth (email/password, sesiones JWT)
- **i18n:** `next-intl` (ES / EN / PT en dashboard y partes del sitio)
- **UI admin:** shadcn/ui (Sidebar, Dialog, Table, etc.)
- **Animación:** Motion
- **Iconos públicos:** Lucide (sustituir emojis por iconos / assets en `public/`)

## Estructura del repositorio

```
src/
├── app/
│   ├── (public)/          # Landing del club
│   │   ├── page.tsx       # Home
│   │   ├── nosotros/
│   │   ├── beneficios/
│   │   ├── eventos/
│   │   ├── equipo/
│   │   ├── unete/
│   │   └── contacto/
│   ├── (authenticated)/dashboard/   # Admin
│   │   ├── club-equipo/   # Core team (JSON en Tenant)
│   │   ├── club-eventos/  # CRUD eventos
│   │   ├── users/, roles/, settings/
│   └── (signin)/          # Login, signup, reset
├── components/
│   ├── club-landing/      # Shell, hero, navbar, beneficios, etc.
│   └── dashboard/         # AppSidebar, secciones admin
├── lib/
│   ├── club-brand.ts      # Textos fijos del club
│   ├── club-theme.ts      # Tokens visuales landing (#3b41ff, violeta)
│   └── club-default-links.ts
└── locales/               # Traducciones
prisma/
├── schema.prisma          # Tenant, ClubEvent, User, RBAC, i18n
└── seed.ts
public/
└── logo/                  # Logos UCB / SBG (SVG y PNG)
```

## Rutas públicas

Definidas en `src/constants/club-routes.ts`:

| Ruta | Propósito |
|------|-----------|
| `/` | Home — hero, highlights, actividades, CTA |
| `/nosotros` | Misión / sobre el club |
| `/beneficios` | Beneficios de membresía |
| `/eventos` | Eventos publicados (`ClubEvent`) |
| `/equipo` | Core team (`Tenant.coreTeam` JSON) |
| `/unete` | Unirse / formulario o enlaces externos |
| `/contacto` | Contacto y redes |

## Panel de administración

Base: `/dashboard` — roles **superadmin**, **admin**, **viewer** (RBAC).

| Ruta | Función |
|------|---------|
| `/dashboard` | Panel principal |
| `/dashboard/users` | Usuarios |
| `/dashboard/roles` | Roles y permisos |
| `/dashboard/club-equipo` | Editar core team público |
| `/dashboard/club-eventos` | CRUD eventos del sitio |
| `/dashboard/settings` | Datos del tenant (redes, logo, meetup, etc.) |

## Modelo de datos relevante

- **Tenant:** branding, redes sociales, `coreTeam` (JSON), SEO
- **ClubEvent:** título, fechas, ubicación, imagen, URL externa, publicado, orden
- **User / Role / Permission:** multitenant + RBAC

## Variables de entorno

Ver `env.example` / `.env` (no commitear). Claves típicas:

- `DATABASE_URL`
- `BETTER_AUTH_*`
- `NEXT_PUBLIC_SITE_URL`

## Assets en `public/`

**En repo hoy:** `public/logo/` (SBG UCB, UCB, SIS).

**Referenciados en código pero pueden faltar localmente:** `/fondo.webp`, `/logo.png` (hero y logo modo oscuro).

**Pendiente (usuario):** carpeta de imágenes adicional (pixel art, iconos de beneficios, decoración grid) — alinear nombres con diseño awsud y evitar emojis en UI.

## Objetivo de rediseño (fase 2+)

Alinear **landing + admin** con el lenguaje visual de [awsud.group](https://www.awsud.group/):

1. **Layout:** sidebar fija en desktop (nav `# navigation`), contenido con breadcrumbs `home / sección`
2. **Estética:** fondo oscuro por defecto, acento púrpura/violeta, rejilla decorativa, etiquetas monoespaciadas con `#`
3. **Componentes:** cards de beneficios/eventos/contacto como UD; chips de filtro donde aplique (eventos)
4. **Admin:** misma paleta y tipografía que el sitio público (no “plantilla genérica”)
5. **Iconografía:** SVG / pixel assets desde `public/` en lugar de emojis (☁️, 🎤, etc. en referencia UPB)

## Comandos útiles

```bash
pnpm install
pnpm dev          # Docker DB + Next dev
pnpm db:seed      # Datos demo
pnpm validate     # lint + typecheck
```

## Scraping / investigación

Resultados crudos en `.cursor/motivation/firecrawl/` (gitignored). Resúmenes curados en `.cursor/references/`.

**Nota:** [awsud.group](https://www.awsud.group/) es SPA (Vite); el HTML inicial no incluye contenido — se analizó bundle JS, meta tags y capturas de pantalla. Para re-scrape completo con JS: autenticar Firecrawl CLI (`firecrawl login --browser`) y volver a ejecutar crawl.

## Contacto del club (código)

- Email: `awscloudclubucblapaz@gmail.com`
- Ciudad: La Paz, Bolivia
