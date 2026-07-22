import { Card } from '@/components/ui/Card';
import { UI_MESSAGES } from '@/constants/messages.constants';

/**
 * Entrada: Ninguna.
 * Proceso: Placeholders de carga para el listado de notificaciones.
 * Salida: Retorna el elemento JSX del skeleton.
 */
export function NotificationsSkeleton() {
  return (
    <div className="mx-auto max-w-3xl animate-pulse space-y-4">
      <div className="h-10 w-56 rounded-lg bg-vivid-100" />
      {Array.from({ length: 5 }).map((_, index) => (
        <Card key={index} glass={false} className="h-20 border border-border-default bg-white">
          <span className="sr-only">{UI_MESSAGES.LOADING}</span>
        </Card>
      ))}
    </div>
  );
}
