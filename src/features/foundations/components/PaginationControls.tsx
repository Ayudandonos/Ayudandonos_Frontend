import { Button } from '@/components/ui/Button';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { cn } from '@/utils/cn';

export const FOUNDATIONS_ADMIN_PAGE_SIZE = 10;
export const ADMIN_USERS_PAGE_SIZE_OPTIONS = [10, 25, 50] as const;
export const ADMIN_CAMPAIGNS_PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  total?: number;
  limit?: number;
  pageSizeOptions?: readonly number[];
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  className?: string;
}

/**
 * Entrada: page, totalPages, total, limit y callbacks de navegacion/tamano.
 * Proceso: Renderiza pie de paginacion compacto con rango, tamano y Anterior/Siguiente.
 * Salida: Retorna el elemento JSX de paginacion o null si no hay resultados.
 */
export function PaginationControls({
  page,
  totalPages,
  total,
  limit = FOUNDATIONS_ADMIN_PAGE_SIZE,
  pageSizeOptions,
  onPageChange,
  onLimitChange,
  className,
}: PaginationControlsProps) {
  if (!total || total <= 0) {
    return null;
  }

  const safeTotalPages = Math.max(1, totalPages);
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  const canGoPrev = page > 1;
  const canGoNext = page < safeTotalPages;
  const showPageSize = Boolean(pageSizeOptions?.length && onLimitChange);

  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-2xl border border-border-default/70 bg-primary-50/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4',
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-text-secondary">
        <span className="font-medium text-text-primary">
          {UI_MESSAGES.FOUNDATIONS_PAGINATION_RANGE(from, to, total)}
        </span>

        {showPageSize ? (
          <label className="inline-flex items-center gap-2 text-xs text-text-muted">
            <span>{UI_MESSAGES.PAGINATION_PAGE_SIZE}</span>
            <select
              value={String(limit)}
              onChange={(event) => onLimitChange?.(Number(event.target.value))}
              aria-label={UI_MESSAGES.PAGINATION_PAGE_SIZE}
              className={cn(
                'h-8 min-w-[3.5rem] rounded-lg border border-border-default bg-white px-2.5 text-sm font-medium text-text-primary',
                'transition-smooth focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20',
              )}
            >
              {pageSizeOptions!.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-2 sm:justify-end">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={!canGoPrev}
          onClick={() => onPageChange(page - 1)}
        >
          {UI_MESSAGES.FOUNDATIONS_PAGINATION_PREV}
        </Button>

        <span className="inline-flex min-w-[7rem] items-center justify-center rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-text-secondary ring-1 ring-border-default/80">
          {UI_MESSAGES.FOUNDATIONS_PAGINATION_PAGE(page, safeTotalPages)}
        </span>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={!canGoNext}
          onClick={() => onPageChange(page + 1)}
        >
          {UI_MESSAGES.FOUNDATIONS_PAGINATION_NEXT}
        </Button>
      </div>
    </div>
  );
}
