import { Alert } from '@/components/ui/Alert';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { useAdminFoundations } from '@/features/foundations/hooks/useAdminFoundations';
import { EmptyState } from '@/features/foundations/components/EmptyState';
import { FoundationFilters } from '@/features/foundations/components/FoundationFilters';
import { FoundationKpiCards } from '@/features/foundations/components/FoundationKpiCards';
import { FoundationReviewModal } from '@/features/foundations/components/FoundationReviewModal';
import { FoundationTable } from '@/features/foundations/components/FoundationTable';
import { FoundationsLoadingSkeleton } from '@/features/foundations/components/FoundationsLoadingSkeleton';
import { PaginationControls, FOUNDATIONS_ADMIN_PAGE_SIZE } from '@/features/foundations/components/PaginationControls';

/**
 * Entrada: Ninguna (usuario autenticado con rol ADMIN).
 * Proceso: Orquesta listado, filtros, KPIs y modal de revision segun prototipo admin.
 * Salida: Retorna el elemento JSX del panel admin de verificacion.
 */
export function AdminFoundationsPage() {
  const {
    items,
    stats,
    selected,
    page,
    totalPages,
    total,
    search,
    statusFilter,
    city,
    department,
    isLoading,
    isProcessing,
    error,
    setSearch,
    setStatusFilter,
    setCountry,
    setCity,
    setDepartment,
    setPage,
    selectFoundation,
    closeReview,
    updateStatus,
    downloadDocument,
    fetchDocumentBlob,
  } = useAdminFoundations();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">{UI_MESSAGES.FOUNDATIONS_ADMIN_TITLE}</h1>
        <p className="mt-2 max-w-3xl text-text-secondary">{UI_MESSAGES.FOUNDATIONS_ADMIN_DESCRIPTION}</p>
      </header>

      {stats && <FoundationKpiCards stats={stats} />}

      <FoundationFilters
        search={search}
        statusFilter={statusFilter}
        city={city}
        department={department}
        onSearchChange={setSearch}
        onStatusFilterChange={setStatusFilter}
        onCountryChange={setCountry}
        onCityChange={setCity}
        onDepartmentChange={setDepartment}
        showStatusFilter
        showLocationCascadingFilters
      />

      {isLoading && <FoundationsLoadingSkeleton variant="table" />}
      {error && !isLoading && <Alert variant="danger">{error}</Alert>}

      {!isLoading && !error && items.length === 0 && (
        <EmptyState message={UI_MESSAGES.FOUNDATIONS_EMPTY_ADMIN} />
      )}

      {!isLoading && !error && items.length > 0 && (
        <div className="space-y-4">
          <FoundationTable
            items={items}
            selectedId={selected?.id}
            onSelect={(foundation) => void selectFoundation(foundation)}
          />
          <PaginationControls
            page={page}
            totalPages={totalPages}
            total={total}
            limit={FOUNDATIONS_ADMIN_PAGE_SIZE}
            onPageChange={setPage}
          />
        </div>
      )}

      {selected && (
        <FoundationReviewModal
          foundation={selected}
          isProcessing={isProcessing}
          onClose={closeReview}
          onUpdateStatus={updateStatus}
          onDownloadDocument={downloadDocument}
          fetchDocumentBlob={fetchDocumentBlob}
        />
      )}
    </div>
  );
}
