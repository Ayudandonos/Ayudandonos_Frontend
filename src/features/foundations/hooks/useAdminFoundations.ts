import { useCallback, useEffect, useState } from 'react';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { useDebounce } from '@/hooks/useDebounce';
import { foundationsService } from '@/features/foundations/services/foundations.service';
import type {
  FoundationDetail,
  FoundationDocumentType,
  FoundationListItem,
  FoundationStats,
  FoundationStatus,
} from '@/features/foundations/types/foundations.types';
import type { UpdateFoundationStatusFormData } from '@/features/foundations/validations/foundations.validations';
import { downloadBlob } from '@/utils/file-download';
import { parseApiError } from '@/utils/api-error';

interface UseAdminFoundationsResult {
  items: FoundationListItem[];
  stats: FoundationStats | null;
  selected: FoundationDetail | null;
  page: number;
  totalPages: number;
  total: number;
  search: string;
  statusFilter: 'all' | FoundationStatus;
  category: string;
  city: string;
  department: string;
  isLoading: boolean;
  isProcessing: boolean;
  error: string;
  setSearch: (value: string) => void;
  setStatusFilter: (value: 'all' | FoundationStatus) => void;
  setCategory: (value: string) => void;
  setCity: (value: string) => void;
  setDepartment: (value: string) => void;
  setPage: (page: number) => void;
  selectFoundation: (foundation: FoundationListItem) => Promise<void>;
  closeReview: () => void;
  updateStatus: (payload: UpdateFoundationStatusFormData) => Promise<void>;
  downloadDocument: (type: FoundationDocumentType) => Promise<void>;
  fetchDocumentBlob: (type: FoundationDocumentType) => Promise<Blob>;
}

/**
 * Entrada: Ninguna.
 * Proceso: Gestiona estado del listado administrativo, seleccion, filtros y acciones de revision.
 * Salida: Retorna estado y handlers para la pagina admin de fundaciones.
 */
export function useAdminFoundations(): UseAdminFoundationsResult {
  const [items, setItems] = useState<FoundationListItem[]>([]);
  const [stats, setStats] = useState<FoundationStats | null>(null);
  const [selected, setSelected] = useState<FoundationDetail | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | FoundationStatus>('all');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [department, setDepartment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const debouncedSearch = useDebounce(search, 400);
  const debouncedCategory = useDebounce(category, 400);
  const debouncedCity = useDebounce(city, 400);
  const debouncedDepartment = useDebounce(department, 400);

  useEffect(() => {
    let cancelled = false;

    /**
     * Entrada: Ninguna (usa filtros administrativos y paginacion del hook).
     * Proceso: Consulta fundaciones con stats para el panel admin y actualiza el estado.
     * Salida: No retorna valor; actualiza items, stats, paginacion y errores del hook.
     */
    async function loadAdminData() {
      setIsLoading(true);
      setError('');

      try {
        const result = await foundationsService.fetchFoundations({
          page,
          limit: 10,
          search: debouncedSearch || undefined,
          status: statusFilter === 'all' ? undefined : statusFilter,
          category: debouncedCategory || undefined,
          city: debouncedCity || undefined,
          department: debouncedDepartment || undefined,
        });

        if (!cancelled) {
          setItems(result.data.items);
          setStats(result.data.stats ?? null);
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

    void loadAdminData();

    return () => {
      cancelled = true;
    };
  }, [page, debouncedSearch, statusFilter, debouncedCategory, debouncedCity, debouncedDepartment]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, debouncedCategory, debouncedCity, debouncedDepartment]);

  /**
   * Entrada: foundation: item del listado seleccionado por el administrador.
   * Proceso: Carga el detalle completo de la fundacion para revision administrativa.
   * Salida: No retorna valor; actualiza selected o error del hook.
   */
  const selectFoundation = useCallback(async (foundation: FoundationListItem) => {
    setError('');

    try {
      const detail = await foundationsService.fetchFoundationById(foundation.id);
      setSelected(detail);
    } catch (loadError) {
      setError(parseApiError(loadError).message || UI_MESSAGES.FOUNDATIONS_NOT_FOUND);
    }
  }, []);

  /**
   * Entrada: Ninguna.
   * Proceso: Limpia la fundacion seleccionada y cierra el panel de revision.
   * Salida: No retorna valor; establece selected en null.
   */
  const closeReview = useCallback(() => {
    setSelected(null);
  }, []);

  /**
   * Entrada: payload: nuevo estado, motivo de rechazo u observaciones administrativas.
   * Proceso: Aplica cambio de estado via API y refresca listado y estadisticas admin.
   * Salida: No retorna valor; actualiza selected, items y stats o propaga error.
   */
  const updateStatus = useCallback(
    async (payload: UpdateFoundationStatusFormData) => {
      if (!selected) {
        return;
      }

      setIsProcessing(true);
      setError('');

      try {
        const updated = await foundationsService.updateFoundationStatus(selected.id, payload);
        setSelected(updated);
        setItems((current) =>
          current.map((item) => (item.id === updated.id ? { ...item, ...updated } : item)),
        );

        const refreshed = await foundationsService.fetchFoundations({ page: 1, limit: 1 });
        if (refreshed.data.stats) {
          setStats(refreshed.data.stats);
        }
      } catch (updateError) {
        setError(parseApiError(updateError).message || UI_MESSAGES.AUTH_GENERIC_ERROR);
        throw updateError;
      } finally {
        setIsProcessing(false);
      }
    },
    [selected],
  );

  /**
   * Entrada: type: tipo documental a descargar de la fundacion seleccionada.
   * Proceso: Obtiene blob autenticado e inicia descarga en el navegador.
   * Salida: No retorna valor; dispara descarga o actualiza error del hook.
   */
  const downloadDocument = useCallback(
    async (type: FoundationDocumentType) => {
      if (!selected) {
        return;
      }

      try {
        const { blob, fileName } = await foundationsService.downloadDocument(selected.id, type);
        downloadBlob(blob, fileName);
      } catch (error) {
        setError(parseApiError(error).message || UI_MESSAGES.FOUNDATIONS_DOCUMENT_PREVIEW_ERROR);
        throw error;
      }
    },
    [selected],
  );

  /**
   * Entrada: type: tipo documental a previsualizar de la fundacion seleccionada.
   * Proceso: Descarga blob autenticado del documento para preview embebido.
   * Salida: Retorna el Blob del archivo solicitado.
   */
  const fetchDocumentBlob = useCallback(
    async (type: FoundationDocumentType) => {
      if (!selected) {
        throw new Error(UI_MESSAGES.FOUNDATIONS_NOT_FOUND);
      }

      const { blob } = await foundationsService.downloadDocument(selected.id, type);
      return blob;
    },
    [selected],
  );

  return {
    items,
    stats,
    selected,
    page,
    totalPages,
    total,
    search,
    statusFilter,
    category,
    city,
    department,
    isLoading,
    isProcessing,
    error,
    setSearch,
    setStatusFilter,
    setCategory,
    setCity,
    setDepartment,
    setPage,
    selectFoundation,
    closeReview,
    updateStatus,
    downloadDocument,
    fetchDocumentBlob,
  };
}
