import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

/**
 * Entrada: Ninguna.
 * Proceso: Renderiza placeholders de carga para la tabla de usuarios admin.
 * Salida: Retorna el elemento JSX del skeleton.
 */
export function AdminUsersSkeleton() {
  return (
    <div className="space-y-4">
      <Card glass={false} className="border border-border-default bg-white p-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
        </div>
      </Card>
      <Card glass={false} className="border border-border-default bg-white p-4">
        <Skeleton className="mb-3 h-6 w-40" />
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="mb-3 h-12 w-full" />
        ))}
      </Card>
    </div>
  );
}
