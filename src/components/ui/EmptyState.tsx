import { Button } from '@/components/ui/Button';
import { UI_MESSAGES } from '@/constants/messages.constants';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  onRetry?: () => void;
}

/**
 * Entrada: title, description y acciones opcionales.
 * Proceso: Renderiza estado vacio o de error con CTA opcional.
 * Salida: Retorna el elemento JSX del empty state.
 */
export function EmptyState({ title, description, actionLabel, onAction, onRetry }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border-default bg-white/70 px-6 py-12 text-center">
      <p className="text-lg font-semibold text-text-primary">{title}</p>
      {description && <p className="mt-2 max-w-md text-sm text-text-secondary">{description}</p>}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {onAction && actionLabel && (
          <Button type="button" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
        {onRetry && (
          <Button type="button" variant="secondary" onClick={onRetry}>
            {UI_MESSAGES.EMPTY_STATE_RETRY}
          </Button>
        )}
      </div>
    </div>
  );
}
