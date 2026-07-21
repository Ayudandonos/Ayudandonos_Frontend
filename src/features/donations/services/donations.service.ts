import { api } from '@/services/api';
import type { ApiSuccessResponse } from '@/types';
import type {
  CreateDonationPayload,
  Donation,
  DonationMessage,
  DonationStatus,
  ListDonationsParams,
  PaginatedDonationsData,
  UpdateDonationDeliveryPayload,
} from '@/features/donations/types/donations.types';
import type { Campaign } from '@/features/campaigns/types/campaigns.types';
import type { Need, PaginatedNeedsData } from '@/features/needs/types/needs.types';

/**
 * Entrada: payload: compromiso de donacion en especie.
 * Proceso: Envia POST /donations (rol USER).
 * Salida: Retorna donacion creada.
 */
async function createDonation(payload: CreateDonationPayload): Promise<Donation> {
  const { data } = await api.post<ApiSuccessResponse<Donation>>('/donations', payload);
  return data.data;
}

/**
 * Entrada: params: paginacion y status opcional.
 * Proceso: Consulta GET /donations/me del donante autenticado.
 * Salida: Retorna items y meta.
 */
async function fetchMyDonations(params: ListDonationsParams = {}): Promise<{
  data: PaginatedDonationsData;
  meta: NonNullable<ApiSuccessResponse['meta']>;
}> {
  const { data } = await api.get<ApiSuccessResponse<PaginatedDonationsData>>('/donations/me', {
    params,
  });
  return { data: data.data, meta: data.meta ?? {} };
}

/**
 * Entrada: id: UUID de la donacion.
 * Proceso: Consulta GET /donations/:id.
 * Salida: Retorna detalle de la donacion.
 */
async function fetchDonationById(id: string): Promise<Donation> {
  const { data } = await api.get<ApiSuccessResponse<Donation>>(`/donations/${id}`);
  return data.data;
}

/**
 * Entrada: id: UUID; status: nuevo estado.
 * Proceso: Envia PATCH /donations/:id/status.
 * Salida: Retorna donacion actualizada.
 */
async function updateDonationStatus(id: string, status: DonationStatus): Promise<Donation> {
  const { data } = await api.patch<ApiSuccessResponse<Donation>>(`/donations/${id}/status`, {
    status,
  });
  return data.data;
}

/**
 * Entrada: id: UUID; payload: datos de entrega (direccion, coordenadas, fecha estimada).
 * Proceso: Envia PATCH /donations/:id/delivery (rol FOUNDATION operativa).
 * Salida: Retorna donacion actualizada.
 */
async function updateDonationDelivery(
  id: string,
  payload: UpdateDonationDeliveryPayload,
): Promise<Donation> {
  const { data } = await api.patch<ApiSuccessResponse<Donation>>(
    `/donations/${id}/delivery`,
    payload,
  );
  return data.data;
}

/**
 * Entrada: params: paginacion y status opcional.
 * Proceso: Consulta GET /foundation/requests de la fundacion operativa autenticada.
 * Salida: Retorna items y meta de paginacion.
 */
async function fetchFoundationRequests(params: ListDonationsParams = {}): Promise<{
  data: PaginatedDonationsData;
  meta: NonNullable<ApiSuccessResponse['meta']>;
}> {
  const { data } = await api.get<ApiSuccessResponse<PaginatedDonationsData>>(
    '/foundation/requests',
    { params },
  );
  return { data: data.data, meta: data.meta ?? {} };
}

/**
 * Entrada: id: UUID de donacion; page/limit.
 * Proceso: Consulta GET /donations/:id/messages.
 * Salida: Retorna mensajes de la conversacion.
 */
async function fetchDonationMessages(
  id: string,
  page = 1,
  limit = 50,
): Promise<{ items: DonationMessage[]; meta: NonNullable<ApiSuccessResponse['meta']> }> {
  const { data } = await api.get<ApiSuccessResponse<{ items: DonationMessage[] }>>(
    `/donations/${id}/messages`,
    { params: { page, limit } },
  );
  return { items: data.data.items, meta: data.meta ?? {} };
}

/**
 * Entrada: id: UUID; body: texto del mensaje.
 * Proceso: Envia POST /donations/:id/messages.
 * Salida: Retorna mensaje creado.
 */
async function sendDonationMessage(id: string, body: string): Promise<DonationMessage> {
  const { data } = await api.post<ApiSuccessResponse<DonationMessage>>(
    `/donations/${id}/messages`,
    { body },
  );
  return data.data;
}

/**
 * Entrada: campaignId: UUID de campana publica.
 * Proceso: Consulta GET /campaigns/:id sin importar el feature campaigns.
 * Salida: Retorna campana para el flujo de aporte.
 */
async function fetchCampaignForDonation(campaignId: string): Promise<Campaign> {
  const { data } = await api.get<ApiSuccessResponse<Campaign>>(`/campaigns/${campaignId}`);
  return data.data;
}

/**
 * Entrada: campaignId: UUID.
 * Proceso: Consulta GET /needs?campaignId= para el formulario de aporte.
 * Salida: Retorna necesidades de la campana.
 */
async function fetchNeedsForDonation(campaignId: string): Promise<Need[]> {
  const { data } = await api.get<ApiSuccessResponse<PaginatedNeedsData>>('/needs', {
    params: { campaignId, page: 1, limit: 100 },
  });
  return data.data.items;
}

export const donationsService = {
  createDonation,
  fetchMyDonations,
  fetchDonationById,
  updateDonationStatus,
  updateDonationDelivery,
  fetchFoundationRequests,
  fetchDonationMessages,
  sendDonationMessage,
  fetchCampaignForDonation,
  fetchNeedsForDonation,
};
