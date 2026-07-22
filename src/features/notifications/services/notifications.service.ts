import { api } from '@/services/api';
import type { ApiSuccessResponse } from '@/types';
import type {
  ListNotificationsParams,
  NotificationItem,
  PaginatedNotificationsData,
  UnreadCountData,
} from '@/features/notifications/types/notifications.types';
import { parsePaginatedResponse } from '@/utils/pagination';

/**
 * Entrada: Ninguna (token en interceptor).
 * Proceso: Consulta GET /notifications/unread-count.
 * Salida: Retorna cantidad de notificaciones no leidas.
 */
async function fetchUnreadCount(): Promise<number> {
  const { data } = await api.get<ApiSuccessResponse<UnreadCountData | number>>(
    '/notifications/unread-count',
  );
  const payload = data.data;
  return typeof payload === 'number' ? payload : payload.count;
}

/**
 * Entrada: params: paginacion y filtro unreadOnly.
 * Proceso: Consulta GET /notifications.
 * Salida: Retorna items y meta.
 */
async function fetchNotifications(params: ListNotificationsParams = {}): Promise<{
  items: NotificationItem[];
  meta: NonNullable<ApiSuccessResponse['meta']>;
}> {
  const { data } = await api.get<ApiSuccessResponse<PaginatedNotificationsData | NotificationItem[]>>(
    '/notifications',
    { params },
  );
  const parsed = parsePaginatedResponse<NotificationItem>(data);
  return { items: parsed.items, meta: parsed.meta };
}

/**
 * Entrada: id: identificador de la notificacion.
 * Proceso: Envia PATCH /notifications/:id/read.
 * Salida: No retorna datos.
 */
async function markAsRead(id: string): Promise<void> {
  await api.patch(`/notifications/${id}/read`);
}

/**
 * Entrada: Ninguna.
 * Proceso: Envia PATCH /notifications/read-all.
 * Salida: No retorna datos.
 */
async function markAllAsRead(): Promise<void> {
  await api.patch('/notifications/read-all');
}

export const notificationsService = {
  fetchUnreadCount,
  fetchNotifications,
  markAsRead,
  markAllAsRead,
};
