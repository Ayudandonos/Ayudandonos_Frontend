import type { NavigateFunction } from 'react-router-dom';
import { parseApiError } from '@/utils/api-error';

export type FoundationAccessGate = 'incomplete' | 'verification';

const PROFILE_MARKERS = [
  'FOUNDATIONS_ACCESS_PROFILE_REQUIRED',
  'PROFILE_REQUIRED',
  'perfil',
  'documentos',
  'profile',
] as const;

const VERIFICATION_MARKERS = [
  'FOUNDATIONS_ACCESS_VERIFICATION_REQUIRED',
  'VERIFICATION_REQUIRED',
  'verific',
] as const;

/**
 * Entrada: message/code: texto o codigo de error del backend.
 * Proceso: Detecta si el mensaje indica bloqueo por perfil incompleto.
 * Salida: Retorna true si corresponde a PROFILE_REQUIRED.
 */
function matchesMarkers(value: string | undefined, markers: readonly string[]): boolean {
  if (!value) {
    return false;
  }
  const normalized = value.toLowerCase();
  return markers.some((marker) => normalized.includes(marker.toLowerCase()));
}

/**
 * Entrada: error: error de Axios o desconocido.
 * Proceso: Clasifica 403 de fundacion operativa (perfil vs verificacion).
 * Salida: Retorna gate UI o null si no aplica.
 */
export function resolveFoundationAccessGate(error: unknown): FoundationAccessGate | null {
  const parsed = parseApiError(error);
  if (parsed.status !== 403) {
    return null;
  }

  const code = parsed.code ?? parsed.fieldErrors.code ?? '';
  const message = parsed.message ?? '';

  if (matchesMarkers(code, VERIFICATION_MARKERS) || matchesMarkers(message, VERIFICATION_MARKERS)) {
    return 'verification';
  }

  if (matchesMarkers(code, PROFILE_MARKERS) || matchesMarkers(message, PROFILE_MARKERS)) {
    return 'incomplete';
  }

  return 'incomplete';
}

/**
 * Entrada: error: error de peticion; navigate: funcion de React Router.
 * Proceso: Si el backend responde 403 operativo, redirige al perfil con gate adecuado.
 * Salida: Retorna true si se manejo el error con redireccion.
 */
export function redirectFoundationOnForbidden(error: unknown, navigate: NavigateFunction): boolean {
  const gate = resolveFoundationAccessGate(error);
  if (!gate) {
    return false;
  }

  navigate('/foundation/profile', { replace: true, state: { gate } });
  return true;
}
