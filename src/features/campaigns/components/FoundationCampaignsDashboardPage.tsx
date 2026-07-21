import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { buttonLinkClass } from '@/components/ui/button-link-class';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { CampaignsLoadingSkeleton } from '@/features/campaigns/components/CampaignsLoadingSkeleton';
import { campaignsService } from '@/features/campaigns/services/campaigns.service';
import type { Campaign, CampaignDashboardSummary } from '@/features/campaigns/types/campaigns.types';
import { parseApiError } from '@/utils/api-error';

/**
 * Entrada: campaigns: listado de campanas propias.
 * Proceso: Agrega KPIs por estado en el cliente.
 * Salida: Retorna resumen numerico.
 */
function buildSummary(campaigns: Campaign[]): CampaignDashboardSummary {
  return {
    total: campaigns.length,
    published: campaigns.filter((c) => c.status === 'PUBLISHED').length,
    finished: campaigns.filter((c) => c.status === 'FINISHED').length,
    drafts: campaigns.filter((c) => c.status === 'DRAFT').length,
    cancelled: campaigns.filter((c) => c.status === 'CANCELLED').length,
  };
}

/**
 * Entrada: Ninguna.
 * Proceso: Agrega campanas propias y conteo de solicitudes para KPIs y barras CSS.
 * Salida: Retorna el elemento JSX del dashboard de campanas.
 */
export function FoundationCampaignsDashboardPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [donationCount, setDonationCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  /**
   * Entrada: Ninguna.
   * Proceso: Carga hasta 100 campanas propias y conteo de solicitudes.
   * Salida: No retorna valor.
   */
  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const [campaignsResult, requestsCount] = await Promise.all([
        campaignsService.fetchMyCampaigns({ page: 1, limit: 100 }),
        campaignsService.fetchFoundationDonationCount(),
      ]);
      setCampaigns(campaignsResult.data.items);
      setDonationCount(requestsCount);
    } catch (loadError) {
      setError(parseApiError(loadError).message || UI_MESSAGES.CAMPAIGNS_LOAD_ERROR);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const summary = useMemo(() => buildSummary(campaigns), [campaigns]);
  const maxBar = Math.max(summary.published, summary.finished, summary.drafts, summary.cancelled, 1);

  const bars = [
    { label: UI_MESSAGES.CAMPAIGNS_KPI_ACTIVE, value: summary.published },
    { label: UI_MESSAGES.CAMPAIGNS_KPI_FINISHED, value: summary.finished },
    { label: UI_MESSAGES.CAMPAIGNS_KPI_DRAFTS, value: summary.drafts },
    { label: UI_MESSAGES.CAMPAIGNS_STATUS_CANCELLED, value: summary.cancelled },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            {UI_MESSAGES.CAMPAIGNS_DASHBOARD_TITLE}
          </h1>
          <p className="mt-1 max-w-2xl text-text-secondary">
            {UI_MESSAGES.CAMPAIGNS_DASHBOARD_DESCRIPTION}
          </p>
        </div>
        <Link
          to="/foundation/campaigns"
          className={buttonLinkClass({ variant: 'secondary', size: 'sm' })}
        >
          {UI_MESSAGES.NAV_MY_CAMPAIGNS}
        </Link>
      </div>

      {isLoading && <CampaignsLoadingSkeleton variant="detail" />}

      {error && !isLoading && (
        <EmptyState title={error} onRetry={() => void loadDashboard()} />
      )}

      {!isLoading && !error && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Card glass={false} className="text-center">
              <p className="text-sm text-text-muted">{UI_MESSAGES.CAMPAIGNS_KPI_TOTAL}</p>
              <p className="mt-2 text-3xl font-bold text-text-primary">{summary.total}</p>
            </Card>
            <Card glass={false} className="text-center">
              <p className="text-sm text-text-muted">{UI_MESSAGES.CAMPAIGNS_KPI_ACTIVE}</p>
              <p className="mt-2 text-3xl font-bold text-success-600">{summary.published}</p>
            </Card>
            <Card glass={false} className="text-center">
              <p className="text-sm text-text-muted">{UI_MESSAGES.CAMPAIGNS_KPI_FINISHED}</p>
              <p className="mt-2 text-3xl font-bold text-primary-700">{summary.finished}</p>
            </Card>
            <Card glass={false} className="text-center">
              <p className="text-sm text-text-muted">{UI_MESSAGES.CAMPAIGNS_KPI_DRAFTS}</p>
              <p className="mt-2 text-3xl font-bold text-secondary-700">{summary.drafts}</p>
            </Card>
            <Card glass={false} className="text-center">
              <p className="text-sm text-text-muted">{UI_MESSAGES.CAMPAIGNS_KPI_DONATIONS}</p>
              <p className="mt-2 text-3xl font-bold text-vivid-700">{donationCount}</p>
            </Card>
          </div>

          <Card glass={false}>
            <h2 className="text-lg font-semibold text-text-primary">
              {UI_MESSAGES.CAMPAIGNS_FILTER_STATUS}
            </h2>
            <div className="mt-6 space-y-4">
              {bars.map((bar) => (
                <div key={bar.label}>
                  <div className="mb-1 flex justify-between text-sm text-text-secondary">
                    <span>{bar.label}</span>
                    <span>{bar.value}</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-vivid-100">
                    <div
                      className="h-full rounded-full bg-primary-600 transition-all duration-500"
                      style={{ width: `${Math.round((bar.value / maxBar) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
