import { UI_MESSAGES } from '@/constants/messages.constants';

/**
 * Entrada: Ninguna.
 * Proceso: Renderiza formulario crear campana (mock fundacion).
 * Salida: Retorna el elemento JSX de crear campana.
 */
export function CreateCampaignPage() {
  return (
    <div className="mx-auto max-w-3xl rounded-xl border border-border-default bg-white p-8">
      <h1 className="text-3xl font-bold">{UI_MESSAGES.NAV_CREATE_CAMPAIGN}</h1>
      <form className="mt-6 space-y-4">
        <input className="w-full rounded-lg border border-border-default px-4 py-3" placeholder="Titulo de la campana" readOnly />
        <textarea className="w-full rounded-lg border border-border-default px-4 py-3" rows={4} placeholder="Descripcion" readOnly />
        <button type="button" className="rounded-full bg-vivid-700 px-8 py-3 text-white">
          Publicar campana
        </button>
      </form>
    </div>
  );
}
