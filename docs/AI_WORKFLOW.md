# Flujo de trabajo con IA — Frontend

## Proposito

Definir como los agentes de IA deben participar en el desarrollo del frontend sin mezclar logica de negocio ni romper la arquitectura por features.

## Git por tarea

Antes de implementar, confirmar o crear la rama segun `docs/GIT_WORKFLOW.md`:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/modulo-descripcion-tarea
```

Una rama por tarea. PR hacia `develop` al cerrar la iteracion.

## Flujo obligatorio por iteracion

1. **Analizar** el requerimiento y leer `AGENTS.md`, `specs/` (local) y reglas en `docs/`.
2. **Confirmar Git:** rama `feature/<tarea>` desde `develop` antes de codificar.
3. **Diseñar** componentes, rutas, servicios API y estado necesario.
4. **Explicar** estrategia, archivos afectados e impacto.
5. **Implementar** solo lo solicitado.
6. **Verificar** `npm run build` y `npm run lint`.
7. **Documentar** cambios y actualizar `specs/` localmente si corresponde.
8. **Esperar aprobacion** antes de la siguiente iteracion.

## Antes de escribir codigo

- Consultar `docs/DESIGN_SYSTEM.md` y `specs/UI_GUIDELINES.md` (local) para cualquier UI.
- Consultar `specs/ROUTES.md` y `specs/FEATURES.md` (local).
- Revisar contratos API en backend (`specs/API_OVERVIEW.md`, `specs/modules/*.md`) y documentar en `specs/API_INTEGRATION.md`.
- Revisar `docs/DEVELOPMENT_RULES.md`.
- Usar skill `.cursor/skills/create-feature/` para features nuevos.
- Usar skill `.cursor/skills/create-page/` para paginas nuevas.
- Textos UI solo en `src/constants/messages.constants.ts`.
- Componentes visuales solo desde `src/components/ui/`; iconos via `Icon`.

## Checklist por feature nuevo

- [ ] Rama `feature/*` creada desde `develop`
- [ ] Carpeta en `src/features/<nombre>/`
- [ ] `components/`, `services/`, `types/` segun necesidad
- [ ] `index.ts` con barrel exports
- [ ] Servicio API usa instancia `api` de `services/api.ts`
- [ ] Formularios con React Hook Form + Zod
- [ ] Textos desde `UI_MESSAGES`
- [ ] Comentarios Entrada/Proceso/Salida en funciones
- [ ] Componentes UI del Design System (Button, Input, Card, Icon)
- [ ] Sin iconos ni estilos fuera del sistema de diseno
- [ ] Responsive con TailwindCSS
- [ ] Build y lint sin errores
- [ ] `specs/` actualizado localmente

## Prohibiciones

- Acceso directo a base de datos.
- Importar un feature desde otro feature.
- Hardcodear textos visibles en componentes.
- Logica de negocio compleja en componentes de presentacion.
- Emojis en cualquier artefacto.
- Commitear `specs/` o `.env`.
- Mezclar varias tareas en una misma rama.
- Mezclar estilos visuales distintos al Design System.
- Importar iconos fuera de `src/components/ui/Icon/`.
- Instalar librerias UI externas sin autorizacion.

## Fases del proyecto

| Fase | Estado | Alcance |
| ---- | ------ | ------- |
| 1 | COMPLETADO | Layouts, rutas, UI base, Design System |
| 2 | EN PROGRESO | Auth integrado, rutas protegidas |
| 3 | PENDIENTE | Fundaciones, campanas (UI) |
| 4 | PENDIENTE | Donaciones, ciclo de vida (UI) |
| 5 | PENDIENTE | Reportes, despliegue Vercel |
