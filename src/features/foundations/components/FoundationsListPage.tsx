import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { useDebounce } from '@/hooks/useDebounce';
import { FoundationCard } from '@/features/foundations/components/FoundationCard';
import { EmptyState } from '@/features/foundations/components/EmptyState';
import { FoundationFilters } from '@/features/foundations/components/FoundationFilters';
import { PaginationControls } from '@/features/foundations/components/PaginationControls';
import { FoundationsLoadingSkeleton } from '@/features/foundations/components/FoundationsLoadingSkeleton';
import { useFoundationsList } from '@/features/foundations/hooks/useFoundationsList';

/**
 * Entrada: Ninguna.
 * Proceso: Orquesta listado publico de fundaciones verificadas con busqueda y filtros.
 * Salida: Retorna el elemento JSX del listado publico de fundaciones.
 */
export function FoundationsListPage() {
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');
  const debouncedCity = useDebounce(city, 400);
  const debouncedCategory = useDebounce(category, 400);

  const { items, page, totalPages, total, search, isLoading, error, setSearch, setPage } =
    useFoundationsList({
      limit: 9,
      city: debouncedCity || undefined,
      category: debouncedCategory || undefined,
    });

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">{UI_MESSAGES.FOUNDATIONS_TITLE}</h1>
        <p className="mt-2 max-w-3xl text-text-secondary">{UI_MESSAGES.FOUNDATIONS_DESCRIPTION}</p>
      </header>

      <FoundationFilters
        search={search}
        city={city}
        category={category}
        onSearchChange={setSearch}
        onCityChange={setCity}
        onCategoryChange={setCategory}
        showExtendedFilters
      />

      {isLoading && <FoundationsLoadingSkeleton variant="cards" />}
      {error && !isLoading && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      {!isLoading && !error && items.length === 0 && (
        <EmptyState message={UI_MESSAGES.FOUNDATIONS_EMPTY_PUBLIC} />
      )}

      {!isLoading && !error && items.length > 0 && (
        <>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {items.map((foundation) => (
              <FoundationCard key={foundation.id} foundation={foundation} />
            ))}
            <div className="flex flex-col justify-center rounded-xl bg-vivid-700 p-8 text-white">
              <h3 className="text-xl font-bold">{UI_MESSAGES.FOUNDATIONS_CTA_TITLE}</h3>
              <p className="mt-2 text-sm text-white/90">{UI_MESSAGES.FOUNDATIONS_CTA_DESC}</p>
              <Link to="/register" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">
                {UI_MESSAGES.FOUNDATIONS_CTA_ACTION} →
              </Link>
            </div>
          </div>
          <PaginationControls
            page={page}
            totalPages={totalPages}
            total={total}
            limit={9}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
