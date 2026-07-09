import { useParams } from 'react-router-dom';

// Entrada:
// Ninguna.

// Proceso:
// Renderiza revision de solicitud de ayuda (mock).

// Salida:
// Retorna el elemento JSX de revisar solicitud.
export function ReviewRequestPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="mx-auto max-w-3xl rounded-xl border border-border-default bg-white p-8">
      <h1 className="text-3xl font-bold">Revisar solicitud #{id}</h1>
      <p className="mt-4 text-text-secondary">
        Detalle del compromiso del donante, necesidad asociada y acciones de aprobar o rechazar (mock).
      </p>
      <div className="mt-6 flex gap-4">
        <button type="button" className="rounded-xl bg-vivid-700 px-6 py-3 text-white">
          Aprobar
        </button>
        <button type="button" className="rounded-xl border border-border-default px-6 py-3">
          Rechazar
        </button>
      </div>
    </div>
  );
}
