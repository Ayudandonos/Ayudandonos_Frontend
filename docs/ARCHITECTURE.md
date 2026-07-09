# Arquitectura Frontend — Ayudándonos

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
| `auth` | PARCIAL (skeleton) |
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

## Estilos

TailwindCSS v4. Tema verde en `src/index.css` (`@theme`).
