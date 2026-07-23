# Handoff backend — implementación frontend

Documento de seguimiento para las vistas e integraciones alineadas con la checklist del backend (perfil USER, notificaciones, nearby, guardas fundación, admin limits, donaciones).

**Rama:** `feature/backend-handoff-views`  
**Última actualización:** 2026-07-22

## Estado por módulo

| # | Módulo | Estado | Rutas / archivos clave |
|---|--------|--------|-------------------------|
| 1 | Cliente API / paginación | Hecho | `src/utils/pagination.ts`, tipos en `src/types/api.types.ts` |
| 2 | Perfil USER | Hecho | `GET/PATCH /users/me` — `src/features/users/`, ruta `/profile` |
| 3 | Stats donante | Hecho | `DonorStatsPanel` en perfil USER (`donationStats`) |
| 4 | Sesión `/auth/me` | Parcial | Campos opcionales en `User`/`Foundation`; `fetchMe()` tras guardar perfil |
| 5 | Fundaciones cercanas | Hecho (Leaflet) | `GET /foundations/nearby` — `/foundations/nearby` |
| 6 | Guardas fundación | Reforzado | `FoundationReadinessChecklist` en perfil; guard existente en rutas |
| 7 | Notificaciones | Hecho | `/notifications`, campana en `DashboardHeader`, polling unread-count |
| 8 | Admin dashboard | Hecho | Query `latestNeedsLimit`, `featuredCampaignsLimit` en UI |
| 9 | Donación + chat | Hecho | `initialMessage` en `ContributePage` + payload POST |
| 10 | UX (skeletons/vacíos) | Hecho en módulos nuevos | Skeletons perfil y notificaciones; empty states |

## Endpoints consumidos

| Método | Ruta | Feature |
|--------|------|---------|
| GET | `/users/me` | `users` |
| PATCH | `/users/me` | `users` |
| GET | `/notifications/unread-count` | `notifications` |
| GET | `/notifications` | `notifications` |
| PATCH | `/notifications/:id/read` | `notifications` |
| PATCH | `/notifications/read-all` | `notifications` |
| GET | `/foundations/nearby` | `foundations` |
| GET | `/admin/dashboard` | `admin` (query limits) |
| POST | `/donations` | `donations` (`initialMessage` opcional) |

## Rutas nuevas (dashboard autenticado)

- `/profile` — USER
- `/notifications` — todos los roles autenticados
- `/foundations/nearby` — USER

## Pendiente / mejoras (P3)

- Mapeo global de 403 fundación en todos los formularios operativos (helper reutilizable).
- Iconos `check` / `pending` en checklist (registrar en `icons.ts` si se desea sustituir texto OK/—).
- Gráfica visual de `byStatus` (barras CSS).
- Specs locales `specs/FEATURES.md`, `specs/ROUTES.md` (actualizar en máquina de cada dev; no commitear según política del repo).

## Rate limit / polling (2026-07-22)

**Problema:** con `RATE_LIMIT_MAX=100` en backend, el frontend agotaba la cuota por:

- polling de `GET /notifications/unread-count`
- `GET /auth/me` que invalidaba sesion ante cualquier error (incluido 429), provocando mas ruido
- posibles instancias concurrentes del hook de unread-count

**Mitigacion frontend (aplicada):**

- Un solo poller compartido (`useNotificationUnreadCount`) cada **60 s**
- Backoff de **120 s** si llega **429** (no reintentar en loop)
- Deduplicacion de peticiones in-flight
- `AuthContext.fetchMe`: ante **429** no cierra sesion; solo limpia token ante **401**
- Restauracion de sesion al montar el provider (no en cada cambio de `fetchMe`)

**Mitigacion backend (desarrollo):** subir `RATE_LIMIT_MAX` (ej. 1000) y reiniciar el servidor. Si ya hay 429, esperar la ventana o reiniciar para resetear el contador en memoria.

## Gaps fundaciones (2026-07-23)

Cierre de checklist backend de fundaciones en rama `feature/foundations-checklist-gaps`:

- Coordenadas `latitude`/`longitude` en perfil (mapa + validacion ambas o ninguna)
- 403 operativo diferenciado (`PROFILE_REQUIRED` vs `VERIFICATION_REQUIRED`) en campanas/needs/solicitudes
- Alerta UI para estado `SUSPENDED`
- Filtro cascada pais/departamento/ciudad en listado publico
- Retry y mensaje especifico ante locations 503

## Mapas Leaflet (2026-07-23)

Migracion completa de Google Maps JS a Leaflet + OpenStreetMap en rama `feature/maps-leaflet`:

- `DeliveryMap` / `LocationMap` (campanas, entregas, perfil fundacion)
- Nearby: DTO completo (`origin`, `total`, `categories`, `items`), TanStack Query, sync lista↔mapa
- Sin `VITE_GOOGLE_MAPS_API_KEY`; tiles OSM publicos
- Geocodificacion en front (Nominatim) al cambiar pais/depto/ciudad/direccion
- Modales con `z-index` alto para no quedar bajo panes de Leaflet
- `/foundations` y `/foundations/:id` usan sidebar si hay sesion (`FoundationsBrowseLayout`)

### Pendiente backend recomendado (geocodificacion)

Exponer un proxy para no depender de Nominatim desde el navegador:

```
GET /api/v1/locations/geocode?street=&city=&state=&country=
```

Respuesta sugerida:

```json
{
  "success": true,
  "message": "OK",
  "data": {
    "latitude": 7.8939,
    "longitude": -72.5078,
    "displayName": "Calle 13 #14-20, Cúcuta, Norte de Santander, Colombia"
  },
  "errors": null
}
```

Requisitos:

- Busqueda **estructurada** (street/city/state/country), no solo `q=` libre
- Validar que el resultado pertenezca a la ciudad/departamento indicados (evitar default a Bogota)
- Rate limit, User-Agent propio, cache
- 404/null cuando no hay match fiable
- El front **ya no muestra** lat/lng al usuario; sigue enviando coords al guardar para nearby/mapa
- Ideal: al hacer `PATCH /foundations/:id` o campañas, si llega `address` + ciudad/depto sin coords, el backend geocodifica y persiste lat/lng

### Backend — modal contactar / donaciones

No requiere cambios para el bug de z-index (era CSS). El flujo ya usa `POST /donations` con `needId`, `quantity`, `notes`/`initialMessage`.

### Backend — listado/detalle fundaciones

No requiere cambios de API: el problema del sidebar era solo de routing frontend.

## Verificación

```bash
npm run build
npm run lint
```

Probar con backend actualizado y `VITE_API_URL` apuntando a `/api/v1`.
