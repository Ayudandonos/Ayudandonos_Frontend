import { Skeleton } from '@/components/ui/Skeleton';

interface FoundationsLoadingSkeletonProps {
  variant: 'cards' | 'table' | 'profile';
}

/**
 * Entrada: variant: tipo de layout a simular durante carga.
 * Proceso: Renderiza placeholders animados acordes al listado o perfil.
 * Salida: Retorna el elemento JSX del skeleton de fundaciones.
 */
export function FoundationsLoadingSkeleton({ variant }: FoundationsLoadingSkeletonProps) {
  if (variant === 'table') {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (variant === 'profile') {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-24 w-24 rounded-xl" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-xl border border-border-default">
          <Skeleton className="h-28 w-full rounded-none" />
          <div className="space-y-3 p-5">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
