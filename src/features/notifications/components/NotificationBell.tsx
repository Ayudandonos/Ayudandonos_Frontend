import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { useNotificationUnreadCount } from '@/features/notifications/hooks/useNotificationUnreadCount';
import { cn } from '@/utils/cn';

interface NotificationBellProps {
  enabled: boolean;
}

/**
 * Entrada: enabled: indica si el usuario puede recibir notificaciones in-app.
 * Proceso: Muestra icono con badge de no leidas y enlace al listado.
 * Salida: Retorna el elemento JSX de la campana de notificaciones.
 */
export function NotificationBell({ enabled }: NotificationBellProps) {
  const { count } = useNotificationUnreadCount(enabled);
  const navigate = useNavigate();

  if (!enabled) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => navigate('/notifications')}
      className={cn(
        'relative flex h-10 w-10 items-center justify-center rounded-full border border-border-default',
        'text-text-secondary transition-colors hover:bg-vivid-50 hover:text-text-primary',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2',
      )}
      aria-label={UI_MESSAGES.NOTIFICATIONS_ARIA_BELL}
    >
      <Icon name="notification" size="md" decorative />
      {count > 0 && (
        <span
          className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-error-600 px-1 text-[10px] font-bold text-white"
          aria-live="polite"
        >
          {UI_MESSAGES.NOTIFICATIONS_UNREAD_BADGE(count)}
        </span>
      )}
    </button>
  );
}

/**
 * Entrada: Ninguna (variante de enlace para SideNav).
 * Proceso: Enlace lateral a notificaciones con badge opcional.
 * Salida: Retorna el elemento JSX del enlace de notificaciones.
 */
export function NotificationNavLink({ enabled }: NotificationBellProps) {
  const { count } = useNotificationUnreadCount(enabled);

  if (!enabled) {
    return null;
  }

  return (
    <Link
      to="/notifications"
      className="flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium text-text-secondary hover:bg-vivid-100"
    >
      <span>{UI_MESSAGES.NAV_NOTIFICATIONS}</span>
      {count > 0 && (
        <span className="rounded-full bg-error-600 px-2 py-0.5 text-xs font-semibold text-white">
          {UI_MESSAGES.NOTIFICATIONS_UNREAD_BADGE(count)}
        </span>
      )}
    </Link>
  );
}
