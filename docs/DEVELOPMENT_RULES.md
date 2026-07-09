# Reglas de desarrollo — Frontend

Reglas obligatorias para humanos y agentes de IA.

## Arquitectura

- Feature-Based Architecture
- Features independientes entre si
- Solo comunicacion con backend via Axios
- No reorganizar carpetas sin autorizacion

## Calidad

- SOLID, Clean Code, DRY, KISS, YAGNI
- Logica compleja en hooks, no en JSX
- Validacion con React Hook Form + Zod

## Idioma

- Codigo en ingles
- Documentacion y comentarios en espanol
- Textos UI en `UI_MESSAGES`

## Comunicacion

- Sin emojis
- Estados en docs: COMPLETADO, PARCIAL, PENDIENTE

## API

- Base URL: `VITE_API_URL` (ej. `http://localhost:3000/api/v1`)
- Respuesta estandar del backend: `{ success, message, data, errors }`
- Documentar endpoints consumidos en `specs/API_INTEGRATION.md` (local)

## Flujo de trabajo

1. Rama `feature/*` desde `develop` (ver `docs/GIT_WORKFLOW.md`)
2. Analizar 3. Disenar 4. Explicar 5. Implementar 6. build + lint 7. Documentar (`specs/` local) 8. PR a `develop` 9. Esperar aprobacion

## Prohibido sin autorizacion

- Cambiar arquitectura
- Acceso directo a BD
- Textos hardcodeados en componentes
- Codigo no solicitado
- Commitear `specs/` o `.env`
- Mezclar varias tareas en una rama
- **Mezclar estilos visuales distintos al Design System**
- **Importar iconos fuera del componente `Icon`**
- **Usar librerias UI externas (MUI, shadcn, etc.)**
- **Usar imagenes con fondo de color o sin transparencia**

## Design System

Referencia obligatoria antes de implementar UI:

| Documento | Alcance |
| --------- | ------- |
| `docs/DESIGN_SYSTEM.md` | Documentacion oficial versionada |
| `specs/DESIGN_SYSTEM.md` | Especificacion tecnica local |
| `specs/UI_GUIDELINES.md` | Guia practica de implementacion |

Implementacion: `src/index.css` + `src/components/ui/`.
