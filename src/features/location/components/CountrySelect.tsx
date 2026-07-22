import { useMemo } from 'react';
import { SearchableSelect } from '@/features/location/components/SearchableSelect';
import { useCountries } from '@/features/location/hooks/useCountries';
import type { Country } from '@/features/location/types/location.types';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { parseApiError } from '@/utils/api-error';

interface CountrySelectProps {
  value: Country | null;
  onChange: (country: Country | null) => void;
  disabled?: boolean;
}

/**
 * Entrada: value/onChange del pais seleccionado; disabled opcional.
 * Proceso: Carga paises con useCountries y permite buscar/seleccionar.
 * Salida: Retorna el selector de pais.
 */
export function CountrySelect({ value, onChange, disabled = false }: CountrySelectProps) {
  const { data, isLoading, isError, error, refetch, isFetching } = useCountries();

  const options = useMemo(
    () =>
      (data ?? []).map((country) => ({
        value: country.iso2,
        label: [country.emoji, country.name, country.iso2].filter(Boolean).join(' '),
      })),
    [data],
  );

  /**
   * Entrada: iso2: codigo seleccionado o vacio.
   * Proceso: Resuelve el pais completo y notifica al padre.
   * Salida: No retorna valor.
   */
  const handleChange = (iso2: string) => {
    if (!iso2) {
      onChange(null);
      return;
    }
    const selected = (data ?? []).find((item) => item.iso2 === iso2) ?? null;
    onChange(selected);
  };

  return (
    <SearchableSelect
      label={UI_MESSAGES.LOCATION_COUNTRY_LABEL}
      placeholder={UI_MESSAGES.LOCATION_COUNTRY_PLACEHOLDER}
      ariaLabel={UI_MESSAGES.LOCATION_COUNTRY_ARIA}
      options={options}
      value={value?.iso2 ?? ''}
      onChange={handleChange}
      disabled={disabled}
      loading={isLoading || (isFetching && !data)}
      fallbackLabel={value?.name}
      error={
        isError
          ? parseApiError(error).message || UI_MESSAGES.LOCATION_LOAD_ERROR
          : undefined
      }
      onRetry={isError ? () => void refetch() : undefined}
    />
  );
}
