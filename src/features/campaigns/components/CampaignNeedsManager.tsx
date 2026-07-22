import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { useToast } from '@/context/useToast';
import { campaignsService } from '@/features/campaigns/services/campaigns.service';
import type { CampaignNeed } from '@/features/campaigns/types/campaigns.types';
import {
  campaignNeedFormSchema,
  type CampaignNeedFormData,
} from '@/features/campaigns/validations/campaigns.validations';
import { parseApiError } from '@/utils/api-error';
import { needProgressPercent } from '@/utils/date-format';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

interface CampaignNeedsManagerProps {
  campaignId: string;
}

const PRIORITY_LABELS = {
  LOW: UI_MESSAGES.NEEDS_PRIORITY_LOW,
  MEDIUM: UI_MESSAGES.NEEDS_PRIORITY_MEDIUM,
  HIGH: UI_MESSAGES.NEEDS_PRIORITY_HIGH,
} as const;

/**
 * Entrada: campaignId: UUID de la campana.
 * Proceso: Lista y gestiona CRUD de necesidades via campaigns.service.
 * Salida: Retorna el elemento JSX del gestor de necesidades.
 */
export function CampaignNeedsManager({ campaignId }: CampaignNeedsManagerProps) {
  const { pushToast } = useToast();
  const [needs, setNeeds] = useState<CampaignNeed[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CampaignNeedFormData>({
    resolver: zodResolver(campaignNeedFormSchema),
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
   * Proceso: Carga necesidades de la campana desde la API.
   * Salida: No retorna valor; actualiza listado y estados de UI.
   */
  const loadNeeds = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await campaignsService.fetchCampaignNeeds(campaignId);
      setNeeds(result.data.items);
    } catch (loadError) {
      setError(parseApiError(loadError).message || UI_MESSAGES.NEEDS_LOAD_ERROR);
    } finally {
      setIsLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    void loadNeeds();
  }, [loadNeeds]);

  /**
   * Entrada: need: necesidad a editar o null para crear.
   * Proceso: Prellena o limpia el formulario y lo muestra.
   * Salida: No retorna valor.
   */
  function openForm(need?: CampaignNeed) {
    setError('');
    if (need) {
      setEditingId(need.id);
      reset({
        name: need.name,
        description: need.description ?? '',
        quantity: need.quantity,
        unit: need.unit,
        priority: need.priority,
      });
    } else {
      setEditingId(null);
      reset({
        name: '',
        description: '',
        quantity: 1,
        unit: '',
        priority: 'MEDIUM',
      });
    }
    setShowForm(true);
  }

  /**
   * Entrada: data: datos validados del formulario.
   * Proceso: Crea o actualiza la necesidad segun editingId.
   * Salida: No retorna valor; recarga listado.
   */
  async function onSubmit(data: CampaignNeedFormData) {
    setError('');
    try {
      const payload = {
        name: data.name,
        description: data.description || null,
        quantity: data.quantity,
        unit: data.unit,
        priority: data.priority,
      };
      if (editingId) {
        await campaignsService.updateCampaignNeed(editingId, payload);
        pushToast({ variant: 'success', message: UI_MESSAGES.NEEDS_UPDATED });
      } else {
        await campaignsService.createCampaignNeed({ ...payload, campaignId });
        pushToast({ variant: 'success', message: UI_MESSAGES.NEEDS_CREATED });
      }
      setShowForm(false);
      setEditingId(null);
      await loadNeeds();
    } catch (submitError) {
      const message = parseApiError(submitError).message || UI_MESSAGES.NEEDS_LOAD_ERROR;
      setError(message);
      pushToast({ variant: 'danger', message });
    }
  }

  /**
   * Entrada: Ninguna.
   * Proceso: Elimina la necesidad seleccionada tras confirmacion.
   * Salida: No retorna valor; recarga listado.
   */
  async function confirmDelete() {
    if (!deleteId) return;
    setIsDeleting(true);
    setError('');
    try {
      await campaignsService.deleteCampaignNeed(deleteId);
      pushToast({ variant: 'success', message: UI_MESSAGES.NEEDS_DELETED });
      setDeleteId(null);
      await loadNeeds();
    } catch (deleteError) {
      const message = parseApiError(deleteError).message || UI_MESSAGES.NEEDS_LOAD_ERROR;
      setError(message);
      pushToast({ variant: 'danger', message });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <section className="space-y-4 rounded-xl border border-border-default bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-text-primary">{UI_MESSAGES.NEEDS_TITLE}</h2>
        <Button type="button" size="sm" onClick={() => openForm()}>
          {UI_MESSAGES.NEEDS_ADD}
        </Button>
      </div>

      {error ? (
        <p className="text-sm text-error-600" role="alert">
          {error}
        </p>
      ) : null}

      {showForm && (
        <form className="space-y-4 rounded-lg border border-border-default bg-vivid-50/50 p-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <h3 className="font-semibold text-text-primary">
            {editingId ? UI_MESSAGES.NEEDS_EDIT : UI_MESSAGES.NEEDS_ADD}
          </h3>
          <Input label={UI_MESSAGES.NEEDS_FORM_NAME} error={errors.name?.message} {...register('name')} />
          <div className="flex flex-col gap-1.5">
            <label className="text-label" htmlFor="need-description">
              {UI_MESSAGES.NEEDS_FORM_DESCRIPTION}
            </label>
            <textarea
              id="need-description"
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
              <label className="text-label" htmlFor="need-priority">
                {UI_MESSAGES.NEEDS_FORM_PRIORITY}
              </label>
              <select
                id="need-priority"
                className="w-full rounded-[var(--radius-sm)] border border-border-default bg-white/60 px-4 py-3 text-base"
                {...register('priority')}
              >
                <option value="LOW">{PRIORITY_LABELS.LOW}</option>
                <option value="MEDIUM">{PRIORITY_LABELS.MEDIUM}</option>
                <option value="HIGH">{PRIORITY_LABELS.HIGH}</option>
              </select>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="submit" isLoading={isSubmitting}>
              {editingId ? UI_MESSAGES.CAMPAIGNS_SAVE_CHANGES : UI_MESSAGES.NEEDS_ADD}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
              {UI_MESSAGES.COMMON_CANCEL}
            </Button>
          </div>
        </form>
      )}

      {isLoading && <p className="text-sm text-text-muted">{UI_MESSAGES.LOADING}</p>}

      {!isLoading && needs.length === 0 && (
        <EmptyState title={UI_MESSAGES.NEEDS_EMPTY} />
      )}

      {!isLoading && needs.length > 0 && (
        <ul className="space-y-3">
          {needs.map((need) => {
            const progress = needProgressPercent(need.fulfilledQuantity, need.quantity);
            return (
              <li
                key={need.id}
                className="rounded-lg border border-border-default bg-white p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-text-primary">{need.name}</p>
                    <p className="text-sm text-text-secondary">
                      {UI_MESSAGES.NEEDS_REQUIRED}: {need.quantity} {need.unit} ·{' '}
                      {UI_MESSAGES.NEEDS_FULFILLED}: {need.fulfilledQuantity} ·{' '}
                      {PRIORITY_LABELS[need.priority]}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" size="sm" variant="secondary" onClick={() => openForm(need)}>
                      {UI_MESSAGES.CAMPAIGNS_EDIT}
                    </Button>
                    <Button type="button" size="sm" variant="secondary" onClick={() => setDeleteId(need.id)}>
                      {UI_MESSAGES.NEEDS_DELETE}
                    </Button>
                  </div>
                </div>
                <ProgressBar className="mt-3" value={progress} max={100} />
              </li>
            );
          })}
        </ul>
      )}

      {deleteId && (
        <ConfirmDialog
          title={UI_MESSAGES.NEEDS_CONFIRM_DELETE_TITLE}
          description={UI_MESSAGES.NEEDS_CONFIRM_DELETE_DESC}
          confirmLabel={UI_MESSAGES.NEEDS_DELETE}
          isProcessing={isDeleting}
          onConfirm={() => void confirmDelete()}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </section>
  );
}
