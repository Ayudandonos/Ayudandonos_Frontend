import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Alert } from '@/components/ui/Alert';
import { buttonLinkClass } from '@/components/ui/button-link-class';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { DeliveryMap } from '@/components/ui/DeliveryMap';
import { EmptyState } from '@/components/ui/EmptyState';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { DonationChatPanel } from '@/features/donations/components/DonationChatPanel';
import {
  DonationStatusBadge,
  DONATION_STATUS_LABELS,
} from '@/features/donations/components/DonationStatusBadge';
import { donationsService } from '@/features/donations/services/donations.service';
import type { Donation } from '@/features/donations/types/donations.types';
import { parseApiError } from '@/utils/api-error';
import { formatDate } from '@/utils/date-format';

/**
 * Entrada: Ninguna (id desde useParams).
 * Proceso: Muestra detalle, historial y permite cancelar si esta COMMITTED.
 * Salida: Retorna el elemento JSX del detalle de donacion.
 */
export function DonationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [donation, setDonation] = useState<Donation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCancel, setShowCancel] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  /**
   * Entrada: Ninguna.
   * Proceso: Carga detalle de donacion por id.
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
      setError(parseApiError(loadError).message || UI_MESSAGES.DONATIONS_LOAD_ERROR);
      setDonation(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadDonation();
  }, [loadDonation]);

  /**
   * Entrada: Ninguna.
   * Proceso: Cancela la donacion via PATCH status CANCELLED.
   * Salida: No retorna valor; recarga detalle.
   */
  async function handleCancel() {
    if (!id) return;
    setIsCancelling(true);
    setError('');
    try {
      const updated = await donationsService.updateDonationStatus(id, 'CANCELLED');
      setDonation(updated);
      setSuccess(UI_MESSAGES.DONATIONS_STATUS_CANCELLED);
      setShowCancel(false);
    } catch (cancelError) {
      setError(parseApiError(cancelError).message || UI_MESSAGES.DONATIONS_LOAD_ERROR);
    } finally {
      setIsCancelling(false);
    }
  }

  if (isLoading) {
    return <p className="text-text-muted">{UI_MESSAGES.LOADING}</p>;
  }

  if (error && !donation) {
    return <EmptyState title={error} onRetry={() => void loadDonation()} />;
  }

  if (!donation) {
    return <EmptyState title={UI_MESSAGES.DONATIONS_LOAD_ERROR} />;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold text-text-primary">
          {UI_MESSAGES.DONATIONS_DETAIL_TITLE}
        </h1>
        <Link to="/my-donations" className={buttonLinkClass({ variant: 'secondary', size: 'sm' })}>
          {UI_MESSAGES.CAMPAIGNS_BACK}
        </Link>
      </div>

      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

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
        {donation.status === 'COMMITTED' && (
          <Button type="button" variant="secondary" onClick={() => setShowCancel(true)}>
            {UI_MESSAGES.DONATIONS_CANCEL}
          </Button>
        )}
      </Card>

      <Card glass={false}>
        <h2 className="text-lg font-semibold text-text-primary">
          {UI_MESSAGES.DONATIONS_HISTORY}
        </h2>
        {donation.statusHistory.length === 0 ? (
          <p className="mt-3 text-sm text-text-muted">—</p>
        ) : (
          <ol className="mt-4 space-y-4 border-l-2 border-vivid-300 pl-6">
            {donation.statusHistory.map((entry) => (
              <li key={entry.id}>
                <p className="font-semibold text-text-primary">
                  {DONATION_STATUS_LABELS[entry.toStatus]}
                  {entry.fromStatus ? ` ← ${DONATION_STATUS_LABELS[entry.fromStatus]}` : ''}
                </p>
                <p className="text-sm text-text-muted">{formatDate(entry.createdAt)}</p>
                {entry.note && <p className="text-sm text-text-secondary">{entry.note}</p>}
              </li>
            ))}
          </ol>
        )}
      </Card>

      {(donation.deliveryAddress || (donation.deliveryLatitude != null && donation.deliveryLongitude != null)) && (
        <Card glass={false} className="space-y-3">
          <h2 className="text-lg font-semibold text-text-primary">
            {UI_MESSAGES.DONATIONS_DELIVERY_TITLE}
          </h2>
          <DeliveryMap
            latitude={donation.deliveryLatitude}
            longitude={donation.deliveryLongitude}
            address={donation.deliveryAddress}
          />
        </Card>
      )}

      <DonationChatPanel donationId={donation.id} />

      {showCancel && (
        <ConfirmDialog
          title={UI_MESSAGES.DONATIONS_CANCEL}
          description={UI_MESSAGES.DONATIONS_STATUS_CANCELLED}
          confirmLabel={UI_MESSAGES.DONATIONS_CANCEL}
          isProcessing={isCancelling}
          onConfirm={() => void handleCancel()}
          onCancel={() => setShowCancel(false)}
        />
      )}
    </div>
  );
}
