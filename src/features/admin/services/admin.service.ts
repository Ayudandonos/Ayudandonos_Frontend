import { api } from '@/services/api';
import type { ApiSuccessResponse } from '@/types';
import type { AdminDashboardData } from '@/features/admin/types/admin.types';

export interface AdminDashboardQuery {
  latestNeedsLimit?: number;
  featuredCampaignsLimit?: number;
}

/**
 * Entrada: query: limites opcionales para secciones del panel.
 * Proceso: Consulta GET /admin/dashboard con KPIs, necesidades recientes y campanas destacadas.
 * Salida: Retorna el payload agregado del panel administrativo.
 */
async function fetchDashboard(query: AdminDashboardQuery = {}): Promise<AdminDashboardData> {
  const { data } = await api.get<ApiSuccessResponse<AdminDashboardData>>('/admin/dashboard', {
    params: query,
  });
  return data.data;
}

export const adminService = {
  fetchDashboard,
};
