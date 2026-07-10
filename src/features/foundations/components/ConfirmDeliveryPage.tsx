import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { UI_MESSAGES } from '@/constants/messages.constants';

/**
 * Entrada: Ninguna.
 * Proceso: Renderiza confirmar recepcion de ayuda (mock hasta modulo donaciones).
 * Salida: Retorna el elemento JSX de confirmar recepcion.
 */
export function ConfirmDeliveryPage() {
  return (
    <Card glass={false} className="mx-auto max-w-3xl border border-border-default bg-white p-8">
      <h1 className="text-3xl font-bold text-text-primary">
        {UI_MESSAGES.FOUNDATION_DELIVERY_CONFIRM_TITLE}
      </h1>
      <p className="mt-4 text-text-secondary">{UI_MESSAGES.FOUNDATION_DELIVERY_CONFIRM_DESC}</p>
      <Button type="button" variant="primary" size="lg" className="mt-6">
        {UI_MESSAGES.FOUNDATION_DELIVERY_CONFIRM_SUBMIT}
      </Button>
    </Card>
  );
}
