import { api } from '@/services/api';
import type { ApiSuccessResponse } from '@/types';
import type {
  FoundationDetail,
  FoundationDocumentType,
  FoundationHelpRequest,
  ListFoundationsParams,
  PaginatedFoundationsData,
  UpdateFoundationPayload,
  UpdateFoundationStatusPayload,
} from '@/features/foundations/types/foundations.types';

/**
 * Entrada: params: filtros de paginacion y busqueda opcionales.
 * Proceso: Consulta GET /foundations con parametros de query.
 * Salida: Retorna items, meta de paginacion y stats opcional para admin.
 */
async function fetchFoundations(params: ListFoundationsParams = {}): Promise<{
  data: PaginatedFoundationsData;
  meta: NonNullable<ApiSuccessResponse['meta']>;
}> {
  const { data } = await api.get<ApiSuccessResponse<PaginatedFoundationsData>>('/foundations', {
    params,
  });

  return {
    data: data.data,
    meta: data.meta ?? {},
  };
}

/**
 * Entrada: id: identificador UUID de la fundacion.
 * Proceso: Consulta GET /foundations/:id.
 * Salida: Retorna detalle de la fundacion.
 */
async function fetchFoundationById(id: string): Promise<FoundationDetail> {
  const { data } = await api.get<ApiSuccessResponse<FoundationDetail>>(`/foundations/${id}`);
  return data.data;
}

/**
 * Entrada: Ninguna (token en interceptor).
 * Proceso: Consulta GET /foundations/me del usuario autenticado con rol FOUNDATION.
 * Salida: Retorna detalle de la fundacion propia.
 */
async function fetchMyFoundation(): Promise<FoundationDetail> {
  const { data } = await api.get<ApiSuccessResponse<FoundationDetail>>('/foundations/me');
  return data.data;
}

/**
 * Entrada: id: identificador de la fundacion; payload: campos a actualizar.
 * Proceso: Envia PATCH /foundations/:id.
 * Salida: Retorna fundacion actualizada.
 */
async function updateFoundation(
  id: string,
  payload: UpdateFoundationPayload,
): Promise<FoundationDetail> {
  const { data } = await api.patch<ApiSuccessResponse<FoundationDetail>>(
    `/foundations/${id}`,
    payload,
  );
  return data.data;
}

/**
 * Entrada: id: identificador de la fundacion; payload: nuevo estado administrativo.
 * Proceso: Envia PATCH /foundations/:id/status (solo admin).
 * Salida: Retorna fundacion con estado actualizado.
 */
async function updateFoundationStatus(
  id: string,
  payload: UpdateFoundationStatusPayload,
): Promise<FoundationDetail> {
  const { data } = await api.patch<ApiSuccessResponse<FoundationDetail>>(
    `/foundations/${id}/status`,
    payload,
  );
  return data.data;
}

/**
 * Entrada: id: identificador de la fundacion; file: archivo de imagen.
 * Proceso: Envia POST /foundations/:id/logo como multipart.
 * Salida: Retorna fundacion con logo actualizado.
 */
async function uploadLogo(id: string, file: File): Promise<FoundationDetail> {
  const formData = new FormData();
  formData.append('logo', file);

  const { data } = await api.post<ApiSuccessResponse<FoundationDetail>>(
    `/foundations/${id}/logo`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );

  return data.data;
}

/**
 * Entrada: id: identificador; type: tipo documental; file: archivo PDF o imagen.
 * Proceso: Envia POST /foundations/:id/documents como multipart.
 * Salida: Retorna fundacion con documentos actualizados.
 */
async function uploadDocument(
  id: string,
  type: FoundationDocumentType,
  file: File,
): Promise<FoundationDetail> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  const { data } = await api.post<ApiSuccessResponse<FoundationDetail>>(
    `/foundations/${id}/documents`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );

  return data.data;
}

/**
 * Entrada: id: identificador; type: tipo documental.
 * Proceso: Descarga el documento via GET autenticado con blob response.
 * Salida: Retorna blob y nombre sugerido para descarga.
 */
async function downloadDocument(
  id: string,
  type: FoundationDocumentType,
): Promise<{ blob: Blob; fileName: string }> {
  const response = await api.get<Blob>(`/foundations/${id}/documents/${type}/download`, {
    responseType: 'blob',
  });

  const disposition = response.headers['content-disposition'] as string | undefined;
  const fileNameMatch = disposition?.match(/filename="?([^"]+)"?/);
  const fileName = fileNameMatch?.[1] ?? `${type.toLowerCase()}.pdf`;

  return { blob: response.data, fileName };
}

/**
 * Entrada: Ninguna (token en interceptor; fundacion verificada en backend).
 * Proceso: Consulta GET /foundation/requests para listar solicitudes de ayuda recibidas.
 * Salida: Retorna arreglo de solicitudes o lanza error HTTP (403, 501, etc.).
 */
async function fetchFoundationRequests(): Promise<FoundationHelpRequest[]> {
  const { data } = await api.get<ApiSuccessResponse<FoundationHelpRequest[]>>(
    '/foundation/requests',
  );
  return data.data ?? [];
}

export const foundationsService = {
  fetchFoundations,
  fetchFoundationById,
  fetchMyFoundation,
  updateFoundation,
  updateFoundationStatus,
  uploadLogo,
  uploadDocument,
  downloadDocument,
  fetchFoundationRequests,
};
