import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { AdminDashboardSkeleton } from '@/features/admin/components/AdminDashboardSkeleton';
import { AdminFeaturedCampaignsPanel } from '@/features/admin/components/AdminFeaturedCampaignsPanel';
import { AdminKpiCards } from '@/features/admin/components/AdminKpiCards';
import { AdminLatestNeedsTable } from '@/features/admin/components/AdminLatestNeedsTable';
import { useAdminDashboard } from '@/features/admin/hooks/useAdminDashboard';

/**
 * Entrada: Ninguna (usuario autenticado con rol ADMIN).
 * Proceso: Orquesta KPIs, tabla de necesidades recientes y panel lateral desde la API.
 * Salida: Retorna el elemento JSX del panel de control administrativo.
 */
export function AdminDashboardPage() {
  const { data, isLoading, error, reload } = useAdminDashboard();

  if (isLoading) {
    return <AdminDashboardSkeleton />;
  }

  if (error && !data) {
    return (
      <EmptyState
        title={UI_MESSAGES.ADMIN_DASHBOARD_ERROR_TITLE}
        description={error}
        onRetry={() => void reload()}
      />
    );
  }

  if (!data) {
    return (
      <EmptyState
        title={UI_MESSAGES.ADMIN_DASHBOARD_EMPTY_TITLE}
        description={UI_MESSAGES.ADMIN_DASHBOARD_EMPTY_DESCRIPTION}
        onRetry={() => void reload()}
      />
    );
  }

  const featuredCampaigns = data.featuredCampaigns ?? [];
  const hasFeatured = featuredCampaigns.length > 0;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-display text-text-primary">{UI_MESSAGES.ADMIN_DASHBOARD_TITLE}</h1>
          <p className="mt-2 max-w-2xl text-body text-text-secondary">
            {UI_MESSAGES.ADMIN_DASHBOARD_DESCRIPTION}
          </p>
        </div>
        <Button type="button" variant="secondary" disabled>
          {UI_MESSAGES.ADMIN_EXPORT_REPORT}
        </Button>
      </header>

      <AdminKpiCards kpis={data.kpis} />

      <div className={hasFeatured ? 'grid gap-6 xl:grid-cols-3' : undefined}>
        <Card
          glass={false}
          className={`border border-border-default bg-white p-0 ${hasFeatured ? 'xl:col-span-2' : ''}`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-default px-6 py-4">
            <h2 className="text-heading text-text-primary">{UI_MESSAGES.ADMIN_LATEST_NEEDS_TITLE}</h2>
            <Link
              to="/admin/campaigns"
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              {UI_MESSAGES.ADMIN_VIEW_ALL}
            </Link>
          </div>

          {data.latestNeeds.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title={UI_MESSAGES.ADMIN_NEEDS_EMPTY_TITLE}
                description={UI_MESSAGES.ADMIN_NEEDS_EMPTY_DESCRIPTION}
              />
            </div>
          ) : (
            <div className="p-4 sm:p-6">
              <AdminLatestNeedsTable items={data.latestNeeds} />
            </div>
          )}
        </Card>

        {hasFeatured && (
          <div className="xl:col-span-1">
            <AdminFeaturedCampaignsPanel campaigns={featuredCampaigns} />
          </div>
        )}
      </div>
    </div>
  );
}
