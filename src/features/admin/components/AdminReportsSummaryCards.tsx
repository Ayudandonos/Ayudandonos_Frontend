import { Card } from '@/components/ui/Card';
import { UI_MESSAGES } from '@/constants/messages.constants';
import type { AdminReportsSummary } from '@/features/admin/types/admin.types';

interface AdminReportsSummaryCardsProps {
  summary: AdminReportsSummary;
}

interface SummaryCardConfig {
  label: string;
  value: number;
}

/**
 * Entrada: summary: totales agregados del reporte administrativo.
 * Proceso: Renderiza tarjetas resumen de usuarios, fundaciones, donaciones y campanas.
 * Salida: Retorna el elemento JSX de las tarjetas KPI de reportes.
 */
export function AdminReportsSummaryCards({ summary }: AdminReportsSummaryCardsProps) {
  const cards: SummaryCardConfig[] = [
    { label: UI_MESSAGES.ADMIN_REPORTS_SUMMARY_USERS, value: summary.totalUsers },
    { label: UI_MESSAGES.ADMIN_REPORTS_SUMMARY_ACTIVE_USERS, value: summary.activeUsers },
    { label: UI_MESSAGES.ADMIN_REPORTS_SUMMARY_FOUNDATIONS, value: summary.totalFoundations },
    {
      label: UI_MESSAGES.ADMIN_REPORTS_SUMMARY_VERIFIED_FOUNDATIONS,
      value: summary.verifiedFoundations,
    },
    { label: UI_MESSAGES.ADMIN_REPORTS_SUMMARY_DONATIONS, value: summary.totalDonations },
    {
      label: UI_MESSAGES.ADMIN_REPORTS_SUMMARY_DELIVERED_DONATIONS,
      value: summary.deliveredDonations,
    },
    { label: UI_MESSAGES.ADMIN_REPORTS_SUMMARY_CAMPAIGNS, value: summary.totalCampaigns },
    { label: UI_MESSAGES.ADMIN_REPORTS_SUMMARY_NEEDS, value: summary.totalNeeds },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label} glass={false} className="border border-border-default bg-white p-4">
          <p className="text-sm text-text-muted">{card.label}</p>
          <p className="mt-1 text-2xl font-bold text-text-primary">
            {card.value.toLocaleString('es-CO')}
          </p>
        </Card>
      ))}
    </div>
  );
}
