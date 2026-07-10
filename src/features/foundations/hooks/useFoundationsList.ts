import { useEffect, useState } from 'react';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { useDebounce } from '@/hooks/useDebounce';
import { foundationsService } from '@/features/foundations/services/foundations.service';
import type { FoundationListItem } from '@/features/foundations/types/foundations.types';
import { parseApiError } from '@/utils/api-error';

interface UseFoundationsListOptions {
  limit?: number;
  city?: string;
  category?: string;
  department?: string;
}

interface UseFoundationsListResult {
  items: FoundationListItem[];
  page: number;
  totalPages: number;
  total: number;
  search: string;
  isLoading: boolean;
  error: string;
  setSearch: (value: string) => void;
  setPage: (page: number) => void;
}

/**
 * Entrada: options: limite de pagina y filtros opcionales de ubicacion o categoria.
 * Proceso: Carga fundaciones verificadas desde la API con busqueda y paginacion.
 * Salida: Retorna estado y handlers para el listado publico.
 */
export function useFoundationsList(options: UseFoundationsListOptions = {}): UseFoundationsListResult {
  const { limit = 9, city, category, department } = options;
  const [items, setItems] = useState<FoundationListItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    let cancelled = false;

    async function loadFoundations() {
      setIsLoading(true);
      setError('');

      try {
        const result = await foundationsService.fetchFoundations({
          page,
          limit,
          search: debouncedSearch || undefined,
          city,
          category,
          department,
        });

        if (!cancelled) {
          setItems(result.data.items);
          setTotalPages(result.meta.totalPages ?? 1);
          setTotal(result.meta.total ?? 0);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(parseApiError(loadError).message || UI_MESSAGES.FOUNDATIONS_LOAD_ERROR);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadFoundations();

    return () => {
      cancelled = true;
    };
  }, [page, debouncedSearch, limit, city, category, department]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, city, category, department]);

  return {
    items,
    page,
    totalPages,
    total,
    search,
    isLoading,
    error,
    setSearch,
    setPage,
  };
}
