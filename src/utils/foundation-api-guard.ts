import type { NavigateFunction } from 'react-router-dom';
import { parseApiError } from '@/utils/api-error';

/**
 * Entrada: error: error de peticion; navigate: funcion de React Router.
 * Proceso: Si el backend responde 403, redirige al perfil de fundacion.
 * Salida: Retorna true si se manejo el error con redireccion.
 */
export function redirectFoundationOnForbidden(error: unknown, navigate: NavigateFunction): boolean {
  const parsed = parseApiError(error);
  if (parsed.status !== 403) {
    return false;
  }
  navigate('/foundation/profile', { replace: true, state: { gate: 'incomplete' } });
  return true;
}
