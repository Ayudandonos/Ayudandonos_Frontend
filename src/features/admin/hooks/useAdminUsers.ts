import { useCallback, useEffect, useState } from 'react';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { useAuth } from '@/context/useAuth';
import { useToast } from '@/context/useToast';
import { usersService } from '@/features/users/services/users.service';
import type {
  AdminUserDetail,
  AdminUserListItem,
} from '@/features/users/types/users.types';
import { parseApiError } from '@/utils/api-error';

export const ADMIN_USERS_DEFAULT_PAGE_SIZE = 10;

type ActiveFilter = 'all' | 'active' | 'inactive';
type RoleFilter = 'all' | 'USER' | 'FOUNDATION';

interface UseAdminUsersResult {
  items: AdminUserListItem[];
  selected: AdminUserDetail | null;
  page: number;
  pageSize: number;
  totalPages: number;
  total: number;
  search: string;
  roleFilter: RoleFilter;
  activeFilter: ActiveFilter;
  isLoading: boolean;
  isProcessing: boolean;
  error: string;
  currentUserId: string | null;
  setSearch: (value: string) => void;
  setRoleFilter: (value: RoleFilter) => void;
  setActiveFilter: (value: ActiveFilter) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  selectUser: (user: AdminUserListItem) => Promise<void>;
  closeDetail: () => void;
  suspendUser: (user: AdminUserListItem) => Promise<void>;
  reactivateUser: (user: AdminUserListItem) => Promise<void>;
  reload: () => Promise<void>;
}

/**
 * Entrada: Ninguna (usuario autenticado ADMIN).
 * Proceso: Gestiona listado, filtros, detalle y suspension/reactivacion de usuarios.
 * Salida: Retorna estado y acciones del panel administrativo de usuarios.
 */
export function useAdminUsers(): UseAdminUsersResult {
  const { user } = useAuth();
  const { pushToast } = useToast();
  const [items, setItems] = useState<AdminUserListItem[]>([]);
  const [selected, setSelected] = useState<AdminUserDetail | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(ADMIN_USERS_DEFAULT_PAGE_SIZE);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearchState] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [roleFilter, setRoleFilterState] = useState<RoleFilter>('all');
  const [activeFilter, setActiveFilterState] = useState<ActiveFilter>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  /**
   * Entrada: Ninguna.
   * Proceso: Solicita el listado paginado segun filtros actuales.
   * Salida: No retorna valor.
   */
  const reload = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const result = await usersService.listUsers({
        page,
        limit: pageSize,
        search: debouncedSearch || undefined,
        role: roleFilter === 'all' ? undefined : roleFilter,
        isActive:
          activeFilter === 'all' ? undefined : activeFilter === 'active',
      });

      setItems(result.data.items);
      setTotal(result.meta.total ?? result.data.items.length);
      setTotalPages(result.meta.totalPages ?? 1);
    } catch (loadError) {
      setItems([]);
      setTotal(0);
      setTotalPages(1);
      setError(parseApiError(loadError).message || UI_MESSAGES.ADMIN_USERS_LOAD_ERROR);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, debouncedSearch, roleFilter, activeFilter]);

  useEffect(() => {
    void reload();
  }, [reload]);

  /**
   * Entrada: value: texto de busqueda.
   * Proceso: Actualiza busqueda y reinicia paginacion.
   * Salida: No retorna valor.
   */
  const setSearch = (value: string) => {
    setSearchState(value);
    setPage(1);
  };

  /**
   * Entrada: value: filtro de rol.
   * Proceso: Actualiza filtro y reinicia paginacion.
   * Salida: No retorna valor.
   */
  const setRoleFilter = (value: RoleFilter) => {
    setRoleFilterState(value);
    setPage(1);
  };

  /**
   * Entrada: value: filtro de estado activo.
   * Proceso: Actualiza filtro y reinicia paginacion.
   * Salida: No retorna valor.
   */
  const setActiveFilter = (value: ActiveFilter) => {
    setActiveFilterState(value);
    setPage(1);
  };

  /**
   * Entrada: size: cantidad de filas por pagina.
   * Proceso: Cambia el tamano de pagina y reinicia a la primera.
   * Salida: No retorna valor.
   */
  const setPageSize = (size: number) => {
    setPageSizeState(size);
    setPage(1);
  };

  /**
   * Entrada: listItem: usuario seleccionado en la tabla.
   * Proceso: Carga el detalle completo desde la API.
   * Salida: No retorna valor.
   */
  const selectUser = async (listItem: AdminUserListItem) => {
    setError('');
    setIsProcessing(true);
    try {
      const detail = await usersService.fetchUserById(listItem.id);
      setSelected(detail);
    } catch (loadError) {
      const message =
        parseApiError(loadError).message || UI_MESSAGES.ADMIN_USERS_DETAIL_ERROR;
      pushToast({ variant: 'danger', message });
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Entrada: Ninguna.
   * Proceso: Cierra el panel de detalle.
   * Salida: No retorna valor.
   */
  const closeDetail = () => {
    setSelected(null);
  };

  /**
   * Entrada: target: usuario a suspender.
   * Proceso: Desactiva el login, notifica por toast y refresca listado/detalle.
   * Salida: No retorna valor.
   */
  const suspendUser = async (target: AdminUserListItem) => {
    if (target.role === 'ADMIN') {
      pushToast({
        variant: 'warning',
        message: UI_MESSAGES.ADMIN_USERS_CANNOT_SUSPEND_ADMIN,
      });
      return;
    }

    setIsProcessing(true);
    try {
      const updated = await usersService.deactivateUser(target.id);
      pushToast({
        variant: 'success',
        message: UI_MESSAGES.ADMIN_USERS_SUSPEND_SUCCESS,
      });
      setItems((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      if (selected?.id === updated.id) {
        setSelected((current) => (current ? { ...current, ...updated } : current));
      }
      await reload();
    } catch (actionError) {
      pushToast({
        variant: 'danger',
        message: parseApiError(actionError).message || UI_MESSAGES.ADMIN_USERS_ACTION_ERROR,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Entrada: target: usuario a reactivar.
   * Proceso: Reactiva el login, notifica por toast y refresca listado/detalle.
   * Salida: No retorna valor.
   */
  const reactivateUserAction = async (target: AdminUserListItem) => {
    setIsProcessing(true);
    try {
      const updated = await usersService.reactivateUser(target.id);
      pushToast({
        variant: 'success',
        message: UI_MESSAGES.ADMIN_USERS_REACTIVATE_SUCCESS,
      });
      setItems((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      if (selected?.id === updated.id) {
        setSelected((current) => (current ? { ...current, ...updated } : current));
      }
      await reload();
    } catch (actionError) {
      pushToast({
        variant: 'danger',
        message: parseApiError(actionError).message || UI_MESSAGES.ADMIN_USERS_ACTION_ERROR,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
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
    currentUserId: user?.id ?? null,
    setSearch,
    setRoleFilter,
    setActiveFilter,
    setPage,
    setPageSize,
    selectUser,
    closeDetail,
    suspendUser,
    reactivateUser: reactivateUserAction,
    reload,
  };
}
