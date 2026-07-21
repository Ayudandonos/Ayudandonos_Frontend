import { api } from '@/services/api';
import type { ApiSuccessResponse } from '@/types';
import type {
  CreateNeedPayload,
  ListNeedsParams,
  Need,
  PaginatedNeedsData,
  UpdateNeedPayload,
} from '@/features/needs/types/needs.types';

export interface NeedCampaignOption {
  id: string;
  title: string;
  status: string;
}

/**
 * Entrada: params: campaignId obligatorio y paginacion.
 * Proceso: Consulta GET /needs.
 * Salida: Retorna items y meta.
 */
async function fetchNeeds(params: ListNeedsParams): Promise<{
  data: PaginatedNeedsData;
  meta: NonNullable<ApiSuccessResponse['meta']>;
}> {
  const { data } = await api.get<ApiSuccessResponse<PaginatedNeedsData>>('/needs', { params });
  return { data: data.data, meta: data.meta ?? {} };
}

/**
 * Entrada: id: UUID de la necesidad.
 * Proceso: Consulta GET /needs/:id.
 * Salida: Retorna Need.
 */
async function fetchNeedById(id: string): Promise<Need> {
  const { data } = await api.get<ApiSuccessResponse<Need>>(`/needs/${id}`);
  return data.data;
}

/**
 * Entrada: payload: datos de creacion.
 * Proceso: Envia POST /needs.
 * Salida: Retorna necesidad creada.
 */
async function createNeed(payload: CreateNeedPayload): Promise<Need> {
  const { data } = await api.post<ApiSuccessResponse<Need>>('/needs', payload);
  return data.data;
}

/**
 * Entrada: id: UUID; payload: campos a actualizar.
 * Proceso: Envia PATCH /needs/:id.
 * Salida: Retorna necesidad actualizada.
 */
async function updateNeed(id: string, payload: UpdateNeedPayload): Promise<Need> {
  const { data } = await api.patch<ApiSuccessResponse<Need>>(`/needs/${id}`, payload);
  return data.data;
}

/**
 * Entrada: id: UUID de la necesidad.
 * Proceso: Envia DELETE /needs/:id.
 * Salida: No retorna entidad.
 */
async function deleteNeed(id: string): Promise<void> {
  await api.delete(`/needs/${id}`);
}

/**
 * Entrada: Ninguna (fundacion autenticada).
 * Proceso: Consulta GET /campaigns/me sin importar el feature campaigns.
 * Salida: Retorna opciones id/title/status para el selector de necesidades.
 */
async function fetchMyCampaignsForNeeds(): Promise<NeedCampaignOption[]> {
  const { data } = await api.get<
    ApiSuccessResponse<{ items: NeedCampaignOption[] }>
  >('/campaigns/me', { params: { page: 1, limit: 100 } });
  return data.data.items ?? [];
}

export const needsService = {
  fetchNeeds,
  fetchNeedById,
  createNeed,
  updateNeed,
  deleteNeed,
  fetchMyCampaignsForNeeds,
};
