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

## Flujo de trabajo

1. Analizar 2. Disenar 3. Explicar 4. Implementar 5. build + lint 6. Documentar 7. Esperar aprobacion

## Prohibido sin autorizacion

- Cambiar arquitectura
- Acceso directo a BD
- Textos hardcodeados en componentes
- Codigo no solicitado
