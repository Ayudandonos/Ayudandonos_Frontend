import { Link } from 'react-router-dom';
import { AppImage } from '@/components/ui/AppImage';
import { Icon } from '@/components/ui/Icon';
import { buttonLinkClass } from '@/components/ui/button-link-class';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { CampaignStatusBadge } from '@/features/campaigns/components/CampaignStatusBadge';
import type { AdminCampaignListItem } from '@/features/admin/types/admin.types';
import { cn } from '@/utils/cn';

interface AdminCampaignsTableProps {
  items: AdminCampaignListItem[];
  selectedId?: string;
  onView: (campaign: AdminCampaignListItem) => void;
}

/**
 * Entrada: date: fecha ISO o null.
 * Proceso: Formatea fecha corta en espanol colombiano.
 * Salida: Retorna texto de fecha o guion.
 */
function formatDate(date: string | null): string {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Entrada: items, selectedId y onView.
 * Proceso: Renderiza tabla amigable de campanas alineada al listado de usuarios.
 * Salida: Retorna el elemento JSX de la tabla.
 */
export function AdminCampaignsTable({
  items,
  selectedId,
  onView,
}: AdminCampaignsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border-default/80 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-border-default/80 bg-primary-50/60 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">
              <th className="px-5 py-3.5">{UI_MESSAGES.ADMIN_CAMPAIGNS_TABLE_TITLE}</th>
              <th className="hidden px-5 py-3.5 md:table-cell">
                {UI_MESSAGES.ADMIN_CAMPAIGNS_TABLE_CREATOR}
              </th>
              <th className="hidden px-5 py-3.5 lg:table-cell">
                {UI_MESSAGES.ADMIN_CAMPAIGNS_TABLE_DONATIONS}
              </th>
              <th className="px-5 py-3.5">{UI_MESSAGES.ADMIN_CAMPAIGNS_TABLE_STATUS}</th>
              <th className="px-5 py-3.5 text-right">
                {UI_MESSAGES.ADMIN_CAMPAIGNS_TABLE_ACTIONS}
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((campaign) => {
              const isSelected = selectedId === campaign.id;
              const imageSrc = campaign.imageUrl?.trim() || undefined;
              const creatorInitial =
                campaign.createdBy.fullName.trim().charAt(0).toUpperCase() || '?';

              return (
                <tr
                  key={campaign.id}
                  className={cn(
                    'border-b border-border-default/60 transition-colors last:border-b-0',
                    isSelected ? 'bg-primary-50/70' : 'hover:bg-vivid-50/60',
                  )}
                >
                  <td className="px-5 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      {imageSrc ? (
                        <AppImage
                          src={imageSrc}
                          alt=""
                          className="h-11 w-11 shrink-0 rounded-xl object-cover ring-2 ring-white"
                        />
                      ) : (
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-700 ring-2 ring-white">
                          <Icon name="organization" size="sm" decorative />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-text-primary">
                          {campaign.title}
                        </p>
                        <p className="truncate text-xs text-text-muted">
                          {campaign.foundation.name}
                        </p>
                        <p className="mt-1 text-[11px] text-text-muted md:hidden">
                          {campaign.createdBy.fullName}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="hidden px-5 py-4 md:table-cell">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary-100 text-xs font-semibold text-secondary-700">
                        {creatorInitial}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-text-primary">
                          {campaign.createdBy.fullName}
                        </p>
                        <p className="truncate text-xs text-text-muted">
                          {campaign.createdBy.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="hidden px-5 py-4 lg:table-cell">
                    <p className="font-semibold text-text-primary">
                      {campaign.donationsCount.toLocaleString('es-CO')}
                    </p>
                    <p className="text-xs text-text-muted">
                      {UI_MESSAGES.ADMIN_CAMPAIGNS_NEEDS_COUNT(campaign.needsCount)}
                    </p>
                    <p className="mt-1 text-[11px] text-text-muted">
                      {formatDate(campaign.startDate)} — {formatDate(campaign.endDate)}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <CampaignStatusBadge status={campaign.status} />
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex flex-nowrap items-center justify-end gap-2">
                      <button
                        type="button"
                        className={cn(
                          buttonLinkClass({ variant: 'outline', size: 'sm' }),
                          'shrink-0 whitespace-nowrap',
                        )}
                        onClick={() => onView(campaign)}
                      >
                        {UI_MESSAGES.ADMIN_CAMPAIGNS_VIEW_SHORT}
                      </button>
                      <Link
                        to={`/campaigns/${campaign.id}`}
                        className={cn(
                          buttonLinkClass({ variant: 'outline', size: 'sm' }),
                          'shrink-0 whitespace-nowrap',
                        )}
                      >
                        {UI_MESSAGES.ADMIN_CAMPAIGNS_VIEW_POST}
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
