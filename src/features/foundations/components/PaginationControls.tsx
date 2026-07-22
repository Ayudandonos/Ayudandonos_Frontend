import { UI_MESSAGES } from '@/constants/messages.constants';

export const FOUNDATIONS_ADMIN_PAGE_SIZE = 10;

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  total?: number;
  limit?: number;
  onPageChange: (page: number) => void;
}

/**
 * Entrada: page, totalPages, total y limit; onPageChange: callback de navegacion.
 * Proceso: Renderiza rango de resultados y controles Anterior/Siguiente (paginas de `limit`).
 * Salida: Retorna el elemento JSX de paginacion o null si no hay resultados.
 */
export function PaginationControls({
  page,
  totalPages,
  total,
  limit = FOUNDATIONS_ADMIN_PAGE_SIZE,
  onPageChange,
}: PaginationControlsProps) {
  if (!total || total <= 0) {
    return null;
  }

  const safeTotalPages = Math.max(1, totalPages);
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  const canGoPrev = page > 1;
  const canGoNext = page < safeTotalPages;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border-default bg-white px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
      <span className="text-text-secondary">
        {UI_MESSAGES.FOUNDATIONS_PAGINATION_RANGE(from, to, total)}
      </span>
      <div className="flex items-center gap-3 sm:ml-auto">
        <button
          type="button"
          disabled={!canGoPrev}
          onClick={() => onPageChange(page - 1)}
          className="rounded-lg px-3 py-2 font-medium text-vivid-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {UI_MESSAGES.FOUNDATIONS_PAGINATION_PREV}
        </button>
        <span className="text-text-secondary">
          {UI_MESSAGES.FOUNDATIONS_PAGINATION_PAGE(page, safeTotalPages)}
        </span>
        <button
          type="button"
          disabled={!canGoNext}
          onClick={() => onPageChange(page + 1)}
          className="rounded-lg px-3 py-2 font-medium text-vivid-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {UI_MESSAGES.FOUNDATIONS_PAGINATION_NEXT}
        </button>
      </div>
    </div>
  );
}
