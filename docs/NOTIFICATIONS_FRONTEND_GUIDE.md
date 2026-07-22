# Indicaciones Frontend — Notificaciones

Handoff para consumir el modulo de notificaciones del backend (`feature/notifications`).

**Base:** `GET/PATCH /api/v1/notifications` (JWT requerido)

## Endpoints

| Metodo | Ruta | Uso |
| ------ | ---- | --- |
| GET | `/notifications?page&limit&unreadOnly` | Listado / campana |
| GET | `/notifications/unread-count` | Badge en header |
| PATCH | `/notifications/:id/read` | Al abrir una notificacion |
| PATCH | `/notifications/read-all` | Boton "marcar todas" |

## DTO

```ts
{
  id: string;
  type: 'DONATION_CREATED' | 'DONATION_STATUS_CHANGED' | 'DONATION_MESSAGE' | 'DONATION_DELIVERY_UPDATED';
  title: string;
  body: string;
  linkPath: string | null; // rutas relativas SPA
  resourceType: string | null;
  resourceId: string | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}
```

Listado: `data: { items: NotificationDto[] }` + `meta`.  
Unread: `data: { unreadCount: number }`.

## UI sugerida

1. Badge en `DashboardChrome` con polling cada 30–60s a `/unread-count`.
2. Panel o pagina `/notifications` listando items; click → `PATCH .../read` + `navigate(linkPath)`.
3. No crear notificaciones desde el frontend; las genera el backend en eventos de donacion.

## Fuera de alcance

Push, email, WebSockets.
