import { UI_MESSAGES } from '@/constants/messages.constants';
import type { FoundationAdminObservation } from '@/features/foundations/types/foundations.types';

interface FoundationObservationHistoryProps {
  observations: FoundationAdminObservation[];
}

/**
 * Entrada: observations: historial de observaciones administrativas.
 * Proceso: Renderiza linea de tiempo con observaciones; no muestra nada si esta vacio.
 * Salida: Retorna el historial o null.
 */
export function FoundationObservationHistory({ observations }: FoundationObservationHistoryProps) {
  if (observations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-text-primary">
        {UI_MESSAGES.FOUNDATIONS_OBSERVATION_HISTORY}
      </p>
      <ol className="space-y-3">
        {observations.map((observation) => (
          <li
            key={observation.id}
            className="rounded-lg border border-border-default bg-vivid-50/40 p-3 text-sm"
          >
            <p className="text-text-primary">{observation.content}</p>
            <p className="mt-2 text-xs text-text-muted">
              {observation.authorName ?? UI_MESSAGES.FOUNDATIONS_OBSERVATION_SYSTEM} —{' '}
              {new Date(observation.createdAt).toLocaleString('es-CO')}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
