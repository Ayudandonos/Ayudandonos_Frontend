import type { CreateCampaignPayload } from '@/features/campaigns/types/campaigns.types';
import type { CampaignFormData } from '@/features/campaigns/validations/campaigns.validations';
import { toIsoDateTime } from '@/utils/date-format';

/**
 * Entrada: data: datos validados del formulario de campana.
 * Proceso: Normaliza imagen vacia, fechas ISO y direccion vacia a null.
 * Salida: Retorna payload listo para create/update de campana.
 */
export function campaignFormToPayload(data: CampaignFormData): CreateCampaignPayload {
  return {
    title: data.title,
    description: data.description,
    imageUrl: data.imageUrl || null,
    startDate: toIsoDateTime(data.startDate),
    endDate: toIsoDateTime(data.endDate),
    deliveryAddress: data.deliveryAddress || null,
    deliveryLatitude: data.deliveryLatitude ?? null,
    deliveryLongitude: data.deliveryLongitude ?? null,
  };
}
