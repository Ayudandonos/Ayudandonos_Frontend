import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { buttonLinkClass } from '@/components/ui/button-link-class';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { donationsService } from '@/features/donations/services/donations.service';
import {
  createDonationSchema,
  type CreateDonationFormData,
} from '@/features/donations/validations/donations.validations';
import { parseApiError } from '@/utils/api-error';
import { toIsoDateTime } from '@/utils/date-format';

type CampaignForDonation = Awaited<ReturnType<typeof donationsService.fetchCampaignForDonation>>;
type NeedForDonation = Awaited<ReturnType<typeof donationsService.fetchNeedsForDonation>>[number];

/**
 * Entrada: Ninguna (campaign id desde useParams; needId opcional desde query).
 * Proceso: Formulario de donacion en especie; opcion monetaria deshabilitada.
 * Salida: Retorna el elemento JSX de contribuir / donar.
 */
export function ContributePage() {
  const { id: campaignId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<CampaignForDonation | null>(null);
  const [needs, setNeeds] = useState<NeedForDonation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const preselectedNeedId = searchParams.get('needId') ?? '';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateDonationFormData>({
    resolver: zodResolver(createDonationSchema),
    defaultValues: {
      needId: preselectedNeedId,
      quantity: 1,
      notes: '',
      initialMessage: '',
      estimatedDeliveryAt: '',
    },
  });

  /**
   * Entrada: Ninguna.
   * Proceso: Carga campana y necesidades para el formulario de aporte.
   * Salida: No retorna valor.
   */
  const loadData = useCallback(async () => {
    if (!campaignId) return;
    setIsLoading(true);
    setApiError('');
    try {
      const [campaignData, needsData] = await Promise.all([
        donationsService.fetchCampaignForDonation(campaignId),
        donationsService.fetchNeedsForDonation(campaignId),
      ]);
      setCampaign(campaignData);
      setNeeds(needsData);
      const initialNeed =
        needsData.find((need) => need.id === preselectedNeedId)?.id ?? needsData[0]?.id ?? '';
      if (initialNeed) {
        setValue('needId', initialNeed);
      }
    } catch (error) {
      setApiError(parseApiError(error).message || UI_MESSAGES.CAMPAIGNS_LOAD_ERROR);
    } finally {
      setIsLoading(false);
    }
  }, [campaignId, preselectedNeedId, setValue]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  /**
   * Entrada: data: formulario validado de donacion.
   * Proceso: Envia POST /donations y redirige a mis donaciones.
   * Salida: No retorna valor.
   */
  async function onSubmit(data: CreateDonationFormData) {
    setApiError('');
    try {
      const created = await donationsService.createDonation({
        needId: data.needId,
        quantity: data.quantity,
        notes: data.notes || undefined,
        initialMessage: data.initialMessage || undefined,
        estimatedDeliveryAt: toIsoDateTime(data.estimatedDeliveryAt) ?? undefined,
      });
      navigate(`/my-donations/${created.id}`);
    } catch (error) {
      setApiError(parseApiError(error).message || UI_MESSAGES.DONATIONS_LOAD_ERROR);
    }
  }

  if (isLoading) {
    return <p className="text-text-secondary">{UI_MESSAGES.LOADING}</p>;
  }

  if (!campaign) {
    return (
      <EmptyState
        title={apiError || UI_MESSAGES.CAMPAIGNS_NOT_FOUND}
        onRetry={() => void loadData()}
      />
    );
  }

  if (needs.length === 0) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <EmptyState title={UI_MESSAGES.CAMPAIGNS_NO_NEEDS} />
        <Link to={`/campaigns/${campaign.id}`} className={buttonLinkClass({ variant: 'secondary' })}>
          {UI_MESSAGES.CAMPAIGNS_BACK}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-text-primary">
          {UI_MESSAGES.DONATIONS_CONTRIBUTE_TITLE}
        </h1>
        <p className="mt-2 text-text-secondary">{UI_MESSAGES.DONATIONS_CONTRIBUTE_DESC}</p>
        <p className="mt-1 text-sm font-medium text-vivid-700">{campaign.title}</p>
      </header>

      <Card glass={false} className="border border-primary-200 bg-primary-50/50 p-4">
        <p className="text-sm text-text-secondary">{UI_MESSAGES.DONATIONS_INITIAL_MESSAGE_HINT}</p>
      </Card>

      <Card glass={false}>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex flex-col gap-1.5">
            <label className="text-label" htmlFor="donation-need">
              {UI_MESSAGES.DONATIONS_NEED}
            </label>
            <select
              id="donation-need"
              className="w-full rounded-[var(--radius-sm)] border border-border-default bg-white/60 px-4 py-3 text-base"
              {...register('needId')}
            >
              {needs.map((need) => (
                <option key={need.id} value={need.id}>
                  {need.name} ({need.quantity - need.fulfilledQuantity} {need.unit})
                </option>
              ))}
            </select>
            {errors.needId?.message && (
              <p className="text-sm text-error-500">{errors.needId.message}</p>
            )}
          </div>
          <Input
            label={UI_MESSAGES.DONATIONS_QUANTITY}
            type="number"
            min={1}
            error={errors.quantity?.message}
            {...register('quantity')}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-label" htmlFor="donation-notes">
              {UI_MESSAGES.DONATIONS_NOTES}
            </label>
            <textarea
              id="donation-notes"
              rows={3}
              className="w-full rounded-[var(--radius-sm)] border border-border-default bg-white/60 px-4 py-3 text-base"
              {...register('notes')}
            />
            {errors.notes?.message && (
              <p className="text-sm text-error-500">{errors.notes.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-label" htmlFor="donation-initial-message">
              {UI_MESSAGES.DONATIONS_INITIAL_MESSAGE}
            </label>
            <textarea
              id="donation-initial-message"
              rows={3}
              className="w-full rounded-[var(--radius-sm)] border border-border-default bg-white/60 px-4 py-3 text-base"
              {...register('initialMessage')}
            />
            {errors.initialMessage?.message && (
              <p className="text-sm text-error-500">{errors.initialMessage.message}</p>
            )}
          </div>
          <Input
            label={UI_MESSAGES.DONATIONS_ESTIMATED_DATE}
            type="datetime-local"
            error={errors.estimatedDeliveryAt?.message}
            {...register('estimatedDeliveryAt')}
          />
          {apiError && (
            <p className="text-sm text-error-500" role="alert">
              {apiError}
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            <Button type="submit" isLoading={isSubmitting}>
              {UI_MESSAGES.DONATIONS_SUBMIT}
            </Button>
            <Link
              to={`/campaigns/${campaign.id}`}
              className={buttonLinkClass({ variant: 'secondary' })}
            >
              {UI_MESSAGES.CAMPAIGNS_BACK}
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
