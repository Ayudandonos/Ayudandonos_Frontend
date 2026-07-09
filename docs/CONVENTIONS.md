# Convenciones de codigo — Frontend

## Idioma

| Elemento | Idioma |
| -------- | ------ |
| Identificadores de codigo | Ingles |
| Comentarios de funciones | Espanol (Entrada/Proceso/Salida) |
| Documentacion | Espanol |
| Textos visibles (UI) | Espanol en `UI_MESSAGES` |

## Comentarios obligatorios

```javascript
// Entrada:
// ...

// Proceso:
// ...

// Salida:
// ...
```

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
- TailwindCSS para estilos
- Sin textos hardcodeados en componentes
