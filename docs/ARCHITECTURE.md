# Arquitectura Frontend — Ayudandonos

## Vision

SPA React con arquitectura por features. Comunicacion exclusiva con backend via Axios.

## Capas

| Capa | Ubicacion | Responsabilidad |
| ---- | --------- | --------------- |
| Pages | `src/pages/` | Paginas de alto nivel |
| Features | `src/features/` | Dominio: UI, hooks, services |
| Components | `src/components/ui/` | UI reutilizable |
| Layouts | `src/layouts/` | Estructura de pagina |
| Services | `src/services/` | Cliente HTTP base |
| Context | `src/context/` | Estado global (auth) |
| Routes | `src/routes/` | React Router |

## Features planificados

| Feature | Estado |
| ------- | ------ |
| `auth` | PARCIAL (UI + servicios) |
| `marketing` | PARCIAL (paginas publicas) |
| `legal` | PARCIAL (paginas legales) |
| `foundations` | PENDIENTE |
| `campaigns` | PENDIENTE |
| `needs` | PENDIENTE |
| `donations` | PENDIENTE |
| `statistics` | PENDIENTE |

## Cliente HTTP

`src/services/api.ts` — Axios con:

- `baseURL` desde `VITE_API_URL`
- Interceptor de request: Bearer token
- Interceptor de response: limpiar token en 401

## Formularios

React Hook Form + Zod. Espejar validaciones del backend cuando existan.

## Estilos y Design System

TailwindCSS v4. Tokens y utilidades en `src/index.css` (`@theme`).

Identidad visual: **Glassmorphism + minimalismo** (Ayudandonos). Documentacion completa en [docs/DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md).

| Capa UI | Ubicacion |
| ------- | --------- |
| Tokens (colores, tipografia, sombras) | `src/index.css` |
| Componentes reutilizables | `src/components/ui/` |
| Iconografia centralizada | `src/components/ui/Icon/` |
| Textos visibles | `src/constants/messages.constants.ts` |
| Assets (logos, ilustraciones) | `public/assets/figma/` |

Componentes implementados: Button, Input, Card, Icon, AuthChrome.  
Componentes pendientes (crear antes de usar): Select, Table, Modal, Alert, Badge, Breadcrumb, Sidebar, Tooltip, Toast, Dropdown.

Reglas: no mezclar estilos, no librerias UI externas sin autorizacion, iconos solo via `Icon`, imagenes con fondo transparente.
