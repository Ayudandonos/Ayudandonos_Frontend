import { UI_MESSAGES } from '@/constants/messages.constants';
import type { DonationStatus } from '@/features/donations/types/donations.types';
import { cn } from '@/utils/cn';

export const DONATION_STATUS_LABELS: Record<DonationStatus, string> = {
  COMMITTED: UI_MESSAGES.DONATIONS_STATUS_COMMITTED,
  IN_TRANSIT: UI_MESSAGES.DONATIONS_STATUS_IN_TRANSIT,
  DELIVERED: UI_MESSAGES.DONATIONS_STATUS_DELIVERED,
  CONFIRMED: UI_MESSAGES.DONATIONS_STATUS_CONFIRMED,
  CANCELLED: UI_MESSAGES.DONATIONS_STATUS_CANCELLED,
};

const STATUS_STYLES: Record<DonationStatus, string> = {
  COMMITTED: 'bg-vivid-200 text-vivid-700',
  IN_TRANSIT: 'bg-secondary-100 text-secondary-700',
  DELIVERED: 'bg-primary-100 text-primary-700',
  CONFIRMED: 'bg-success-500/15 text-success-600',
  CANCELLED: 'bg-error-500/15 text-error-600',
};

interface DonationStatusBadgeProps {
  status: DonationStatus;
}

/**
 * Entrada: status: estado de donacion.
 * Proceso: Mapea estado a etiqueta UI_MESSAGES y estilo visual.
 * Salida: Retorna badge JSX del estado.
 */
export function DonationStatusBadge({ status }: DonationStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold',
        STATUS_STYLES[status],
      )}
    >
      {DONATION_STATUS_LABELS[status]}
    </span>
  );
}
