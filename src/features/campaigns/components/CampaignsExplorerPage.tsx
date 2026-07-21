import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { CampaignCard } from '@/features/campaigns/components/CampaignCard';
import { CampaignsLoadingSkeleton } from '@/features/campaigns/components/CampaignsLoadingSkeleton';
import { campaignsService } from '@/features/campaigns/services/campaigns.service';
import type { Campaign } from '@/features/campaigns/types/campaigns.types';
import { useDebounce } from '@/hooks/useDebounce';
import { parseApiError } from '@/utils/api-error';
import { needProgressPercent } from '@/utils/date-format';

interface CampaignWithMetrics extends Campaign {
  needsCount: number;
  progressPercent: number;
}

const FETCH_CONCURRENCY = 4;

/**
 * Entrada: items: campanas; concurrency: maximo de peticiones paralelas.
 * Proceso: Obtiene necesidades por campana con concurrencia limitada; falla a 0.
 * Salida: Retorna campanas enriquecidas con conteo y progreso.
 */
async function enrichCampaignsWithNeeds(
  items: Campaign[],
  concurrency: number,
): Promise<CampaignWithMetrics[]> {
  const results: CampaignWithMetrics[] = new Array(items.length);
  let cursor = 0;

  /**
   * Entrada: Ninguna.
   * Proceso: Worker que toma el siguiente indice y carga needs de esa campana.
   * Salida: No retorna valor; escribe en results.
   */
  async function worker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      const campaign = items[index];
      try {
        const { data } = await campaignsService.fetchCampaignNeeds(campaign.id, 1, 100);
        const needs = data.items;
        const required = needs.reduce((sum, need) => sum + need.quantity, 0);
        const fulfilled = needs.reduce((sum, need) => sum + need.fulfilledQuantity, 0);
        results[index] = {
          ...campaign,
          needsCount: needs.length,
          progressPercent: needProgressPercent(fulfilled, required),
        };
      } catch {
        results[index] = { ...campaign, needsCount: 0, progressPercent: 0 };
      }
    }
  }

  const workers = Array.from(
    { length: Math.min(concurrency, Math.max(items.length, 1)) },
    () => worker(),
  );
  await Promise.all(workers);
  return results;
}

/**
 * Entrada: Ninguna.
 * Proceso: Lista campanas publicas con busqueda y metricas de necesidades.
 * Salida: Retorna el elemento JSX del explorador de campanas.
 */
export function CampaignsExplorerPage() {
  const [campaigns, setCampaigns] = useState<CampaignWithMetrics[]>([]);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  /**
   * Entrada: Ninguna.
   * Proceso: Carga campanas publicas y enriquece con needs en paralelo limitado.
   * Salida: No retorna valor; actualiza estado de la pagina.
   */
  const loadCampaigns = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await campaignsService.fetchCampaigns({
        page: 1,
        limit: 12,
        search: debouncedSearch || undefined,
      });
      const enriched = await enrichCampaignsWithNeeds(result.data.items, FETCH_CONCURRENCY);
      setCampaigns(enriched);
    } catch (loadError) {
      setError(parseApiError(loadError).message || UI_MESSAGES.CAMPAIGNS_LOAD_ERROR);
      setCampaigns([]);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    void loadCampaigns();
  }, [loadCampaigns]);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">{UI_MESSAGES.CAMPAIGNS_TITLE}</h1>
        <p className="mt-2 max-w-3xl text-text-secondary">{UI_MESSAGES.CAMPAIGNS_DESCRIPTION}</p>
      </header>

      <div className="rounded-xl border border-border-default bg-white p-4">
        <Input
          type="search"
          placeholder={UI_MESSAGES.CAMPAIGNS_SEARCH_PLACEHOLDER}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label={UI_MESSAGES.CAMPAIGNS_SEARCH_PLACEHOLDER}
        />
      </div>

      {isLoading && <CampaignsLoadingSkeleton />}

      {error && !isLoading && (
        <EmptyState title={error} onRetry={() => void loadCampaigns()} />
      )}

      {!isLoading && !error && campaigns.length === 0 && (
        <EmptyState title={UI_MESSAGES.CAMPAIGNS_EMPTY} />
      )}

      {!isLoading && !error && campaigns.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              needsCount={campaign.needsCount}
              progressPercent={campaign.progressPercent}
            />
          ))}
          <div className="flex flex-col justify-center rounded-xl bg-vivid-700 p-8 text-white">
            <h3 className="text-xl font-bold">{UI_MESSAGES.CAMPAIGNS_CTA_TITLE}</h3>
            <p className="mt-2 text-sm text-white/90">{UI_MESSAGES.CAMPAIGNS_CTA_DESC}</p>
            <Link to="/register" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">
              {UI_MESSAGES.CAMPAIGNS_CTA_ACTION}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
