import { FilterBar, FilterSearchInput, FilterSelect } from '@/components/ui/FilterBar';
import { UI_MESSAGES } from '@/constants/messages.constants';

type ActiveFilter = 'all' | 'active' | 'inactive';
type RoleFilter = 'all' | 'USER' | 'FOUNDATION';

interface AdminUsersFiltersProps {
  search: string;
  roleFilter: RoleFilter;
  activeFilter: ActiveFilter;
  onSearchChange: (value: string) => void;
  onRoleFilterChange: (value: RoleFilter) => void;
  onActiveFilterChange: (value: ActiveFilter) => void;
}

/**
 * Entrada: filtros controlados y callbacks de cambio.
 * Proceso: Renderiza busqueda, rol (donante/fundacion) y estado de acceso.
 * Salida: Retorna el elemento JSX de la barra de filtros.
 */
export function AdminUsersFilters({
  search,
  roleFilter,
  activeFilter,
  onSearchChange,
  onRoleFilterChange,
  onActiveFilterChange,
}: AdminUsersFiltersProps) {
  return (
    <FilterBar gridClassName="sm:grid-cols-2 lg:grid-cols-3">
      <FilterSearchInput
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder={UI_MESSAGES.ADMIN_USERS_SEARCH_PLACEHOLDER}
        aria-label={UI_MESSAGES.ADMIN_USERS_SEARCH_PLACEHOLDER}
      />
      <FilterSelect
        value={roleFilter}
        onChange={(event) => onRoleFilterChange(event.target.value as RoleFilter)}
        aria-label={UI_MESSAGES.ADMIN_USERS_FILTER_ROLE}
      >
        <option value="all">{UI_MESSAGES.ADMIN_USERS_FILTER_ROLE_ALL}</option>
        <option value="USER">{UI_MESSAGES.ROLE_USER}</option>
        <option value="FOUNDATION">{UI_MESSAGES.ROLE_FOUNDATION}</option>
      </FilterSelect>
      <FilterSelect
        value={activeFilter}
        onChange={(event) => onActiveFilterChange(event.target.value as ActiveFilter)}
        aria-label={UI_MESSAGES.ADMIN_USERS_FILTER_STATUS}
      >
        <option value="all">{UI_MESSAGES.ADMIN_USERS_FILTER_STATUS_ALL}</option>
        <option value="active">{UI_MESSAGES.ADMIN_USERS_STATUS_ACTIVE}</option>
        <option value="inactive">{UI_MESSAGES.ADMIN_USERS_STATUS_SUSPENDED}</option>
      </FilterSelect>
    </FilterBar>
  );
}
