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

## Desarrollo con IA

| Archivo | Proposito |
| ------- | --------- |
| [AGENTS.md](./AGENTS.md) | Instrucciones para agentes de IA |
| [docs/AI_WORKFLOW.md](./docs/AI_WORKFLOW.md) | Flujo de trabajo iterativo |
| [specs/](./specs/) | Especificaciones tecnicas |
| [.cursor/skills/](./.cursor/skills/) | Skills del proyecto |

## Arquitectura

Feature-Based Architecture. Ver [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md).

## Licencia

MIT
