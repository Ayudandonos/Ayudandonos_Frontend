import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { buttonLinkClass } from '@/components/ui/button-link-class';
import { Card } from '@/components/ui/Card';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { EmptyState } from '@/features/foundations/components/EmptyState';
import { FoundationsLoadingSkeleton } from '@/features/foundations/components/FoundationsLoadingSkeleton';
import { foundationsService } from '@/features/foundations/services/foundations.service';
import type { FoundationHelpRequest } from '@/features/foundations/types/foundations.types';
import { parseApiError } from '@/utils/api-error';

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
 * Proceso: Carga solicitudes de ayuda desde GET /foundation/requests y maneja restricciones de acceso.
 * Salida: Retorna el elemento JSX del listado de solicitudes.
 */
export function HelpRequestsPage() {
  const [requests, setRequests] = useState<FoundationHelpRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [accessError, setAccessError] = useState<RequestsAccessError | null>(null);
  const [isInDevelopment, setIsInDevelopment] = useState(false);

  useEffect(() => {
    let cancelled = false;

    /**
     * Entrada: Ninguna.
     * Proceso: Obtiene solicitudes de ayuda del backend y normaliza estados de error en pantalla.
     * Salida: No retorna valor; actualiza listado, errores o aviso de modulo en desarrollo.
     */
    async function loadRequests() {
      setIsLoading(true);
      setErrorMessage('');
      setAccessError(null);
      setIsInDevelopment(false);

      try {
        const data = await foundationsService.fetchFoundationRequests();
        if (!cancelled) {
          setRequests(data);
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
        <Card glass={false} className="space-y-4 border border-amber-200 bg-amber-50">
          <p className="text-sm text-amber-900" role="alert">
            {accessError === 'profile'
              ? UI_MESSAGES.FOUNDATIONS_GATE_INCOMPLETE
              : accessError === 'verification'
                ? UI_MESSAGES.FOUNDATIONS_GATE_VERIFICATION
                : errorMessage}
          </p>
          <Link
            to="/foundation/profile"
            className={buttonLinkClass({ variant: 'primary', size: 'sm' })}
          >
            {UI_MESSAGES.FOUNDATIONS_REQUESTS_GO_TO_PROFILE}
          </Link>
        </Card>
      )}

      {!accessError && isInDevelopment && (
        <Card glass={false} className="border border-border-default bg-white">
          <p className="text-sm text-text-secondary" role="status">
            {errorMessage || UI_MESSAGES.FOUNDATIONS_REQUESTS_IN_DEVELOPMENT}
          </p>
        </Card>
      )}

      {!accessError && !isInDevelopment && errorMessage && (
        <Card glass={false} className="border border-red-200 bg-red-50">
          <p className="text-sm text-red-700" role="alert">
            {errorMessage}
          </p>
        </Card>
      )}

      {!accessError && !isInDevelopment && !errorMessage && requests.length === 0 && (
        <EmptyState message={UI_MESSAGES.FOUNDATIONS_REQUESTS_EMPTY} />
      )}

      {!accessError && !isInDevelopment && !errorMessage && requests.length > 0 && (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card
              key={request.id}
              glass={false}
              className="flex items-center justify-between border border-border-default bg-white"
            >
              <div>
                <p className="font-semibold text-text-primary">{request.donorName}</p>
                <p className="text-sm text-text-secondary">{request.needSummary}</p>
                <p className="text-xs text-text-muted">{request.submittedAt}</p>
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
      )}
    </div>
  );
}
