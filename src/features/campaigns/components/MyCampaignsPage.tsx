import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { buttonLinkClass } from '@/components/ui/button-link-class';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { useToast } from '@/context/useToast';
import { CampaignStatusBadge } from '@/features/campaigns/components/CampaignStatusBadge';
import { CampaignsLoadingSkeleton } from '@/features/campaigns/components/CampaignsLoadingSkeleton';
import { campaignsService } from '@/features/campaigns/services/campaigns.service';
import type { Campaign } from '@/features/campaigns/types/campaigns.types';
import { parseApiError } from '@/utils/api-error';
import { formatDate } from '@/utils/date-format';
import { redirectFoundationOnForbidden } from '@/utils/foundation-api-guard';

interface CampaignRow extends Campaign {
  needsCount: number;
}

type ConfirmAction = { type: 'delete' | 'publish'; campaign: Campaign } | null;

const FETCH_CONCURRENCY = 4;

/**
 * Entrada: items: campanas propias.
 * Proceso: Carga conteo de necesidades con concurrencia limitada.
 * Salida: Retorna filas enriquecidas.
 */
async function withNeedsCounts(items: Campaign[]): Promise<CampaignRow[]> {
  const results: CampaignRow[] = new Array(items.length);
  let cursor = 0;

  /**
   * Entrada: Ninguna.
   * Proceso: Worker que consulta needs por campana.
   * Salida: No retorna valor; escribe en results.
   */
  async function worker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      const campaign = items[index];
      try {
        const { data, meta } = await campaignsService.fetchCampaignNeeds(campaign.id, 1, 100);
        results[index] = {
          ...campaign,
          needsCount: typeof meta.total === 'number' ? meta.total : data.items.length,
        };
      } catch {
        results[index] = { ...campaign, needsCount: 0 };
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(FETCH_CONCURRENCY, Math.max(items.length, 1)) }, () => worker()),
  );
  return results;
}

/**
 * Entrada: Ninguna.
 * Proceso: Lista campanas de la fundacion con acciones editar, publicar, eliminar y ver.
 * Salida: Retorna el elemento JSX de mis campanas.
 */
export function MyCampaignsPage() {
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const [campaigns, setCampaigns] = useState<CampaignRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState<ConfirmAction>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Entrada: Ninguna.
   * Proceso: Carga GET /campaigns/me y enriquece con conteos de needs.
   * Salida: No retorna valor.
   */
  const loadCampaigns = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await campaignsService.fetchMyCampaigns({ page: 1, limit: 50 });
      const rows = await withNeedsCounts(result.data.items);
      setCampaigns(rows);
    } catch (loadError) {
      if (redirectFoundationOnForbidden(loadError, navigate)) {
        return;
      }
      setError(parseApiError(loadError).message || UI_MESSAGES.CAMPAIGNS_LOAD_ERROR);
      setCampaigns([]);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    void loadCampaigns();
  }, [loadCampaigns]);

  /**
   * Entrada: Ninguna.
   * Proceso: Ejecuta publicar o eliminar segun confirmacion activa.
   * Salida: No retorna valor; recarga listado.
   */
  async function handleConfirm() {
    if (!confirm) return;
    setIsProcessing(true);
    setError('');
    try {
      if (confirm.type === 'delete') {
        await campaignsService.deleteCampaign(confirm.campaign.id);
        pushToast({ variant: 'success', message: UI_MESSAGES.CAMPAIGNS_DELETED });
      } else {
        await campaignsService.publishCampaign(confirm.campaign.id);
        pushToast({ variant: 'success', message: UI_MESSAGES.CAMPAIGNS_PUBLISHED });
      }
      setConfirm(null);
      await loadCampaigns();
    } catch (actionError) {
      if (redirectFoundationOnForbidden(actionError, navigate)) {
        return;
      }
      const message = parseApiError(actionError).message || UI_MESSAGES.CAMPAIGNS_LOAD_ERROR;
      setError(message);
      pushToast({ variant: 'danger', message });
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">{UI_MESSAGES.CAMPAIGNS_MY_TITLE}</h1>
          <p className="mt-1 text-text-secondary">{UI_MESSAGES.CAMPAIGNS_MY_DESCRIPTION}</p>
        </div>
        <Link to="/foundation/campaigns/new" className={buttonLinkClass({ variant: 'primary' })}>
          {UI_MESSAGES.CAMPAIGNS_CREATE_TITLE}
        </Link>
      </div>

      {isLoading && <CampaignsLoadingSkeleton variant="table" />}

      {error && !isLoading && (
        <EmptyState title={error} onRetry={() => void loadCampaigns()} />
      )}

      {!isLoading && !error && campaigns.length === 0 && (
        <EmptyState
          title={UI_MESSAGES.CAMPAIGNS_EMPTY_MINE}
          actionLabel={UI_MESSAGES.CAMPAIGNS_CREATE_TITLE}
          onAction={() => navigate('/foundation/campaigns/new')}
        />
      )}

      {!isLoading && !error && campaigns.length > 0 && (
        <>
          <div className="hidden overflow-hidden rounded-xl border border-border-default bg-white md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border-default bg-vivid-50">
                <tr>
                  <th className="px-4 py-3 font-semibold">{UI_MESSAGES.CAMPAIGNS_FORM_TITLE}</th>
                  <th className="px-4 py-3 font-semibold">{UI_MESSAGES.CAMPAIGNS_FILTER_STATUS}</th>
                  <th className="px-4 py-3 font-semibold">{UI_MESSAGES.CAMPAIGNS_END}</th>
                  <th className="px-4 py-3 font-semibold">{UI_MESSAGES.CAMPAIGNS_MANAGE_NEEDS}</th>
                  <th className="px-4 py-3 font-semibold" />
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="border-b border-border-default last:border-0">
                    <td className="px-4 py-3 font-medium text-text-primary">{campaign.title}</td>
                    <td className="px-4 py-3">
                      <CampaignStatusBadge status={campaign.status} />
                    </td>
                    <td className="px-4 py-3 text-text-muted">{formatDate(campaign.endDate)}</td>
                    <td className="px-4 py-3 text-text-secondary">
                      {UI_MESSAGES.CAMPAIGNS_NEEDS_COUNT(campaign.needsCount)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap justify-end gap-2">
                        <Link
                          to={`/campaigns/${campaign.id}`}
                          className={buttonLinkClass({ variant: 'secondary', size: 'sm' })}
                        >
                          {UI_MESSAGES.CAMPAIGNS_VIEW}
                        </Link>
                        <Link
                          to={`/foundation/campaigns/${campaign.id}/edit`}
                          className={buttonLinkClass({ variant: 'secondary', size: 'sm' })}
                        >
                          {UI_MESSAGES.CAMPAIGNS_EDIT}
                        </Link>
                        {campaign.status === 'DRAFT' && (
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => setConfirm({ type: 'publish', campaign })}
                          >
                            {UI_MESSAGES.CAMPAIGNS_PUBLISH}
                          </Button>
                        )}
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() => setConfirm({ type: 'delete', campaign })}
                        >
                          {UI_MESSAGES.CAMPAIGNS_DELETE}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-4 md:hidden">
            {campaigns.map((campaign) => (
              <article
                key={campaign.id}
                className="space-y-3 rounded-xl border border-border-default bg-white p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-semibold text-text-primary">{campaign.title}</h2>
                  <CampaignStatusBadge status={campaign.status} />
                </div>
                <p className="text-xs text-text-muted">
                  {UI_MESSAGES.CAMPAIGNS_END}: {formatDate(campaign.endDate)} ·{' '}
                  {UI_MESSAGES.CAMPAIGNS_NEEDS_COUNT(campaign.needsCount)}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/foundation/campaigns/${campaign.id}/edit`}
                    className={buttonLinkClass({ variant: 'secondary', size: 'sm' })}
                  >
                    {UI_MESSAGES.CAMPAIGNS_EDIT}
                  </Link>
                  <Link
                    to={`/campaigns/${campaign.id}`}
                    className={buttonLinkClass({ variant: 'secondary', size: 'sm' })}
                  >
                    {UI_MESSAGES.CAMPAIGNS_VIEW}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      {confirm && (
        <ConfirmDialog
          title={
            confirm.type === 'delete'
              ? UI_MESSAGES.CAMPAIGNS_CONFIRM_DELETE_TITLE
              : UI_MESSAGES.CAMPAIGNS_CONFIRM_PUBLISH_TITLE
          }
          description={
            confirm.type === 'delete'
              ? UI_MESSAGES.CAMPAIGNS_CONFIRM_DELETE_DESC
              : UI_MESSAGES.CAMPAIGNS_CONFIRM_PUBLISH_DESC
          }
          confirmLabel={
            confirm.type === 'delete'
              ? UI_MESSAGES.CAMPAIGNS_DELETE
              : UI_MESSAGES.CAMPAIGNS_PUBLISH
          }
          isProcessing={isProcessing}
          onConfirm={() => void handleConfirm()}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
