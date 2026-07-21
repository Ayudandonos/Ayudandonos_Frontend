# Handoff Backend — Panel Administrador (Dashboard)

Documento para el repositorio **Ayudandonos_Backend** (`https://github.com/Erickpe8/Ayudandonos_Backend`).

**Frontend relacionado:** rama `feature/admin-dashboard` en Ayudandonos_Frontend.  
**Consumo actual:** `GET /api/v1/admin/dashboard` (unico endpoint nuevo requerido para que el home admin funcione).  
**Auth existente:** JWT Bearer; rol `ADMIN` en el claim/usuario.

---

## Prompt listo para copiar (agente / issue en Backend)

```markdown
Implementa el modulo administrativo minimo para el Dashboard del Administrador en Ayudandonos Backend, alineado con el frontend ya integrado en la rama `feature/admin-dashboard`.

## Contexto

- SPA React consume `VITE_API_URL` (ej. `http://localhost:3000/api/v1`).
- Respuesta estandar en todos los endpoints: `{ success, message, data, errors?, meta? }`.
- El frontend NO crea usuarios ADMIN desde la UI; los administradores se gestionan solo en backend (seed, migracion o script interno).
- Tras login, si `user.role === 'ADMIN'`, el frontend redirige a `/admin/dashboard` y llama a `GET /admin/dashboard`.
- La verificacion de fundaciones YA usa endpoints existentes (`GET /foundations` con stats para ADMIN, `PATCH /foundations/:id/status`). No romper ese contrato.

## Objetivo inmediato (obligatorio)

### Endpoint: GET /admin/dashboard

- **Auth:** Bearer JWT obligatorio.
- **Autorizacion:** solo rol `ADMIN`. Otros roles → **403**.
- **Query opcionales (recomendado para evolucion):**
  - `latestNeedsLimit` (default `10`, max `50`)
  - `featuredCampaignsLimit` (default `3`, max `10`)

### Body de `data` (contrato exacto con el frontend)

```typescript
interface AdminDashboardData {
  kpis: {
    activeCampaigns: number;
    pendingNeeds: number;
    deliveredAids: number;
    verifiedFoundations: number;
    activeCampaignsTrendPercent?: number | null;
    pendingNeedsCritical?: boolean;
  };
  latestNeeds: Array<{
    id: string;
    name: string;
    foundationName: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    publishedAt: string; // ISO 8601 — usar createdAt del need si no hay publishedAt
  }>;
  featuredCampaigns?: Array<{
    id: string;
    title: string;
    description: string;
    imageUrl: string | null;
    progressPercent: number; // 0–100 entero
    daysRemaining: number | null;
    isPrimary?: boolean;
  }>;
}
```

### Reglas de negocio sugeridas para KPIs

| Campo | Definicion recomendada |
| ----- | ---------------------- |
| `activeCampaigns` | Campanas con `status = PUBLISHED` y vigentes (`endDate` null o `endDate >= now`). |
| `pendingNeeds` | Necesidades (`needs`) con cantidad pendiente: `fulfilledQuantity < quantity`, en campanas no canceladas/eliminadas. |
| `deliveredAids` | Donaciones con `status IN ('DELIVERED', 'CONFIRMED')` (o solo `CONFIRMED` si el producto define "entregada" asi). Documentar la regla elegida. |
| `verifiedFoundations` | Fundaciones con `status = VERIFIED`. |
| `activeCampaignsTrendPercent` | Opcional. Variacion porcentual de campanas activas vs periodo anterior (ej. ultimos 30 dias vs 30 dias previos). Si no se implementa aun, enviar `null` u omitir. |
| `pendingNeedsCritical` | Opcional. `true` si existe al menos una need pendiente con `priority = HIGH`. |

### Reglas para `latestNeeds`

- Orden: `publishedAt` o `createdAt` descendente.
- Limit: segun query (default 10).
- Incluir nombre de fundacion (`foundation.name` via campana).
- Solo needs asociadas a campanas visibles para operacion (ej. PUBLISHED o todas las no soft-deleted — documentar).

### Reglas para `featuredCampaigns` (opcional en v1)

- Si no hay logica de destacados, enviar `[]` o omitir la propiedad.
- Maximo N items (default 3).
- `progressPercent`: agregado de avance de needs de la campana (sum fulfilled / sum quantity * 100) o metrica de donaciones — documentar formula.
- `daysRemaining`: dias hasta `endDate` si existe; si no, `null`.
- Marcar una con `isPrimary: true` (ej. mayor progreso o campana mas reciente publicada).

## Errores HTTP

| Codigo | Cuando |
| ------ | ------ |
| 401 | Sin token o token invalido |
| 403 | Usuario autenticado sin rol ADMIN |
| 500 | Error interno |

Mensajes en espanol en `message`, coherente con el resto de la API.

## Ejemplo de respuesta 200

```json
{
  "success": true,
  "message": "Panel administrativo obtenido correctamente",
  "data": {
    "kpis": {
      "activeCampaigns": 24,
      "pendingNeeds": 156,
      "deliveredAids": 1240,
      "verifiedFoundations": 42,
      "activeCampaignsTrendPercent": 12,
      "pendingNeedsCritical": true
    },
    "latestNeeds": [
      {
        "id": "uuid-need-1",
        "name": "Alimentos no perecederos",
        "foundationName": "Banco de Alimentos",
        "priority": "HIGH",
        "publishedAt": "2026-07-15T14:30:00.000Z"
      }
    ],
    "featuredCampaigns": [
      {
        "id": "uuid-campaign-1",
        "title": "Campaña Invierno Cálido",
        "description": "Abrigo y alimentos para familias vulnerables.",
        "imageUrl": "https://...",
        "progressPercent": 75,
        "daysRemaining": 15,
        "isPrimary": true
      }
    ]
  },
  "errors": null
}
```

## Arquitectura backend sugerida

- Modulo `admin` (o `statistics/admin`) con:
  - `AdminController` → `GET /admin/dashboard`
  - `AdminDashboardService` con consultas agregadas (Prisma/raw) reutilizando repositorios de campaigns, needs, donations, foundations.
- Guards/middleware: `authenticate` + `requireRole('ADMIN')`.
- Tests: unit del servicio de agregacion + e2e del endpoint con usuario ADMIN y 403 con USER/FOUNDATION.

## Fuera de alcance inmediato (frontend ya tiene placeholders)

No bloquean el dashboard, pero el producto los pedira despues:

| Futuro endpoint | Uso frontend |
| --------------- | ------------ |
| GET /admin/campaigns | Modulo admin campanas |
| GET /admin/users | Gestion usuarios |
| GET /admin/reports | Reportes / export |
| GET/PATCH /admin/me | Perfil administrador |
| GET /admin/reports/export | Boton "Exportar reporte" (hoy disabled) |

## Criterios de aceptacion

- [ ] `GET /admin/dashboard` registrado bajo prefijo `/api/v1`.
- [ ] Solo ADMIN accede; 401/403 correctos.
- [ ] JSON cumple tipos anteriores (nombres de propiedades en camelCase).
- [ ] KPIs son calculos reales de BD, no valores hardcodeados.
- [ ] `latestNeeds` respeta limit y orden.
- [ ] No se rompe `GET /foundations` con stats para verificacion admin.
- [ ] Documentacion en README o OpenAPI del modulo admin.
- [ ] Seed o script documentado para crear al menos un usuario ADMIN en desarrollo.

## Verificacion con frontend

1. Backend en `localhost:3000`, frontend `.env` con `VITE_API_URL=http://localhost:3000/api/v1`.
2. Login con usuario ADMIN (creado en backend).
3. Navegar a `/admin/dashboard`: deben verse KPIs y tabla sin error de red.
4. Si `featuredCampaigns` viene vacio, el panel lateral no se muestra (comportamiento esperado).

---

## Cierre de contrato (decisiones front — vigentes)

Estas reglas las confirma el equipo frontend para implementacion backend v1.

### `deliveredAids`

Contar donaciones con **`status IN ('DELIVERED', 'CONFIRMED')`**.  
No incluir `COMMITTED`, `IN_TRANSIT` ni `CANCELLED`.

### `progressPercent` (campanas destacadas)

Por campana, agregar **todas sus needs** (no soft-deleted):

```text
totalRequired = SUM(need.quantity)
totalFulfilled = SUM(need.fulfilledQuantity)
progressPercent = totalRequired <= 0 ? 0 : MIN(100, ROUND(totalFulfilled / totalRequired * 100))
```

Misma logica que el util frontend `needProgressPercent` aplicada a nivel campana.

### `featuredCampaigns` (seleccion v1)

- Solo campanas **`status = PUBLISHED`**, vigentes (`endDate IS NULL OR endDate >= NOW()`).
- Orden: **`progressPercent` DESC**, desempate **`endDate` ASC** (mas urgentes primero), desempate **`createdAt` DESC**.
- Devolver **max 3** (default query `featuredCampaignsLimit=3`).
- El **primer elemento del array** es la tarjeta grande en UI (hero); el resto lista compacta.
- En el primer item, enviar **`isPrimary: true`** (opcional; solo muestra badge si viene true).
- Si no hay campanas elegibles: **`featuredCampaigns: []`** o **omitir** la propiedad.

### Otros KPIs (confirmacion)

| Campo | Regla v1 |
| ----- | -------- |
| `activeCampaigns` | `PUBLISHED` y vigentes (`endDate` null o >= now) |
| `pendingNeeds` | Needs con `fulfilledQuantity < quantity`, campana no cancelada/eliminada |
| `verifiedFoundations` | `foundation.status = VERIFIED` |
| `activeCampaignsTrendPercent` | `ROUND((activas_hoy - activas_hace_30d) / activas_hace_30d * 100)`; **`null`** si denominador 0 |
| `pendingNeedsCritical` | `true` si existe need pendiente con `priority = HIGH` |

### `latestNeeds`

- Needs con **`fulfilledQuantity < quantity`**, campana **`PUBLISHED`** (recomendado v1).
- Orden: **`createdAt` DESC** (campo expuesto al front como `publishedAt`).
- Default **10** filas (`latestNeedsLimit`); el front **aun no envia** query params en v1.

### Campos opcionales en JSON

| Campo | Obligatorio en `data` | Notas |
| ----- | --------------------- | ----- |
| `kpis` | Si | Siempre los 4 numeros base |
| `kpis.activeCampaignsTrendPercent` | No | Omitir o `null` si no se calcula |
| `kpis.pendingNeedsCritical` | No | Omitir = front no muestra badge "Critico" |
| `latestNeeds` | Si | Puede ser `[]` |
| `featuredCampaigns` | No | Omitir o `[]` = sin panel lateral |

### Tests v1 (decision proyecto)

- **Obligatorio minimo:** e2e o integracion de **`GET /admin/dashboard`**: 401 sin token, 403 USER/FOUNDATION, 200 ADMIN con forma de `data`.
- **Recomendado:** unit tests del servicio de agregacion (KPIs y orden de featured).
- **Swagger/OpenAPI** actualizado es obligatorio antes de merge.
- Prueba manual documentada en PR (login ADMIN + dashboard en front).

### Fragmento front (servicio + tipos)

Ver seccion **Anexo: codigo frontend** al final de este documento.

```

---

## Mapa de integracion frontend ↔ backend

| Pantalla frontend | Ruta UI | Endpoint backend | Estado |
| ----------------- | ------- | ---------------- | ------ |
| Panel de control | `/admin/dashboard` | `GET /admin/dashboard` | **PENDIENTE (nuevo)** |
| Verificacion fundaciones | `/admin/foundations` | `GET /foundations`, `GET /foundations/:id`, `PATCH /foundations/:id/status`, descarga documentos | **Debe existir** |
| Login admin | `/login` | `POST /auth/login` → `user.role = ADMIN` | **Debe existir** |
| Campanas admin | `/admin/campaigns` | Por definir | Placeholder UI |
| Usuarios | `/admin/users` | Por definir | Placeholder UI |
| Reportes | `/admin/reports` | Por definir | Placeholder UI |
| Perfil admin | `/admin/profile` | Por definir | Placeholder UI |

---

## Autenticacion y rol ADMIN

Requisitos alineados con el frontend:

1. El registro publico (`POST /auth/register/user`, `POST /auth/register/foundation`) **no** debe permitir crear rol `ADMIN`.
2. Usuarios ADMIN se crean por:
   - seed de desarrollo,
   - migracion,
   - script interno,
   - o panel interno futuro (no expuesto en SPA actual).
3. `GET /auth/me` debe devolver `user.role: 'ADMIN'` para sesiones administrativas.
4. El frontend adjunta `Authorization: Bearer <token>` via interceptor Axios.

---

## Detalle tecnico del contrato TypeScript (frontend)

Archivo de referencia en frontend: `src/features/admin/types/admin.types.ts`.

Servicio: `src/features/admin/services/admin.service.ts` → unica llamada:

```http
GET /admin/dashboard
Authorization: Bearer <accessToken>
```

El hook `useAdminDashboard` interpreta:

- **Loading** mientras la peticion esta en curso.
- **Error** si falla la red o HTTP ≠ 2xx (muestra `message` del API).
- **Empty parcial** si `latestNeeds.length === 0` pero KPIs existen.
- **Error total** si no hay `data` tras error.

---

## Coherencia con dominios existentes

Reutilizar modelos/enums ya usados en campanas y donaciones:

| Dominio | Enum / estados relevantes |
| ------- | ------------------------- |
| Fundaciones | `PENDING`, `VERIFIED`, `REJECTED`, `SUSPENDED` |
| Campanas | `DRAFT`, `PUBLISHED`, `FINISHED`, `CANCELLED` |
| Needs | `priority`: `LOW`, `MEDIUM`, `HIGH`; `quantity`, `fulfilledQuantity` |
| Donaciones | `COMMITTED`, `IN_TRANSIT`, `DELIVERED`, `CONFIRMED`, `CANCELLED` |

---

## Consultas SQL / Prisma (pseudologica)

```text
activeCampaigns =
  COUNT campaigns WHERE status = PUBLISHED AND (endDate IS NULL OR endDate >= NOW())

pendingNeeds =
  COUNT needs n
  JOIN campaigns c ON n.campaignId = c.id
  WHERE n.fulfilledQuantity < n.quantity
    AND c.deletedAt IS NULL
    AND c.status NOT IN ('CANCELLED')  -- ajustar segun schema

deliveredAids =
  COUNT donations WHERE status IN ('DELIVERED', 'CONFIRMED')

verifiedFoundations =
  COUNT foundations WHERE status = 'VERIFIED'

latestNeeds =
  SELECT n.id, n.name, n.priority, n.createdAt AS publishedAt, f.name AS foundationName
  FROM needs n
  JOIN campaigns c ON ...
  JOIN foundations f ON ...
  ORDER BY n.createdAt DESC
  LIMIT :latestNeedsLimit
```

Ajustar joins y soft-delete segun el schema real del backend.

---

## Seguridad

- Rate limiting coherente con otros endpoints autenticados.
- No exponer datos sensibles de donantes en el dashboard agregado (solo conteos y needs publicables).
- Validar y acotar query params (`limit` max 50).
- Logs de acceso admin opcionales para auditoria.

---

## Checklist de entrega backend

1. Modulo + ruta `GET /admin/dashboard`.
2. Guard rol ADMIN.
3. DTO de respuesta alineado al JSON de ejemplo.
4. Tests automatizados minimos.
5. Usuario ADMIN de prueba documentado en `.env.example` o README del backend.
6. PR hacia rama de integracion del backend con descripcion que enlace a este documento y a la rama frontend `feature/admin-dashboard`.

---

## Referencias en frontend

| Recurso | Ruta |
| ------- | ---- |
| Tipos dashboard | `src/features/admin/types/admin.types.ts` |
| Cliente HTTP | `src/features/admin/services/admin.service.ts` |
| Pagina | `src/features/admin/components/AdminDashboardPage.tsx` |
| Verificacion fundaciones | `src/features/foundations/components/AdminFoundationsPage.tsx` |
| Guia campanas (contexto Fase 4) | `docs/CAMPAIGNS_FRONTEND_GUIDE.md` |
| Modulo fundaciones | `docs/FOUNDATIONS_MODULE.md` |

---

## Anexo: codigo frontend (cruce linea a linea)

### HTTP

```http
GET {VITE_API_URL}/admin/dashboard
Authorization: Bearer <accessToken>
Accept: application/json
```

`VITE_API_URL` tipico: `http://localhost:3000/api/v1` → URL final `http://localhost:3000/api/v1/admin/dashboard`.

Sin query string en v1 del cliente.

### Servicio (`admin.service.ts`)

```typescript
async function fetchDashboard(): Promise<AdminDashboardData> {
  const { data } = await api.get<ApiSuccessResponse<AdminDashboardData>>('/admin/dashboard');
  return data.data;
}
```

El cliente espera envelope:

```typescript
interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  meta?: { page?, limit?, total?, totalPages? };
}
```

### Tipos (`admin.types.ts`)

```typescript
export type AdminNeedPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface AdminDashboardKpis {
  activeCampaigns: number;
  pendingNeeds: number;
  deliveredAids: number;
  verifiedFoundations: number;
  activeCampaignsTrendPercent?: number | null;
  pendingNeedsCritical?: boolean;
}

export interface AdminLatestNeedItem {
  id: string;
  name: string;
  foundationName: string;
  priority: AdminNeedPriority;
  publishedAt: string;
}

export interface AdminFeaturedCampaignItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  progressPercent: number;
  daysRemaining: number | null;
  isPrimary?: boolean;
}

export interface AdminDashboardData {
  kpis: AdminDashboardKpis;
  latestNeeds: AdminLatestNeedItem[];
  featuredCampaigns?: AdminFeaturedCampaignItem[];
}
```

### Hook (`useAdminDashboard.ts`)

- Montaje: `GET /admin/dashboard` una vez.
- Exito: guarda `response.data` completo en estado.
- Error HTTP/red: `data = null`, muestra `message` del API o texto generico.
- No transforma ni renombra campos del backend.

### UI que consume campos

| Campo | Componente | Comportamiento |
| ----- | ---------- | -------------- |
| `kpis.*` | `AdminKpiCards` | Numeros con `toLocaleString('es-CO')` |
| `kpis.activeCampaignsTrendPercent != null` | badge "+N%" | |
| `kpis.pendingNeedsCritical === true` | badge "Critico" | |
| `latestNeeds[]` | `AdminLatestNeedsTable` | Empty si length 0 |
| `featuredCampaigns ?? []` | panel lateral | Oculto si length 0; `[0]` = hero |

### `daysRemaining`

Front muestra texto solo si **`daysRemaining != null`**.  
Backend: `CEIL((endDate - now) / 1 day)` para campanas con `endDate`; si no hay fecha, **`null`**.

