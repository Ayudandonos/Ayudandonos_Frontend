---
name: create-frontend-feature
description: Crear un feature frontend en Ayudandonos siguiendo Feature-Based Architecture. Usar al implementar un nuevo dominio en src/features/.
---

# Crear feature frontend

## Cuando usar

Al implementar un nuevo dominio en `src/features/<nombre>/`.

## Git (antes de codificar)

```bash
git checkout develop
git pull origin develop
git checkout -b feature/<modulo>-<descripcion>
```

Una rama por tarea. PR hacia `develop`. Ver `docs/GIT_WORKFLOW.md`.

## Pasos

1. Actualizar `specs/FEATURES.md` (local) con proposito y componentes.
2. Crear estructura:
   ```
   src/features/<nombre>/
     components/
     hooks/
     services/
     types/
     index.ts
   ```
3. Crear servicio API en `services/<nombre>.service.ts` usando instancia `api`.
4. Documentar endpoints en `specs/API_INTEGRATION.md` (local).
5. Crear componentes; textos desde `UI_MESSAGES`.
6. Formularios: React Hook Form + Zod.
7. Comentarios Entrada/Proceso/Salida en funciones.
8. Exportar desde `index.ts`.
9. Registrar rutas en `src/routes/AppRouter.tsx` si aplica.
10. Actualizar `specs/ROUTES.md` (local).
11. Ejecutar `npm run build` y `npm run lint`.

## Reglas

- No importar de otro feature.
- Sin textos hardcodeados en JSX.
- Sin emojis.
- No commitear `specs/`.
