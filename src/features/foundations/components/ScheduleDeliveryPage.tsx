import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { buttonLinkClass } from '@/components/ui/button-link-class';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DeliveryMap } from '@/components/ui/DeliveryMap';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { donationsService } from '@/features/donations/services/donations.service';
import type { Donation } from '@/features/donations/types/donations.types';
import { parseApiError } from '@/utils/api-error';
import { formatDate, toDateTimeLocalValue, toIsoDateTime } from '@/utils/date-format';

/**
 * Entrada: Ninguna (donationId opcional desde query string).
 * Proceso: Sin donationId lista donaciones en transito; con donationId permite programar direccion,
 * ubicacion y fecha estimada de entrega via PATCH /donations/:id/delivery.
 * Salida: Retorna el elemento JSX de programar entrega.
 */
export function ScheduleDeliveryPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const donationId = searchParams.get('donationId') ?? '';

  const [donation, setDonation] = useState<Donation | null>(null);
  const [candidates, setCandidates] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [estimatedDeliveryAt, setEstimatedDeliveryAt] = useState('');

  /**
   * Entrada: Ninguna.
   * Proceso: Carga la donacion indicada o el listado de donaciones en transito disponibles.
   * Salida: No retorna valor.
   */
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      if (donationId) {
        const data = await donationsService.fetchDonationById(donationId);
        setDonation(data);
        setAddress(data.deliveryAddress ?? '');
        setLatitude(data.deliveryLatitude);
        setLongitude(data.deliveryLongitude);
        setEstimatedDeliveryAt(toDateTimeLocalValue(data.estimatedDeliveryAt));
      } else {
        const result = await donationsService.fetchFoundationRequests({
          page: 1,
          limit: 50,
          status: 'IN_TRANSIT',
        });
        setCandidates(result.data.items);
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
   * Entrada: event: envio de formulario.
   * Proceso: Envia PATCH /donations/:id/delivery con direccion, coordenadas y fecha estimada.
   * Salida: No retorna valor; navega a la pagina de confirmar entrega.
   */
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!donationId) return;
    setIsSubmitting(true);
    setError('');
    try {
      await donationsService.updateDonationDelivery(donationId, {
        deliveryAddress: address || null,
        deliveryLatitude: latitude,
        deliveryLongitude: longitude,
        estimatedDeliveryAt: toIsoDateTime(estimatedDeliveryAt),
      });
      navigate(`/foundation/deliveries/confirm?donationId=${donationId}`);
    } catch (submitError) {
      setError(parseApiError(submitError).message || UI_MESSAGES.FOUNDATION_REQUEST_NOT_FOUND);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <p className="text-text-muted">{UI_MESSAGES.LOADING}</p>;
  }

  if (!donationId) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-3xl font-bold text-text-primary">
          {UI_MESSAGES.FOUNDATION_DELIVERY_SCHEDULE_TITLE}
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
                <div>
                  <p className="font-semibold text-text-primary">
                    {candidate.need.name} ({candidate.quantity} {candidate.need.unit})
                  </p>
                  <p className="text-sm text-text-secondary">{candidate.donor.fullName}</p>
                </div>
                <Link
                  to={`/foundation/deliveries/schedule?donationId=${candidate.id}`}
                  className={buttonLinkClass({ variant: 'primary', size: 'sm' })}
                >
                  {UI_MESSAGES.FOUNDATION_DELIVERY_SCHEDULE_SUBMIT}
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
          {UI_MESSAGES.FOUNDATION_DELIVERY_SCHEDULE_TITLE}
        </h1>
        <Link
          to={`/foundation/requests/${donation.id}`}
          className={buttonLinkClass({ variant: 'secondary', size: 'sm' })}
        >
          {UI_MESSAGES.CAMPAIGNS_BACK}
        </Link>
      </div>

      <Card glass={false} className="space-y-1">
        <p className="font-semibold text-text-primary">
          {donation.need.name} ({donation.quantity} {donation.need.unit})
        </p>
        <p className="text-sm text-text-secondary">
          {UI_MESSAGES.FOUNDATION_REQUEST_DONOR}: {donation.donor.fullName}
        </p>
        <p className="text-sm text-text-muted">{formatDate(donation.createdAt)}</p>
      </Card>

      <Card glass={false}>
        <p className="mb-4 text-text-secondary">{UI_MESSAGES.FOUNDATION_DELIVERY_SCHEDULE_DESC}</p>
        <form className="space-y-4" onSubmit={(event) => void handleSubmit(event)}>
          <Input
            label={UI_MESSAGES.FOUNDATION_DELIVERY_SCHEDULE_PLACEHOLDER}
            value={address}
            onChange={(event) => setAddress(event.target.value)}
          />
          <Input
            label={UI_MESSAGES.DONATIONS_ESTIMATED_DATE}
            type="datetime-local"
            value={estimatedDeliveryAt}
            onChange={(event) => setEstimatedDeliveryAt(event.target.value)}
          />
          <DeliveryMap
            latitude={latitude}
            longitude={longitude}
            address={address}
            editable
            onChange={(nextLat, nextLng) => {
              setLatitude(nextLat);
              setLongitude(nextLng);
            }}
          />
          {error && (
            <p className="text-sm text-error-500" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting}>
            {UI_MESSAGES.FOUNDATION_DELIVERY_SCHEDULE_SUBMIT}
          </Button>
        </form>
      </Card>
    </div>
  );
}
