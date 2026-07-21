import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { UI_MESSAGES } from '@/constants/messages.constants';
import type { AdminDashboardKpis } from '@/features/admin/types/admin.types';
import { cn } from '@/utils/cn';

interface AdminKpiCardsProps {
  kpis: AdminDashboardKpis;
}

interface KpiConfig {
  label: string;
  value: number;
  icon: 'window-alt' | 'bell' | 'users-alt' | 'building';
  badge?: string;
  badgeClassName?: string;
}

/**
 * Entrada: kpis: indicadores agregados del panel administrativo.
 * Proceso: Renderiza cuatro tarjetas KPI con iconografia del design system.
 * Salida: Retorna el elemento JSX de las tarjetas resumen.
 */
export function AdminKpiCards({ kpis }: AdminKpiCardsProps) {
  const cards: KpiConfig[] = [
    {
      label: UI_MESSAGES.ADMIN_KPI_ACTIVE_CAMPAIGNS,
      value: kpis.activeCampaigns,
      icon: 'window-alt',
      badge:
        kpis.activeCampaignsTrendPercent != null
          ? UI_MESSAGES.ADMIN_KPI_TREND_PERCENT(kpis.activeCampaignsTrendPercent)
          : undefined,
      badgeClassName: 'bg-vivid-100 text-vivid-700',
    },
    {
      label: UI_MESSAGES.ADMIN_KPI_PENDING_NEEDS,
      value: kpis.pendingNeeds,
      icon: 'bell',
      badge: kpis.pendingNeedsCritical ? UI_MESSAGES.ADMIN_KPI_CRITICAL_BADGE : undefined,
      badgeClassName: 'bg-red-100 text-red-700',
    },
    {
      label: UI_MESSAGES.ADMIN_KPI_DELIVERED_AIDS,
      value: kpis.deliveredAids,
      icon: 'users-alt',
    },
    {
      label: UI_MESSAGES.ADMIN_KPI_VERIFIED_FOUNDATIONS,
      value: kpis.verifiedFoundations,
      icon: 'building',
      badge: UI_MESSAGES.ADMIN_KPI_VERIFIED_BADGE,
      badgeClassName: 'bg-vivid-100 text-vivid-700',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label} glass={false} className="border border-border-default bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-vivid-50">
              <Icon name={card.icon} size="sm" className="text-vivid-700" decorative />
            </div>
            {card.badge && (
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase',
                  card.badgeClassName,
                )}
              >
                {card.badge}
              </span>
            )}
          </div>
          <p className="mt-4 text-sm text-text-muted">{card.label}</p>
          <p className="mt-1 text-2xl font-bold text-text-primary">{card.value.toLocaleString('es-CO')}</p>
        </Card>
      ))}
    </div>
  );
}
