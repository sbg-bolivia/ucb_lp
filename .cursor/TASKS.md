# Backlog — Rediseño UI + Admin

Estado inicial documentado: **2026-05-27**.  
Referencias: `.cursor/references/awsud-group.md`, `upb-cochabamba.md`, `design-inspiration.md`.

---

## Fase 0 — Investigación ✅

- [x] Scrape HTML UPB (contenido completo en `.cursor/motivation/firecrawl/upb-home.html`)
- [x] Análisis awsud.group (SPA + capturas + bundle)
- [x] Inventario codebase UCB
- [x] Documentación en `.cursor/`
- [ ] **Opcional:** Firecrawl autenticado para markdown por ruta UD
- [ ] **Usuario:** Confirmar carpeta `public/images` (o subir assets pixel/iconos)

---

## Fase 1 — Design system base

**Objetivo:** Tokens y shell reutilizable sin romper rutas.

| ID | Tarea | Archivos / notas | Prioridad |
|----|-------|------------------|-----------|
| 1.1 | Definir tokens dark “builder” (purple, surfaces, mono) | `club-theme.ts`, `globals.css` | Alta |
| 1.2 | Crear `ClubAppShell` con sidebar desktop + drawer mobile | Nuevo componente; usar en `club-marketing-shell.tsx` | Alta |
| 1.3 | Crear `ClubPageHeader` (breadcrumb, `# tag`, title, grid decor) | Nuevo | Alta |
| 1.4 | Componente `ClubChip` / `ClubTag` | Nuevo | Media |
| 1.5 | Mapear rutas sidebar → `CLUB_MARKETING_PATHS` | `club-routes.ts`, navbar links | Alta |
| 1.6 | Toggle ES/EN en landing (si aplica) | `next-intl` o extensión actual | Media |

**Criterio de aceptación:** Home renderiza con sidebar estilo UD en dark; mobile usable.

---

## Fase 2 — Páginas públicas

| ID | Tarea | Inspiración | Prioridad |
|----|-------|-------------|-----------|
| 2.1 | **Home** — hero + stats + CTA “Join now” | UD header + UPB stats | Alta |
| 2.2 | **Nosotros** — misión + timeline hitos | UPB historia | Alta |
| 2.3 | **Beneficios** — grid cards `# label` + iconos | UD benefits | Alta |
| 2.4 | **Eventos** — tabs próximos/pasados, cards | UD events | Alta |
| 2.5 | **Equipo** — core team cards | UD team | Media |
| 2.6 | **Contacto** — 3 cards email/IG/LinkedIn | UD contact | Media |
| 2.7 | **Únete** — formulario + FAQ corto | UPB únete + FAQ | Media |
| 2.8 | Reemplazar emojis/iconos genéricos por assets `public/` | — | Alta |
| 2.9 | SEO y structured data tras cambios de copy | `seo.ts`, `structured-data.ts` | Baja |

**Criterio:** Paridad visual con referencia UD; contenido sigue siendo UCB La Paz.

---

## Fase 3 — Módulo administrador

| ID | Tarea | Detalle | Prioridad |
|----|-------|---------|-----------|
| 3.1 | Re-skin `AppSidebar` + header dashboard | Misma paleta que landing | Alta |
| 3.2 | Mejorar UX **club-eventos** (preview card, imagen) | `club-eventos/page.tsx` | Alta |
| 3.3 | Mejorar UX **club-equipo** (cards preview, orden) | `club-equipo`, `CoreTeamAdminSection` | Alta |
| 3.4 | Settings: agrupar redes + preview “Contact card” | `settings/page.tsx` | Media |
| 3.5 | Dashboard home: métricas club (eventos publicados, miembros team) | `dashboard/page.tsx` | Media |
| 3.6 | Traducciones dashboard ES/EN/PT para nuevos labels | `locales/*/dashboard.json` | Media |

**Criterio:** Admin se siente parte del mismo producto, no plantilla T3 genérica.

---

## Fase 4 — Contenido y datos reales

| ID | Tarea | Responsable |
|----|-------|-------------|
| 4.1 | Copy final hero / beneficios / nosotros | Equipo club |
| 4.2 | Fotos y bios core team | Admin → club-equipo |
| 4.3 | Eventos reales con imágenes | Admin → club-eventos |
| 4.4 | Enlaces Meetup, WhatsApp, Discord, IG | Settings tenant |
| 4.5 | Stats reales (miembros, proyectos) si se muestran | Coordinación club |

---

## Fase 5 — Calidad y deploy

| ID | Tarea |
|----|-------|
| 5.1 | `pnpm validate` sin errores |
| 5.2 | Prueba responsive (375, 768, 1280) |
| 5.3 | Lighthouse a11y + performance landing |
| 5.4 | Actualizar `env.example` si hay nuevas `NEXT_PUBLIC_*` |
| 5.5 | Deploy (Amplify/Vercel según infra actual) |

---

## Fuera de alcance (por ahora)

- Catálogo completo **AWS Services** como UD (136 servicios) — solo si el club lo pide
- Mapa multi-ciudad Bolivia — opcional futuro
- Auth social / registro público masivo — no pedido

---

## Orden sugerido para el próximo sprint

1. Fase 1 completa (shell + tokens)  
2. Beneficios + Eventos (máximo impacto visual)  
3. Admin re-skin + club-eventos  
4. Resto de páginas públicas  

---

## Notas para agentes Cursor

- Leer siempre `.cursor/PROJECT.md` antes de cambios grandes de UI.
- Minimizar diff: no refactorizar RBAC/auth sin pedido.
- No commitear `.env` ni `.cursor/motivation/firecrawl/`.
- Preferir Lucide + SVG en `public/` sobre emojis.
- Responder al usuario en **español**.
