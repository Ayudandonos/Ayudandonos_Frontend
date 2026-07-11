import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { UI_MESSAGES } from '@/constants/messages.constants';

/**
 * Entrada: Ninguna.
 * Proceso: Renderiza programar entrega (mock hasta modulo donaciones).
 * Salida: Retorna el elemento JSX de programar entrega.
 */
export function ScheduleDeliveryPage() {
  return (
    <Card glass={false} className="mx-auto max-w-3xl border border-border-default bg-white p-8">
      <h1 className="text-3xl font-bold text-text-primary">{UI_MESSAGES.NAV_DELIVERIES}</h1>
      <form className="mt-6 space-y-4">
        <Input type="date" readOnly />
        <Input
          placeholder={UI_MESSAGES.FOUNDATION_DELIVERY_SCHEDULE_PLACEHOLDER}
          readOnly
        />
        <Button type="button" variant="primary" size="lg">
          {UI_MESSAGES.FOUNDATION_DELIVERY_SCHEDULE_SUBMIT}
        </Button>
      </form>
    </Card>
  );
}
