# Indicaciones Frontend — Flujo completo de Campanas

Documento de handoff para el frontend. El backend ya esta implementado en la rama `feature/campaigns` del repo backend.

**Rama frontend recomendada:** `feature/campaigns-flow`  
**Base API:** `VITE_API_URL` (ej. `http://localhost:3000/api/v1`)  
**Mapas:** Google Maps JS — variable `VITE_GOOGLE_MAPS_API_KEY`  
**Auth:** Bearer JWT (interceptor Axios ya existente)

Respuesta estandar:

```json
{ "success": true, "message": "...", "data": {}, "errors": null, "meta": { "page", "limit", "total", "totalPages" } }
```

---

## Objetivo de producto

1. **Fundacion operativa** crea campanas con necesidades y punto de entrega (mapa), publica.
2. **Donante (USER)** explora campanas, aporta a una necesidad, chatea con la fundacion.
3. **Fundacion** ve solicitudes, agenda entrega en mapa, avanza estados hasta confirmacion.

Sin pagos. Contacto = **mensajeria interna por donacion** (no Google/SSO, no chat global).

---

## Precondiciones de acceso

| Rol | Condicion |
| ----- | --------- |
| FOUNDATION crear/gestionar campanas, needs, requests, delivery | Perfil completo + docs + `status === VERIFIED` (`canFoundationOperate`) |
| USER donar / mis donaciones / chat | JWT rol `USER` |
| Publico | Listar campanas `PUBLISHED` y needs de esa campana |

Si la fundacion no esta operativa, el backend responde **403** con mensajes de perfil/verificacion. Mantener el gate existente (`FoundationDashboardGuard`).

---

## Endpoints a consumir

### Campanas — `/campaigns`

| Metodo | Ruta | Auth | Uso UI |
| ------ | ---- | ---- | ------ |
| GET | `/campaigns?page&limit&search` | Publico | Explorador |
| GET | `/campaigns/me?page&limit&status` | FOUNDATION operativa | Mis campanas |
| GET | `/campaigns/:id` | Opcional | Detalle (publico si PUBLISHED; owner ve borradores) |
| POST | `/campaigns` | FOUNDATION operativa | Crear |
| PATCH | `/campaigns/:id` | FOUNDATION operativa (owner) | Editar / publicar |
| DELETE | `/campaigns/:id` | FOUNDATION operativa (owner) | Soft delete |

**Body crear/actualizar (relevante):**

```ts
{
  title: string;           // min 3
  description: string;     // min 10
  imageUrl?: string | null;
  status?: 'DRAFT' | 'PUBLISHED'; // al crear solo estos
  startDate?: string | null;     // ISO 8601
  endDate?: string | null;
  deliveryAddress?: string | null;
  deliveryLatitude?: number | null;   // -90..90; ir juntas con lng
  deliveryLongitude?: number | null;  // -180..180
}
```

**Publicar:** exige `startDate` y `endDate` con `endDate >= startDate`.

**DTO respuesta:** incluye `foundation { id, name, acronym, slug, logoUrl, city, department }` y campos de delivery.

### Necesidades — `/needs`

| Metodo | Ruta | Auth | Uso UI |
| ------ | ---- | ---- | ------ |
| GET | `/needs?campaignId=&page&limit` | Publico | Detalle campana / aportar |
| GET | `/needs/:id` | Publico | Detalle need |
| POST | `/needs` | FOUNDATION operativa | Tras crear campana |
| PATCH | `/needs/:id` | FOUNDATION operativa | Editar |
| DELETE | `/needs/:id` | FOUNDATION operativa | Soft delete (falla si hay donaciones) |

**Body crear:**

```ts
{
  campaignId: string;
  name: string;
  description?: string | null;
  quantity: number;      // >= 1
  unit: string;          // ej. "kg", "unidades"
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
}
```

`fulfilledQuantity` lo calcula el backend al donar/cancelar.

### Donaciones — `/donations`

| Metodo | Ruta | Auth | Uso UI |
| ------ | ---- | ---- | ------ |
| POST | `/donations` | USER | Confirmar aporte |
| GET | `/donations/me?page&limit&status` | USER | Mis donaciones |
| GET | `/donations/:id` | donor o fundacion dueña | Detalle + timeline |
| PATCH | `/donations/:id/status` | donor o fundacion | Avanzar / cancelar |
| PATCH | `/donations/:id/delivery` | FOUNDATION operativa | Agendar mapa/fecha |
| GET | `/donations/:id/messages?page&limit` | participantes | Chat |
| POST | `/donations/:id/messages` | participantes | Enviar mensaje |

**Crear donacion:**

```ts
{ needId: string; quantity: number; notes?: string; estimatedDeliveryAt?: string }
```

Al crear: status `COMMITTED`, se crea conversacion automaticamente.

**Estados:** `COMMITTED` → `IN_TRANSIT` → `DELIVERED` → `CONFIRMED`  
Tambien `CANCELLED` desde `COMMITTED` / `IN_TRANSIT`.  
Donante solo puede cancelar desde `COMMITTED`.

**Delivery body:**

```ts
{
  deliveryAddress?: string | null;
  deliveryLatitude?: number | null;
  deliveryLongitude?: number | null;
  estimatedDeliveryAt?: string | null;
}
```

**Mensaje:** `{ body: string }` (1..2000 chars).

### Solicitudes fundacion — `/foundation/requests`

| Metodo | Ruta | Auth |
| ------ | ---- | ---- |
| GET | `/foundation/requests?page&limit&status` | FOUNDATION operativa |

`data` = `{ items: DonationDto[] }` + `meta`.  
Cada item trae `donor`, `need`, `campaign`, `statusHistory`, delivery, `conversationId`.

---

## Pantallas y comportamiento esperado

| Ruta | Debe hacer |
| ---- | ---------- |
| `/foundation/campaigns/new` | Form RHF+Zod: campana + needs dinamicos + `DeliveryMap` editable + guardar DRAFT o PUBLISHED. Luego `POST /needs` por cada item. |
| `/campaigns` | `GET /campaigns` real (sin mock). Busqueda, cards, link detalle. |
| `/campaigns/:id` | Campana + needs + mapa lectura. CTA aportar si USER. |
| `/campaigns/:id/contribute` | Select need, cantidad, notas → `POST /donations` → ir a `/my-donations/:id`. |
| `/my-donations` | `GET /donations/me`. |
| `/my-donations/:id` | Detalle, timeline historial, mapa, **chat con polling 10–15s**. |
| `/foundation/requests` | `GET /foundation/requests` (manejar 403 perfil/verificacion). |
| `/foundation/requests/:id` | Revisar donacion, chat, pasar a `IN_TRANSIT` o `CANCELLED`, link a agendar. |
| `/foundation/deliveries/schedule` | Query `?donationId=`; mapa editable + `PATCH .../delivery`. |
| `/foundation/deliveries/confirm` | `PATCH .../status` a `DELIVERED` / `CONFIRMED`. |

---

## Mapa (Google Maps)

1. Dependencia: `@react-google-maps/api`.
2. Env: `VITE_GOOGLE_MAPS_API_KEY` en `.env` y tipado en `vite-env.d.ts`.
3. Componente reutilizable (ej. `DeliveryMap`):
   - Lectura: marker fijo.
   - Edicion: click/drag actualiza lat/lng y opcionalmente address.
   - Sin API key: fallback textual (coords/direccion), **no romper** la app.
4. Centro por defecto sugerido: Bogota `4.7110, -74.0721`.

---

## Convenciones tecnicas

- Services con `api` de `@/services/api` y `ApiSuccessResponse<T>`.
- Validaciones Zod + react-hook-form donde haya formularios.
- Textos UI en `messages.constants.ts` (espanol).
- JSDoc unico `Entrada / Proceso / Salida` en funciones nuevas.
- Sin emojis.
- No inventar endpoints: solo los listados arriba.
- No storage/S3: `imageUrl` es string opcional (URL), no upload multipart en esta fase.

---

## Checklist de aceptacion

- [ ] Fundacion verificada crea campana con needs y punto en mapa y publica.
- [ ] Donante ve campanas publicadas, aporta, ve la donacion en `/my-donations`.
- [ ] Ambos chatean en el detalle de la donacion.
- [ ] Fundacion ve la solicitud en `/foundation/requests`, agenda entrega en mapa, confirma estados.
- [ ] Sin key de Google Maps la UI degrada sin crash.
- [ ] `npm run build` y `npm run lint` OK.
- [ ] Guards de fundacion siguen bloqueando si no esta operativa.

---

## Fuera de alcance (no implementar ahora)

- Storage S3/R2 para imagenes.
- WebSockets (usar polling).
- Notificaciones push/email.
- Pagos.
- Login Google/SSO.

---

## Referencias backend

- Specs: `specs/modules/campaigns.md`, `needs.md`, `donations.md`
- Swagger: `{API}/docs`
- Rama backend: `feature/campaigns`

Si algo del UI stub permanece con `readOnly` / mock, **reemplazarlo** por los services reales descritos aqui.
