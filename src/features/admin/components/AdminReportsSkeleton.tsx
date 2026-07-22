import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

/**
 * Entrada: Ninguna.
 * Proceso: Renderiza placeholders de carga para KPIs y graficos de reportes.
 * Salida: Retorna el elemento JSX del skeleton.
 */
export function AdminReportsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-5 w-full max-w-xl" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} glass={false} className="border border-border-default bg-white p-4">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-2 h-8 w-16" />
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} glass={false} className="border border-border-default bg-white p-6">
            <Skeleton className="mb-4 h-6 w-48" />
            <Skeleton className="h-64 w-full" />
          </Card>
        ))}
      </div>
      <Card glass={false} className="border border-border-default bg-white p-6">
        <Skeleton className="mb-4 h-6 w-64" />
        <Skeleton className="h-80 w-full" />
      </Card>
    </div>
  );
}
