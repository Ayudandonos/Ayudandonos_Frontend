import { UI_MESSAGES } from '@/constants/messages.constants';
import { parseApiError } from '@/utils/api-error';

/**
 * Entrada: error: fallo de consulta de locations.
 * Proceso: Elige mensaje legible; prioriza 503 del servicio CSC/proxy.
 * Salida: Retorna texto para mostrar junto al boton reintentar.
 */
export function getLocationLoadErrorMessage(error: unknown): string {
  const parsed = parseApiError(error);
  if (parsed.status === 503) {
    return UI_MESSAGES.LOCATION_SERVICE_UNAVAILABLE;
  }
  return parsed.message || UI_MESSAGES.LOCATION_LOAD_ERROR;
}

/**
 * Entrada: failureCount y error de React Query.
 * Proceso: Reintenta mas veces ante 503; limita reintentos en otros errores.
 * Salida: Retorna true si debe reintentar.
 */
export function shouldRetryLocationQuery(failureCount: number, error: unknown): boolean {
  const status = parseApiError(error).status;
  if (status === 503) {
    return failureCount < 3;
  }
  return failureCount < 1;
}
