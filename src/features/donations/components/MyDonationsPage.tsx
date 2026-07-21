import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { buttonLinkClass } from '@/components/ui/button-link-class';
import { EmptyState } from '@/components/ui/EmptyState';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { DonationStatusBadge } from '@/features/donations/components/DonationStatusBadge';
import { donationsService } from '@/features/donations/services/donations.service';
import type { Donation } from '@/features/donations/types/donations.types';
import { parseApiError } from '@/utils/api-error';
import { formatDate } from '@/utils/date-format';

/**
 * Entrada: Ninguna.
 * Proceso: Lista donaciones del usuario autenticado desde GET /donations/me.
 * Salida: Retorna el elemento JSX de mis donaciones.
 */
export function MyDonationsPage() {
  const navigate = useNavigate();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  /**
   * Entrada: Ninguna.
   * Proceso: Carga listado de donaciones propias.
   * Salida: No retorna valor.
   */
  const loadDonations = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await donationsService.fetchMyDonations({ page: 1, limit: 50 });
      setDonations(result.data.items);
    } catch (loadError) {
      setError(parseApiError(loadError).message || UI_MESSAGES.DONATIONS_LOAD_ERROR);
      setDonations([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDonations();
  }, [loadDonations]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">{UI_MESSAGES.DONATIONS_TITLE}</h1>
        <p className="mt-2 text-text-secondary">{UI_MESSAGES.DONATIONS_DESCRIPTION}</p>
      </header>

      {isLoading && <p className="text-text-muted">{UI_MESSAGES.LOADING}</p>}

      {error && !isLoading && (
        <EmptyState title={error} onRetry={() => void loadDonations()} />
      )}

      {!isLoading && !error && donations.length === 0 && (
        <EmptyState
          title={UI_MESSAGES.DONATIONS_EMPTY}
          actionLabel={UI_MESSAGES.NAV_CAMPAIGNS}
          onAction={() => navigate('/campaigns')}
        />
      )}

      {!isLoading && !error && donations.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-border-default bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border-default bg-vivid-50">
              <tr>
                <th className="px-6 py-4 font-semibold">{UI_MESSAGES.DONATIONS_NEED}</th>
                <th className="px-6 py-4 font-semibold">{UI_MESSAGES.DONATIONS_CAMPAIGN}</th>
                <th className="px-6 py-4 font-semibold">{UI_MESSAGES.CAMPAIGNS_FILTER_STATUS}</th>
                <th className="px-6 py-4 font-semibold">{UI_MESSAGES.CAMPAIGNS_START}</th>
                <th className="px-6 py-4 font-semibold" />
              </tr>
            </thead>
            <tbody>
              {donations.map((donation) => (
                <tr key={donation.id} className="border-b border-border-default last:border-0">
                  <td className="px-6 py-4">
                    {donation.need.name} ({donation.quantity} {donation.need.unit})
                  </td>
                  <td className="px-6 py-4 text-text-secondary">{donation.campaign.title}</td>
                  <td className="px-6 py-4">
                    <DonationStatusBadge status={donation.status} />
                  </td>
                  <td className="px-6 py-4 text-text-muted">{formatDate(donation.createdAt)}</td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/my-donations/${donation.id}`}
                      className={buttonLinkClass({ variant: 'secondary', size: 'sm' })}
                    >
                      {UI_MESSAGES.DONATIONS_VIEW}
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
