import { useCallback, useEffect, useState } from 'react';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { adminService } from '@/features/admin/services/admin.service';
import type { AdminDashboardData } from '@/features/admin/types/admin.types';
import { parseApiError } from '@/utils/api-error';

interface UseAdminDashboardResult {
  data: AdminDashboardData | null;
  isLoading: boolean;
  error: string;
  latestNeedsLimit: number;
  featuredCampaignsLimit: number;
  setLatestNeedsLimit: (value: number) => void;
  setFeaturedCampaignsLimit: (value: number) => void;
  reload: () => Promise<void>;
}

/**
 * Entrada: Ninguna.
 * Proceso: Carga el resumen del panel administrativo desde la API.
 * Salida: Retorna datos, estados de carga/error y funcion de recarga.
 */
export function useAdminDashboard(): UseAdminDashboardResult {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [latestNeedsLimit, setLatestNeedsLimit] = useState(10);
  const [featuredCampaignsLimit, setFeaturedCampaignsLimit] = useState(3);

  /**
   * Entrada: Ninguna.
   * Proceso: Solicita GET /admin/dashboard y actualiza el estado del hook.
   * Salida: No retorna valor.
   */
  const reload = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const dashboard = await adminService.fetchDashboard({
        latestNeedsLimit,
        featuredCampaignsLimit,
      });
      setData(dashboard);
    } catch (loadError) {
      setData(null);
      setError(parseApiError(loadError).message || UI_MESSAGES.ADMIN_DASHBOARD_LOAD_ERROR);
    } finally {
      setIsLoading(false);
    }
  }, [latestNeedsLimit, featuredCampaignsLimit]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    data,
    isLoading,
    error,
    latestNeedsLimit,
    featuredCampaignsLimit,
    setLatestNeedsLimit,
    setFeaturedCampaignsLimit,
    reload,
  };
}
