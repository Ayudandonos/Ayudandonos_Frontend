import { api } from '@/services/api';
import type { ApiSuccessResponse } from '@/types';
import type {
  Campaign,
  CampaignNeed,
  CreateCampaignNeedPayload,
  CreateCampaignPayload,
  ListCampaignsParams,
  PaginatedCampaignNeedsData,
  PaginatedCampaignsData,
  UpdateCampaignNeedPayload,
  UpdateCampaignPayload,
} from '@/features/campaigns/types/campaigns.types';

/**
 * Entrada: params: filtros de listado publico.
 * Proceso: Consulta GET /campaigns (solo PUBLISHED en backend).
 * Salida: Retorna items y meta de paginacion.
 */
async function fetchCampaigns(params: ListCampaignsParams = {}): Promise<{
  data: PaginatedCampaignsData;
  meta: NonNullable<ApiSuccessResponse['meta']>;
}> {
  const { data } = await api.get<ApiSuccessResponse<PaginatedCampaignsData>>('/campaigns', {
    params,
  });
  return { data: data.data, meta: data.meta ?? {} };
}

/**
 * Entrada: params: filtros incluyendo status opcional.
 * Proceso: Consulta GET /campaigns/me de la fundacion autenticada.
 * Salida: Retorna items y meta de paginacion.
 */
async function fetchMyCampaigns(params: ListCampaignsParams = {}): Promise<{
  data: PaginatedCampaignsData;
  meta: NonNullable<ApiSuccessResponse['meta']>;
}> {
  const { data } = await api.get<ApiSuccessResponse<PaginatedCampaignsData>>('/campaigns/me', {
    params,
  });
  return { data: data.data, meta: data.meta ?? {} };
}

/**
 * Entrada: id: UUID de la campana.
 * Proceso: Consulta GET /campaigns/:id.
 * Salida: Retorna detalle de la campana.
 */
async function fetchCampaignById(id: string): Promise<Campaign> {
  const { data } = await api.get<ApiSuccessResponse<Campaign>>(`/campaigns/${id}`);
  return data.data;
}

/**
 * Entrada: payload: datos de creacion.
 * Proceso: Envia POST /campaigns.
 * Salida: Retorna campana creada.
 */
async function createCampaign(payload: CreateCampaignPayload): Promise<Campaign> {
  const { data } = await api.post<ApiSuccessResponse<Campaign>>('/campaigns', payload);
  return data.data;
}

/**
 * Entrada: id: UUID; payload: campos a actualizar.
 * Proceso: Envia PATCH /campaigns/:id.
 * Salida: Retorna campana actualizada.
 */
async function updateCampaign(id: string, payload: UpdateCampaignPayload): Promise<Campaign> {
  const { data } = await api.patch<ApiSuccessResponse<Campaign>>(`/campaigns/${id}`, payload);
  return data.data;
}

/**
 * Entrada: id: UUID de la campana.
 * Proceso: Envia DELETE /campaigns/:id (soft delete).
 * Salida: No retorna entidad.
 */
async function deleteCampaign(id: string): Promise<void> {
  await api.delete(`/campaigns/${id}`);
}

/**
 * Entrada: id: UUID de la campana.
 * Proceso: Publica la campana via PATCH status PUBLISHED.
 * Salida: Retorna campana publicada.
 */
async function publishCampaign(id: string): Promise<Campaign> {
  return updateCampaign(id, { status: 'PUBLISHED' });
}

/**
 * Entrada: campaignId: UUID; page/limit opcionales.
 * Proceso: Consulta GET /needs?campaignId= scoped a la campana.
 * Salida: Retorna necesidades de la campana.
 */
async function fetchCampaignNeeds(
  campaignId: string,
  page = 1,
  limit = 50,
): Promise<{ data: PaginatedCampaignNeedsData; meta: NonNullable<ApiSuccessResponse['meta']> }> {
  const { data } = await api.get<ApiSuccessResponse<PaginatedCampaignNeedsData>>('/needs', {
    params: { campaignId, page, limit },
  });
  return { data: data.data, meta: data.meta ?? {} };
}

/**
 * Entrada: payload: datos de la necesidad.
 * Proceso: Envia POST /needs desde el dominio campanas (sin importar feature needs).
 * Salida: Retorna necesidad creada.
 */
async function createCampaignNeed(payload: CreateCampaignNeedPayload): Promise<CampaignNeed> {
  const { data } = await api.post<ApiSuccessResponse<CampaignNeed>>('/needs', payload);
  return data.data;
}

/**
 * Entrada: id: UUID; payload: campos a actualizar.
 * Proceso: Envia PATCH /needs/:id.
 * Salida: Retorna necesidad actualizada.
 */
async function updateCampaignNeed(
  id: string,
  payload: UpdateCampaignNeedPayload,
): Promise<CampaignNeed> {
  const { data } = await api.patch<ApiSuccessResponse<CampaignNeed>>(`/needs/${id}`, payload);
  return data.data;
}

/**
 * Entrada: id: UUID de la necesidad.
 * Proceso: Envia DELETE /needs/:id.
 * Salida: No retorna entidad.
 */
async function deleteCampaignNeed(id: string): Promise<void> {
  await api.delete(`/needs/${id}`);
}

/**
 * Entrada: Ninguna (token de fundacion en interceptor).
 * Proceso: Consulta GET /foundation/requests y cuenta items; falla silenciosa a 0.
 * Salida: Retorna cantidad de solicitudes recibidas.
 */
async function fetchFoundationDonationCount(): Promise<number> {
  try {
    const { data } = await api.get<
      ApiSuccessResponse<{ items: unknown[] } | unknown[]>
    >('/foundation/requests');
    if (Array.isArray(data.data)) {
      return data.data.length;
    }
    if (data.data && typeof data.data === 'object' && 'items' in data.data) {
      const items = (data.data as { items: unknown[] }).items;
      return Array.isArray(items) ? items.length : (data.meta?.total ?? 0);
    }
    return data.meta?.total ?? 0;
  } catch {
    return 0;
  }
}

export const campaignsService = {
  fetchCampaigns,
  fetchMyCampaigns,
  fetchCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  publishCampaign,
  fetchCampaignNeeds,
  createCampaignNeed,
  updateCampaignNeed,
  deleteCampaignNeed,
  fetchFoundationDonationCount,
};

export type { CampaignNeed };
