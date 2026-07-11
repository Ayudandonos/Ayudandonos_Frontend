import { Button } from '@/components/ui/Button';
import { UI_MESSAGES } from '@/constants/messages.constants';

interface ConfirmDialogProps {
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  isProcessing?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Entrada: title, description, labels y callbacks de confirmacion/cancelacion.
 * Proceso: Renderiza dialogo modal accesible para confirmar acciones destructivas.
 * Salida: Retorna el elemento JSX del dialogo de confirmacion.
 */
export function ConfirmDialog({
  title,
  description,
  confirmLabel,
  cancelLabel = UI_MESSAGES.COMMON_CANCEL,
  isProcessing = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="w-full max-w-md rounded-xl border border-border-default bg-white p-6 shadow-xl">
        <h3 id="confirm-dialog-title" className="text-lg font-bold text-text-primary">
          {title}
        </h3>
        <p className="mt-2 text-sm text-text-secondary">{description}</p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onCancel} disabled={isProcessing}>
            {cancelLabel}
          </Button>
          <Button type="button" onClick={onConfirm} isLoading={isProcessing}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
