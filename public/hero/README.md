# Hero 3D — chip y portal

Para lograr el efecto del mockup (chip flotante + anillos de luz), usa **una** de estas opciones:

## 1. Spline (recomendado — calidad del diseño)

1. Crea la escena en [spline.design](https://spline.design) (chip + anillos + luces).
2. Exporta → **Export** → **Code export** → copia la URL pública.
3. En `.env`:

```env
NEXT_PUBLIC_SPLINE_SCENE_URL=https://my.spline.design/tu-escena
```

El componente `ClubPortalVisual` la mostrará automáticamente.

## 2. Video WebM (rápido, sin librería extra)

1. Exporta desde Spline/Blender/After Effects un loop de **3–5 s**.
2. Guárdalo como `public/hero/chip-portal.webm` (fondo transparente si puedes).
3. Opcional en `.env`:

```env
NEXT_PUBLIC_HERO_VIDEO_URL=/hero/chip-portal.webm
```

## 3. GIF (no recomendado)

- Archivos pesados, peor calidad, sin transparencia real.
- Solo como último recurso.

## 4. Solo CSS (actual)

Si no hay video ni Spline, se usa animación CSS + logo SVG. Es funcional pero no igual al render 3D del Figma.
