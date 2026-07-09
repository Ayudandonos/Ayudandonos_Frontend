# Ayudándonos — Frontend

SPA React para la plataforma de donaciones en especie.

**Repositorio:** https://github.com/Erickpe8/Ayudandonos_Frontend

## Stack

React 19, Vite, TypeScript, React Router, Axios, TailwindCSS, React Hook Form, Zod.

## Inicio rapido

```bash
cp .env.example .env
npm install
npm run dev
```

- App: `http://localhost:5173`
- API esperada: `http://localhost:3000/api/v1`

## Scripts

| Comando | Descripcion |
| ------- | ----------- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de produccion |
| `npm run preview` | Preview del build |
| `npm run lint` | ESLint |

## Git

GitFlow por tarea: una rama `feature/*` por iteracion, integracion en `develop`, estable en `main`.

Ver [docs/GIT_WORKFLOW.md](./docs/GIT_WORKFLOW.md).

## Desarrollo con IA

| Archivo | Proposito |
| ------- | --------- |
| [AGENTS.md](./AGENTS.md) | Instrucciones para agentes de IA |
| [docs/GIT_WORKFLOW.md](./docs/GIT_WORKFLOW.md) | GitFlow y ramas por tarea |
| [docs/AI_WORKFLOW.md](./docs/AI_WORKFLOW.md) | Flujo de trabajo iterativo |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Guia de contribucion |
| [specs/](./specs/) | Especificaciones tecnicas (local, no en Git) |
| [.cursor/skills/](./.cursor/skills/) | Skills del proyecto |

## Arquitectura

Feature-Based Architecture. Ver [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md).

## Licencia

MIT
