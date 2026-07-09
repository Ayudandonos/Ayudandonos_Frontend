import axios from 'axios';
import type { ApiErrorResponse } from '@/types';

// Entrada:
// error: error capturado de una peticion API.

// Proceso:
// Extrae mensaje y errores por campo del formato estandar del backend.

// Salida:
// Retorna objeto con message y fieldErrors normalizados.
export function parseApiError(error: unknown): {
  message: string;
  fieldErrors: Record<string, string>;
  status?: number;
} {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return { message: '', fieldErrors: {} };
  }

  const data = error.response?.data;
  const fieldErrors: Record<string, string> = {};

  if (data?.errors) {
    for (const [key, messages] of Object.entries(data.errors)) {
      if (messages[0]) fieldErrors[key] = messages[0];
    }
  }

  return {
    message: data?.message ?? '',
    fieldErrors,
    status: error.response?.status,
  };
}
