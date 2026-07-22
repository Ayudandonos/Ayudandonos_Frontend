import { useCallback, useEffect, useState } from 'react';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { impactService } from '@/features/marketing/services/impact.service';
import type { ImpactStats } from '@/features/marketing/types/impact.types';
import { parseApiError } from '@/utils/api-error';

interface UseImpactStatsResult {
  stats: ImpactStats | null;
  isLoading: boolean;
  error: string;
  reload: () => Promise<void>;
}

/**
 * Entrada: Ninguna.
 * Proceso: Carga estadisticas publicas de impacto desde la API.
 * Salida: Retorna stats, estados de carga/error y recarga.
 */
export function useImpactStats(): UseImpactStatsResult {
  const [stats, setStats] = useState<ImpactStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await impactService.fetchImpactStats();
      setStats(data);
    } catch (loadError) {
      setStats(null);
      setError(parseApiError(loadError).message || UI_MESSAGES.IMPACT_LOAD_ERROR);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { stats, isLoading, error, reload };
}
