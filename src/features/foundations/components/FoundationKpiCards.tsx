import { Card } from '@/components/ui/Card';
import { UI_MESSAGES } from '@/constants/messages.constants';
import type { FoundationStats } from '@/features/foundations/types/foundations.types';

interface FoundationKpiCardsProps {
  stats: FoundationStats;
}

interface KpiCardConfig {
  label: string;
  value: number;
  badge?: string;
  badgeClassName?: string;
  hint?: string;
}

/**
 * Entrada: stats: totales agregados del modulo de fundaciones.
 * Proceso: Renderiza tarjetas KPI con badges segun prototipo de verificacion admin.
 * Salida: Retorna el elemento JSX de indicadores.
 */
export function FoundationKpiCards({ stats }: FoundationKpiCardsProps) {
  const verifiedRate = stats.total > 0 ? Math.round((stats.verified / stats.total) * 100) : 0;

  const cards: KpiCardConfig[] = [
    { label: UI_MESSAGES.FOUNDATIONS_KPI_TOTAL, value: stats.total },
    {
      label: UI_MESSAGES.FOUNDATIONS_KPI_PENDING,
      value: stats.pending,
      badge: stats.pending > 0 ? UI_MESSAGES.FOUNDATIONS_KPI_PENDING_BADGE : undefined,
      badgeClassName: 'bg-amber-100 text-amber-800',
      hint: stats.pending > 0 ? UI_MESSAGES.FOUNDATIONS_KPI_PENDING_HINT : undefined,
    },
    {
      label: UI_MESSAGES.FOUNDATIONS_KPI_VERIFIED,
      value: stats.verified,
      badge: UI_MESSAGES.FOUNDATIONS_KPI_VERIFIED_BADGE,
      badgeClassName: 'bg-vivid-100 text-vivid-700',
      hint: UI_MESSAGES.FOUNDATIONS_KPI_VERIFIED_RATE(verifiedRate),
    },
    {
      label: UI_MESSAGES.FOUNDATIONS_KPI_REJECTED,
      value: stats.rejected,
      hint: UI_MESSAGES.FOUNDATIONS_KPI_REJECTED_HINT,
    },
    { label: UI_MESSAGES.FOUNDATIONS_KPI_SUSPENDED, value: stats.suspended },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <Card key={card.label} glass={false} className="border border-border-default bg-white p-4">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm text-text-muted">{card.label}</p>
            {card.badge && (
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${card.badgeClassName}`}>
                {card.badge}
              </span>
            )}
          </div>
          <p className="mt-1 text-2xl font-bold text-text-primary">{card.value}</p>
          {card.hint && <p className="mt-1 text-xs text-text-secondary">{card.hint}</p>}
        </Card>
      ))}
    </div>
  );
}
