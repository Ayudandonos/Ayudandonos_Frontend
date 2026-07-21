import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { buttonLinkClass } from '@/components/ui/button-link-class';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DeliveryMap } from '@/components/ui/DeliveryMap';
import { EmptyState } from '@/components/ui/EmptyState';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { DonationStatusBadge } from '@/features/donations/components/DonationStatusBadge';
import { donationsService } from '@/features/donations/services/donations.service';
import type { Donation } from '@/features/donations/types/donations.types';
import { parseApiError } from '@/utils/api-error';
import { formatDate } from '@/utils/date-format';

/**
 * Entrada: Ninguna (donationId opcional desde query string).
 * Proceso: Sin donationId lista donaciones en transito o entregadas; con donationId permite marcar
 * la donacion como entregada y luego confirmar su recepcion.
 * Salida: Retorna el elemento JSX de confirmar recepcion de ayuda.
 */
export function ConfirmDeliveryPage() {
  const [searchParams] = useSearchParams();
  const donationId = searchParams.get('donationId') ?? '';

  const [donation, setDonation] = useState<Donation | null>(null);
  const [candidates, setCandidates] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  /**
   * Entrada: Ninguna.
   * Proceso: Carga la donacion indicada o el listado de donaciones pendientes de entrega/confirmacion.
   * Salida: No retorna valor.
   */
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      if (donationId) {
        const data = await donationsService.fetchDonationById(donationId);
        setDonation(data);
      } else {
        const [inTransit, delivered] = await Promise.all([
          donationsService.fetchFoundationRequests({ page: 1, limit: 50, status: 'IN_TRANSIT' }),
          donationsService.fetchFoundationRequests({ page: 1, limit: 50, status: 'DELIVERED' }),
        ]);
        setCandidates([...inTransit.data.items, ...delivered.data.items]);
      }
    } catch (loadError) {
      setError(parseApiError(loadError).message || UI_MESSAGES.FOUNDATION_REQUEST_NOT_FOUND);
    } finally {
      setIsLoading(false);
    }
  }, [donationId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  /**
   * Entrada: status: nuevo estado a aplicar (DELIVERED o CONFIRMED).
   * Proceso: Envia PATCH /donations/:id/status y actualiza el detalle en pantalla.
   * Salida: No retorna valor.
   */
  async function handleStatusChange(status: 'DELIVERED' | 'CONFIRMED') {
    if (!donationId) return;
    setIsUpdating(true);
    setError('');
    try {
      const updated = await donationsService.updateDonationStatus(donationId, status);
      setDonation(updated);
      setSuccess(UI_MESSAGES.FOUNDATION_REQUEST_STATUS_UPDATED);
    } catch (updateError) {
      setError(parseApiError(updateError).message || UI_MESSAGES.FOUNDATION_REQUEST_NOT_FOUND);
    } finally {
      setIsUpdating(false);
    }
  }

  if (isLoading) {
    return <p className="text-text-muted">{UI_MESSAGES.LOADING}</p>;
  }

  if (!donationId) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-3xl font-bold text-text-primary">
          {UI_MESSAGES.FOUNDATION_DELIVERY_CONFIRM_TITLE}
        </h1>
        <p className="text-text-secondary">{UI_MESSAGES.FOUNDATION_DELIVERY_SELECT_DONATION}</p>

        {error && (
          <p className="rounded-lg bg-error-500/10 px-3 py-2 text-sm text-error-600" role="alert">
            {error}
          </p>
        )}

        {candidates.length === 0 ? (
          <EmptyState title={UI_MESSAGES.FOUNDATION_DELIVERY_NO_DONATIONS} />
        ) : (
          <div className="space-y-3">
            {candidates.map((candidate) => (
              <Card
                key={candidate.id}
                glass={false}
                className="flex flex-wrap items-center justify-between gap-3 border border-border-default bg-white"
              >
                <div className="flex items-center gap-3">
                  <DonationStatusBadge status={candidate.status} />
                  <div>
                    <p className="font-semibold text-text-primary">
                      {candidate.need.name} ({candidate.quantity} {candidate.need.unit})
                    </p>
                    <p className="text-sm text-text-secondary">{candidate.donor.fullName}</p>
                  </div>
                </div>
                <Link
                  to={`/foundation/deliveries/confirm?donationId=${candidate.id}`}
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

  if (!donation) {
    return <EmptyState title={error || UI_MESSAGES.FOUNDATION_REQUEST_NOT_FOUND} onRetry={() => void loadData()} />;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold text-text-primary">
          {UI_MESSAGES.FOUNDATION_DELIVERY_CONFIRM_TITLE}
        </h1>
        <Link
          to={`/foundation/requests/${donation.id}`}
          className={buttonLinkClass({ variant: 'secondary', size: 'sm' })}
        >
          {UI_MESSAGES.CAMPAIGNS_BACK}
        </Link>
      </div>

      <p className="text-text-secondary">{UI_MESSAGES.FOUNDATION_DELIVERY_CONFIRM_DESC}</p>

      {success && (
        <p className="rounded-lg bg-success-500/10 px-3 py-2 text-sm text-success-600" role="status">
          {success}
        </p>
      )}
      {error && (
        <p className="rounded-lg bg-error-500/10 px-3 py-2 text-sm text-error-600" role="alert">
          {error}
        </p>
      )}

      <Card glass={false} className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <DonationStatusBadge status={donation.status} />
          <span className="text-sm text-text-muted">{formatDate(donation.createdAt)}</span>
        </div>
        <p className="font-semibold text-text-primary">
          {donation.need.name} ({donation.quantity} {donation.need.unit})
        </p>
        <p className="text-sm text-text-secondary">
          {UI_MESSAGES.FOUNDATION_REQUEST_DONOR}: {donation.donor.fullName}
        </p>

        {(donation.deliveryAddress || (donation.deliveryLatitude != null && donation.deliveryLongitude != null)) && (
          <DeliveryMap
            latitude={donation.deliveryLatitude}
            longitude={donation.deliveryLongitude}
            address={donation.deliveryAddress}
          />
        )}

        <div className="flex flex-wrap gap-3 pt-2">
          {donation.status === 'IN_TRANSIT' && (
            <Button
              type="button"
              variant="primary"
              size="lg"
              isLoading={isUpdating}
              onClick={() => void handleStatusChange('DELIVERED')}
            >
              {UI_MESSAGES.FOUNDATION_DELIVERY_MARK_DELIVERED}
            </Button>
          )}
          {donation.status === 'DELIVERED' && (
            <Button
              type="button"
              variant="primary"
              size="lg"
              isLoading={isUpdating}
              onClick={() => void handleStatusChange('CONFIRMED')}
            >
              {UI_MESSAGES.FOUNDATION_DELIVERY_CONFIRM_SUBMIT}
            </Button>
          )}
          {donation.status === 'CONFIRMED' && (
            <p className="text-sm text-success-600">
              {UI_MESSAGES.FOUNDATION_DELIVERY_ALREADY_CONFIRMED}
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
