import { useCallback, useEffect, useState } from 'react';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { adminService } from '@/features/admin/services/admin.service';
import type { AdminReportsData } from '@/features/admin/types/admin.types';
import { parseApiError } from '@/utils/api-error';

interface UseAdminReportsResult {
  data: AdminReportsData | null;
  isLoading: boolean;
  error: string;
  reload: () => Promise<void>;
}

/**
 * Entrada: Ninguna.
 * Proceso: Carga el resumen y series de reportes administrativos desde la API.
 * Salida: Retorna datos, estados de carga/error y funcion de recarga.
 */
export function useAdminReports(): UseAdminReportsResult {
  const [data, setData] = useState<AdminReportsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  /**
   * Entrada: Ninguna.
   * Proceso: Solicita GET /admin/reports y actualiza el estado del hook.
   * Salida: No retorna valor.
   */
  const reload = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const reports = await adminService.fetchReports();
      setData(reports);
    } catch (loadError) {
      setData(null);
      setError(parseApiError(loadError).message || UI_MESSAGES.ADMIN_REPORTS_LOAD_ERROR);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { data, isLoading, error, reload };
}
