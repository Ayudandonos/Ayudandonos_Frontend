import { useState } from 'react';
import {
  FilterBar,
  FilterSearchInput,
  FilterSelect,
} from '@/components/ui/FilterBar';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { LocationCascadingFilters } from '@/features/location/components/LocationCascadingFilters';
import type { City, Country, State } from '@/features/location/types/location.types';
import type { FoundationStatus } from '@/features/foundations/types/foundations.types';

interface FoundationFiltersProps {
  search: string;
  statusFilter?: 'all' | FoundationStatus;
  category?: string;
  country?: string;
  city?: string;
  department?: string;
  onSearchChange: (value: string) => void;
  onStatusFilterChange?: (value: 'all' | FoundationStatus) => void;
  onCategoryChange?: (value: string) => void;
  onCountryChange?: (value: string) => void;
  onCityChange?: (value: string) => void;
  onDepartmentChange?: (value: string) => void;
  showStatusFilter?: boolean;
  showExtendedFilters?: boolean;
  showLocationCascadingFilters?: boolean;
}

/**
 * Entrada: search, filtros y callbacks; flags de filtros admin/publicos.
 * Proceso: Compone FilterBar con busqueda, estado y ubicacion seleccionable.
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
  onCountryChange,
  onCityChange,
  onDepartmentChange,
  showStatusFilter = false,
  showExtendedFilters = false,
  showLocationCascadingFilters = false,
}: FoundationFiltersProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  /**
   * Entrada: country: pais seleccionado o null.
   * Proceso: Actualiza seleccion local, limpia depto/ciudad y notifica nombre al padre.
   * Salida: No retorna valor.
   */
  const handleCountryChange = (country: Country | null) => {
    setSelectedCountry(country);
    setSelectedState(null);
    setSelectedCity(null);
    onCountryChange?.(country?.name ?? '');
    onDepartmentChange?.('');
    onCityChange?.('');
  };

  /**
   * Entrada: state: departamento seleccionado o null.
   * Proceso: Actualiza seleccion local, limpia ciudad y notifica nombre al padre.
   * Salida: No retorna valor.
   */
  const handleStateChange = (state: State | null) => {
    setSelectedState(state);
    setSelectedCity(null);
    onDepartmentChange?.(state?.name ?? '');
    onCityChange?.('');
  };

  /**
   * Entrada: nextCity: ciudad seleccionada o null.
   * Proceso: Actualiza seleccion local y notifica nombre al padre.
   * Salida: No retorna valor.
   */
  const handleCityChange = (nextCity: City | null) => {
    setSelectedCity(nextCity);
    onCityChange?.(nextCity?.name ?? '');
  };

  return (
    <FilterBar
      gridClassName={
        showLocationCascadingFilters
          ? 'sm:grid-cols-2 xl:grid-cols-12'
          : showStatusFilter
            ? 'md:grid-cols-2 xl:grid-cols-4'
            : 'md:grid-cols-2'
      }
    >
      <FilterSearchInput
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder={UI_MESSAGES.FOUNDATIONS_SEARCH_PLACEHOLDER}
        aria-label={UI_MESSAGES.FOUNDATIONS_SEARCH_PLACEHOLDER}
        className={
          showLocationCascadingFilters ? 'sm:col-span-2 xl:col-span-3' : 'xl:col-span-2'
        }
      />

      {showStatusFilter && onStatusFilterChange && (
        <FilterSelect
          value={statusFilter}
          onChange={(event) =>
            onStatusFilterChange(event.target.value as 'all' | FoundationStatus)
          }
          className={showLocationCascadingFilters ? 'xl:col-span-2' : undefined}
          aria-label={UI_MESSAGES.FOUNDATIONS_TABLE_STATUS}
        >
          <option value="all">{UI_MESSAGES.FOUNDATIONS_FILTER_ALL}</option>
          <option value="PENDING">{UI_MESSAGES.FOUNDATIONS_FILTER_PENDING}</option>
          <option value="VERIFIED">{UI_MESSAGES.FOUNDATIONS_FILTER_VERIFIED}</option>
          <option value="REJECTED">{UI_MESSAGES.FOUNDATIONS_FILTER_REJECTED}</option>
          <option value="SUSPENDED">{UI_MESSAGES.FOUNDATIONS_FILTER_SUSPENDED}</option>
        </FilterSelect>
      )}

      {showLocationCascadingFilters && (
        <LocationCascadingFilters
          country={selectedCountry}
          state={selectedState}
          city={selectedCity}
          onCountryChange={handleCountryChange}
          onStateChange={handleStateChange}
          onCityChange={handleCityChange}
          countryClassName="xl:col-span-3"
          stateClassName="xl:col-span-2"
          cityClassName="xl:col-span-2"
        />
      )}

      {showExtendedFilters && onCategoryChange && (
        <FilterSearchInput
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
          placeholder={UI_MESSAGES.FOUNDATIONS_FILTER_CATEGORY}
          aria-label={UI_MESSAGES.FOUNDATIONS_FILTER_CATEGORY}
        />
      )}

      {showExtendedFilters && !showLocationCascadingFilters && onCityChange && (
        <FilterSearchInput
          value={city}
          onChange={(event) => onCityChange(event.target.value)}
          placeholder={UI_MESSAGES.FOUNDATIONS_FILTER_CITY}
          aria-label={UI_MESSAGES.FOUNDATIONS_FILTER_CITY}
        />
      )}

      {showExtendedFilters && !showLocationCascadingFilters && onDepartmentChange && (
        <FilterSearchInput
          value={department}
          onChange={(event) => onDepartmentChange(event.target.value)}
          placeholder={UI_MESSAGES.FOUNDATIONS_FILTER_DEPARTMENT}
          aria-label={UI_MESSAGES.FOUNDATIONS_FILTER_DEPARTMENT}
        />
      )}
    </FilterBar>
  );
}
