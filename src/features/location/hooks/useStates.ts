import { useQuery } from '@tanstack/react-query';
import { fetchStates } from '@/features/location/api/locations.api';
import { locationQueryKeys } from '@/features/location/hooks/useCountries';
import type { State } from '@/features/location/types/location.types';

/**
 * Entrada: countryIso: codigo ISO2 del pais o null/undefined si aun no hay seleccion.
 * Proceso: Obtiene estados del pais solo cuando hay ISO; cachea por pais.
 * Salida: Retorna estado de consulta tipado de State[].
 */
export function useStates(countryIso: string | null | undefined) {
  const iso = countryIso?.trim().toUpperCase() ?? '';

  return useQuery<State[]>({
    queryKey: locationQueryKeys.states(iso),
    queryFn: () => fetchStates(iso),
    enabled: iso.length === 2,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
  });
}
