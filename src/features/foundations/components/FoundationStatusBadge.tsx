import { cn } from '@/utils/cn';
import { UI_MESSAGES } from '@/constants/messages.constants';
import type { FoundationStatus } from '@/features/foundations/types/foundations.types';

interface FoundationStatusBadgeProps {
  status: FoundationStatus;
  className?: string;
}

const STATUS_STYLES: Record<FoundationStatus, string> = {
  VERIFIED: 'bg-vivid-100 text-vivid-700',
  PENDING: 'bg-amber-100 text-amber-800',
  REJECTED: 'bg-red-100 text-red-700',
  SUSPENDED: 'bg-secondary-100 text-secondary-700',
};

const STATUS_LABELS: Record<FoundationStatus, string> = {
  VERIFIED: UI_MESSAGES.FOUNDATIONS_STATUS_VERIFIED,
  PENDING: UI_MESSAGES.FOUNDATIONS_STATUS_PENDING,
  REJECTED: UI_MESSAGES.FOUNDATIONS_STATUS_REJECTED,
  SUSPENDED: UI_MESSAGES.FOUNDATIONS_STATUS_SUSPENDED,
};

/**
 * Entrada: status: estado de verificacion de la fundacion.
 * Proceso: Renderiza badge semantico segun el enum FoundationStatus.
 * Salida: Retorna el elemento JSX del badge de estado.
 */
export function FoundationStatusBadge({ status, className }: FoundationStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
        STATUS_STYLES[status],
        className,
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
