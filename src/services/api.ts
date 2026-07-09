import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { ApiErrorResponse } from '@/types';
import { getAccessToken, clearAccessToken } from '@/utils/auth-storage';

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
// Adjunta el token de acceso al encabezado Authorization si existe.

// Salida:
// Retorna la configuración modificada para continuar la petición.
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
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
// En respuestas 401 elimina el token y redirige a login si no está en ruta pública.

// Salida:
// Retorna la respuesta sin modificar o rechaza la promesa con el error.
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response?.status === 401) {
      clearAccessToken();
      const isAuthRoute =
        window.location.pathname === '/login' || window.location.pathname === '/register';
      if (!isAuthRoute) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);
