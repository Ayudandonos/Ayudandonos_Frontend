import { Card } from '@/components/ui/Card';
import { UI_MESSAGES } from '@/constants/messages.constants';

/**
 * Entrada: Ninguna.
 * Proceso: Muestra placeholders de carga para la pagina de perfil de usuario.
 * Salida: Retorna el elemento JSX del skeleton.
 */
export function UserProfileSkeleton() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse space-y-6">
      <div className="h-10 w-64 rounded-lg bg-vivid-100" />
      <div className="h-4 w-full max-w-xl rounded bg-vivid-100" />
      <Card glass={false} className="border border-border-default bg-white p-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-vivid-100" />
          <div className="space-y-2">
            <div className="h-4 w-48 rounded bg-vivid-100" />
            <div className="h-4 w-32 rounded bg-vivid-100" />
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-10 rounded-lg bg-vivid-100" />
          ))}
        </div>
      </Card>
      <Card glass={false} className="h-40 border border-border-default bg-white">
        <span className="sr-only">{UI_MESSAGES.LOADING}</span>
      </Card>
    </div>
  );
}
