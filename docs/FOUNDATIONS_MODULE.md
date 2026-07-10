# Modulo Fundaciones — Frontend

Estado: **IMPLEMENTADO** (Iteracion C — prototipo completo).

## Rutas

| Ruta | Layout | Rol | Componente |
| ---- | ------ | --- | ---------- |
| `/foundations` | MainLayout | Publico | `FoundationsListPage` |
| `/foundations/:id` | MainLayout | Publico | `FoundationDetailPage` |
| `/foundation/profile` | Dashboard | FOUNDATION | `FoundationProfilePage` |
| `/admin/foundations` | Dashboard | ADMIN | `AdminFoundationsPage` |

## Estructura del feature

```
src/features/foundations/
  components/          # UI del dominio
  hooks/               # Logica de estado reutilizable
  services/            # Cliente API Axios
  types/               # Tipos TypeScript
  validations/         # Schemas Zod
  index.ts
```

## Componentes principales

| Componente | Responsabilidad |
| ---------- | --------------- |
| `FoundationsListPage` | Directorio publico con busqueda, filtros y paginacion |
| `FoundationDetailPage` | Detalle publico de fundacion verificada |
| `FoundationProfilePage` | Edicion de perfil, logo, documentos y redes |
| `AdminFoundationsPage` | Verificacion admin con KPIs, tabla y modal de revision |
| `FoundationReviewModal` | Panel lateral de revision (prototipo admin) |
| `FoundationForm` | Formulario completo con validacion Zod |
| `FoundationDocumentManager` | Carga, vista previa y descarga de documentos legales |
| `FoundationLogoUploader` | Subida de logo institucional |
| `FoundationSocialLinksEditor` | Editor de redes sociales |
| `FoundationKpiCards` | Indicadores administrativos |
| `FoundationTable` | Tabla de revision con logo y categoria |
| `FoundationAdminReviewPanel` | Acciones de aprobar, rechazar, suspender e informacion adicional |

## Hooks

| Hook | Uso |
| ---- | --- |
| `useFoundationsList` | Listado publico con paginacion y filtros |
| `useAdminFoundations` | Estado completo del panel administrativo |

## Integracion API

Servicio: `foundationsService` en `services/foundations.service.ts`.

Endpoints consumidos:

- `GET /foundations`
- `GET /foundations/:id`
- `GET /foundations/me`
- `PATCH /foundations/:id`
- `PATCH /foundations/:id/status`
- `POST /foundations/:id/logo`
- `POST /foundations/:id/documents`
- `GET /foundations/:id/documents/:type/download`

Documentacion backend: `../backend/docs/FOUNDATIONS_MODULE.md`.

## Prototipo de referencia

Pantalla admin: `Prototipado/Verificación de Fundaciones - ConectaAyuda.png`

Flujos implementados:

1. Admin filtra por estado, ciudad, categoria y departamento.
2. Admin revisa fundacion en modal lateral con documentos descargables.
3. Admin aprueba, rechaza, suspende o solicita informacion adicional.
4. Fundacion completa perfil, sube logo y documentos obligatorios.
5. Publico explora fundaciones verificadas con filtros.

## Textos UI

Todos los textos visibles estan en `src/constants/messages.constants.ts` bajo prefijo `FOUNDATIONS_*`.
