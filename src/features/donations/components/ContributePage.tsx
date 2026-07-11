import { Link, useParams } from 'react-router-dom';

/**
 * Entrada: Ninguna.
 * Proceso: Renderiza formulario de confirmar aporte (mock, sin API).
 * Salida: Retorna el elemento JSX de confirmar aporte.
 */
export function ContributePage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-border-default bg-white p-8">
      <h1 className="text-2xl font-bold text-text-primary">Confirmar aporte</h1>
      <p className="mt-2 text-text-secondary">
        Campaña #{id} — formulario visual segun Figma (datos mock).
      </p>
      <div className="mt-6 space-y-4">
        <input
          className="w-full rounded-lg border border-border-default px-4 py-3"
          placeholder="Cantidad o descripcion del aporte"
          readOnly
        />
        <input
          className="w-full rounded-lg border border-border-default px-4 py-3"
          placeholder="Fecha estimada de entrega"
          readOnly
        />
      </div>
      <Link
        to="/my-donations"
        className="mt-6 inline-block rounded-xl bg-vivid-700 px-6 py-3 text-sm font-medium text-white"
      >
        Confirmar compromiso
      </Link>
    </div>
  );
}
