import { Icon } from '@/components/ui/Icon';

interface EmptyStateProps {
  message: string;
}

/**
 * Entrada: message: texto descriptivo cuando no hay resultados.
 * Proceso: Renderiza estado vacio reutilizable para listados.
 * Salida: Retorna el elemento JSX del estado vacio.
 */
export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border-default bg-white px-6 py-16 text-center">
      <Icon name="organization" size="lg" className="mb-4 text-text-muted" decorative />
      <p className="max-w-md text-sm text-text-secondary">{message}</p>
    </div>
  );
}
