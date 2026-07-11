import { useParams } from 'react-router-dom';
import { UI_MESSAGES } from '@/constants/messages.constants';

/**
 * Entrada: Ninguna.
 * Proceso: Renderiza detalle de aporte con timeline mock.
 * Salida: Retorna el elemento JSX del detalle de aporte.
 */
export function DonationDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold">Detalle del aporte #{id}</h1>
      <div className="rounded-xl border border-border-default bg-white p-6">
        <ol className="space-y-4 border-l-2 border-vivid-300 pl-6">
          <li>
            <p className="font-semibold">Compromiso registrado</p>
            <p className="text-sm text-text-muted">15 Oct, 2026</p>
          </li>
          <li>
            <p className="font-semibold">En preparacion</p>
            <p className="text-sm text-text-muted">18 Oct, 2026</p>
          </li>
          <li>
            <p className="font-semibold text-text-muted">Entrega pendiente</p>
          </li>
        </ol>
        <p className="mt-6 text-sm text-text-secondary">{UI_MESSAGES.LOADING} — mock fase 4</p>
      </div>
    </div>
  );
}
