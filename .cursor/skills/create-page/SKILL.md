---
name: create-frontend-page
description: Crear una pagina o pantalla en el frontend Ayudandonos. Usar al agregar rutas y vistas nuevas.
---

# Crear pagina frontend

## Cuando usar

Al agregar una nueva pantalla accesible por ruta.

## Pasos

1. Definir ruta en `specs/ROUTES.md` (path, layout, rol, estado).
2. Crear componente en `src/pages/` o `src/features/<x>/components/`.
3. Asignar layout en `src/routes/AppRouter.tsx` (MainLayout, AuthLayout).
4. Si es protegida: usar ProtectedRoute (Fase 2).
5. Consumir servicio API del feature correspondiente.
6. Estados: loading, error, vacio.
7. Textos desde `UI_MESSAGES`.
8. Responsive con TailwindCSS.
9. Comentarios Entrada/Proceso/Salida.
10. Verificar build y lint.

## Layouts disponibles

| Layout | Uso |
| ------ | --- |
| `MainLayout` | Paginas publicas y dashboard |
| `AuthLayout` | Login, registro |
