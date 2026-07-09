---
name: create-frontend-feature
description: Crear un feature frontend en Ayudandonos siguiendo Feature-Based Architecture. Usar al implementar un nuevo dominio en src/features/.
---

# Crear feature frontend

## Cuando usar

Al implementar un nuevo dominio en `src/features/<nombre>/`.

## Pasos

1. Actualizar `specs/FEATURES.md` con proposito y componentes.
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
4. Crear componentes; textos desde `UI_MESSAGES`.
5. Formularios: React Hook Form + Zod.
6. Comentarios Entrada/Proceso/Salida en funciones.
7. Exportar desde `index.ts`.
8. Registrar rutas en `src/routes/AppRouter.tsx` si aplica.
9. Actualizar `specs/ROUTES.md`.
10. Ejecutar `npm run build` y `npm run lint`.

## Reglas

- No importar de otro feature.
- Sin textos hardcodeados en JSX.
- Sin emojis.
