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

type DraftNeed = CampaignNeedFormData & { localId: string };

/**
 * Entrada: Ninguna.
 * Proceso: Crea campana (DRAFT o PUBLISHED), luego POST /needs por cada necesidad del formulario.
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
   * Proceso: POST campana, POST needs en secuencia y navega a edicion.
   * Salida: No retorna valor.
   */
  async function submitCampaign(data: CampaignFormData, publish: boolean) {
    setApiError('');
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

      navigate(`/foundation/campaigns/${created.id}/edit`);
    } catch (submitError) {
      setApiError(parseApiError(submitError).message || UI_MESSAGES.CAMPAIGNS_LOAD_ERROR);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold text-text-primary">{UI_MESSAGES.CAMPAIGNS_CREATE_TITLE}</h1>
        <Link
          to="/foundation/campaigns"
          className={buttonLinkClass({ variant: 'secondary', size: 'sm' })}
        >
          {UI_MESSAGES.CAMPAIGNS_BACK}
        </Link>
      </div>

      <Card glass={false} className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">{UI_MESSAGES.NEEDS_TITLE}</h2>
          <p className="mt-1 text-sm text-text-secondary">{UI_MESSAGES.CAMPAIGNS_CREATE_NEEDS_HINT}</p>
        </div>

        {draftNeeds.length > 0 && (
          <ul className="space-y-2">
            {draftNeeds.map((need) => (
              <li
                key={need.localId}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border-default px-3 py-2"
              >
                <span className="text-sm text-text-primary">
                  {need.name} — {need.quantity} {need.unit}
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

        <form className="grid gap-3 sm:grid-cols-2" onSubmit={handleNeedSubmit(addDraftNeed)} noValidate>
          <Input label={UI_MESSAGES.NEEDS_FORM_NAME} error={needErrors.name?.message} {...register('name')} />
          <Input label={UI_MESSAGES.NEEDS_FORM_UNIT} error={needErrors.unit?.message} {...register('unit')} />
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
            <Button type="submit" variant="secondary" size="sm">
              {UI_MESSAGES.NEEDS_ADD}
            </Button>
          </div>
        </form>
      </Card>

      <Card glass={false}>
        <CampaignForm
          apiError={apiError}
          submitLabel={
            isSaving ? UI_MESSAGES.LOADING : UI_MESSAGES.CAMPAIGNS_SAVE_DRAFT
          }
          onSubmit={(data) => submitCampaign(data, false)}
          secondaryAction={{
            label: UI_MESSAGES.CAMPAIGNS_PUBLISH,
            onClick: (data) => submitCampaign(data, true),
          }}
        />
      </Card>
    </div>
  );
}
