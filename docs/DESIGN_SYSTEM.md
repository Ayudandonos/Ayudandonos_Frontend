# Design System — Ayudandonos

**Estado:** OFICIAL — vigente desde 2026-07-09  
**Alcance:** Arquitectura obligatoria del frontend  
**Marca:** Ayudandonos  
**Implementacion:** `src/index.css`, `src/components/ui/`  
**Especificacion detallada (local):** `specs/DESIGN_SYSTEM.md`, `specs/UI_GUIDELINES.md`

Documentacion oficial del sistema de diseno del frontend. Forma parte de la arquitectura del proyecto y es obligatoria para desarrolladores y agentes de IA.

---

## Indice

1. [Identidad visual](#1-identidad-visual)
2. [Tokens de diseno](#2-tokens-de-diseno)
3. [Componentes UI](#3-componentes-ui)
4. [Animaciones](#4-animaciones)
5. [Iconografia e imagenes](#5-iconografia-e-imagenes)
6. [Accesibilidad](#6-accesibilidad)
7. [Responsive](#7-responsive)
8. [Reglas permanentes](#8-reglas-permanentes)

---

## 1. Identidad visual

Toda la aplicacion utiliza una unica identidad visual basada en:

| Principio | Descripcion |
| --------- | ----------- |
| Glassmorphism | Fondos translucidos, blur suave, bordes de baja opacidad |
| Minimalismo | Solo elementos necesarios; sin decoracion superflua |
| Componentes suaves | Bordes redondeados, sombras ligeras, transiciones fluidas |
| Diseno moderno | Interfaz elegante, profesional y cercana |
| Espacio en blanco | Separacion amplia entre bloques y dentro de cards |
| Jerarquia clara | Titulos, subtitulos y cuerpo bien diferenciados |

**Prohibido:** mezclar estilos de paneles administrativos tradicionales, bibliotecas UI externas o componentes con apariencia distinta al sistema.

---

## 2. Tokens de diseno

Fuente unica de verdad: `src/index.css` (`@theme` y utilidades CSS).

### Colores

| Token | Uso | Valor referencia |
| ----- | --- | ---------------- |
| `primary-600/700` | Acciones principales, marca | `#6646ff` / `#4d21e7` |
| `primary-50–200` | Fondos suaves, estados activos | Escala lavanda |
| `secondary-500/700` | Acciones secundarias | `#64748b` / `#334155` |
| `success-500/600` | Confirmaciones, estados OK | `#10b981` / `#059669` |
| `warning-500/600` | Advertencias | `#f59e0b` / `#d97706` |
| `error-500/600` | Errores, peligro | `#ef4444` / `#dc2626` |
| `info-500/600` | Informacion | `#3b82f6` / `#2563eb` |
| `text-primary` | Titulos, texto principal | `#1c1a25` |
| `text-secondary` | Cuerpo | `#474556` |
| `text-muted` | Captions, hints | `#787588` |
| `border-default` | Bordes | `rgba(201,196,217,0.6)` |
| `surface-page` | Fondo base | `#f8f6fc` |

Alias `vivid-*` mantenidos por compatibilidad; preferir `primary-*` en codigo nuevo.

### Tipografia

**Familia:** Inter (`--font-sans`), cargada en `index.html`.

| Nivel | Clase | Tamaño | Peso | Uso |
| ----- | ----- | ------ | ---- | --- |
| Display | `.text-display` | 30–36px | 700 | Titulo de pagina (h1) |
| Heading | `.text-heading` | 24px | 600 | Titulo de seccion (h2) |
| Subheading | `.text-subheading` | 18px | 500 | Subtitulo (h3) |
| Body | `.text-body` | 16px | 400 | Parrafos |
| Caption | `.text-caption` | 14px | 400 | Texto auxiliar |
| Label | `.text-label` | 14px | 500 | Etiquetas de formulario |

Line-height body: `leading-relaxed` (1.625). Tracking titulos: `tracking-tight`.

### Espaciado, radios y sombras

| Contexto | Valor recomendado |
| -------- | ----------------- |
| Margen entre secciones | 48–64px (`py-12` a `py-16`) |
| Padding pagina mobile | 24px (`px-6`) |
| Padding pagina desktop | 40px (`lg:px-10`) |
| Gap entre campos formulario | 16px (`space-y-4`) |
| Gap entre cards grid | 24px (`gap-6`) |
| Separacion header/contenido | 64px minimo |

| Token | Valor |
| ----- | ----- |
| `--radius-sm` | 8px (inputs) |
| `--radius-md` | 12px (botones) |
| `--radius-lg` | 16px (cards) |
| `--radius-pill` | 9999px (botones pill) |
| `--shadow-glass` | Sombra glass |
| `--shadow-card` | Sombra card reposo |
| `--shadow-card-hover` | Sombra card hover |
| `--shadow-button` | Sombra boton primario |

Padding estandar en cards: `sm=16px`, `md=24px`, `lg=32px` (componente `Card`).

### Glassmorphism

| Clase | Uso |
| ----- | --- |
| `.glass` | Cards principales |
| `.glass-subtle` | Inputs, elementos secundarios |
| `.glass-header` | Header y footer fijos |

Reglas: blur 12–20px, opacidad 50–82%, borde blanco translucido. No abusar del efecto en contenido denso.

---

## 3. Componentes UI

Ubicacion: `src/components/ui/`. Export central: `src/components/ui/index.ts`.

| Componente | Archivo | Estado |
| ---------- | ------- | ------ |
| Button | `Button.tsx` | IMPLEMENTADO |
| Input | `Input.tsx` | IMPLEMENTADO |
| Card | `Card.tsx` | IMPLEMENTADO |
| Icon | `Icon/` | IMPLEMENTADO |
| AuthChrome | `AuthChrome.tsx` | IMPLEMENTADO (header/footer auth) |
| Select | — | PENDIENTE |
| Table | — | PENDIENTE |
| Modal / Dialog | — | PENDIENTE |
| Alert | — | PENDIENTE |
| Badge | — | PENDIENTE |
| Breadcrumb | — | PENDIENTE |
| Sidebar | — | PENDIENTE |
| Tooltip | — | PENDIENTE |
| Toast | — | PENDIENTE |
| Dropdown | — | PENDIENTE |

Los componentes PENDIENTE deben crearse siguiendo los mismos tokens y patrones de Button, Input y Card antes de usarse en features.

### Button

Variantes: `primary`, `secondary`, `outline`, `ghost`, `danger`.  
Tamanos: `sm`, `md`, `lg`.  
Estados: hover, focus-visible, active (scale), disabled, loading.

```tsx
import { Button } from '@/components/ui';

<Button variant="primary" iconRight="add">Continuar</Button>
```

### Input

Props: `label`, `error`, `hint`, `iconLeft` (IconName), `iconRight`, `filled`.  
Altura estandar: 44px (`h-11`).

### Card

Props: `glass`, `hover`, `padding`. Efecto lift en hover cuando `hover={true}`.

### Icon

Fuente oficial: SVG locales en `src/assets/icons/` (origen: carpeta `ICONOS SVG` del proyecto).  
Registro central: `src/components/ui/Icon/icons.ts`.  
Componente: `src/components/ui/Icon/Icon.tsx`.

```tsx
import { Icon } from '@/components/ui';

<Icon name="envelope" size="md" color="#6646ff" className="text-primary-600" />
<Icon name="user" size="lg" title="Perfil de usuario" decorative={false} />
```

Props: `name`, `size`, `width`, `height`, `color`, `className`, `title`, `decorative`, `aria-label`, `role`.

**Prohibido:** importar SVG directamente en paginas, features o componentes. Ampliar `icons.ts` si falta un icono (copiar SVG a `src/assets/icons/` primero).

**Agregar icono:**
1. Copiar SVG a `src/assets/icons/` (kebab-case, ingles).
2. Importar y registrar en `icons.ts`.
3. Usar `<Icon name="..." />`.

### Componentes pendientes — estilo oficial

Todos deben crearse en `src/components/ui/` antes de usarse. Compartir tokens, glass, radios y transiciones.

| Componente | Estilo oficial |
| ---------- | -------------- |
| **Select** | Misma altura/radio que Input; icono chevron via Icon; glass-subtle |
| **Table** | Header glass-subtle; filas hover `primary-50`; bordes `border-default` |
| **Modal / Dialog** | Overlay `rgba(28,26,37,0.4)` + blur; contenedor `.glass` radius-lg; animacion scale-in |
| **Alert** | Variantes success/warning/error/info; icono semantico + texto; sin bordes duros |
| **Badge** | Pill; fondo `primary-100`; texto `primary-700`; tamanos sm/md |
| **Breadcrumb** | `.text-caption`; separador Icon; links `primary-700` |
| **Navbar** | `.glass-header` sticky; items con estado activo `primary-50` |
| **Sidebar** | `.glass` fijo; ancho 256px; items hover `primary-50` |
| **Menu / Dropdown** | Panel `.glass-subtle`; sombra card; animacion fade-in |
| **Tooltip** | Fondo `text-primary` invertido; texto blanco; radius-sm; fade-in |
| **Toast** | Card glass en esquina; icono semantico; auto-dismiss; slide-in |
| **Formularios** | React Hook Form + Zod; solo Input/Select del sistema; espaciado `space-y-4` |

---

## 4. Animaciones

| Animacion | Clase / uso |
| --------- | ----------- |
| Fade in | `.animate-fade-in` (entrada de pagina) |
| Slide in | `.animate-slide-in` (modales, toasts, paneles) |
| Scale in | `.animate-scale-in` (dialogs) |
| Hover lift | `.interactive-lift` en cards |
| Active scale | `.interactive-scale` en botones |
| Focus | `focus-visible:ring-2 ring-primary-600/40` |
| Transicion | `.transition-smooth` |

Duraciones: `--duration-fast` 150ms, `--duration-normal` 250ms, `--duration-slow` 400ms.  
Easing: `--ease-smooth` cubic-bezier(0.4, 0, 0.2, 1).

No usar animaciones exageradas, rebotes extremos ni parallax.

---

## 5. Iconografia e imagenes

### Iconos

- Fuente unica: SVG en `src/assets/icons/`.
- Componente central: `src/components/ui/Icon/`.
- Registro: `icons.ts`.
- Prohibido: React Icons, Heroicons, Lucide, Font Awesome, Uicons CDN, imports directos de `.svg`.
- Excepcion: logos de terceros (Google OAuth) en `public/assets/figma/`.

### Imagenes e ilustraciones

Reglas obligatorias:

- Fondo transparente (PNG/SVG).
- Alta resolucion y optimizadas para web.
- Sin marcas de agua, fondos blancos o de color, bordes innecesarios.
- Preferir SVG cuando sea posible.
- Ilustraciones con estilo minimalista acorde a la paleta primary.

Assets de marca: `public/assets/figma/`, constantes en `figma-assets.constants.ts`.

---

## 6. Accesibilidad

Obligatorio en todo componente:

- Navegacion por teclado.
- `:focus-visible` con ring `primary-600`.
- Labels asociados a inputs (`htmlFor` / `id`).
- `aria-invalid`, `aria-describedby`, `role="alert"` en errores.
- `aria-label` o `aria-hidden` en iconos decorativos.
- Contraste suficiente texto/fondo.

---

## 7. Responsive

Un unico diseno adaptable. Breakpoints Tailwind estandar (`sm`, `md`, `lg`).  
No crear layouts separados por dispositivo. Probar mobile, tablet y desktop.

---

## 8. Reglas permanentes

Antes de implementar cualquier pantalla nueva:

1. Consultar `docs/DESIGN_SYSTEM.md` y `specs/UI_GUIDELINES.md`.
2. Reutilizar componentes de `components/ui/`.
3. Textos en `UI_MESSAGES`.
4. No instalar librerias UI sin autorizacion.
5. No usar iconos fuera de `Icon`.
6. No usar imagenes con fondo de color.
7. Ejecutar `npm run build` y `npm run lint`.

El incumplimiento de estas reglas debe corregirse antes de integrar a `develop`.
