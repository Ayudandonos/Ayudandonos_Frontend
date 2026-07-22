import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { UI_MESSAGES } from '@/constants/messages.constants';
import type { DonationStats } from '@/features/users/types/users.types';
import { Link } from 'react-router-dom';

const DONATION_STATUS_LABELS: Record<string, string> = {
  COMMITTED: UI_MESSAGES.DONATIONS_STATUS_COMMITTED,
  IN_TRANSIT: UI_MESSAGES.DONATIONS_STATUS_IN_TRANSIT,
  DELIVERED: UI_MESSAGES.DONATIONS_STATUS_DELIVERED,
  CONFIRMED: UI_MESSAGES.DONATIONS_STATUS_CONFIRMED,
  CANCELLED: UI_MESSAGES.DONATIONS_STATUS_CANCELLED,
};

/**
 * Entrada: status: codigo de estado de donacion.
 * Proceso: Renderiza etiqueta legible sin depender de otros features.
 * Salida: Retorna span con estilo de badge.
 */
function DonationStatusLabel({ status }: { status: string }) {
  const label = DONATION_STATUS_LABELS[status] ?? status;
  return (
    <span className="inline-flex rounded-full bg-vivid-100 px-2.5 py-1 text-xs font-semibold text-vivid-700">
      {label}
    </span>
  );
}

interface DonorStatsPanelProps {
  stats: DonationStats | null | undefined;
}

/**
 * Entrada: stats: agregados de donaciones del usuario o null.
 * Proceso: Renderiza KPIs y distribucion por estado o estado vacio.
 * Salida: Retorna el elemento JSX del panel de estadisticas del donante.
 */
export function DonorStatsPanel({ stats }: DonorStatsPanelProps) {
  if (!stats || stats.totalDonations === 0) {
    return (
      <Card glass={false} className="border border-border-default bg-white p-6">
        <h2 className="text-heading text-text-primary">{UI_MESSAGES.USER_PROFILE_STATS_TITLE}</h2>
        <div className="mt-4">
          <EmptyState
            title={UI_MESSAGES.USER_PROFILE_STATS_EMPTY_TITLE}
            description={UI_MESSAGES.USER_PROFILE_STATS_EMPTY_DESC}
          />
          <p className="mt-4 text-center">
            <Link
              to="/campaigns"
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              {UI_MESSAGES.CAMPAIGNS_TITLE}
            </Link>
          </p>
        </div>
      </Card>
    );
  }

  const kpis = [
    { label: UI_MESSAGES.USER_PROFILE_STATS_TOTAL_DONATIONS, value: stats.totalDonations },
    { label: UI_MESSAGES.USER_PROFILE_STATS_TOTAL_QUANTITY, value: stats.totalQuantity },
    { label: UI_MESSAGES.USER_PROFILE_STATS_DELIVERED, value: stats.deliveredQuantity },
    { label: UI_MESSAGES.USER_PROFILE_STATS_CANCELLED, value: stats.cancelledDonations },
  ];

  return (
    <Card glass={false} className="border border-border-default bg-white p-6">
      <h2 className="text-heading text-text-primary">{UI_MESSAGES.USER_PROFILE_STATS_TITLE}</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl border border-border-default bg-vivid-50 px-4 py-5"
          >
            <p className="text-2xl font-bold text-text-primary">{kpi.value.toLocaleString('es-CO')}</p>
            <p className="mt-1 text-sm text-text-secondary">{kpi.label}</p>
          </div>
        ))}
      </div>
      {stats.byStatus.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-text-primary">
            {UI_MESSAGES.USER_PROFILE_STATS_BY_STATUS}
          </h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {stats.byStatus.map((entry) => (
              <li
                key={`${entry.status}-${entry.count}`}
                className="flex items-center gap-2 rounded-full border border-border-default bg-white px-3 py-1.5 text-sm"
              >
                <DonationStatusLabel status={entry.status} />
                <span className="font-medium text-text-primary">{entry.count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
