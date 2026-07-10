import { Link } from 'react-router-dom';
import { buttonLinkClass } from '@/components/ui/button-link-class';
import { Card } from '@/components/ui/Card';
import { UI_MESSAGES } from '@/constants/messages.constants';

const MOCK_REQUESTS = [
  { id: '1', donor: 'Maria Lopez', need: 'Abrigos talla M', date: '19 Oct, 2026' },
  { id: '2', donor: 'Carlos Ruiz', need: 'Arroz x 5kg', date: '21 Oct, 2026' },
];

/**
 * Entrada: Ninguna.
 * Proceso: Renderiza solicitudes de ayuda recibidas (mock hasta modulo donaciones).
 * Salida: Retorna el elemento JSX de solicitudes.
 */
export function HelpRequestsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="text-3xl font-bold text-text-primary">{UI_MESSAGES.NAV_REQUESTS}</h1>
      <div className="space-y-4">
        {MOCK_REQUESTS.map((request) => (
          <Card key={request.id} glass={false} className="flex items-center justify-between border border-border-default bg-white">
            <div>
              <p className="font-semibold text-text-primary">{request.donor}</p>
              <p className="text-sm text-text-secondary">{request.need}</p>
              <p className="text-xs text-text-muted">{request.date}</p>
            </div>
            <Link
              to={`/foundation/requests/${request.id}`}
              className={buttonLinkClass({ variant: 'primary', size: 'sm' })}
            >
              {UI_MESSAGES.FOUNDATIONS_REVIEW}
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
