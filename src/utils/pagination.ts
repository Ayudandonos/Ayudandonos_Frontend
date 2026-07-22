import type { ApiResponseMeta, ApiSuccessResponse } from '@/types/api.types';

export interface PaginatedResult<T> {
  items: T[];
  meta: ApiResponseMeta;
}

/**
 * Entrada: response: respuesta exitosa de la API con items y meta opcional.
 * Proceso: Normaliza listados paginados al formato interno del frontend.
 * Salida: Retorna items y meta con valores por defecto si faltan.
 */
export function parsePaginatedResponse<T>(
  response: ApiSuccessResponse<{ items: T[] } | T[]>,
): PaginatedResult<T> {
  const payload = response.data;
  const items = Array.isArray(payload) ? payload : (payload.items ?? []);
  const meta = response.meta ?? {};

  return {
    items,
    meta: {
      page: meta.page ?? 1,
      limit: meta.limit ?? items.length,
      total: meta.total ?? items.length,
      totalPages: meta.totalPages ?? 1,
    },
  };
}
