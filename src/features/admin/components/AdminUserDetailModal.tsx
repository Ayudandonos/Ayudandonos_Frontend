import { useEffect } from 'react';
import { AppImage } from '@/components/ui/AppImage';
import { Button } from '@/components/ui/Button';
import { UI_MESSAGES } from '@/constants/messages.constants';
import type { AdminUserDetail } from '@/features/users/types/users.types';
import type { UserRole } from '@/types';
import { cn } from '@/utils/cn';

interface AdminUserDetailModalProps {
  user: AdminUserDetail;
  currentUserId: string | null;
  isProcessing: boolean;
  onClose: () => void;
  onSuspend: () => void;
  onReactivate: () => void;
}

/**
 * Entrada: role: rol del usuario.
 * Proceso: Traduce el rol a etiqueta de UI.
 * Salida: Retorna texto localizado del rol.
 */
function roleLabel(role: UserRole): string {
  if (role === 'ADMIN') return UI_MESSAGES.ROLE_ADMIN;
  if (role === 'FOUNDATION') return UI_MESSAGES.ROLE_FOUNDATION;
  return UI_MESSAGES.ROLE_USER;
}

/**
 * Entrada: value: texto opcional.
 * Proceso: Normaliza vacios a guion tipografico.
 * Salida: Retorna valor visible o — .
 */
function displayValue(value: string | null | undefined): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : '—';
}

/**
 * Entrada: isoDate: fecha ISO.
 * Proceso: Formatea fecha corta en es-CO.
 * Salida: Retorna cadena legible de fecha.
 */
function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Entrada: user: detalle; callbacks de cierre y suspension/reactivacion.
 * Proceso: Muestra ficha del usuario con cierre por overlay/Escape y acciones de acceso.
 * Salida: Retorna el elemento JSX del modal de detalle.
 */
export function AdminUserDetailModal({
  user,
  currentUserId,
  isProcessing,
  onClose,
  onSuspend,
  onReactivate,
}: AdminUserDetailModalProps) {
  const isSelf = currentUserId === user.id;
  const isAdmin = user.role === 'ADMIN';
  const canSuspend = user.isActive && !isSelf && !isAdmin;
  const canReactivate = !user.isActive && !isAdmin;
  const initial = user.fullName.trim().charAt(0).toUpperCase() || '?';
  const avatarSrc = user.avatarUrl?.trim() || undefined;

  useEffect(() => {
    /**
     * Entrada: event: tecla pulsada.
     * Proceso: Cierra el modal con Escape.
     * Salida: No retorna valor.
     */
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const rows: Array<{ label: string; value: string }> = [
    { label: UI_MESSAGES.ADMIN_USERS_TABLE_ROLE, value: roleLabel(user.role) },
    { label: UI_MESSAGES.USER_PROFILE_PHONE, value: displayValue(user.phone) },
    { label: UI_MESSAGES.USER_PROFILE_CITY, value: displayValue(user.city) },
    { label: UI_MESSAGES.USER_PROFILE_DEPARTMENT, value: displayValue(user.department) },
    ...(user.foundationName
      ? [{ label: UI_MESSAGES.ADMIN_USERS_FOUNDATION, value: user.foundationName }]
      : []),
    { label: UI_MESSAGES.ADMIN_USERS_CREATED_AT, value: formatDate(user.createdAt) },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-0 backdrop-blur-[2px] sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-user-detail-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label={UI_MESSAGES.ADMIN_USERS_CLOSE_OVERLAY}
        onClick={onClose}
      />

      <div
        className={cn(
          'relative z-10 flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden',
          'rounded-t-2xl border border-border-default/80 bg-white shadow-xl sm:rounded-2xl',
          'animate-fade-in',
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="border-b border-border-default/70 bg-primary-50/50 px-5 py-4 sm:px-6">
          <div className="flex items-start gap-4">
            {avatarSrc ? (
              <AppImage
                src={avatarSrc}
                alt=""
                className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-white"
              />
            ) : (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-100 text-lg font-semibold text-primary-700 ring-2 ring-white">
                {initial}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary-700">
                {UI_MESSAGES.ADMIN_USERS_DETAIL_SUBTITLE}
              </p>
              <h2
                id="admin-user-detail-title"
                className="mt-0.5 truncate text-xl font-bold tracking-tight text-text-primary"
              >
                {user.fullName}
              </h2>
              <p className="mt-0.5 truncate text-sm text-text-secondary">{user.email}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span
                  className={cn(
                    'inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold',
                    user.isActive
                      ? 'bg-success-500/15 text-success-600'
                      : 'bg-error-500/15 text-error-600',
                  )}
                >
                  {user.isActive
                    ? UI_MESSAGES.ADMIN_USERS_STATUS_ACTIVE
                    : UI_MESSAGES.ADMIN_USERS_STATUS_SUSPENDED}
                </span>
                <span className="inline-flex rounded-full bg-secondary-100 px-2.5 py-1 text-[11px] font-semibold text-secondary-700">
                  {roleLabel(user.role)}
                </span>
                {isAdmin ? (
                  <span className="inline-flex rounded-full bg-primary-100 px-2.5 py-1 text-[11px] font-semibold text-primary-700">
                    {UI_MESSAGES.ADMIN_USERS_PROTECTED_ADMIN}
                  </span>
                ) : null}
              </div>
            </div>

            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              {UI_MESSAGES.COMMON_CLOSE}
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <dl className="grid gap-3 sm:grid-cols-2">
            {rows.map((row) => (
              <div
                key={row.label}
                className="rounded-xl border border-border-default/70 bg-vivid-50/40 px-3.5 py-3"
              >
                <dt className="text-xs font-medium text-text-muted">{row.label}</dt>
                <dd className="mt-1 text-sm font-semibold text-text-primary">{row.value}</dd>
              </div>
            ))}
          </dl>

          {user.bio ? (
            <div className="mt-3 rounded-xl border border-border-default/70 bg-white px-3.5 py-3">
              <p className="text-xs font-medium text-text-muted">{UI_MESSAGES.USER_PROFILE_BIO}</p>
              <p className="mt-1 text-sm leading-relaxed text-text-primary">{user.bio}</p>
            </div>
          ) : null}

          {isSelf || (isAdmin && !isSelf) ? (
            <p className="mt-4 rounded-xl border border-border-default/70 bg-secondary-50 px-3.5 py-3 text-xs text-text-secondary">
              {isSelf
                ? UI_MESSAGES.ADMIN_USERS_CANNOT_SUSPEND_SELF
                : UI_MESSAGES.ADMIN_USERS_CANNOT_SUSPEND_ADMIN}
            </p>
          ) : null}
        </div>

        {(canSuspend || canReactivate) && (
          <footer className="flex flex-col-reverse gap-3 border-t border-border-default/70 bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            {canSuspend ? (
              <Button
                type="button"
                variant="danger"
                disabled={isProcessing}
                isLoading={isProcessing}
                onClick={onSuspend}
              >
                {UI_MESSAGES.ADMIN_USERS_SUSPEND}
              </Button>
            ) : null}
            {canReactivate ? (
              <Button
                type="button"
                disabled={isProcessing}
                isLoading={isProcessing}
                onClick={onReactivate}
              >
                {UI_MESSAGES.ADMIN_USERS_REACTIVATE}
              </Button>
            ) : null}
          </footer>
        )}
      </div>
    </div>
  );
}
