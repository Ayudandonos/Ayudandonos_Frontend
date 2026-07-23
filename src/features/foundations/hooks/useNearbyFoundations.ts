import { useQuery } from '@tanstack/react-query';
import { foundationsService } from '@/features/foundations/services/foundations.service';
import type {
  NearbyFoundationsData,
  NearbyFoundationsParams,
} from '@/features/foundations/types/foundations.types';

export const nearbyFoundationsQueryKey = (params: NearbyFoundationsParams) =>
  ['foundations', 'nearby', params.latitude, params.longitude, params.radiusKm ?? 5] as const;

/**
 * Entrada: params: coordenadas y radio, o null si aun no hay origen.
 * Proceso: Consulta GET /foundations/nearby con React Query (sin polling).
 * Salida: Retorna el resultado tipado de la query.
 */
export function useNearbyFoundations(params: NearbyFoundationsParams | null) {
  return useQuery<NearbyFoundationsData>({
    queryKey: params
      ? nearbyFoundationsQueryKey(params)
      : (['foundations', 'nearby', 'idle'] as const),
    queryFn: () => foundationsService.fetchNearbyFoundations(params!),
    enabled: params != null,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}
