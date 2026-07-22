import { useMemo } from 'react';
import { SearchableSelect } from '@/features/location/components/SearchableSelect';
import { useCities } from '@/features/location/hooks/useCities';
import type { City } from '@/features/location/types/location.types';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { parseApiError } from '@/utils/api-error';

interface CitySelectProps {
  countryIso: string | null;
  stateIso: string | null;
  value: City | null;
  onChange: (city: City | null) => void;
}

/**
 * Entrada: countryIso/stateIso: contexto geografico; value/onChange de ciudad.
 * Proceso: Carga ciudades solo si hay pais y estado; deshabilita en caso contrario.
 * Salida: Retorna el selector de ciudad.
 */
export function CitySelect({ countryIso, stateIso, value, onChange }: CitySelectProps) {
  const enabled = Boolean(countryIso && stateIso);
  const { data, isLoading, isError, error, refetch, isFetching } = useCities(
    countryIso,
    stateIso,
  );

  const options = useMemo(
    () =>
      (data ?? []).map((city) => ({
        value: city.name,
        label: city.name,
      })),
    [data],
  );

  /**
   * Entrada: cityName: nombre seleccionado o vacio.
   * Proceso: Resuelve la ciudad completa y notifica al padre.
   * Salida: No retorna valor.
   */
  const handleChange = (cityName: string) => {
    if (!cityName) {
      onChange(null);
      return;
    }
    const selected = (data ?? []).find((item) => item.name === cityName) ?? null;
    onChange(selected);
  };

  return (
    <SearchableSelect
      label={UI_MESSAGES.LOCATION_CITY_LABEL}
      placeholder={UI_MESSAGES.LOCATION_CITY_PLACEHOLDER}
      ariaLabel={UI_MESSAGES.LOCATION_CITY_ARIA}
      options={options}
      value={value?.name ?? ''}
      onChange={handleChange}
      disabled={!enabled}
      loading={enabled && (isLoading || (isFetching && !data))}
      fallbackLabel={value?.name}
      error={
        enabled && isError
          ? parseApiError(error).message || UI_MESSAGES.LOCATION_LOAD_ERROR
          : undefined
      }
      onRetry={enabled && isError ? () => void refetch() : undefined}
    />
  );
}
