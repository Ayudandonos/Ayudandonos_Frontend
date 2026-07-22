import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppImage } from '@/components/ui/AppImage';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { buttonLinkClass } from '@/components/ui/button-link-class';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { CampaignStatusBadge } from '@/features/campaigns/components/CampaignStatusBadge';
import type { AdminCampaignListItem } from '@/features/admin/types/admin.types';
import { cn } from '@/utils/cn';

interface AdminCampaignDetailModalProps {
  campaign: AdminCampaignListItem;
  onClose: () => void;
}

/**
 * Entrada: date: fecha ISO o null.
 * Proceso: Formatea fecha corta en es-CO.
 * Salida: Retorna cadena legible o guion.
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
 * Entrada: campaign: detalle de listado; onClose: cierre del modal.
 * Proceso: Muestra ficha de campana con cierre por overlay/Escape y enlace al post.
 * Salida: Retorna el elemento JSX del modal.
 */
export function AdminCampaignDetailModal({
  campaign,
  onClose,
}: AdminCampaignDetailModalProps) {
  const imageSrc = campaign.imageUrl?.trim() || undefined;

  useEffect(() => {
    /**
     * Entrada: event: tecla pulsada.
     * Proceso: Cierra el modal con Escape.
     * Salida: No retorna valor.
     */
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const rows: Array<{ label: string; value: string }> = [
    { label: UI_MESSAGES.ADMIN_CAMPAIGNS_TABLE_CREATOR, value: campaign.createdBy.fullName },
    { label: UI_MESSAGES.ADMIN_USERS_TABLE_EMAIL, value: campaign.createdBy.email },
    {
      label: UI_MESSAGES.ADMIN_CAMPAIGNS_CREATED_AT,
      value: formatDate(campaign.createdAt),
    },
    {
      label: UI_MESSAGES.ADMIN_CAMPAIGNS_PERIOD,
      value: `${formatDate(campaign.startDate)} — ${formatDate(campaign.endDate)}`,
    },
    {
      label: UI_MESSAGES.ADMIN_CAMPAIGNS_TABLE_DONATIONS,
      value: campaign.donationsCount.toLocaleString('es-CO'),
    },
    {
      label: UI_MESSAGES.ADMIN_CAMPAIGNS_NEEDS_LABEL,
      value: UI_MESSAGES.ADMIN_CAMPAIGNS_NEEDS_COUNT(campaign.needsCount),
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-0 backdrop-blur-[2px] sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-campaign-detail-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label={UI_MESSAGES.ADMIN_CAMPAIGNS_CLOSE_OVERLAY}
        onClick={onClose}
      />

      <div
        className={cn(
          'relative z-10 flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden',
          'rounded-t-2xl border border-border-default/80 bg-white shadow-xl sm:rounded-2xl',
          'animate-fade-in',
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="border-b border-border-default/70 bg-primary-50/50 px-5 py-4 sm:px-6">
          <div className="flex items-start gap-4">
            {imageSrc ? (
              <AppImage
                src={imageSrc}
                alt=""
                className="h-14 w-14 shrink-0 rounded-xl object-cover ring-2 ring-white"
              />
            ) : (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-700 ring-2 ring-white">
                <Icon name="organization" size="md" decorative />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary-700">
                {UI_MESSAGES.ADMIN_CAMPAIGNS_DETAIL_SUBTITLE}
              </p>
              <h2
                id="admin-campaign-detail-title"
                className="mt-0.5 line-clamp-2 text-xl font-bold tracking-tight text-text-primary"
              >
                {campaign.title}
              </h2>
              <p className="mt-0.5 truncate text-sm text-text-secondary">
                {campaign.foundation.name}
              </p>
              <div className="mt-3">
                <CampaignStatusBadge status={campaign.status} />
              </div>
            </div>

            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              {UI_MESSAGES.COMMON_CLOSE}
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <dl className="grid gap-3 sm:grid-cols-2">
            {rows.map((row) => (
              <div
                key={row.label}
                className="rounded-xl border border-border-default/70 bg-vivid-50/40 px-3.5 py-3"
              >
                <dt className="text-xs font-medium text-text-muted">{row.label}</dt>
                <dd className="mt-1 break-words text-sm font-semibold text-text-primary">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <footer className="flex flex-col-reverse gap-3 border-t border-border-default/70 bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <Button type="button" variant="secondary" onClick={onClose}>
            {UI_MESSAGES.COMMON_CLOSE}
          </Button>
          <Link
            to={`/campaigns/${campaign.id}`}
            className={buttonLinkClass({ variant: 'primary', size: 'md' })}
          >
            {UI_MESSAGES.ADMIN_CAMPAIGNS_OPEN_POST}
          </Link>
        </footer>
      </div>
    </div>
  );
}
