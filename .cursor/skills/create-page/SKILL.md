---
name: create-frontend-page
description: Crear una pagina o pantalla en el frontend Ayudandonos. Usar al agregar rutas y vistas nuevas.
---

# Crear pagina frontend

## Cuando usar

Al agregar una nueva pantalla accesible por ruta.

## Git (antes de codificar)

```bash
git checkout develop
git pull origin develop
git checkout -b feature/<modulo>-<descripcion>
```

Una rama por tarea. PR hacia `develop`. Ver `docs/GIT_WORKFLOW.md`.

## Pasos

1. Definir ruta en `specs/ROUTES.md` (local): path, layout, rol, estado.
2. Crear componente en `src/pages/` o `src/features/<x>/components/`.
3. Asignar layout en `src/routes/AppRouter.tsx` (MainLayout, AuthLayout).
4. Si es protegida: usar ProtectedRoute (Fase 2).
5. Consumir servicio API del feature correspondiente.
6. Documentar endpoints en `specs/API_INTEGRATION.md` (local).
7. Estados: loading, error, vacio.
8. Textos desde `UI_MESSAGES`.
9. Responsive con TailwindCSS.
10. Comentarios JSDoc unico (Entrada/Proceso/Salida).
11. Verificar build y lint.

## Layouts disponibles

| Layout | Uso |
| ------ | --- |
| `MainLayout` | Paginas publicas y dashboard |
| `AuthLayout` | Login, registro |

## Reglas

- No commitear `specs/`.
- Sin emojis.
