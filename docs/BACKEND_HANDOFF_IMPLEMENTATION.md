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
| 5 | Fundaciones cercanas | Hecho | `GET /foundations/nearby` — `/foundations/nearby` |
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

## Verificación

```bash
npm run build
npm run lint
```

Probar con backend actualizado y `VITE_API_URL` apuntando a `/api/v1`.
