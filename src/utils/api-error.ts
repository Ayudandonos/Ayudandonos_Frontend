import axios from 'axios';
import type { ApiErrorResponse } from '@/types';

export interface ParsedApiError {
  message: string;
  status?: number;
  code?: string;
  fieldErrors: Record<string, string>;
}

/**
 * Entrada: error: error capturado desde Axios o desconocido.
 * Proceso: Normaliza mensaje, codigo HTTP, code de negocio y errores por campo.
 * Salida: Retorna objeto ParsedApiError listo para la UI.
 */
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

  const codeFromErrors = fieldErrors.code || fieldErrors.errorCode || fieldErrors.error;
  const message = response?.data?.message ?? '';

  return {
    message,
    status: response?.status,
    code: codeFromErrors || undefined,
    fieldErrors,
  };
}
