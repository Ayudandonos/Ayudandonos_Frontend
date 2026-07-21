import { Link } from 'react-router-dom';
import { AppImage } from '@/components/ui/AppImage';
import { buttonLinkClass } from '@/components/ui/button-link-class';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { CampaignStatusBadge } from '@/features/campaigns/components/CampaignStatusBadge';
import type { Campaign } from '@/features/campaigns/types/campaigns.types';
import { formatDate } from '@/utils/date-format';

interface CampaignCardProps {
  campaign: Campaign;
  needsCount?: number;
  progressPercent?: number;
  showFoundation?: boolean;
}

/**
 * Entrada: campaign y metricas opcionales de necesidades.
 * Proceso: Renderiza tarjeta publica/listado con datos esenciales y CTA.
 * Salida: Retorna el elemento JSX de la tarjeta.
 */
export function CampaignCard({
  campaign,
  needsCount = 0,
  progressPercent = 0,
  showFoundation = true,
}: CampaignCardProps) {
  return (
    <Card
      glass={false}
      className="overflow-hidden border border-border-default bg-white p-0 transition-smooth hover:shadow-md"
    >
      <div className="aspect-[16/9] bg-vivid-100">
        {campaign.imageUrl ? (
          <AppImage src={campaign.imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-text-muted">
            {UI_MESSAGES.FOUNDATIONS_LOGO_PLACEHOLDER}
          </div>
        )}
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-text-primary">{campaign.title}</h3>
          <CampaignStatusBadge status={campaign.status} />
        </div>
        {showFoundation && (
          <p className="text-sm text-text-secondary">
            {campaign.foundation.name}
            {campaign.foundation.city ? ` · ${campaign.foundation.city}` : ''}
          </p>
        )}
        <ProgressBar value={progressPercent} max={100} label={UI_MESSAGES.CAMPAIGNS_PROGRESS} />
        <p className="text-xs text-text-muted">
          {UI_MESSAGES.CAMPAIGNS_NEEDS_COUNT(needsCount)} · {UI_MESSAGES.CAMPAIGNS_END}:{' '}
          {formatDate(campaign.endDate)}
        </p>
        <Link
          to={`/campaigns/${campaign.id}`}
          className={buttonLinkClass({ variant: 'secondary', size: 'sm', fullWidth: true })}
        >
          {UI_MESSAGES.CAMPAIGNS_VIEW}
        </Link>
      </div>
    </Card>
  );
}
