import { FilterBar, FilterSearchInput, FilterSelect } from '@/components/ui/FilterBar';
import { UI_MESSAGES } from '@/constants/messages.constants';
import type { AdminCampaignStatus } from '@/features/admin/types/admin.types';

type StatusFilter = 'all' | AdminCampaignStatus;

interface AdminCampaignsFiltersProps {
  search: string;
  statusFilter: StatusFilter;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: StatusFilter) => void;
}

/**
 * Entrada: filtros controlados y callbacks de cambio.
 * Proceso: Renderiza busqueda y estado para el listado admin de campanas.
 * Salida: Retorna el elemento JSX de la barra de filtros.
 */
export function AdminCampaignsFilters({
  search,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
}: AdminCampaignsFiltersProps) {
  return (
    <FilterBar gridClassName="sm:grid-cols-2">
      <FilterSearchInput
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder={UI_MESSAGES.ADMIN_CAMPAIGNS_SEARCH_PLACEHOLDER}
        aria-label={UI_MESSAGES.ADMIN_CAMPAIGNS_SEARCH_PLACEHOLDER}
      />
      <FilterSelect
        value={statusFilter}
        onChange={(event) => onStatusFilterChange(event.target.value as StatusFilter)}
        aria-label={UI_MESSAGES.ADMIN_CAMPAIGNS_FILTER_STATUS}
      >
        <option value="all">{UI_MESSAGES.ADMIN_CAMPAIGNS_FILTER_STATUS_ALL}</option>
        <option value="DRAFT">{UI_MESSAGES.CAMPAIGNS_STATUS_DRAFT}</option>
        <option value="PUBLISHED">{UI_MESSAGES.CAMPAIGNS_STATUS_PUBLISHED}</option>
        <option value="FINISHED">{UI_MESSAGES.CAMPAIGNS_STATUS_FINISHED}</option>
        <option value="CANCELLED">{UI_MESSAGES.CAMPAIGNS_STATUS_CANCELLED}</option>
      </FilterSelect>
    </FilterBar>
  );
}
