import { api } from '@/services/api';
import type { ApiSuccessResponse } from '@/types';
import type {
  AdminUserDetail,
  AdminUserListItem,
  DonationStats,
  ListAdminUsersParams,
  PaginatedAdminUsers,
  UpdateUserProfilePayload,
  UserProfile,
} from '@/features/users/types/users.types';

interface UserDetailApiResponse {
  user: {
    id: string;
    email: string;
    fullName: string;
    role: UserProfile['role'];
    phone: string | null;
    city: string | null;
    department: string | null;
    bio: string | null;
    avatarUrl: string | null;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
  };
  foundation: { name?: string | null } | null;
  donationStats: DonationStats | null;
}

/**
 * Entrada: payload: respuesta anidada de GET/PATCH /users/me.
 * Proceso: Extrae el usuario y las estadisticas al modelo plano del frontend.
 * Salida: Retorna UserProfile listo para la UI.
 */
function mapUserProfile(payload: UserDetailApiResponse): UserProfile {
  return {
    id: payload.user.id,
    email: payload.user.email,
    fullName: payload.user.fullName,
    role: payload.user.role,
    phone: payload.user.phone,
    city: payload.user.city,
    department: payload.user.department,
    bio: payload.user.bio,
    avatarUrl: payload.user.avatarUrl,
    donationStats: payload.donationStats,
  };
}

/**
 * Entrada: payload: respuesta de detalle administrativo.
 * Proceso: Mapea usuario, fundacion y stats al modelo de detalle admin.
 * Salida: Retorna AdminUserDetail.
 */
function mapAdminUserDetail(payload: UserDetailApiResponse): AdminUserDetail {
  return {
    id: payload.user.id,
    email: payload.user.email,
    fullName: payload.user.fullName,
    role: payload.user.role,
    phone: payload.user.phone,
    city: payload.user.city,
    department: payload.user.department,
    bio: payload.user.bio,
    avatarUrl: payload.user.avatarUrl,
    isActive: payload.user.isActive ?? true,
    createdAt: payload.user.createdAt ?? new Date(0).toISOString(),
    updatedAt: payload.user.updatedAt,
    donationStats: payload.donationStats,
    foundationName: payload.foundation?.name ?? null,
  };
}

/**
 * Entrada: Ninguna (token en interceptor).
 * Proceso: Consulta GET /users/me con perfil y estadisticas opcionales.
 * Salida: Retorna perfil del usuario autenticado.
 */
async function fetchMyProfile(): Promise<UserProfile> {
  const { data } = await api.get<ApiSuccessResponse<UserDetailApiResponse>>('/users/me');
  return mapUserProfile(data.data);
}

/**
 * Entrada: payload: campos editables del perfil.
 * Proceso: Envia PATCH /users/me al backend.
 * Salida: Retorna perfil actualizado.
 */
async function updateMyProfile(payload: UpdateUserProfilePayload): Promise<UserProfile> {
  const { data } = await api.patch<ApiSuccessResponse<UserDetailApiResponse>>(
    '/users/me',
    payload,
  );
  return mapUserProfile(data.data);
}

/**
 * Entrada: params: paginacion y filtros opcionales.
 * Proceso: Consulta GET /users (solo ADMIN).
 * Salida: Retorna items y meta de paginacion.
 */
async function listUsers(params: ListAdminUsersParams = {}): Promise<{
  data: PaginatedAdminUsers;
  meta: NonNullable<ApiSuccessResponse['meta']>;
}> {
  const { data } = await api.get<ApiSuccessResponse<PaginatedAdminUsers>>('/users', {
    params: {
      page: params.page,
      limit: params.limit,
      role: params.role,
      isActive:
        params.isActive === undefined ? undefined : params.isActive ? 'true' : 'false',
      search: params.search || undefined,
    },
  });

  return {
    data: data.data,
    meta: data.meta ?? {},
  };
}

/**
 * Entrada: id: identificador UUID del usuario.
 * Proceso: Consulta GET /users/:id.
 * Salida: Retorna detalle administrativo del usuario.
 */
async function fetchUserById(id: string): Promise<AdminUserDetail> {
  const { data } = await api.get<ApiSuccessResponse<UserDetailApiResponse>>(`/users/${id}`);
  return mapAdminUserDetail(data.data);
}

/**
 * Entrada: id: identificador del usuario a suspender.
 * Proceso: Envia DELETE /users/:id para desactivar el login.
 * Salida: Retorna el usuario desactivado.
 */
async function deactivateUser(id: string): Promise<AdminUserListItem> {
  const { data } = await api.delete<ApiSuccessResponse<AdminUserListItem>>(`/users/${id}`);
  return data.data;
}

/**
 * Entrada: id: identificador del usuario a reactivar.
 * Proceso: Envia PATCH /users/:id/reactivate.
 * Salida: Retorna el usuario reactivado.
 */
async function reactivateUser(id: string): Promise<AdminUserListItem> {
  const { data } = await api.patch<ApiSuccessResponse<AdminUserListItem>>(
    `/users/${id}/reactivate`,
  );
  return data.data;
}

export const usersService = {
  fetchMyProfile,
  updateMyProfile,
  listUsers,
  fetchUserById,
  deactivateUser,
  reactivateUser,
};
