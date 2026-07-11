import { UI_MESSAGES } from '@/constants/messages.constants';

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  total?: number;
  limit?: number;
  onPageChange: (page: number) => void;
}

/**
 * Entrada: page, totalPages, total y limit opcionales; onPageChange: callback de navegacion.
 * Proceso: Renderiza controles de paginacion con rango de resultados segun prototipo.
 * Salida: Retorna el elemento JSX de paginacion.
 */
export function PaginationControls({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: PaginationControlsProps) {
  if (totalPages <= 1 && !total) {
    return null;
  }

  const from = total && limit ? (page - 1) * limit + 1 : undefined;
  const to = total && limit ? Math.min(page * limit, total) : undefined;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border-default bg-white px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
      {total !== undefined && from !== undefined && to !== undefined && (
        <span className="text-text-secondary">
          {UI_MESSAGES.FOUNDATIONS_PAGINATION_RANGE(from, to, total)}
        </span>
      )}
      {totalPages > 1 && (
        <div className="flex items-center gap-3 sm:ml-auto">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="rounded-lg px-3 py-2 font-medium text-vivid-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {UI_MESSAGES.FOUNDATIONS_PAGINATION_PREV}
          </button>
          <span className="text-text-secondary">
            {UI_MESSAGES.FOUNDATIONS_PAGINATION_PAGE(page, totalPages)}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="rounded-lg px-3 py-2 font-medium text-vivid-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {UI_MESSAGES.FOUNDATIONS_PAGINATION_NEXT}
          </button>
        </div>
      )}
    </div>
  );
}
