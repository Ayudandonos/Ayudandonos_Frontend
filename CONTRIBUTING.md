# Contribucion — Frontend

## Git (GitFlow por tarea)

Usamos una rama por tarea. Detalle completo en [docs/GIT_WORKFLOW.md](./docs/GIT_WORKFLOW.md).

| Rama | Uso |
| ---- | --- |
| `main` | Estable / produccion |
| `develop` | Integracion de tareas |
| `feature/*` | Una tarea o iteracion |
| `fix/*` | Correcciones sobre develop |
| `hotfix/*` | Urgente desde main |

Inicio de tarea:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/modulo-descripcion
```

Al terminar: push, PR hacia `develop`, revision y merge. No commitear directo en `main`.

## Flujo de desarrollo

1. Leer `AGENTS.md` y `docs/AI_WORKFLOW.md`
2. Crear o usar rama `feature/*` para la tarea
3. Consultar `specs/` localmente antes de implementar (no se versiona en Git)
4. Seguir arquitectura por features
5. Ejecutar `npm run build` y `npm run lint`
6. Actualizar `specs/` localmente
7. Solicitar revision antes de merge a `develop`

## Commits

Formato Conventional Commits:

```
feat(auth): integrate login with API
fix(routes): correct protected route redirect
docs(workflow): update GIT_WORKFLOW examples
```

## Pull requests

Incluir:

- Pantallas o features afectados
- Endpoints API consumidos
- Capturas responsive (si aplica UI)
- Resultado de build y lint

## Secretos y archivos locales

- Nunca commitear `.env`. Usar `.env.example` como plantilla.
- No commitear `specs/` (documentacion tecnica local; ver `.gitignore`).
