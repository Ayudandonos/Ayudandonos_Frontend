# Convenciones de codigo — Frontend

## Idioma

| Elemento | Idioma |
| -------- | ------ |
| Identificadores de codigo | Ingles |
| Comentarios de funciones | Espanol en bloque JSDoc unico (Entrada/Proceso/Salida) |
| Documentacion | Espanol |
| Textos visibles (UI) | Espanol en `UI_MESSAGES` |

## Comentarios obligatorios

Toda funcion, metodo, hook, utilidad, middleware y componente exportado debe documentarse con **un unico bloque JSDoc** en espanol:

```typescript
/**
 * Entrada: Describe de forma clara los parametros o datos que recibe la funcion.
 * Proceso: Explica brevemente la responsabilidad y el comportamiento de la funcion.
 * Salida: Describe el valor retornado o el efecto que produce la funcion.
 */
```

No usar comentarios de linea (`//`) ni bloques separados para Entrada, Proceso o Salida.

## Nomenclatura

| Tipo | Patron |
| ---- | ------ |
| Componente | `PascalCase.tsx` |
| Hook | `use<Nombre>.ts` |
| Servicio | `<nombre>.service.ts` |
| Feature | `src/features/<nombre>/` |

## Commits (Conventional Commits)

```
feat: add login form integration
fix: correct route protection
docs: update ROUTES spec
```

## Estilo

- Sin emojis
- TailwindCSS para estilos; tokens en `src/index.css`
- Sin textos hardcodeados en componentes
- **Design System obligatorio:** ver `docs/DESIGN_SYSTEM.md`
- Componentes UI solo desde `src/components/ui/`
- Iconos solo via `src/components/ui/Icon/`
- No instalar librerias de componentes UI sin autorizacion
