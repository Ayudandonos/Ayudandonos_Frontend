import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { UI_MESSAGES } from '@/constants/messages.constants';

/**
 * Entrada: Ninguna.
 * Proceso: Renderiza revision de solicitud de ayuda (mock hasta modulo donaciones).
 * Salida: Retorna el elemento JSX de revisar solicitud.
 */
export function ReviewRequestPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <Card glass={false} className="mx-auto max-w-3xl border border-border-default bg-white p-8">
      <h1 className="text-3xl font-bold text-text-primary">
        {UI_MESSAGES.FOUNDATION_REQUEST_REVIEW_TITLE(id ?? '')}
      </h1>
      <p className="mt-4 text-text-secondary">{UI_MESSAGES.FOUNDATION_REQUEST_REVIEW_DESC}</p>
      <div className="mt-6 flex gap-4">
        <Button type="button" variant="primary">
          {UI_MESSAGES.FOUNDATION_REQUEST_APPROVE}
        </Button>
        <Button type="button" variant="outline">
          {UI_MESSAGES.FOUNDATION_REQUEST_REJECT}
        </Button>
      </div>
    </Card>
  );
}
