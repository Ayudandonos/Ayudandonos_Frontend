import { UI_MESSAGES } from '@/constants/messages.constants';
import { cn } from '@/utils/cn';
import type { CampaignStatus } from '@/features/campaigns/types/campaigns.types';

const STATUS_STYLES: Record<CampaignStatus, string> = {
  DRAFT: 'bg-secondary-100 text-secondary-700',
  PUBLISHED: 'bg-success-500/15 text-success-600',
  FINISHED: 'bg-primary-100 text-primary-700',
  CANCELLED: 'bg-error-500/15 text-error-600',
};

const STATUS_LABELS: Record<CampaignStatus, string> = {
  DRAFT: UI_MESSAGES.CAMPAIGNS_STATUS_DRAFT,
  PUBLISHED: UI_MESSAGES.CAMPAIGNS_STATUS_PUBLISHED,
  FINISHED: UI_MESSAGES.CAMPAIGNS_STATUS_FINISHED,
  CANCELLED: UI_MESSAGES.CAMPAIGNS_STATUS_CANCELLED,
};

interface CampaignStatusBadgeProps {
  status: CampaignStatus;
}

/**
 * Entrada: status: estado de la campana.
 * Proceso: Mapea estado a etiqueta y estilo visual.
 * Salida: Retorna badge JSX del estado.
 */
export function CampaignStatusBadge({ status }: CampaignStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold',
        STATUS_STYLES[status],
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
