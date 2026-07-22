import { useQuery } from '@tanstack/react-query';
import { fetchCountries } from '@/features/location/api/locations.api';
import type { Country } from '@/features/location/types/location.types';

export const locationQueryKeys = {
  countries: ['locations', 'countries'] as const,
  states: (countryIso: string) => ['locations', 'states', countryIso] as const,
  cities: (countryIso: string, stateIso: string) =>
    ['locations', 'cities', countryIso, stateIso] as const,
};

/**
 * Entrada: Ninguna.
 * Proceso: Obtiene paises via React Query con cache en memoria.
 * Salida: Retorna estado de consulta tipado de Country[].
 */
export function useCountries() {
  return useQuery<Country[]>({
    queryKey: locationQueryKeys.countries,
    queryFn: fetchCountries,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
  });
}
