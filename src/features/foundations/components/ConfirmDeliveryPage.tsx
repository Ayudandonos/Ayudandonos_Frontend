// Entrada:
// Ninguna.

// Proceso:
// Renderiza confirmar recepcion de ayuda (mock).

// Salida:
// Retorna el elemento JSX de confirmar recepcion.
export function ConfirmDeliveryPage() {
  return (
    <div className="mx-auto max-w-3xl rounded-xl border border-border-default bg-white p-8">
      <h1 className="text-3xl font-bold">Confirmar recepcion de ayuda</h1>
      <p className="mt-4 text-text-secondary">
        Resumen del aporte recibido y confirmacion de recepcion (mock fase 4).
      </p>
      <button type="button" className="mt-6 rounded-full bg-vivid-700 px-8 py-3 text-white">
        Confirmar recepcion
      </button>
    </div>
  );
}
