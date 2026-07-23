import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { buttonLinkClass } from '@/components/ui/button-link-class';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { useToast } from '@/context/useToast';
import { CampaignForm } from '@/features/campaigns/components/CampaignForm';
import { CampaignNeedsManager } from '@/features/campaigns/components/CampaignNeedsManager';
import { CampaignsLoadingSkeleton } from '@/features/campaigns/components/CampaignsLoadingSkeleton';
import { campaignsService } from '@/features/campaigns/services/campaigns.service';
import type { Campaign } from '@/features/campaigns/types/campaigns.types';
import { campaignFormToPayload } from '@/features/campaigns/utils/campaign-payload';
import type { CampaignFormData } from '@/features/campaigns/validations/campaigns.validations';
import { parseApiError } from '@/utils/api-error';
import { toDateTimeLocalValue } from '@/utils/date-format';
import { redirectFoundationOnForbidden } from '@/utils/foundation-api-guard';

/**
 * Entrada: Ninguna (id desde useParams).
 * Proceso: Carga campana, permite editar y gestionar necesidades inline.
 * Salida: Retorna el elemento JSX de editar campana.
 */
export function EditCampaignPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [loadError, setLoadError] = useState('');

  /**
   * Entrada: Ninguna.
   * Proceso: Obtiene la campana por id para prellenar el formulario.
   * Salida: No retorna valor; actualiza estado.
   */
  const loadCampaign = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setLoadError('');
    try {
      const data = await campaignsService.fetchCampaignById(id);
      setCampaign(data);
    } catch (error) {
      if (redirectFoundationOnForbidden(error, navigate)) {
        return;
      }
      setLoadError(parseApiError(error).message || UI_MESSAGES.CAMPAIGNS_NOT_FOUND);
      setCampaign(null);
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    void loadCampaign();
  }, [loadCampaign]);

  /**
   * Entrada: data: formulario validado.
   * Proceso: Actualiza la campana via PATCH.
   * Salida: No retorna valor.
   */
  async function handleUpdate(data: CampaignFormData) {
    if (!id) return;
    setApiError('');
    try {
      const updated = await campaignsService.updateCampaign(id, campaignFormToPayload(data));
      setCampaign(updated);
      pushToast({ variant: 'success', message: UI_MESSAGES.CAMPAIGNS_UPDATED });
    } catch (error) {
      if (redirectFoundationOnForbidden(error, navigate)) {
        return;
      }
      const message = parseApiError(error).message || UI_MESSAGES.CAMPAIGNS_LOAD_ERROR;
      setApiError(message);
      pushToast({ variant: 'danger', message });
    }
  }

  /**
   * Entrada: data: formulario validado.
   * Proceso: Guarda cambios y publica la campana.
   * Salida: No retorna valor.
   */
  async function handlePublish(data: CampaignFormData) {
    if (!id) return;
    setApiError('');
    try {
      await campaignsService.updateCampaign(id, campaignFormToPayload(data));
      const published = await campaignsService.publishCampaign(id);
      setCampaign(published);
      pushToast({ variant: 'success', message: UI_MESSAGES.CAMPAIGNS_PUBLISHED });
    } catch (error) {
      if (redirectFoundationOnForbidden(error, navigate)) {
        return;
      }
      const message = parseApiError(error).message || UI_MESSAGES.CAMPAIGNS_LOAD_ERROR;
      setApiError(message);
      pushToast({ variant: 'danger', message });
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl">
        <CampaignsLoadingSkeleton variant="detail" />
      </div>
    );
  }

  if (loadError || !campaign || !id) {
    return (
      <div className="mx-auto max-w-3xl">
        <EmptyState
          title={loadError || UI_MESSAGES.CAMPAIGNS_NOT_FOUND}
          onRetry={() => void loadCampaign()}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold text-text-primary">{UI_MESSAGES.CAMPAIGNS_EDIT_TITLE}</h1>
        <Link
          to="/foundation/campaigns"
          className={buttonLinkClass({ variant: 'secondary', size: 'sm' })}
        >
          {UI_MESSAGES.CAMPAIGNS_BACK}
        </Link>
      </div>
      <Card glass={false}>
        <CampaignForm
          key={campaign.updatedAt}
          defaultValues={{
            title: campaign.title,
            description: campaign.description,
            imageUrl: campaign.imageUrl ?? '',
            startDate: toDateTimeLocalValue(campaign.startDate),
            endDate: toDateTimeLocalValue(campaign.endDate),
            deliveryAddress: campaign.deliveryAddress ?? '',
            deliveryLatitude: campaign.deliveryLatitude,
            deliveryLongitude: campaign.deliveryLongitude,
          }}
          apiError={apiError}
          submitLabel={UI_MESSAGES.CAMPAIGNS_SAVE_CHANGES}
          onSubmit={handleUpdate}
          secondaryAction={
            campaign.status === 'DRAFT'
              ? {
                  label: UI_MESSAGES.CAMPAIGNS_PUBLISH,
                  onClick: handlePublish,
                }
              : undefined
          }
        />
      </Card>
      <CampaignNeedsManager campaignId={id} />
    </div>
  );
}
