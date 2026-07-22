import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { buttonLinkClass } from '@/components/ui/button-link-class';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { DonationChatPanel } from '@/features/donations/components/DonationChatPanel';
import { DonationStatusBadge } from '@/features/donations/components/DonationStatusBadge';
import { donationsService } from '@/features/donations/services/donations.service';
import type { Donation } from '@/features/donations/types/donations.types';
import { parseApiError } from '@/utils/api-error';
import { formatDate } from '@/utils/date-format';

/**
 * Entrada: Ninguna (id de la donacion desde useParams).
 * Proceso: Carga la solicitud de donacion, muestra la conversacion y permite avanzar o cancelar el estado.
 * Salida: Retorna el elemento JSX de revision de solicitud.
 */
export function ReviewRequestPage() {
  const { id } = useParams<{ id: string }>();
  const [donation, setDonation] = useState<Donation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCancel, setShowCancel] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  /**
   * Entrada: Ninguna.
   * Proceso: Carga el detalle de la donacion por id.
   * Salida: No retorna valor.
   */
  const loadDonation = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError('');
    try {
      const data = await donationsService.fetchDonationById(id);
      setDonation(data);
    } catch (loadError) {
      setError(parseApiError(loadError).message || UI_MESSAGES.FOUNDATION_REQUEST_NOT_FOUND);
      setDonation(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadDonation();
  }, [loadDonation]);

  /**
   * Entrada: status: nuevo estado a aplicar (IN_TRANSIT o CANCELLED).
   * Proceso: Envia PATCH /donations/:id/status y actualiza el detalle en pantalla.
   * Salida: No retorna valor.
   */
  async function handleStatusChange(status: 'IN_TRANSIT' | 'CANCELLED') {
    if (!id) return;
    setIsUpdating(true);
    setError('');
    try {
      const updated = await donationsService.updateDonationStatus(id, status);
      setDonation(updated);
      setSuccess(UI_MESSAGES.FOUNDATION_REQUEST_STATUS_UPDATED);
      setShowCancel(false);
    } catch (updateError) {
      setError(parseApiError(updateError).message || UI_MESSAGES.FOUNDATION_REQUEST_NOT_FOUND);
    } finally {
      setIsUpdating(false);
    }
  }

  if (isLoading) {
    return <p className="text-text-muted">{UI_MESSAGES.LOADING}</p>;
  }

  if (error && !donation) {
    return <EmptyState title={error} onRetry={() => void loadDonation()} />;
  }

  if (!donation) {
    return <EmptyState title={UI_MESSAGES.FOUNDATION_REQUEST_NOT_FOUND} />;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold text-text-primary">
          {UI_MESSAGES.FOUNDATION_REQUEST_REVIEW_TITLE(donation.id)}
        </h1>
        <Link to="/foundation/requests" className={buttonLinkClass({ variant: 'secondary', size: 'sm' })}>
          {UI_MESSAGES.CAMPAIGNS_BACK}
        </Link>
      </div>

      <p className="text-text-secondary">{UI_MESSAGES.FOUNDATION_REQUEST_REVIEW_DESC}</p>

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
        <p className="text-lg font-semibold text-text-primary">
          {donation.need.name} — {donation.quantity} {donation.need.unit}
        </p>
        <p className="text-sm text-text-secondary">
          {UI_MESSAGES.DONATIONS_CAMPAIGN}: {donation.campaign.title}
        </p>
        <p className="text-sm text-text-secondary">
          {UI_MESSAGES.FOUNDATION_REQUEST_DONOR}: {donation.donor.fullName}
        </p>
        {donation.notes && (
          <p className="text-sm text-text-secondary">
            {UI_MESSAGES.DONATIONS_NOTES}: {donation.notes}
          </p>
        )}
        {donation.estimatedDeliveryAt && (
          <p className="text-sm text-text-muted">
            {UI_MESSAGES.DONATIONS_ESTIMATED_DATE}: {formatDate(donation.estimatedDeliveryAt)}
          </p>
        )}

        <div className="flex flex-wrap gap-3 pt-2">
          {donation.status === 'COMMITTED' && (
            <>
              <Button
                type="button"
                variant="primary"
                isLoading={isUpdating}
                onClick={() => void handleStatusChange('IN_TRANSIT')}
              >
                {UI_MESSAGES.FOUNDATION_REQUEST_MARK_IN_TRANSIT}
              </Button>
              <Button type="button" variant="secondary" onClick={() => setShowCancel(true)}>
                {UI_MESSAGES.FOUNDATION_REQUEST_CANCEL}
              </Button>
            </>
          )}
          {donation.status === 'IN_TRANSIT' && (
            <>
              <Link
                to={`/foundation/deliveries/schedule?donationId=${donation.id}`}
                className={buttonLinkClass({ variant: 'primary' })}
              >
                {UI_MESSAGES.FOUNDATION_REQUEST_GO_TO_SCHEDULE}
              </Link>
              <Button type="button" variant="secondary" onClick={() => setShowCancel(true)}>
                {UI_MESSAGES.FOUNDATION_REQUEST_CANCEL}
              </Button>
            </>
          )}
          {donation.status === 'DELIVERED' && (
            <Link
              to={`/foundation/deliveries/confirm?donationId=${donation.id}`}
              className={buttonLinkClass({ variant: 'primary' })}
            >
              {UI_MESSAGES.FOUNDATION_REQUEST_GO_TO_CONFIRM}
            </Link>
          )}
        </div>
      </Card>

      <DonationChatPanel donationId={donation.id} />

      {showCancel && (
        <ConfirmDialog
          title={UI_MESSAGES.FOUNDATION_REQUEST_CANCEL}
          description={UI_MESSAGES.FOUNDATION_REQUEST_STATUS_UPDATED}
          confirmLabel={UI_MESSAGES.FOUNDATION_REQUEST_CANCEL}
          isProcessing={isUpdating}
          onConfirm={() => void handleStatusChange('CANCELLED')}
          onCancel={() => setShowCancel(false)}
        />
      )}
    </div>
  );
}
