import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert } from '@/components/ui/Alert';
import { buttonLinkClass } from '@/components/ui/button-link-class';
import { Card } from '@/components/ui/Card';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { DonationStatusBadge } from '@/features/donations/components/DonationStatusBadge';
import { donationsService } from '@/features/donations/services/donations.service';
import type { Donation } from '@/features/donations/types/donations.types';
import { EmptyState } from '@/features/foundations/components/EmptyState';
import { FoundationsLoadingSkeleton } from '@/features/foundations/components/FoundationsLoadingSkeleton';
import { parseApiError } from '@/utils/api-error';
import { formatDate } from '@/utils/date-format';

type RequestsAccessError = 'profile' | 'verification' | 'generic';

/**
 * Entrada: status: codigo HTTP de la respuesta de error.
 * Proceso: Clasifica el bloqueo de acceso segun perfil incompleto o falta de verificacion.
 * Salida: Retorna el tipo de restriccion o generic para otros errores.
 */
function resolveAccessError(status?: number, message?: string): RequestsAccessError {
  if (status !== 403) {
    return 'generic';
  }

  if (message?.toLowerCase().includes('verific')) {
    return 'verification';
  }

  if (message?.toLowerCase().includes('perfil') || message?.toLowerCase().includes('documentos')) {
    return 'profile';
  }

  return 'generic';
}

/**
 * Entrada: Ninguna.
 * Proceso: Carga solicitudes de donacion desde GET /foundation/requests y maneja restricciones de acceso.
 * Salida: Retorna el elemento JSX del listado de solicitudes.
 */
export function HelpRequestsPage() {
  const [requests, setRequests] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [accessError, setAccessError] = useState<RequestsAccessError | null>(null);
  const [isInDevelopment, setIsInDevelopment] = useState(false);

  useEffect(() => {
    let cancelled = false;

    /**
     * Entrada: Ninguna.
     * Proceso: Obtiene solicitudes de donacion del backend y normaliza estados de error en pantalla.
     * Salida: No retorna valor; actualiza listado, errores o aviso de modulo en desarrollo.
     */
    async function loadRequests() {
      setIsLoading(true);
      setErrorMessage('');
      setAccessError(null);
      setIsInDevelopment(false);

      try {
        const result = await donationsService.fetchFoundationRequests({ page: 1, limit: 50 });
        if (!cancelled) {
          setRequests(result.data.items);
        }
      } catch (loadError) {
        if (cancelled) {
          return;
        }

        const parsed = parseApiError(loadError);

        if (parsed.status === 501) {
          setIsInDevelopment(true);
          setErrorMessage(parsed.message || UI_MESSAGES.FOUNDATIONS_REQUESTS_IN_DEVELOPMENT);
          return;
        }

        if (parsed.status === 403) {
          setAccessError(resolveAccessError(parsed.status, parsed.message));
          setErrorMessage(parsed.message || UI_MESSAGES.FOUNDATIONS_GATE_VERIFICATION);
          return;
        }

        setErrorMessage(parsed.message || UI_MESSAGES.FOUNDATIONS_REQUESTS_LOAD_ERROR);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadRequests();

    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return <FoundationsLoadingSkeleton variant="table" />;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="text-3xl font-bold text-text-primary">{UI_MESSAGES.NAV_REQUESTS}</h1>

      {accessError && (
        <div className="space-y-4">
          <Alert variant="warning">
            {accessError === 'profile'
              ? UI_MESSAGES.FOUNDATIONS_GATE_INCOMPLETE
              : accessError === 'verification'
                ? UI_MESSAGES.FOUNDATIONS_GATE_VERIFICATION
                : errorMessage}
          </Alert>
          <Link
            to="/foundation/profile"
            className={buttonLinkClass({ variant: 'primary', size: 'sm' })}
          >
            {UI_MESSAGES.FOUNDATIONS_REQUESTS_GO_TO_PROFILE}
          </Link>
        </div>
      )}

      {!accessError && isInDevelopment && (
        <Card glass={false} className="border border-border-default bg-white">
          <p className="text-sm text-text-secondary" role="status">
            {errorMessage || UI_MESSAGES.FOUNDATIONS_REQUESTS_IN_DEVELOPMENT}
          </p>
        </Card>
      )}

      {!accessError && !isInDevelopment && errorMessage && (
        <Alert variant="danger">{errorMessage}</Alert>
      )}

      {!accessError && !isInDevelopment && !errorMessage && requests.length === 0 && (
        <EmptyState message={UI_MESSAGES.FOUNDATIONS_REQUESTS_EMPTY} />
      )}

      {!accessError && !isInDevelopment && !errorMessage && requests.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-border-default bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border-default bg-vivid-50">
              <tr>
                <th className="px-6 py-4 font-semibold">{UI_MESSAGES.FOUNDATION_REQUESTS_TABLE_DONOR}</th>
                <th className="px-6 py-4 font-semibold">{UI_MESSAGES.FOUNDATION_REQUESTS_TABLE_NEED}</th>
                <th className="px-6 py-4 font-semibold">{UI_MESSAGES.FOUNDATION_REQUESTS_TABLE_STATUS}</th>
                <th className="px-6 py-4 font-semibold">{UI_MESSAGES.FOUNDATION_REQUESTS_TABLE_DATE}</th>
                <th className="px-6 py-4 font-semibold" />
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id} className="border-b border-border-default last:border-0">
                  <td className="px-6 py-4 font-medium text-text-primary">
                    {request.donor.fullName}
                  </td>
                  <td className="px-6 py-4 text-text-secondary">
                    {request.need.name} ({request.quantity} {request.need.unit})
                  </td>
                  <td className="px-6 py-4">
                    <DonationStatusBadge status={request.status} />
                  </td>
                  <td className="px-6 py-4 text-text-muted">{formatDate(request.createdAt)}</td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/foundation/requests/${request.id}`}
                      className={buttonLinkClass({ variant: 'primary', size: 'sm' })}
                    >
                      {UI_MESSAGES.FOUNDATIONS_REVIEW}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
