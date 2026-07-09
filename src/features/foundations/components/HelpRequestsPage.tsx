import { Link } from 'react-router-dom';
import { UI_MESSAGES } from '@/constants/messages.constants';

const MOCK_REQUESTS = [
  { id: '1', donor: 'Maria Lopez', need: 'Abrigos talla M', date: '19 Oct, 2026' },
  { id: '2', donor: 'Carlos Ruiz', need: 'Arroz x 5kg', date: '21 Oct, 2026' },
];

// Entrada:
// Ninguna.

// Proceso:
// Renderiza solicitudes de ayuda recibidas (mock).

// Salida:
// Retorna el elemento JSX de solicitudes.
export function HelpRequestsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="text-3xl font-bold">{UI_MESSAGES.NAV_REQUESTS}</h1>
      <div className="space-y-4">
        {MOCK_REQUESTS.map((r) => (
          <div
            key={r.id}
            className="flex items-center justify-between rounded-xl border border-border-default bg-white p-5"
          >
            <div>
              <p className="font-semibold">{r.donor}</p>
              <p className="text-sm text-text-secondary">{r.need}</p>
              <p className="text-xs text-text-muted">{r.date}</p>
            </div>
            <Link
              to={`/foundation/requests/${r.id}`}
              className="rounded-lg bg-vivid-700 px-4 py-2 text-sm text-white"
            >
              Revisar
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
