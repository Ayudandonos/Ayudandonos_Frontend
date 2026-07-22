import { useState } from 'react';
import { Alert } from '@/components/ui/Alert';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { AdminUserDetailModal } from '@/features/admin/components/AdminUserDetailModal';
import { AdminUsersFilters } from '@/features/admin/components/AdminUsersFilters';
import { AdminUsersSkeleton } from '@/features/admin/components/AdminUsersSkeleton';
import { AdminUsersTable } from '@/features/admin/components/AdminUsersTable';
import { useAdminUsers } from '@/features/admin/hooks/useAdminUsers';
import {
  ADMIN_USERS_PAGE_SIZE_OPTIONS,
  PaginationControls,
} from '@/features/foundations/components/PaginationControls';
import type { AdminUserListItem } from '@/features/users/types/users.types';

/**
 * Entrada: Ninguna (usuario autenticado con rol ADMIN).
 * Proceso: Orquesta listado, detalle y suspension/reactivacion de login de usuarios.
 * Salida: Retorna el elemento JSX de la pagina de gestion de usuarios.
 */
export function AdminUsersPage() {
  const {
    items,
    selected,
    page,
    pageSize,
    totalPages,
    total,
    search,
    roleFilter,
    activeFilter,
    isLoading,
    isProcessing,
    error,
    successMessage,
    currentUserId,
    setSearch,
    setRoleFilter,
    setActiveFilter,
    setPage,
    setPageSize,
    selectUser,
    closeDetail,
    suspendUser,
    reactivateUser,
    reload,
  } = useAdminUsers();

  const [pendingAction, setPendingAction] = useState<{
    type: 'suspend' | 'reactivate';
    user: AdminUserListItem;
  } | null>(null);

  /**
   * Entrada: Ninguna.
   * Proceso: Ejecuta la accion confirmada de suspension o reactivacion.
   * Salida: No retorna valor.
   */
  const confirmPendingAction = async () => {
    if (!pendingAction) return;
    const { type, user } = pendingAction;
    setPendingAction(null);
    if (type === 'suspend') {
      await suspendUser(user);
      return;
    }
    await reactivateUser(user);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <header>
        <h1 className="text-display text-text-primary">{UI_MESSAGES.ADMIN_USERS_PAGE_TITLE}</h1>
        <p className="mt-2 max-w-3xl text-body text-text-secondary">
          {UI_MESSAGES.ADMIN_USERS_PAGE_DESCRIPTION}
        </p>
      </header>

      {successMessage ? <Alert variant="success">{successMessage}</Alert> : null}
      {error && !isLoading ? <Alert variant="danger">{error}</Alert> : null}

      <AdminUsersFilters
        search={search}
        roleFilter={roleFilter}
        activeFilter={activeFilter}
        onSearchChange={setSearch}
        onRoleFilterChange={setRoleFilter}
        onActiveFilterChange={setActiveFilter}
      />

      {isLoading ? <AdminUsersSkeleton /> : null}

      {!isLoading && items.length === 0 ? (
        <EmptyState
          title={UI_MESSAGES.ADMIN_USERS_EMPTY_TITLE}
          description={UI_MESSAGES.ADMIN_USERS_EMPTY_DESCRIPTION}
          onRetry={() => void reload()}
        />
      ) : null}

      {!isLoading && items.length > 0 ? (
        <div className="space-y-4">
          <AdminUsersTable
            items={items}
            selectedId={selected?.id}
            currentUserId={currentUserId}
            isProcessing={isProcessing}
            onView={(user) => void selectUser(user)}
            onSuspend={(user) => setPendingAction({ type: 'suspend', user })}
            onReactivate={(user) => setPendingAction({ type: 'reactivate', user })}
          />
          <PaginationControls
            page={page}
            totalPages={totalPages}
            total={total}
            limit={pageSize}
            pageSizeOptions={ADMIN_USERS_PAGE_SIZE_OPTIONS}
            onPageChange={setPage}
            onLimitChange={setPageSize}
          />
        </div>
      ) : null}

      {selected ? (
        <AdminUserDetailModal
          user={selected}
          currentUserId={currentUserId}
          isProcessing={isProcessing}
          onClose={closeDetail}
          onSuspend={() => setPendingAction({ type: 'suspend', user: selected })}
          onReactivate={() => setPendingAction({ type: 'reactivate', user: selected })}
        />
      ) : null}

      {pendingAction ? (
        <ConfirmDialog
          title={
            pendingAction.type === 'suspend'
              ? UI_MESSAGES.ADMIN_USERS_SUSPEND_CONFIRM_TITLE
              : UI_MESSAGES.ADMIN_USERS_REACTIVATE_CONFIRM_TITLE
          }
          description={
            pendingAction.type === 'suspend'
              ? UI_MESSAGES.ADMIN_USERS_SUSPEND_CONFIRM_DESC(pendingAction.user.fullName)
              : UI_MESSAGES.ADMIN_USERS_REACTIVATE_CONFIRM_DESC(pendingAction.user.fullName)
          }
          confirmLabel={
            pendingAction.type === 'suspend'
              ? UI_MESSAGES.ADMIN_USERS_SUSPEND
              : UI_MESSAGES.ADMIN_USERS_REACTIVATE
          }
          isProcessing={isProcessing}
          onConfirm={() => void confirmPendingAction()}
          onCancel={() => setPendingAction(null)}
        />
      ) : null}
    </div>
  );
}
