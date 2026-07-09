import { UI_MESSAGES } from '@/constants/messages.constants';

// Entrada:
// Ninguna.

// Proceso:
// Renderiza programar entrega (mock).

// Salida:
// Retorna el elemento JSX de programar entrega.
export function ScheduleDeliveryPage() {
  return (
    <div className="mx-auto max-w-3xl rounded-xl border border-border-default bg-white p-8">
      <h1 className="text-3xl font-bold">{UI_MESSAGES.NAV_DELIVERIES}</h1>
      <form className="mt-6 space-y-4">
        <input className="w-full rounded-lg border border-border-default px-4 py-3" type="date" readOnly />
        <input className="w-full rounded-lg border border-border-default px-4 py-3" placeholder="Lugar de entrega" readOnly />
        <button type="button" className="rounded-full bg-vivid-700 px-8 py-3 text-white">
          Programar entrega
        </button>
      </form>
    </div>
  );
}
