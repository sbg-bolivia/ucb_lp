# Referencia: awsud.group (AWS Student Builder Group — Universidad Distrital)

**URL:** https://www.awsud.group/  
**Título:** AWS Student Builder Group at Universidad Distrital  
**Meta description:** *Construimos el futuro con AWS.*  
**Stack detectado:** Vite + React SPA, i18n (EN/ES), fuentes **Amazon Ember Display**, Sentry, lazy routes por página.

> El sitio devuelve el mismo `index.html` (~3.2 KB) para todas las rutas; el contenido se hidrata en cliente. Esta documentación combina meta tags, análisis del bundle, rutas y **capturas de pantalla** del club UD.

---

## Arquitectura de información

### Sidebar (desktop) — `# navigation`

| Ítem | Ruta SPA (inferida) | Contenido principal |
|------|---------------------|---------------------|
| Home | `/` | Landing / bienvenida |
| About | `/about` | Cobertura SBG en Colombia + mapa |
| Benefits | `/benefits` | Tarjetas de beneficios |
| Events | `/events` | Próximos / pasados |
| AWS Services | `/services` | Catálogo buscable de servicios AWS |
| Team | `/team` | Core team |
| Contact | `/contact` | Canales de contacto |

**CTA fijo:** botón blanco **Join now** (icono sparkle).  
**Footer sidebar:** toggle tema (monitor), **ES | EN**, icono grid, redes (Discord, LinkedIn, Instagram).

### Mobile

- Header sticky con menú hamburguesa (`nav.openMenu`)
- Logo + `shortName` en mono

---

## Sistema visual (design tokens)

| Elemento | Valor / comportamiento |
|----------|-------------------------|
| Fondo | Negro / navy muy oscuro (`theme-color: #000000`) |
| Acento | Púrpura / violeta (estados activos, chips, glow) |
| Secundario | Naranja / coral en decoración (cuadrados pixel, acentos) |
| Texto | Blanco títulos, gris cuerpo |
| Labels | Fuente **monoespaciada**, prefijo `#` (ej. `# navigation`, `# members`, `# certification`) |
| Breadcrumbs | `home / benefits` en mono pequeño |
| Cards | `rounded`, borde sutil, fondo gris-azulado sobre el page bg |
| Hero decor | Rejilla de fondo + cuadrados flotantes + **iconos pixel art** (rayo, trofeo, chip) |
| Logo | Pixel chip / gear (`/logo/sbg-logo-black.png` \| `white` según tema) |
| Fuentes | Amazon Ember Display (Rg, Md, Bd — preload woff2) |

### Patrones UX

- **Una página = una sección** con hero superior (breadcrumb + `# tag` + H1 + párrafo)
- **Filtros tipo chip** en Services y Events (`# upcoming`, `# past (15)`, categorías compute/storage…)
- **Contador** contextual (ej. `136 / 136 services`, `9 groups · 3 cities`)
- **Tabs** con borde/glow púrpura en activo
- **Mapa interactivo** en About (marcadores por ciudad: Bogotá, Medellín, Cali)

---

## Páginas (detalle por capturas)

### About — *Coverage in Colombia*

- Badge: `COVERAGE IN COLOMBIA`
- H1: **AWS Student Builder Groups**
- Stats: `9 groups · 3 cities`
- Lista por ciudad (ej. Bogotá) con cards horizontales:
  - Avatar/logo universidad
  - Nombre del grupo
  - Botón **SBG on MeetUp**
- Mapa Colombia con pins y conteo por ciudad

### Benefits — *Benefits of joining the group*

- `# members`
- H1: **Benefits of joining the group**
- Descripción: certificaciones, proyectos, comunidad, mentoría
- Grid de cards, cada una con:
  - Icono funcional (lucide-style) + **pixel art grande** (trofeo, máscara, etc.)
  - Label `# certification`, `# labs & workshops`, …
  - Título + descripción

### Events — *Events and workshops*

- `# events`
- H1: **Events and workshops**
- Tabs: `# upcoming` | `# past (15)`
- Cards de evento con tag `# próximo`, título, QR, logo

### AWS Services — catálogo

- `# catalog`
- H1: **AWS Services**
- Barra de búsqueda + toggle vista grid/list
- Filas de chips: `# all`, `# compute`, `# storage`, … + `# popular`, `# a-z`, ratings `90+`
- Grid de cards: icono servicio, score, pill de categoría, nombre (EC2, S3, Lambda…)

### Team — *The people making the community possible*

- `# core team`
- Grid de personas:
  - Avatar con iniciales (MA, MP…)
  - Nombre, rol `# Lead 2025` / `# Core Team`
  - Bio corta
  - LinkedIn

### Contact — *Let's talk*

- `# contact`
- H1: **Let's talk**
- 3 cards: `# email`, `# instagram`, `# linkedin`
  - Título, dato (ej. `clubawsud@gmail.com`, `@aws.ud`)
  - Link **Contact →**

---

## i18n

- Idiomas: **en**, **es** (localStorage `lang`)
- Tema: `light` \| `dark` (localStorage `theme`, respeta `prefers-color-scheme`)

Claves detectadas en bundle (parcial): `nav.openMenu`, `nav.goHome`, `benefits:`, `builderCenter:`, `# why join`.

---

## Assets remotos (para inspiración, no copiar sin licencia)

- `/logo/sbg-logo-*.png`
- `/fonts/AmazonEmberDisplay_*.woff2`
- Iconografía pixel integrada en UI (exportar equivalentes propios a `public/icons/`)

---

## Qué adoptar para UCB La Paz

| De UD | Adaptación UCB |
|-------|----------------|
| Sidebar + main | Reemplazar top navbar actual en landing |
| Dark + purple | Evolucionar `club-theme.ts` (hoy azul `#3b41ff` + modo claro celeste) |
| Labels `#` | Usar en secciones: `# eventos`, `# beneficios`, `# equipo` |
| Cards beneficios/eventos | Rehacer `club-benefits`, `club-published-events` |
| Join now prominente | Mantener meetup/whatsapp desde `useClubLinks` |
| Sin emojis | Iconos Lucide + PNG/SVG pixel en `public/` |
| About mapa | Opcional: mapa clubs Bolivia o timeline (como UPB) |

---

## Scraping técnico

| Archivo | Descripción |
|---------|-------------|
| `.cursor/motivation/firecrawl/awsud-home.html` | Shell SPA |
| `.cursor/motivation/firecrawl/awsud-bundle.js` | Bundle principal (~430 KB) |
| `.cursor/motivation/firecrawl/awsud-i18n.js` | Runtime i18next |

**Re-scrape recomendado:** `firecrawl scrape "https://www.awsud.group/" --wait-for 5000` tras `firecrawl login --browser`.
