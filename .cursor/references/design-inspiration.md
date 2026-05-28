# Guía de diseño — Fusión UD + UCB

## Dirección acordada

**Primaria:** [awsud.group](https://www.awsud.group/) — estructura, dark UI, sidebar, chips, pixel accents.  
**Secundaria:** [UPB Amplify](https://main.dwlqhqmsg4skm.amplifyapp.com/) — storytelling, stats, timeline, proyectos, FAQ.

## Comparativa rápida

| Aspecto | Sitio actual UCB | awsud.group | UPB |
|---------|------------------|-------------|-----|
| Layout | Top navbar + footer | Sidebar fija | Top nav + secciones anchor |
| Tema default | Claro celeste + dark opcional | Dark predominante | Light/dark ink |
| Acento | `#3b41ff` azul | Púrpura AWS builder | Signal naranja |
| Tipografía | Gilroy + GuarujaTitle | Amazon Ember + mono | Geist + JetBrains Mono |
| Iconos | Lucide | Pixel + line | Emojis (evitar) |
| Admin | Sidebar shadcn genérico | — | — |

## Tokens propuestos (fase rediseño)

```css
/* Sugerencia — implementar en club-theme.ts / globals.css */
--club-bg: #07051a;
--club-surface: #12101f;
--club-border: rgba(255,255,255,0.08);
--club-accent: #7c3aed;        /* purple active */
--club-accent-muted: #a78bfa;
--club-orange: #f97316;         /* decor pixels */
--club-text: #fafafa;
--club-text-muted: #a1a1aa;
--club-font-sans: "Gilroy", system-ui;
--club-font-mono: "JetBrains Mono", ui-monospace;
```

## Componentes a diseñar

### Público

1. `ClubAppShell` — sidebar + `main` (reemplaza solo top nav en marketing)
2. `ClubPageHeader` — breadcrumbs, `# tag`, title, description, decor grid
3. `ClubBenefitCard` — icon + pixel asset + `# label`
4. `ClubEventCard` — tabs upcoming/past
5. `ClubContactCard` — 3 columnas email / IG / LinkedIn
6. `ClubTeamCard` — iniciales, rol `#`, bio, LinkedIn
7. `ClubChip` — filtros y tags

### Admin (misma familia visual)

1. Re-skin `AppSidebar` — fondo oscuro, acento púrpura, logo club
2. `DashboardPageHeader` — mismo patrón breadcrumb + `#`
3. Tablas y dialogs — bordes y radios alineados a cards públicas
4. Preview en vivo del equipo/evento (opcional)

## Assets en `public/` (solicitar al equipo)

| Asset | Uso |
|-------|-----|
| `logo/` (existente) | Nav, sidebar, favicon |
| `icons/pixel/` | Decoración hero (chip, rayo, trofeo) |
| `icons/benefits/` | Un SVG por beneficio |
| `fondo.webp` o grid bg | Hero background |
| Avatares equipo | Fotos reales en admin → URLs |

**No usar:** emojis como iconografía principal (referencia UPB).

## Accesibilidad

- Contraste WCAG en texto gris sobre fondo oscuro
- `aria-label` en sidebar y toggles ES/EN
- Respetar `prefers-reduced-motion` en animaciones Motion

## Responsive

- **Desktop:** sidebar fija 240–280px
- **Tablet/mobile:** drawer (patrón ya en `Sheet` del navbar actual)
