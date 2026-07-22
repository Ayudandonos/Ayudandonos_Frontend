import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { buttonLinkClass } from '@/components/ui/button-link-class';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { CampaignForm } from '@/features/campaigns/components/CampaignForm';
import { campaignsService } from '@/features/campaigns/services/campaigns.service';
import { campaignFormToPayload } from '@/features/campaigns/utils/campaign-payload';
import type { CampaignFormData } from '@/features/campaigns/validations/campaigns.validations';
import {
  campaignNeedFormSchema,
  type CampaignNeedFormData,
} from '@/features/campaigns/validations/campaigns.validations';
import { parseApiError } from '@/utils/api-error';
import { redirectFoundationOnForbidden } from '@/utils/foundation-api-guard';

type DraftNeed = CampaignNeedFormData & { localId: string };

/**
 * Entrada: Ninguna.
 * Proceso: Formulario de fundacion: datos de campana, needs y publicar para habilitar donaciones.
 * Salida: Retorna el elemento JSX de crear campana.
 */
export function CreateCampaignPage() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  const [draftNeeds, setDraftNeeds] = useState<DraftNeed[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit: handleNeedSubmit,
    reset: resetNeedForm,
    formState: { errors: needErrors },
  } = useForm<CampaignNeedFormData>({
    resolver: zodResolver(campaignNeedFormSchema),
    defaultValues: {
      name: '',
      description: '',
      quantity: 1,
      unit: 'unidades',
      priority: 'MEDIUM',
    },
  });

  /**
   * Entrada: data: necesidad validada.
   * Proceso: Agrega la necesidad a la lista local previa al envio de la campana.
   * Salida: No retorna valor.
   */
  function addDraftNeed(data: CampaignNeedFormData) {
    setDraftNeeds((current) => [
      ...current,
      { ...data, localId: `${Date.now()}-${current.length}` },
    ]);
    resetNeedForm({
      name: '',
      description: '',
      quantity: 1,
      unit: 'unidades',
      priority: 'MEDIUM',
    });
    setApiError('');
  }

  /**
   * Entrada: localId: identificador temporal de la necesidad en borrador.
   * Proceso: Elimina la necesidad de la lista local.
   * Salida: No retorna valor.
   */
  function removeDraftNeed(localId: string) {
    setDraftNeeds((current) => current.filter((need) => need.localId !== localId));
  }

  /**
   * Entrada: data: formulario de campana; publish: si debe publicar al crear.
   * Proceso: Valida requisitos, POST campana, POST needs y redirige.
   * Salida: No retorna valor.
   */
  async function submitCampaign(data: CampaignFormData, publish: boolean) {
    setApiError('');

    if (publish) {
      if (!data.startDate?.trim() || !data.endDate?.trim()) {
        setApiError(UI_MESSAGES.CAMPAIGNS_PUBLISH_DATES_REQUIRED);
        return;
      }
      if (draftNeeds.length === 0) {
        setApiError(UI_MESSAGES.CAMPAIGNS_NEED_DRAFT_EMPTY);
        return;
      }
    }

    setIsSaving(true);
    try {
      const payload = {
        ...campaignFormToPayload(data),
        status: publish ? ('PUBLISHED' as const) : ('DRAFT' as const),
      };
      const created = await campaignsService.createCampaign(payload);

      for (const need of draftNeeds) {
        await campaignsService.createCampaignNeed({
          campaignId: created.id,
          name: need.name,
          description: need.description || null,
          quantity: need.quantity,
          unit: need.unit,
          priority: need.priority,
        });
      }

      if (publish) {
        navigate(`/campaigns/${created.id}`);
      } else {
        navigate(`/foundation/campaigns/${created.id}/edit`);
      }
    } catch (submitError) {
      if (redirectFoundationOnForbidden(submitError, navigate)) {
        return;
      }
      setApiError(parseApiError(submitError).message || UI_MESSAGES.CAMPAIGNS_LOAD_ERROR);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            {UI_MESSAGES.CAMPAIGNS_CREATE_TITLE}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {UI_MESSAGES.CAMPAIGNS_CREATE_SUCCESS_HINT}
          </p>
        </div>
        <Link
          to="/foundation/campaigns"
          className={buttonLinkClass({ variant: 'secondary', size: 'sm' })}
        >
          {UI_MESSAGES.CAMPAIGNS_BACK}
        </Link>
      </div>

      <Card glass={false}>
        <CampaignForm
          apiError={apiError}
          isLoading={isSaving}
          submitLabel={UI_MESSAGES.CAMPAIGNS_SAVE_DRAFT}
          onSubmit={(data) => submitCampaign(data, false)}
          secondaryAction={{
            label: UI_MESSAGES.CAMPAIGNS_PUBLISH,
            onClick: (data) => submitCampaign(data, true),
            disabled: draftNeeds.length === 0,
          }}
        >
          <div className="space-y-4 rounded-xl border border-border-default bg-vivid-50/40 p-4">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                {UI_MESSAGES.CAMPAIGNS_CREATE_STEP_NEEDS}
              </h2>
              <p className="mt-1 text-sm text-text-secondary">
                {UI_MESSAGES.CAMPAIGNS_CREATE_NEEDS_HINT}
              </p>
            </div>

            {draftNeeds.length > 0 && (
              <ul className="space-y-2">
                {draftNeeds.map((need) => (
                  <li
                    key={need.localId}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border-default bg-white px-3 py-2"
                  >
                    <span className="text-sm text-text-primary">
                      {need.name} — {need.quantity} {need.unit} ({need.priority})
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => removeDraftNeed(need.localId)}
                    >
                      {UI_MESSAGES.NEEDS_DELETE}
                    </Button>
                  </li>
                ))}
              </ul>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                label={UI_MESSAGES.NEEDS_FORM_NAME}
                error={needErrors.name?.message}
                {...register('name')}
              />
              <Input
                label={UI_MESSAGES.NEEDS_FORM_UNIT}
                error={needErrors.unit?.message}
                {...register('unit')}
              />
              <Input
                label={UI_MESSAGES.NEEDS_FORM_QUANTITY}
                type="number"
                min={1}
                error={needErrors.quantity?.message}
                {...register('quantity')}
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-label" htmlFor="need-priority">
                  {UI_MESSAGES.NEEDS_FORM_PRIORITY}
                </label>
                <select
                  id="need-priority"
                  className="h-11 w-full rounded-[var(--radius-sm)] border border-border-default bg-white/60 px-4 text-base"
                  {...register('priority')}
                >
                  <option value="LOW">{UI_MESSAGES.NEEDS_PRIORITY_LOW}</option>
                  <option value="MEDIUM">{UI_MESSAGES.NEEDS_PRIORITY_MEDIUM}</option>
                  <option value="HIGH">{UI_MESSAGES.NEEDS_PRIORITY_HIGH}</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <Input
                  label={UI_MESSAGES.NEEDS_FORM_DESCRIPTION}
                  error={needErrors.description?.message}
                  {...register('description')}
                />
              </div>
              <div className="sm:col-span-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => void handleNeedSubmit(addDraftNeed)()}
                >
                  {UI_MESSAGES.NEEDS_ADD}
                </Button>
              </div>
            </div>

            {draftNeeds.length === 0 && (
              <p className="text-xs text-text-muted">{UI_MESSAGES.CAMPAIGNS_NEED_DRAFT_EMPTY}</p>
            )}
          </div>
        </CampaignForm>
      </Card>
    </div>
  );
}
