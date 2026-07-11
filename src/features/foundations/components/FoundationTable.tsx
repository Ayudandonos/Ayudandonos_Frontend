import { Button } from '@/components/ui/Button';
import { AppImage } from '@/components/ui/AppImage';
import { UI_MESSAGES } from '@/constants/messages.constants';
import type { FoundationListItem } from '@/features/foundations/types/foundations.types';
import { FoundationStatusBadge } from '@/features/foundations/components/FoundationStatusBadge';
import { Icon } from '@/components/ui/Icon';

interface FoundationTableProps {
  items: FoundationListItem[];
  selectedId?: string;
  onSelect: (foundation: FoundationListItem) => void;
}

/**
 * Entrada: items: filas del listado; selectedId: fila activa; onSelect: callback al revisar.
 * Proceso: Renderiza tabla administrativa de fundaciones segun prototipo.
 * Salida: Retorna el elemento JSX de la tabla.
 */
export function FoundationTable({ items, selectedId, onSelect }: FoundationTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border-default bg-white">
      <table className="min-w-full divide-y divide-border-default text-sm">
        <thead className="bg-vivid-50 text-left text-text-secondary">
          <tr>
            <th className="px-4 py-3 font-medium">{UI_MESSAGES.FOUNDATIONS_TABLE_NAME}</th>
            <th className="px-4 py-3 font-medium">{UI_MESSAGES.FOUNDATIONS_TABLE_REPRESENTATIVE}</th>
            <th className="px-4 py-3 font-medium">{UI_MESSAGES.FOUNDATIONS_TABLE_CITY}</th>
            <th className="px-4 py-3 font-medium">{UI_MESSAGES.FOUNDATIONS_TABLE_DATE}</th>
            <th className="px-4 py-3 font-medium">{UI_MESSAGES.FOUNDATIONS_TABLE_STATUS}</th>
            <th className="px-4 py-3 font-medium">{UI_MESSAGES.FOUNDATIONS_TABLE_ACTIONS}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-default">
          {items.map((foundation) => (
            <tr
              key={foundation.id}
              className={selectedId === foundation.id ? 'bg-vivid-50/70' : undefined}
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-vivid-50">
                    {foundation.logoUrl ? (
                      <AppImage src={foundation.logoUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <Icon name="organization" size="sm" className="text-vivid-600" decorative />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">{foundation.name}</p>
                    <p className="text-xs text-text-muted">
                      {[foundation.category, foundation.acronym].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-text-secondary">{foundation.representative.fullName}</td>
              <td className="px-4 py-3 text-text-secondary">{foundation.city ?? '—'}</td>              <td className="px-4 py-3 text-text-muted">
                {new Date(foundation.createdAt).toLocaleDateString('es-CO')}
              </td>
              <td className="px-4 py-3">
                <FoundationStatusBadge status={foundation.status} />
              </td>
              <td className="px-4 py-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => onSelect(foundation)}
                >
                  {UI_MESSAGES.FOUNDATIONS_REVIEW}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
