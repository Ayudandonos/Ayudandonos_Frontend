import { api } from '@/services/api';
import type { ApiSuccessResponse } from '@/types';
import type { AdminDashboardData } from '@/features/admin/types/admin.types';

/**
 * Entrada: Ninguna (token ADMIN en interceptor).
 * Proceso: Consulta GET /admin/dashboard con KPIs, necesidades recientes y campanas destacadas.
 * Salida: Retorna el payload agregado del panel administrativo.
 */
async function fetchDashboard(): Promise<AdminDashboardData> {
  const { data } = await api.get<ApiSuccessResponse<AdminDashboardData>>('/admin/dashboard');
  return data.data;
}

export const adminService = {
  fetchDashboard,
};
