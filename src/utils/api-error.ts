import axios from 'axios';
import type { ApiErrorResponse } from '@/types';

export interface ParsedApiError {
  message: string;
  status?: number;
  fieldErrors: Record<string, string>;
}

// Entrada:
// error: error capturado desde Axios o desconocido.

// Proceso:
// Normaliza mensaje, codigo HTTP y errores por campo desde la respuesta API.

// Salida:
// Retorna objeto ParsedApiError listo para la UI.
export function parseApiError(error: unknown): ParsedApiError {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return { message: '', fieldErrors: {} };
  }

  const response = error.response;
  const fieldErrors: Record<string, string> = {};

  if (response?.data?.errors) {
    Object.entries(response.data.errors).forEach(([field, messages]) => {
      if (messages[0]) fieldErrors[field] = messages[0];
    });
  }

  return {
    message: response?.data?.message ?? '',
    status: response?.status,
    fieldErrors,
  };
}
