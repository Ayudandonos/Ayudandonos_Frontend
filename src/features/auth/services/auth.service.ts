import { api } from '@/services/api';
import type { ApiSuccessResponse, AuthTokenData, MeData } from '@/types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterUserPayload {
  email: string;
  password: string;
  fullName: string;
}

export interface RegisterFoundationPayload {
  email: string;
  password: string;
  fullName: string;
  foundationName: string;
  description?: string;
}

// Entrada:
// payload: credenciales de login.

// Proceso:
// Envía POST /auth/login al backend.

// Salida:
// Retorna accessToken, user y foundation opcional.
async function login(payload: LoginPayload): Promise<AuthTokenData> {
  const { data } = await api.post<ApiSuccessResponse<AuthTokenData>>('/auth/login', payload);
  return data.data;
}

// Entrada:
// payload: datos de registro de donante.

// Proceso:
// Envía POST /auth/register/user al backend.

// Salida:
// Retorna accessToken y user.
async function registerUser(payload: RegisterUserPayload): Promise<AuthTokenData> {
  const { data } = await api.post<ApiSuccessResponse<AuthTokenData>>(
    '/auth/register/user',
    payload,
  );
  return data.data;
}

// Entrada:
// payload: datos de registro de fundación.

// Proceso:
// Envía POST /auth/register/foundation al backend.

// Salida:
// Retorna accessToken, user y foundation.
async function registerFoundation(payload: RegisterFoundationPayload): Promise<AuthTokenData> {
  const { data } = await api.post<ApiSuccessResponse<AuthTokenData>>(
    '/auth/register/foundation',
    payload,
  );
  return data.data;
}

// Entrada:
// Ninguna (token en interceptor).

// Proceso:
// Envía POST /auth/logout al backend.

// Salida:
// No retorna datos.
async function logout(): Promise<void> {
  await api.post('/auth/logout');
}

// Entrada:
// Ninguna (token en interceptor).

// Proceso:
// Envía GET /auth/me al backend.

// Salida:
// Retorna user y foundation.
async function fetchMe(): Promise<MeData> {
  const { data } = await api.get<ApiSuccessResponse<MeData>>('/auth/me');
  return data.data;
}

export const authService = {
  login,
  registerUser,
  registerFoundation,
  logout,
  fetchMe,
};
