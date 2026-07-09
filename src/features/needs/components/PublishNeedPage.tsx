import { UI_MESSAGES } from '@/constants/messages.constants';

// Entrada:
// Ninguna.

// Proceso:
// Renderiza formulario publicar necesidad (mock).

// Salida:
// Retorna el elemento JSX de publicar necesidad.
export function PublishNeedPage() {
  return (
    <div className="mx-auto max-w-3xl rounded-xl border border-border-default bg-white p-8">
      <h1 className="text-3xl font-bold">{UI_MESSAGES.NAV_NEEDS}</h1>
      <form className="mt-6 space-y-4">
        <input className="w-full rounded-lg border border-border-default px-4 py-3" placeholder="Nombre de la necesidad" readOnly />
        <input className="w-full rounded-lg border border-border-default px-4 py-3" placeholder="Cantidad requerida" readOnly />
        <button type="button" className="rounded-full bg-vivid-700 px-8 py-3 text-white">
          Publicar necesidad
        </button>
      </form>
    </div>
  );
}
