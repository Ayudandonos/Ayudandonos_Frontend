import { api } from '@/services/api';
import type { ApiSuccessResponse } from '@/types';
import type {
  AdminDashboardData,
  AdminReportsData,
  ListAdminCampaignsParams,
  PaginatedAdminCampaigns,
} from '@/features/admin/types/admin.types';

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

/**
 * Entrada: Ninguna (token ADMIN en interceptor).
 * Proceso: Consulta GET /admin/reports con resumen y series para graficos.
 * Salida: Retorna el payload de reportes administrativos.
 */
async function fetchReports(): Promise<AdminReportsData> {
  const { data } = await api.get<ApiSuccessResponse<AdminReportsData>>('/admin/reports');
  return data.data;
}

/**
 * Entrada: params: paginacion y filtros opcionales.
 * Proceso: Consulta GET /admin/campaigns con creador, fechas y donaciones.
 * Salida: Retorna items y meta de paginacion.
 */
async function fetchCampaigns(params: ListAdminCampaignsParams = {}): Promise<{
  data: PaginatedAdminCampaigns;
  meta: NonNullable<ApiSuccessResponse['meta']>;
}> {
  const { data } = await api.get<ApiSuccessResponse<PaginatedAdminCampaigns>>('/admin/campaigns', {
    params,
  });

  return {
    data: data.data,
    meta: data.meta ?? {},
  };
}

export const adminService = {
  fetchDashboard,
  fetchReports,
  fetchCampaigns,
};
