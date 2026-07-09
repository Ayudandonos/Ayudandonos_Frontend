import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { ApiErrorResponse } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Entrada:
// config: configuración de la petición saliente.

// Proceso:
// Adjunta el token de acceso al encabezado Authorization si existe en localStorage.

// Salida:
// Retorna la configuración modificada para continuar la petición.
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Entrada:
// response: respuesta exitosa o error de Axios.

// Proceso:
// En respuestas 401 elimina el token expirado del almacenamiento local y propaga el error.

// Salida:
// Retorna la respuesta sin modificar o rechaza la promesa con el error.
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
    }
    return Promise.reject(error);
  },
);
