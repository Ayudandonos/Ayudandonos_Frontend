import { api } from './api';
import type { ApiSuccessResponse, HealthCheck } from '@/types';

export const healthService = {
  // Entrada:
  // Ninguna.

  // Proceso:
  // Realiza una petición GET al endpoint /health y extrae los datos de la respuesta.

  // Salida:
  // Retorna el objeto HealthCheck con el estado del servidor.
  async check(): Promise<HealthCheck> {
    const { data } = await api.get<ApiSuccessResponse<HealthCheck>>('/health');
    return data.data;
  },
};
