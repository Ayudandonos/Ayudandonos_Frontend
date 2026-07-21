import { Card } from '@/components/ui/Card';
import { AppImage } from '@/components/ui/AppImage';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { UI_MESSAGES } from '@/constants/messages.constants';
import type { AdminFeaturedCampaignItem } from '@/features/admin/types/admin.types';

interface AdminFeaturedCampaignsPanelProps {
  campaigns: AdminFeaturedCampaignItem[];
}

/**
 * Entrada: campaigns: listado de campanas destacadas para el panel lateral.
 * Proceso: Renderiza tarjeta principal y listado compacto con barras de progreso.
 * Salida: Retorna el elemento JSX del panel de campanas destacadas.
 */
export function AdminFeaturedCampaignsPanel({ campaigns }: AdminFeaturedCampaignsPanelProps) {
  if (campaigns.length === 0) {
    return null;
  }

  const [primary, ...rest] = campaigns;

  return (
    <Card glass={false} className="border border-border-default bg-white p-0">
      <div className="border-b border-border-default px-6 py-4">
        <h2 className="text-heading text-text-primary">{UI_MESSAGES.ADMIN_FEATURED_CAMPAIGNS_TITLE}</h2>
      </div>

      {primary && (
        <div className="space-y-4 p-6">
          {primary.imageUrl && (
            <div className="overflow-hidden rounded-lg">
              <AppImage
                src={primary.imageUrl}
                alt=""
                className="aspect-video w-full object-cover"
              />
            </div>
          )}
          {primary.isPrimary && (
            <span className="inline-flex rounded-full bg-vivid-100 px-2 py-0.5 text-[10px] font-bold uppercase text-vivid-700">
              {UI_MESSAGES.ADMIN_FEATURED_PRIMARY_BADGE}
            </span>
          )}
          <div>
            <h3 className="text-subheading text-text-primary">{primary.title}</h3>
            <p className="mt-2 text-sm text-text-secondary line-clamp-2">{primary.description}</p>
          </div>
          <ProgressBar value={primary.progressPercent} max={100} label={UI_MESSAGES.ADMIN_FEATURED_PROGRESS} />
          {primary.daysRemaining != null && (
            <p className="text-xs text-text-muted">
              {UI_MESSAGES.ADMIN_FEATURED_DAYS_REMAINING(primary.daysRemaining)}
            </p>
          )}
        </div>
      )}

      {rest.length > 0 && (
        <ul className="divide-y divide-border-default border-t border-border-default px-6 py-2">
          {rest.map((campaign) => (
            <li key={campaign.id} className="py-4">
              <p className="text-sm font-medium text-text-primary">{campaign.title}</p>
              <ProgressBar
                className="mt-2"
                value={campaign.progressPercent}
                max={100}
                label={UI_MESSAGES.ADMIN_FEATURED_PROGRESS}
              />
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
