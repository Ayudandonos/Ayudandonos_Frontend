import { api } from '@/services/api';
import type { ApiSuccessResponse } from '@/types';
import type { UpdateUserProfilePayload, UserProfile } from '@/features/users/types/users.types';

/**
 * Entrada: Ninguna (token en interceptor).
 * Proceso: Consulta GET /users/me con perfil y estadisticas opcionales.
 * Salida: Retorna perfil del usuario autenticado.
 */
async function fetchMyProfile(): Promise<UserProfile> {
  const { data } = await api.get<ApiSuccessResponse<UserProfile>>('/users/me');
  return data.data;
}

/**
 * Entrada: payload: campos editables del perfil.
 * Proceso: Envia PATCH /users/me al backend.
 * Salida: Retorna perfil actualizado.
 */
async function updateMyProfile(payload: UpdateUserProfilePayload): Promise<UserProfile> {
  const { data } = await api.patch<ApiSuccessResponse<UserProfile>>('/users/me', payload);
  return data.data;
}

export const usersService = {
  fetchMyProfile,
  updateMyProfile,
};
