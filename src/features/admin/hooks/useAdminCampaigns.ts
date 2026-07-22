import { useCallback, useEffect, useState } from 'react';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { adminService } from '@/features/admin/services/admin.service';
import type {
  AdminCampaignListItem,
  AdminCampaignStatus,
} from '@/features/admin/types/admin.types';
import { parseApiError } from '@/utils/api-error';

export const ADMIN_CAMPAIGNS_DEFAULT_PAGE_SIZE = 10;

type StatusFilter = 'all' | AdminCampaignStatus;

interface UseAdminCampaignsResult {
  items: AdminCampaignListItem[];
  page: number;
  pageSize: number;
  totalPages: number;
  total: number;
  search: string;
  statusFilter: StatusFilter;
  isLoading: boolean;
  error: string;
  setSearch: (value: string) => void;
  setStatusFilter: (value: StatusFilter) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  reload: () => Promise<void>;
}

/**
 * Entrada: Ninguna (usuario autenticado ADMIN).
 * Proceso: Gestiona listado paginado de campanas administrativas con filtros.
 * Salida: Retorna estado y acciones del panel de campanas.
 */
export function useAdminCampaigns(): UseAdminCampaignsResult {
  const [items, setItems] = useState<AdminCampaignListItem[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(ADMIN_CAMPAIGNS_DEFAULT_PAGE_SIZE);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearchState] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilterState] = useState<StatusFilter>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  /**
   * Entrada: Ninguna.
   * Proceso: Solicita GET /admin/campaigns segun filtros actuales.
   * Salida: No retorna valor.
   */
  const reload = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const result = await adminService.fetchCampaigns({
        page,
        limit: pageSize,
        search: debouncedSearch || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter,
      });

      setItems(result.data.items);
      setTotal(result.meta.total ?? result.data.items.length);
      setTotalPages(result.meta.totalPages ?? 1);
    } catch (loadError) {
      setItems([]);
      setTotal(0);
      setTotalPages(1);
      setError(parseApiError(loadError).message || UI_MESSAGES.ADMIN_CAMPAIGNS_LOAD_ERROR);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, debouncedSearch, statusFilter]);

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
   * Entrada: value: filtro de estado.
   * Proceso: Actualiza filtro y reinicia paginacion.
   * Salida: No retorna valor.
   */
  const setStatusFilter = (value: StatusFilter) => {
    setStatusFilterState(value);
    setPage(1);
  };

  /**
   * Entrada: size: cantidad de filas por pagina.
   * Proceso: Actualiza tamano de pagina y vuelve a la primera.
   * Salida: No retorna valor.
   */
  const setPageSize = (size: number) => {
    setPageSizeState(size);
    setPage(1);
  };

  return {
    items,
    page,
    pageSize,
    totalPages,
    total,
    search,
    statusFilter,
    isLoading,
    error,
    setSearch,
    setStatusFilter,
    setPage,
    setPageSize,
    reload,
  };
}
