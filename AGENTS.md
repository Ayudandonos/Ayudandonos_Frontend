# Instrucciones para agentes de IA — Frontend Ayudándonos

Este repositorio contiene la SPA del proyecto **Ayudándonos**. Lee este archivo antes de modificar codigo.

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
2. Comentarios en funciones: formato **Entrada / Proceso / Salida**.
3. Sin emojis en ningun artefacto.
4. Mensajes UI en `UI_MESSAGES`; no hardcodear textos en componentes.
5. Validacion de formularios con React Hook Form + Zod.
6. No reorganizar carpetas sin autorizacion.
7. No implementar funcionalidades no solicitadas (YAGNI).
8. Esperar aprobacion antes de avanzar de fase.
9. Trabajar en rama `feature/*` (una tarea por rama); PR hacia `develop`. Ver `docs/GIT_WORKFLOW.md`.

## Git (GitFlow por tarea)

- `main`: estable. `develop`: integracion.
- Crear `feature/<modulo>-<tarea>` desde `develop` antes de codificar.
- No mezclar tareas en la misma rama ni commitear directo en `main`.
- No commitear `specs/` ni `.env` (documentacion tecnica local).

## Fases del proyecto

| Fase | Estado | Frontend |
| ---- | ------ | -------- |
| 1 | COMPLETADO | Layouts, rutas, UI base, auth skeleton |
| 2 | PENDIENTE | Auth integrado, formularios, rutas protegidas |
| 3 | PENDIENTE | Fundaciones, campanas (UI) |
| 4 | PENDIENTE | Donaciones, ciclo de vida (UI) |
| 5 | PENDIENTE | Reportes, despliegue |

**Siguiente:** Fase 2 — integracion auth, formularios completos, rutas protegidas.

## Documentacion interna

| Recurso | Ruta |
| ------- | ---- |
| Flujo Git | `docs/GIT_WORKFLOW.md` |
| Flujo de trabajo con IA | `docs/AI_WORKFLOW.md` |
| Arquitectura | `docs/ARCHITECTURE.md` |
| Convenciones | `docs/CONVENTIONS.md` |
| Reglas de desarrollo | `docs/DEVELOPMENT_RULES.md` |
| Especificaciones (local) | `specs/FEATURES.md`, `specs/ROUTES.md`, `specs/API_INTEGRATION.md` |
| Skills del proyecto | `.cursor/skills/` |

## Comandos utiles

```bash
npm run dev          # Servidor Vite (puerto 5173)
npm run build        # Build de produccion
npm run lint         # ESLint
npm run preview      # Preview del build
```

## Variables de entorno

Copiar `.env.example` a `.env`. Variable principal: `VITE_API_URL`.
