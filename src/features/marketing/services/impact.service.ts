import { api } from '@/services/api';
import type { ApiSuccessResponse } from '@/types';
import type { ImpactStats } from '@/features/marketing/types/impact.types';

/**
 * Entrada: Ninguna.
 * Proceso: Consulta GET /impact/stats con contadores publicos reales.
 * Salida: Retorna las estadisticas de impacto de la plataforma.
 */
async function fetchImpactStats(): Promise<ImpactStats> {
  const { data } = await api.get<ApiSuccessResponse<ImpactStats>>('/impact/stats');
  return data.data;
}

export const impactService = {
  fetchImpactStats,
};
