import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AppImage } from '@/components/ui/AppImage';
import { buttonLinkClass } from '@/components/ui/button-link-class';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { DeliveryMap } from '@/components/ui/DeliveryMap';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { CampaignStatusBadge } from '@/features/campaigns/components/CampaignStatusBadge';
import { CampaignsLoadingSkeleton } from '@/features/campaigns/components/CampaignsLoadingSkeleton';
import { campaignsService } from '@/features/campaigns/services/campaigns.service';
import type { Campaign, CampaignNeed } from '@/features/campaigns/types/campaigns.types';
import { useAuth } from '@/context/useAuth';
import { parseApiError } from '@/utils/api-error';
import { formatDate, needProgressPercent } from '@/utils/date-format';
import { buildGoogleMapsDirectionsUrl } from '@/utils/maps';

/**
 * Entrada: Ninguna (id desde useParams).
 * Proceso: Carga campana y necesidades; muestra mapa, CTAs de aporte y listado de needs.
 * Salida: Retorna el elemento JSX del detalle de campana.
 */
export function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { role, isAuthenticated } = useAuth();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [needs, setNeeds] = useState<CampaignNeed[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  /**
   * Entrada: Ninguna.
   * Proceso: Obtiene detalle de campana y sus necesidades en paralelo.
   * Salida: No retorna valor; actualiza estado de la pagina.
   */
  const loadDetail = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError('');
    try {
      const [campaignData, needsResult] = await Promise.all([
        campaignsService.fetchCampaignById(id),
        campaignsService
          .fetchCampaignNeeds(id)
          .catch(() => ({ data: { items: [] as CampaignNeed[] } })),
      ]);
      setCampaign(campaignData);
      setNeeds(needsResult.data.items);
    } catch (loadError) {
      setError(parseApiError(loadError).message || UI_MESSAGES.CAMPAIGNS_NOT_FOUND);
      setCampaign(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadDetail();
  }, [loadDetail]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl">
        <CampaignsLoadingSkeleton variant="detail" />
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="mx-auto max-w-4xl">
        <EmptyState
          title={error || UI_MESSAGES.CAMPAIGNS_NOT_FOUND}
          onRetry={() => void loadDetail()}
        />
      </div>
    );
  }

  const hasCoords =
    campaign.deliveryLatitude != null && campaign.deliveryLongitude != null;
  const mapsUrl = hasCoords
    ? buildGoogleMapsDirectionsUrl(campaign.deliveryLatitude!, campaign.deliveryLongitude!)
    : null;
  const canContribute = isAuthenticated && role === 'USER';

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="overflow-hidden rounded-xl border border-border-default bg-white">
        <div className="aspect-[21/9] bg-vivid-100">
          {campaign.imageUrl ? (
            <AppImage src={campaign.imageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-text-muted">
              {UI_MESSAGES.FOUNDATIONS_LOGO_PLACEHOLDER}
            </div>
          )}
        </div>
        <div className="space-y-4 p-6">
          <div className="flex flex-wrap items-center gap-3">
            <CampaignStatusBadge status={campaign.status} />
            <span className="text-sm text-text-muted">
              {UI_MESSAGES.CAMPAIGNS_START}: {formatDate(campaign.startDate)} ·{' '}
              {UI_MESSAGES.CAMPAIGNS_END}: {formatDate(campaign.endDate)}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary">{campaign.title}</h1>
          <p className="text-vivid-700">
            {UI_MESSAGES.CAMPAIGNS_FOUNDATION}: {campaign.foundation.name}
            {campaign.foundation.city ? ` · ${campaign.foundation.city}` : ''}
          </p>
          <p className="whitespace-pre-wrap text-text-secondary">{campaign.description}</p>

          <div className="flex flex-wrap gap-3">
            {canContribute ? (
              <Link
                to={`/campaigns/${campaign.id}/contribute`}
                className={buttonLinkClass({ variant: 'primary' })}
              >
                {UI_MESSAGES.CAMPAIGNS_DONATE}
              </Link>
            ) : (
              <Link to="/login" className={buttonLinkClass({ variant: 'primary' })}>
                {UI_MESSAGES.DONATIONS_LOGIN_REQUIRED}
              </Link>
            )}
            <Link
              to={`/foundations/${campaign.foundation.id}`}
              className={buttonLinkClass({ variant: 'secondary' })}
            >
              {UI_MESSAGES.CAMPAIGNS_VIEW_FOUNDATION}
            </Link>
            {mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonLinkClass({ variant: 'secondary' })}
              >
                {UI_MESSAGES.CAMPAIGNS_HOW_TO_ARRIVE}
              </a>
            )}
          </div>
          <p className="text-xs text-text-muted">{UI_MESSAGES.CAMPAIGNS_CONTACT_VIA_DONATION}</p>
        </div>
      </div>

      <Card glass={false}>
        <h2 className="text-xl font-bold text-text-primary">{UI_MESSAGES.CAMPAIGNS_LOCATION}</h2>
        {campaign.deliveryAddress && (
          <p className="mt-2 text-sm text-text-secondary">{campaign.deliveryAddress}</p>
        )}
        {hasCoords ? (
          <div className="mt-4">
            <DeliveryMap
              latitude={campaign.deliveryLatitude}
              longitude={campaign.deliveryLongitude}
              address={campaign.deliveryAddress}
            />
          </div>
        ) : (
          <p className="mt-2 text-sm text-text-muted">{UI_MESSAGES.CAMPAIGNS_NO_LOCATION}</p>
        )}
      </Card>

      <Card glass={false}>
        <h2 className="text-xl font-bold text-text-primary">{UI_MESSAGES.CAMPAIGNS_NEEDS_TITLE}</h2>
        {needs.length === 0 ? (
          <p className="mt-3 text-sm text-text-muted">{UI_MESSAGES.CAMPAIGNS_NO_NEEDS}</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {needs.map((need) => {
              const progress = needProgressPercent(need.fulfilledQuantity, need.quantity);
              return (
                <li key={need.id} className="rounded-lg border border-border-default p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-text-primary">{need.name}</p>
                      {need.description && (
                        <p className="mt-1 text-sm text-text-secondary">{need.description}</p>
                      )}
                      <p className="mt-1 text-xs text-text-muted">
                        {UI_MESSAGES.NEEDS_REQUIRED}: {need.quantity} {need.unit} ·{' '}
                        {UI_MESSAGES.NEEDS_FULFILLED}: {need.fulfilledQuantity}
                      </p>
                    </div>
                    {canContribute && (
                      <Link
                        to={`/campaigns/${campaign.id}/contribute?needId=${need.id}`}
                        className={buttonLinkClass({ variant: 'secondary', size: 'sm' })}
                      >
                        {UI_MESSAGES.NEEDS_DONATE_THIS}
                      </Link>
                    )}
                  </div>
                  <ProgressBar
                    className="mt-3"
                    value={progress}
                    max={100}
                    label={UI_MESSAGES.CAMPAIGNS_PROGRESS}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
