import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { AdminReportsCharts } from '@/features/admin/components/AdminReportsCharts';
import { AdminReportsSkeleton } from '@/features/admin/components/AdminReportsSkeleton';
import { AdminReportsSummaryCards } from '@/features/admin/components/AdminReportsSummaryCards';
import { useAdminReports } from '@/features/admin/hooks/useAdminReports';

/**
 * Entrada: Ninguna (usuario autenticado con rol ADMIN).
 * Proceso: Orquesta resumen KPI y diagramas de reportes desde la API.
 * Salida: Retorna el elemento JSX de la pagina de reportes administrativos.
 */
export function AdminReportsPage() {
  const { data, isLoading, error, reload } = useAdminReports();

  if (isLoading) {
    return <AdminReportsSkeleton />;
  }

  if (error && !data) {
    return (
      <EmptyState
        title={UI_MESSAGES.ADMIN_REPORTS_ERROR_TITLE}
        description={error}
        onRetry={() => void reload()}
      />
    );
  }

  if (!data) {
    return (
      <EmptyState
        title={UI_MESSAGES.ADMIN_REPORTS_EMPTY_TITLE}
        description={UI_MESSAGES.ADMIN_REPORTS_EMPTY_DESCRIPTION}
        onRetry={() => void reload()}
      />
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-display text-text-primary">{UI_MESSAGES.ADMIN_REPORTS_PAGE_TITLE}</h1>
          <p className="mt-2 max-w-2xl text-body text-text-secondary">
            {UI_MESSAGES.ADMIN_REPORTS_PAGE_DESCRIPTION}
          </p>
        </div>
        <Button type="button" variant="secondary" onClick={() => void reload()}>
          {UI_MESSAGES.ADMIN_REPORTS_REFRESH}
        </Button>
      </header>

      <AdminReportsSummaryCards summary={data.summary} />

      <AdminReportsCharts
        usersByRole={data.usersByRole}
        foundationsByStatus={data.foundationsByStatus}
        donationsByStatus={data.donationsByStatus}
        campaignsByStatus={data.campaignsByStatus}
        monthlyActivity={data.monthlyActivity}
      />
    </div>
  );
}
