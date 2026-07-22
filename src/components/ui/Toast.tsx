import { Icon } from '@/components/ui/Icon';
import { UI_MESSAGES } from '@/constants/messages.constants';
import type { ToastItem, ToastVariant } from '@/context/toast-context';
import { cn } from '@/utils/cn';

interface ToastViewportProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

const VARIANT_STYLES: Record<ToastVariant, string> = {
  info: 'border-primary-200 bg-white text-primary-800',
  danger: 'border-error-500/30 bg-white text-error-600',
  success: 'border-success-500/30 bg-white text-success-600',
  warning: 'border-warning-500/40 bg-white text-warning-600',
  neutral: 'border-border-default bg-white text-text-primary',
};

const VARIANT_LABELS: Record<ToastVariant, string> = {
  info: UI_MESSAGES.ALERT_INFO,
  danger: UI_MESSAGES.ALERT_DANGER,
  success: UI_MESSAGES.ALERT_SUCCESS,
  warning: UI_MESSAGES.ALERT_WARNING,
  neutral: UI_MESSAGES.ALERT_NEUTRAL,
};

/**
 * Entrada: toast: item de la cola.
 * Proceso: Renderiza una tarjeta flotante descartable con estilo semantico.
 * Salida: Retorna el elemento JSX del toast.
 */
function ToastCard({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-[var(--radius-md)] border p-4 text-sm shadow-lg',
        'animate-toast-in',
        VARIANT_STYLES[toast.variant],
      )}
    >
      <Icon name="info" size="sm" className="mt-0.5 shrink-0" decorative />
      <span className="sr-only">{VARIANT_LABELS[toast.variant]}</span>
      <div className="min-w-0 flex-1">
        {toast.title ? <p className="font-medium text-text-primary">{toast.title}</p> : null}
        <p className={cn(toast.title ? 'mt-0.5 text-text-secondary' : undefined)}>{toast.message}</p>
      </div>
      <button
        type="button"
        className="shrink-0 text-xs font-medium text-text-muted transition-colors hover:text-text-primary"
        onClick={() => onDismiss(toast.id)}
        aria-label={UI_MESSAGES.COMMON_CLOSE}
      >
        {UI_MESSAGES.COMMON_CLOSE}
      </button>
    </div>
  );
}

/**
 * Entrada: toasts: cola activa; onDismiss: callback de cierre.
 * Proceso: Fija el contenedor arriba a la derecha sobre toda la UI.
 * Salida: Retorna el viewport de toasts o null si no hay items.
 */
export function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[min(100%-2rem,24rem)] flex-col gap-2"
      aria-label={UI_MESSAGES.TOAST_REGION_LABEL}
    >
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
