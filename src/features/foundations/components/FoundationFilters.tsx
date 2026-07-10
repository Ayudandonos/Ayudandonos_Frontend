import { UI_MESSAGES } from '@/constants/messages.constants';
import type { FoundationStatus } from '@/features/foundations/types/foundations.types';

interface FoundationFiltersProps {
  search: string;
  statusFilter?: 'all' | FoundationStatus;
  category?: string;
  city?: string;
  department?: string;
  onSearchChange: (value: string) => void;
  onStatusFilterChange?: (value: 'all' | FoundationStatus) => void;
  onCategoryChange?: (value: string) => void;
  onCityChange?: (value: string) => void;
  onDepartmentChange?: (value: string) => void;
  showStatusFilter?: boolean;
  showExtendedFilters?: boolean;
}

/**
 * Entrada: search, filtros y callbacks; flags para filtros admin extendidos.
 * Proceso: Renderiza buscador y filtros por estado, categoria, ciudad y departamento.
 * Salida: Retorna el elemento JSX del bloque de filtros.
 */
export function FoundationFilters({
  search,
  statusFilter = 'all',
  category = '',
  city = '',
  department = '',
  onSearchChange,
  onStatusFilterChange,
  onCategoryChange,
  onCityChange,
  onDepartmentChange,
  showStatusFilter = false,
  showExtendedFilters = false,
}: FoundationFiltersProps) {
  return (
    <div className="rounded-xl border border-border-default bg-white p-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={UI_MESSAGES.FOUNDATIONS_SEARCH_PLACEHOLDER}
          className="rounded-lg border border-border-default bg-vivid-50 px-4 py-2 text-sm xl:col-span-2"
        />

        {showStatusFilter && onStatusFilterChange && (
          <select
            value={statusFilter}
            onChange={(event) =>
              onStatusFilterChange(event.target.value as 'all' | FoundationStatus)
            }
            className="rounded-lg border border-border-default bg-white px-4 py-2 text-sm"
          >
            <option value="all">{UI_MESSAGES.FOUNDATIONS_FILTER_ALL}</option>
            <option value="PENDING">{UI_MESSAGES.FOUNDATIONS_FILTER_PENDING}</option>
            <option value="VERIFIED">{UI_MESSAGES.FOUNDATIONS_FILTER_VERIFIED}</option>
            <option value="REJECTED">{UI_MESSAGES.FOUNDATIONS_FILTER_REJECTED}</option>
            <option value="SUSPENDED">{UI_MESSAGES.FOUNDATIONS_FILTER_SUSPENDED}</option>
          </select>
        )}

        {showExtendedFilters && onCategoryChange && (
          <input
            value={category}
            onChange={(event) => onCategoryChange(event.target.value)}
            placeholder={UI_MESSAGES.FOUNDATIONS_FILTER_CATEGORY}
            className="rounded-lg border border-border-default bg-white px-4 py-2 text-sm"
          />
        )}

        {showExtendedFilters && onCityChange && (
          <input
            value={city}
            onChange={(event) => onCityChange(event.target.value)}
            placeholder={UI_MESSAGES.FOUNDATIONS_FILTER_CITY}
            className="rounded-lg border border-border-default bg-white px-4 py-2 text-sm"
          />
        )}

        {showExtendedFilters && onDepartmentChange && (
          <input
            value={department}
            onChange={(event) => onDepartmentChange(event.target.value)}
            placeholder={UI_MESSAGES.FOUNDATIONS_FILTER_DEPARTMENT}
            className="rounded-lg border border-border-default bg-white px-4 py-2 text-sm"
          />
        )}
      </div>
    </div>
  );
}
