import { AppImage } from '@/components/ui/AppImage';
import { Button } from '@/components/ui/Button';
import { UI_MESSAGES } from '@/constants/messages.constants';
import type { AdminUserListItem } from '@/features/users/types/users.types';
import type { UserRole } from '@/types';
import { cn } from '@/utils/cn';

interface AdminUsersTableProps {
  items: AdminUserListItem[];
  selectedId?: string;
  currentUserId: string | null;
  isProcessing: boolean;
  onView: (user: AdminUserListItem) => void;
  onSuspend: (user: AdminUserListItem) => void;
  onReactivate: (user: AdminUserListItem) => void;
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
 * Entrada: role: rol del usuario.
 * Proceso: Asigna estilo de badge segun rol.
 * Salida: Retorna clases Tailwind del badge.
 */
function roleBadgeClass(role: UserRole): string {
  if (role === 'ADMIN') return 'bg-primary-100 text-primary-700';
  if (role === 'FOUNDATION') return 'bg-info-500/10 text-info-600';
  return 'bg-secondary-100 text-secondary-700';
}

/**
 * Entrada: items y callbacks de acciones administrativas.
 * Proceso: Renderiza tabla amigable con avatar, badges y acciones en fila.
 * Salida: Retorna el elemento JSX de la tabla.
 */
export function AdminUsersTable({
  items,
  selectedId,
  currentUserId,
  isProcessing,
  onView,
  onSuspend,
  onReactivate,
}: AdminUsersTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border-default/80 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-border-default/80 bg-primary-50/60 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">
              <th className="px-5 py-3.5">{UI_MESSAGES.ADMIN_USERS_TABLE_NAME}</th>
              <th className="hidden px-5 py-3.5 md:table-cell">
                {UI_MESSAGES.ADMIN_USERS_TABLE_ROLE}
              </th>
              <th className="hidden px-5 py-3.5 lg:table-cell">
                {UI_MESSAGES.ADMIN_USERS_TABLE_CITY}
              </th>
              <th className="px-5 py-3.5">{UI_MESSAGES.ADMIN_USERS_TABLE_STATUS}</th>
              <th className="px-5 py-3.5 text-right">
                {UI_MESSAGES.ADMIN_USERS_TABLE_ACTIONS}
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const isSelf = currentUserId === item.id;
              const isAdmin = item.role === 'ADMIN';
              const canSuspend = item.isActive && !isSelf && !isAdmin;
              const canReactivate = !item.isActive && !isAdmin;
              const initial = item.fullName.trim().charAt(0).toUpperCase() || '?';
              const avatarSrc = item.avatarUrl?.trim() || undefined;
              const isSelected = selectedId === item.id;

              return (
                <tr
                  key={item.id}
                  className={cn(
                    'border-b border-border-default/60 transition-colors last:border-b-0',
                    isSelected ? 'bg-primary-50/70' : 'hover:bg-vivid-50/60',
                  )}
                >
                  <td className="px-5 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      {avatarSrc ? (
                        <AppImage
                          src={avatarSrc}
                          alt=""
                          className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-white"
                        />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700 ring-2 ring-white">
                          {initial}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-text-primary">{item.fullName}</p>
                        <p className="truncate text-xs text-text-muted">{item.email}</p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 md:hidden">
                          <span
                            className={cn(
                              'inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium',
                              roleBadgeClass(item.role),
                            )}
                          >
                            {roleLabel(item.role)}
                          </span>
                          <span className="text-[11px] text-text-muted">
                            {item.city?.trim() || '—'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="hidden px-5 py-4 md:table-cell">
                    <span
                      className={cn(
                        'inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold',
                        roleBadgeClass(item.role),
                      )}
                    >
                      {roleLabel(item.role)}
                    </span>
                  </td>

                  <td className="hidden whitespace-nowrap px-5 py-4 text-text-secondary lg:table-cell">
                    {item.city?.trim() || '—'}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={cn(
                        'inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold',
                        item.isActive
                          ? 'bg-success-500/15 text-success-600'
                          : 'bg-error-500/15 text-error-600',
                      )}
                    >
                      {item.isActive
                        ? UI_MESSAGES.ADMIN_USERS_STATUS_ACTIVE
                        : UI_MESSAGES.ADMIN_USERS_STATUS_SUSPENDED}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex flex-nowrap items-center justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="shrink-0 whitespace-nowrap"
                        disabled={isProcessing}
                        onClick={() => onView(item)}
                      >
                        {UI_MESSAGES.ADMIN_USERS_VIEW_SHORT}
                      </Button>
                      {canSuspend ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="shrink-0 whitespace-nowrap border-error-500/30 text-error-600 hover:border-error-500/50 hover:bg-error-500/10 hover:text-error-600"
                          disabled={isProcessing}
                          onClick={() => onSuspend(item)}
                        >
                          {UI_MESSAGES.ADMIN_USERS_SUSPEND_SHORT}
                        </Button>
                      ) : null}
                      {canReactivate ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="shrink-0 whitespace-nowrap border-success-500/30 text-success-600 hover:border-success-500/50 hover:bg-success-500/10 hover:text-success-600"
                          disabled={isProcessing}
                          onClick={() => onReactivate(item)}
                        >
                          {UI_MESSAGES.ADMIN_USERS_REACTIVATE_SHORT}
                        </Button>
                      ) : null}
                      {isAdmin ? (
                        <span className="shrink-0 whitespace-nowrap rounded-full bg-secondary-100 px-2.5 py-1 text-[11px] font-medium text-text-muted">
                          {UI_MESSAGES.ADMIN_USERS_PROTECTED_ADMIN}
                        </span>
                      ) : null}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
