import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { UI_MESSAGES } from '@/constants/messages.constants';
import {
  updateFoundationStatusSchema,
  type UpdateFoundationStatusFormData,
} from '@/features/foundations/validations/foundations.validations';
import type { FoundationDetail, FoundationStatus } from '@/features/foundations/types/foundations.types';
import { FoundationObservationHistory } from '@/features/foundations/components/FoundationObservationHistory';

interface FoundationAdminReviewPanelProps {
  foundation: FoundationDetail;
  isProcessing?: boolean;
  onUpdateStatus: (payload: UpdateFoundationStatusFormData) => Promise<void>;
}

type PendingAction = FoundationStatus | 'REQUEST_INFO' | null;

const CONFIRM_COPY: Record<
  Exclude<PendingAction, null>,
  { title: string; description: string; confirmLabel: string }
> = {
  VERIFIED: {
    title: UI_MESSAGES.FOUNDATIONS_CONFIRM_APPROVE_TITLE,
    description: UI_MESSAGES.FOUNDATIONS_CONFIRM_APPROVE_DESC,
    confirmLabel: UI_MESSAGES.FOUNDATIONS_APPROVE,
  },
  REJECTED: {
    title: UI_MESSAGES.FOUNDATIONS_CONFIRM_REJECT_TITLE,
    description: UI_MESSAGES.FOUNDATIONS_CONFIRM_REJECT_DESC,
    confirmLabel: UI_MESSAGES.FOUNDATIONS_REJECT,
  },
  SUSPENDED: {
    title: UI_MESSAGES.FOUNDATIONS_CONFIRM_SUSPEND_TITLE,
    description: UI_MESSAGES.FOUNDATIONS_CONFIRM_SUSPEND_DESC,
    confirmLabel: UI_MESSAGES.FOUNDATIONS_SUSPEND,
  },
  PENDING: {
    title: UI_MESSAGES.FOUNDATIONS_CONFIRM_PENDING_TITLE,
    description: UI_MESSAGES.FOUNDATIONS_CONFIRM_PENDING_DESC,
    confirmLabel: UI_MESSAGES.FOUNDATIONS_RETURN_PENDING,
  },
  REQUEST_INFO: {
    title: UI_MESSAGES.FOUNDATIONS_REQUEST_INFO,
    description: UI_MESSAGES.FOUNDATIONS_REQUEST_INFO_DESC,
    confirmLabel: UI_MESSAGES.FOUNDATIONS_REQUEST_INFO,
  },
};

/**
 * Entrada: foundation: detalle seleccionado; onUpdateStatus: callback admin.
 * Proceso: Renderiza acciones de revision administrativa con confirmacion y observaciones.
 * Salida: Retorna el elemento JSX del panel de revision admin.
 */
export function FoundationAdminReviewPanel({
  foundation,
  isProcessing = false,
  onUpdateStatus,
}: FoundationAdminReviewPanelProps) {
  const [actionError, setActionError] = useState('');
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const {
    register,
    getValues,
    formState: { errors },
  } = useForm<UpdateFoundationStatusFormData>({
    resolver: zodResolver(updateFoundationStatusSchema),
    defaultValues: {
      status: foundation.status,
      rejectionReason: foundation.rejectionReason ?? '',
      adminNotes: '',
    },
  });

  /**
   * Entrada: status: nuevo estado administrativo a aplicar.
   * Proceso: Valida motivo de rechazo si aplica y delega actualizacion al callback padre.
   * Salida: No retorna valor; cierra dialogo pendiente tras exito.
   */
  const executeAction = async (status: FoundationStatus) => {
    const data = getValues();

    if (status === 'REJECTED' && !data.rejectionReason?.trim()) {
      setActionError(UI_MESSAGES.FOUNDATIONS_REJECTION_REASON_REQUIRED);
      return;
    }

    await onUpdateStatus({
      ...data,
      status,
      rejectionReason: status === 'REJECTED' ? data.rejectionReason?.trim() ?? null : null,
      adminNotes: data.adminNotes?.trim() || null,
    });
    setPendingAction(null);
  };

  /**
   * Entrada: Ninguna (lee adminNotes del formulario).
   * Proceso: Solicita informacion adicional devolviendo la fundacion a estado PENDING.
   * Salida: No retorna valor; cierra dialogo pendiente tras exito.
   */
  const executeRequestInfo = async () => {
    const data = getValues();

    if (!data.adminNotes?.trim()) {
      setActionError(UI_MESSAGES.FOUNDATIONS_REQUEST_INFO_NOTES_REQUIRED);
      return;
    }

    await onUpdateStatus({
      ...data,
      status: 'PENDING',
      adminNotes: data.adminNotes.trim(),
    });
    setPendingAction(null);
  };

  /**
   * Entrada: Ninguna (usa pendingAction del estado local).
   * Proceso: Ejecuta la accion administrativa confirmada o solicitud de informacion.
   * Salida: No retorna valor; delega en executeAction o executeRequestInfo.
   */
  const handleConfirm = async () => {
    setActionError('');

    try {
      if (pendingAction === 'REQUEST_INFO') {
        await executeRequestInfo();
        return;
      }

      if (pendingAction) {
        await executeAction(pendingAction);
      }
    } catch {
      return;
    }
  };

  return (
    <div className="space-y-4 border-t border-border-default pt-4">
      <div className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
        <p className="font-semibold">{UI_MESSAGES.FOUNDATIONS_CURRENT_STATUS}</p>
        <p className="mt-1">
          {UI_MESSAGES.FOUNDATIONS_REGISTERED_AT}:{' '}
          {new Date(foundation.createdAt).toLocaleDateString('es-CO')}
        </p>
      </div>

      <form className="space-y-3" onSubmit={(event) => event.preventDefault()}>
        {actionError && <p className="text-xs text-red-600">{actionError}</p>}
        {foundation.status === 'REJECTED' && foundation.rejectionReason && (
          <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            <p className="font-semibold">{UI_MESSAGES.FOUNDATIONS_REJECTION_REASON}</p>
            <p className="mt-1">{foundation.rejectionReason}</p>
          </div>
        )}

        <div>
          <label className="mb-1 block text-xs font-medium text-text-secondary">
            {UI_MESSAGES.FOUNDATIONS_ADMIN_NOTES}
          </label>
          <textarea
            rows={3}
            className="w-full rounded-lg border border-border-default px-3 py-2 text-sm"
            {...register('adminNotes')}
          />
          {errors.adminNotes?.message && (
            <p className="mt-1 text-xs text-red-600">{errors.adminNotes.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-text-secondary">
            {UI_MESSAGES.FOUNDATIONS_REJECTION_REASON}
          </label>
          <textarea
            rows={2}
            className="w-full rounded-lg border border-border-default px-3 py-2 text-sm"
            {...register('rejectionReason')}
          />
          {errors.rejectionReason?.message && (
            <p className="mt-1 text-xs text-red-600">{errors.rejectionReason.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          {foundation.status !== 'VERIFIED' && (
            <Button type="button" isLoading={isProcessing} fullWidth onClick={() => setPendingAction('VERIFIED')}>
              {UI_MESSAGES.FOUNDATIONS_APPROVE}
            </Button>
          )}
          {foundation.status !== 'REJECTED' && (
            <Button
              type="button"
              variant="secondary"
              isLoading={isProcessing}
              fullWidth
              onClick={() => setPendingAction('REJECTED')}
            >
              {UI_MESSAGES.FOUNDATIONS_REJECT}
            </Button>
          )}
          {foundation.status === 'VERIFIED' && (
            <Button
              type="button"
              variant="secondary"
              isLoading={isProcessing}
              fullWidth
              onClick={() => setPendingAction('SUSPENDED')}
            >
              {UI_MESSAGES.FOUNDATIONS_SUSPEND}
            </Button>
          )}
          {foundation.status !== 'PENDING' && (
            <Button
              type="button"
              variant="secondary"
              isLoading={isProcessing}
              fullWidth
              onClick={() => setPendingAction('PENDING')}
            >
              {UI_MESSAGES.FOUNDATIONS_RETURN_PENDING}
            </Button>
          )}
          <Button
            type="button"
            variant="secondary"
            isLoading={isProcessing}
            fullWidth
            onClick={() => setPendingAction('REQUEST_INFO')}
          >
            {UI_MESSAGES.FOUNDATIONS_REQUEST_INFO}
          </Button>
        </div>
      </form>

      <FoundationObservationHistory observations={foundation.observations} />

      {pendingAction && (
        <ConfirmDialog
          title={CONFIRM_COPY[pendingAction].title}
          description={CONFIRM_COPY[pendingAction].description}
          confirmLabel={CONFIRM_COPY[pendingAction].confirmLabel}
          isProcessing={isProcessing}
          onConfirm={() => void handleConfirm()}
          onCancel={() => setPendingAction(null)}
        />
      )}
    </div>
  );
}
