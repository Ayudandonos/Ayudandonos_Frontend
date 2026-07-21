# Instrucciones para agentes de IA — Frontend Ayudandonos

Este repositorio contiene la SPA del proyecto **Ayudandonos**. Lee este archivo antes de modificar codigo.

## Contexto del proyecto

Plataforma para conectar fundaciones verificadas con donantes en especie. El frontend consume exclusivamente la API REST del backend. No accede a base de datos.

**Repositorio relacionado:** Backend en `https://github.com/Erickpe8/Ayudandonos_Backend`

## Stack

React 19, Vite, TypeScript, React Router, Axios, React Hook Form, Zod, TailwindCSS v4, Context API.

## Arquitectura obligatoria

**Feature-Based Architecture:**

```
src/
  features/<dominio>/   # componentes, hooks, services del dominio
  components/ui/        # componentes reutilizables genericos
  layouts/              # layouts de pagina
  pages/                # paginas de alto nivel
  services/             # cliente Axios base
  context/              # estado global (auth)
  routes/               # React Router
  constants/            # textos UI (UI_MESSAGES)
```

- Un feature **no importa** internamente de otro feature.
- Llamadas API en `features/<x>/services/` o `services/`.
- Textos visibles en `src/constants/messages.constants.ts`.

## Reglas no negociables

1. Codigo en **ingles**; documentacion y comentarios en **espanol**.
2. Comentarios en funciones: **un unico bloque JSDoc** con lineas `Entrada`, `Proceso` y `Salida` (ver `docs/CONVENTIONS.md`).
3. Sin emojis en ningun artefacto.
4. Mensajes UI en `UI_MESSAGES`; no hardcodear textos en componentes.
5. Validacion de formularios con React Hook Form + Zod.
6. No reorganizar carpetas sin autorizacion.
7. No implementar funcionalidades no solicitadas (YAGNI).
8. Esperar aprobacion antes de avanzar de fase.
9. Trabajar en rama `feature/*` (una tarea por rama); PR hacia `develop`. Ver `docs/GIT_WORKFLOW.md`.
10. **Design System obligatorio:** consultar `docs/DESIGN_SYSTEM.md` antes de cualquier UI nueva. Usar solo componentes de `src/components/ui/`, iconos via `Icon`, tokens de `src/index.css`. No mezclar estilos ni librerias UI sin autorizacion.
11. **Iconografia centralizada:** todo icono UI via `<Icon name="..." />` desde `src/components/ui/Icon/`. SVG solo en `src/assets/icons/` registrados en `icons.ts`. Prohibido importar SVG en features o paginas. Si falta un icono en la carpeta oficial, informar antes de usar otra fuente.

## Git (GitFlow por tarea)

- `main`: estable. `develop`: integracion.
- Crear `feature/<modulo>-<tarea>` desde `develop` antes de codificar.
- No mezclar tareas en la misma rama ni commitear directo en `main`.
- No commitear `specs/` ni `.env` (documentacion tecnica local).

## Fases del proyecto

| Fase | Estado | Frontend |
| ---- | ------ | -------- |
| 1 | COMPLETADO | Layouts, rutas, UI base, Design System |
| 2 | COMPLETADO | Auth integrado, formularios, rutas protegidas |
| 3 | COMPLETADO | Fundaciones (listado, detalle, perfil, admin verificacion) |
| 4 | EN PROGRESO | Campanas, needs, donaciones, chat, mapa entrega (`feature/campaigns-flow`) |
| 5 | PENDIENTE | Reportes, despliegue |

**Siguiente / handoff Fase 4:** Leer y aplicar `docs/CAMPAIGNS_FRONTEND_GUIDE.md` (contrato API backend + pantallas + checklist).

## Documentacion interna

| Recurso | Ruta |
| ------- | ---- |
| Flujo Git | `docs/GIT_WORKFLOW.md` |
| Flujo de trabajo con IA | `docs/AI_WORKFLOW.md` |
| Arquitectura | `docs/ARCHITECTURE.md` |
| **Design System** | **`docs/DESIGN_SYSTEM.md`** |
| **Campanas / Donaciones (handoff)** | **`docs/CAMPAIGNS_FRONTEND_GUIDE.md`** |
| Convenciones | `docs/CONVENTIONS.md` |
| Reglas de desarrollo | `docs/DEVELOPMENT_RULES.md` |
| Especificaciones (local) | `specs/DESIGN_SYSTEM.md`, `specs/UI_GUIDELINES.md`, `specs/FEATURES.md`, `specs/ROUTES.md`, `specs/API_INTEGRATION.md` |
| Skills del proyecto | `.cursor/skills/` |

## Comandos utiles

```bash
npm run dev          # Servidor Vite (puerto 5173)
npm run build        # Build de produccion
npm run lint         # ESLint
npm run preview      # Preview del build
```

## Variables de entorno

Copiar `.env.example` a `.env`.

- `VITE_API_URL` — URL base de la API (`/api/v1`).
- `VITE_GOOGLE_MAPS_API_KEY` — Maps JavaScript API (mapa de entregas). Sin key, UI con fallback textual.
