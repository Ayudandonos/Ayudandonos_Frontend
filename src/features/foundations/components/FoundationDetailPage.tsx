import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { FoundationDetailPanel } from '@/features/foundations/components/FoundationDetailPanel';
import { foundationsService } from '@/features/foundations/services/foundations.service';
import type { FoundationDetail } from '@/features/foundations/types/foundations.types';
import { parseApiError } from '@/utils/api-error';

/**
 * Entrada: Ninguna (id desde params de ruta).
 * Proceso: Carga detalle publico de fundacion verificada desde la API.
 * Salida: Retorna el elemento JSX de la pagina de detalle.
 */
export function FoundationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [foundation, setFoundation] = useState<FoundationDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      setError(UI_MESSAGES.FOUNDATIONS_NOT_FOUND);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    /**
     * Entrada: foundationId: identificador UUID de la fundacion a consultar.
     * Proceso: Obtiene detalle publico de fundacion desde la API.
     * Salida: No retorna valor; actualiza foundation o error en el componente.
     */
    async function loadFoundation(foundationId: string) {
      setIsLoading(true);
      setError('');

      try {
        const data = await foundationsService.fetchFoundationById(foundationId);
        if (!cancelled) {
          setFoundation(data);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(parseApiError(loadError).message || UI_MESSAGES.FOUNDATIONS_NOT_FOUND);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadFoundation(id);

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (isLoading) {
    return <p className="px-4 py-10 text-sm text-text-secondary">{UI_MESSAGES.LOADING}</p>;
  }

  if (error || !foundation) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Card glass={false} className="border border-border-default bg-white">
          <p className="text-sm text-red-700">{error || UI_MESSAGES.FOUNDATIONS_NOT_FOUND}</p>
          <Link to="/foundations" className="mt-4 inline-block text-sm font-medium text-vivid-700">
            {UI_MESSAGES.FOUNDATIONS_BACK_TO_LIST}
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <Link to="/foundations" className="text-sm font-medium text-vivid-700">
        ← {UI_MESSAGES.FOUNDATIONS_BACK_TO_LIST}
      </Link>
      <FoundationDetailPanel foundation={foundation} />
    </div>
  );
}
