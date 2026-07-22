import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { needsService } from '@/features/needs/services/needs.service';
import {
  needFormSchema,
  type NeedFormData,
} from '@/features/needs/validations/needs.validations';
import { parseApiError } from '@/utils/api-error';

interface CampaignOption {
  id: string;
  title: string;
  status: string;
}

/**
 * Entrada: Ninguna.
 * Proceso: Formulario para crear necesidad asociada a una campana propia.
 * Salida: Retorna el elemento JSX de publicar necesidad.
 */
export function PublishNeedPage() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<CampaignOption[]>([]);
  const [campaignId, setCampaignId] = useState('');
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(true);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NeedFormData>({
    resolver: zodResolver(needFormSchema),
    defaultValues: {
      name: '',
      description: '',
      quantity: 1,
      unit: '',
      priority: 'MEDIUM',
    },
  });

  /**
   * Entrada: Ninguna.
   * Proceso: Carga campanas propias via needs.service (sin importar feature campaigns).
   * Salida: No retorna valor.
   */
  const loadCampaigns = useCallback(async () => {
    setIsLoadingCampaigns(true);
    setApiError('');
    try {
      const items = await needsService.fetchMyCampaignsForNeeds();
      setCampaigns(items);
      if (items[0]) {
        setCampaignId(items[0].id);
      }
    } catch (error) {
      setApiError(parseApiError(error).message || UI_MESSAGES.NEEDS_LOAD_ERROR);
    } finally {
      setIsLoadingCampaigns(false);
    }
  }, []);

  useEffect(() => {
    void loadCampaigns();
  }, [loadCampaigns]);

  /**
   * Entrada: data: formulario validado de necesidad.
   * Proceso: Crea necesidad asociada a campaignId seleccionado.
   * Salida: No retorna valor; navega a edicion de campana.
   */
  async function onSubmit(data: NeedFormData) {
    if (!campaignId) {
      setApiError(UI_MESSAGES.NEEDS_SELECT_CAMPAIGN);
      return;
    }
    setApiError('');
    setSuccess('');
    try {
      await needsService.createNeed({
        campaignId,
        name: data.name,
        description: data.description || null,
        quantity: data.quantity,
        unit: data.unit,
        priority: data.priority,
      });
      setSuccess(UI_MESSAGES.NEEDS_CREATED);
      navigate(`/foundation/campaigns/${campaignId}/edit`);
    } catch (error) {
      setApiError(parseApiError(error).message || UI_MESSAGES.NEEDS_LOAD_ERROR);
    }
  }

  if (!isLoadingCampaigns && campaigns.length === 0 && !apiError) {
    return (
      <div className="mx-auto max-w-3xl">
        <EmptyState
          title={UI_MESSAGES.CAMPAIGNS_EMPTY_MINE}
          actionLabel={UI_MESSAGES.CAMPAIGNS_CREATE_TITLE}
          onAction={() => navigate('/foundation/campaigns/new')}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">{UI_MESSAGES.NEEDS_PUBLISH_TITLE}</h1>
        <p className="mt-2 text-text-secondary">{UI_MESSAGES.NEEDS_PUBLISH_DESC}</p>
      </header>

      {success && <Alert variant="success">{success}</Alert>}

      <Card glass={false}>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex flex-col gap-1.5">
            <label className="text-label" htmlFor="need-campaign">
              {UI_MESSAGES.NEEDS_SELECT_CAMPAIGN}
            </label>
            <select
              id="need-campaign"
              className="w-full rounded-[var(--radius-sm)] border border-border-default bg-white/60 px-4 py-3 text-base"
              value={campaignId}
              onChange={(event) => setCampaignId(event.target.value)}
              disabled={isLoadingCampaigns}
            >
              {campaigns.map((campaign) => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.title} ({campaign.status})
                </option>
              ))}
            </select>
          </div>
          <Input label={UI_MESSAGES.NEEDS_FORM_NAME} error={errors.name?.message} {...register('name')} />
          <div className="flex flex-col gap-1.5">
            <label className="text-label" htmlFor="publish-need-description">
              {UI_MESSAGES.NEEDS_FORM_DESCRIPTION}
            </label>
            <textarea
              id="publish-need-description"
              rows={3}
              className="w-full rounded-[var(--radius-sm)] border border-border-default bg-white/60 px-4 py-3 text-base"
              {...register('description')}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              label={UI_MESSAGES.NEEDS_FORM_QUANTITY}
              type="number"
              min={1}
              error={errors.quantity?.message}
              {...register('quantity')}
            />
            <Input label={UI_MESSAGES.NEEDS_FORM_UNIT} error={errors.unit?.message} {...register('unit')} />
            <div className="flex flex-col gap-1.5">
              <label className="text-label" htmlFor="publish-need-priority">
                {UI_MESSAGES.NEEDS_FORM_PRIORITY}
              </label>
              <select
                id="publish-need-priority"
                className="w-full rounded-[var(--radius-sm)] border border-border-default bg-white/60 px-4 py-3 text-base"
                {...register('priority')}
              >
                <option value="LOW">{UI_MESSAGES.NEEDS_PRIORITY_LOW}</option>
                <option value="MEDIUM">{UI_MESSAGES.NEEDS_PRIORITY_MEDIUM}</option>
                <option value="HIGH">{UI_MESSAGES.NEEDS_PRIORITY_HIGH}</option>
              </select>
            </div>
          </div>
          {apiError && <Alert variant="danger">{apiError}</Alert>}
          <Button type="submit" isLoading={isSubmitting}>
            {UI_MESSAGES.NEEDS_ADD}
          </Button>
        </form>
      </Card>
    </div>
  );
}
