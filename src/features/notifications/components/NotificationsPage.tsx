import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { NotificationsSkeleton } from '@/features/notifications/components/NotificationsSkeleton';
import { notificationsService } from '@/features/notifications/services/notifications.service';
import type { NotificationItem } from '@/features/notifications/types/notifications.types';
import { parseApiError } from '@/utils/api-error';
import { formatDate } from '@/utils/date-format';
import { cn } from '@/utils/cn';

const PAGE_SIZE = 15;

/**
 * Entrada: Ninguna (usuario autenticado).
 * Proceso: Lista notificaciones paginadas, marca leidas y navega por linkPath.
 * Salida: Retorna el elemento JSX del centro de notificaciones.
 */
export function NotificationsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  /**
   * Entrada: Ninguna.
   * Proceso: Carga pagina actual del listado de notificaciones.
   * Salida: No retorna valor.
   */
  const loadNotifications = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await notificationsService.fetchNotifications({
        page,
        limit: PAGE_SIZE,
        unreadOnly,
      });
      setItems(result.items);
      setTotalPages(result.meta.totalPages ?? 1);
    } catch (loadError) {
      setError(parseApiError(loadError).message || UI_MESSAGES.NOTIFICATIONS_LOAD_ERROR);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, unreadOnly]);

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  /**
   * Entrada: item: notificacion seleccionada.
   * Proceso: Marca como leida y navega si hay linkPath.
   * Salida: No retorna valor.
   */
  async function handleOpen(item: NotificationItem) {
    try {
      if (!item.isRead) {
        await notificationsService.markAsRead(item.id);
        setItems((current) =>
          current.map((entry) => (entry.id === item.id ? { ...entry, isRead: true } : entry)),
        );
      }
      if (item.linkPath) {
        navigate(item.linkPath);
      }
    } catch {
      setError(UI_MESSAGES.NOTIFICATIONS_LOAD_ERROR);
    }
  }

  /**
   * Entrada: Ninguna.
   * Proceso: Marca todas las notificaciones como leidas.
   * Salida: No retorna valor.
   */
  async function handleMarkAllRead() {
    setIsMarkingAll(true);
    setError('');
    try {
      await notificationsService.markAllAsRead();
      await loadNotifications();
    } catch {
      setError(UI_MESSAGES.NOTIFICATIONS_LOAD_ERROR);
    } finally {
      setIsMarkingAll(false);
    }
  }

  if (isLoading && items.length === 0) {
    return <NotificationsSkeleton />;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-display text-text-primary">{UI_MESSAGES.NOTIFICATIONS_TITLE}</h1>
          <p className="mt-2 text-body text-text-secondary">{UI_MESSAGES.NOTIFICATIONS_DESCRIPTION}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setUnreadOnly((value) => !value);
              setPage(1);
            }}
          >
            {unreadOnly ? UI_MESSAGES.NOTIFICATIONS_SHOW_ALL : UI_MESSAGES.NOTIFICATIONS_UNREAD_ONLY}
          </Button>
          <Button type="button" variant="secondary" disabled={isMarkingAll} onClick={() => void handleMarkAllRead()}>
            {UI_MESSAGES.NOTIFICATIONS_MARK_ALL_READ}
          </Button>
        </div>
      </header>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      {items.length === 0 ? (
        <EmptyState
          title={UI_MESSAGES.NOTIFICATIONS_EMPTY}
          onRetry={error ? () => void loadNotifications() : undefined}
        />
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => void handleOpen(item)}
                className={cn(
                  'w-full rounded-xl border border-border-default bg-white p-4 text-left transition-colors',
                  'hover:border-primary-300 hover:bg-vivid-50/80',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600',
                  !item.isRead && 'border-l-4 border-l-primary-600 bg-primary-50/40',
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-text-primary">{item.title}</p>
                    <p className="mt-1 text-sm text-text-secondary">{item.body}</p>
                  </div>
                  <time className="shrink-0 text-xs text-text-muted" dateTime={item.createdAt}>
                    {formatDate(item.createdAt)}
                  </time>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button
            type="button"
            variant="secondary"
            disabled={page <= 1 || isLoading}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            {UI_MESSAGES.FOUNDATIONS_PAGINATION_PREV}
          </Button>
          <span className="text-sm text-text-secondary">
            {UI_MESSAGES.FOUNDATIONS_PAGINATION_PAGE(page, totalPages)}
          </span>
          <Button
            type="button"
            variant="secondary"
            disabled={page >= totalPages || isLoading}
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
          >
            {UI_MESSAGES.FOUNDATIONS_PAGINATION_NEXT}
          </Button>
        </div>
      )}
    </div>
  );
}
