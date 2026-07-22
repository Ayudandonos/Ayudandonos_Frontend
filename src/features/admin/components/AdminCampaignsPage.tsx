import { useState } from 'react';
import { Alert } from '@/components/ui/Alert';
import { EmptyState } from '@/components/ui/EmptyState';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { AdminCampaignDetailModal } from '@/features/admin/components/AdminCampaignDetailModal';
import { AdminCampaignsFilters } from '@/features/admin/components/AdminCampaignsFilters';
import { AdminCampaignsSkeleton } from '@/features/admin/components/AdminCampaignsSkeleton';
import { AdminCampaignsTable } from '@/features/admin/components/AdminCampaignsTable';
import { useAdminCampaigns } from '@/features/admin/hooks/useAdminCampaigns';
import {
  ADMIN_CAMPAIGNS_PAGE_SIZE_OPTIONS,
  PaginationControls,
} from '@/features/foundations/components/PaginationControls';
import type { AdminCampaignListItem } from '@/features/admin/types/admin.types';

/**
 * Entrada: Ninguna (usuario autenticado con rol ADMIN).
 * Proceso: Orquesta listado, detalle y paginacion de campanas administrativas.
 * Salida: Retorna el elemento JSX de la pagina administrativa de campanas.
 */
export function AdminCampaignsPage() {
  const {
    items,
    page,
    pageSize,
    totalPages,
    total,
    search,
    statusFilter,
    isLoading,
    error,
    setSearch,
    setStatusFilter,
    setPage,
    setPageSize,
    reload,
  } = useAdminCampaigns();

  const [selected, setSelected] = useState<AdminCampaignListItem | null>(null);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <header>
        <h1 className="text-display text-text-primary">{UI_MESSAGES.ADMIN_CAMPAIGNS_PAGE_TITLE}</h1>
        <p className="mt-2 max-w-3xl text-body text-text-secondary">
          {UI_MESSAGES.ADMIN_CAMPAIGNS_PAGE_DESCRIPTION}
        </p>
      </header>

      {error && !isLoading ? <Alert variant="danger">{error}</Alert> : null}

      <AdminCampaignsFilters
        search={search}
        statusFilter={statusFilter}
        onSearchChange={setSearch}
        onStatusFilterChange={setStatusFilter}
      />

      {isLoading ? <AdminCampaignsSkeleton /> : null}

      {!isLoading && items.length === 0 ? (
        <EmptyState
          title={UI_MESSAGES.ADMIN_CAMPAIGNS_EMPTY_TITLE}
          description={UI_MESSAGES.ADMIN_CAMPAIGNS_EMPTY_DESCRIPTION}
          onRetry={() => void reload()}
        />
      ) : null}

      {!isLoading && items.length > 0 ? (
        <div className="space-y-4">
          <AdminCampaignsTable
            items={items}
            selectedId={selected?.id}
            onView={setSelected}
          />
          <PaginationControls
            page={page}
            totalPages={totalPages}
            total={total}
            limit={pageSize}
            pageSizeOptions={ADMIN_CAMPAIGNS_PAGE_SIZE_OPTIONS}
            onPageChange={setPage}
            onLimitChange={setPageSize}
          />
        </div>
      ) : null}

      {selected ? (
        <AdminCampaignDetailModal campaign={selected} onClose={() => setSelected(null)} />
      ) : null}
    </div>
  );
}
