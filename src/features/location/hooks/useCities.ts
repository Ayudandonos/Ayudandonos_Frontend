import { useQuery } from '@tanstack/react-query';
import { fetchCities } from '@/features/location/api/locations.api';
import { locationQueryKeys } from '@/features/location/hooks/useCountries';
import type { City } from '@/features/location/types/location.types';

/**
 * Entrada: countryIso: ISO2 pais; stateIso: ISO estado (nullable si no hay seleccion).
 * Proceso: Obtiene ciudades solo cuando ambos ISO estan definidos; cachea por par.
 * Salida: Retorna estado de consulta tipado de City[].
 */
export function useCities(
  countryIso: string | null | undefined,
  stateIso: string | null | undefined,
) {
  const country = countryIso?.trim().toUpperCase() ?? '';
  const state = stateIso?.trim().toUpperCase() ?? '';

  return useQuery<City[]>({
    queryKey: locationQueryKeys.cities(country, state),
    queryFn: () => fetchCities(country, state),
    enabled: country.length === 2 && state.length > 0,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
  });
}
