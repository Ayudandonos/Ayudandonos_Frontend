import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { AppImage } from '@/components/ui/AppImage';
import { Icon } from '@/components/ui/Icon';
import { UI_MESSAGES } from '@/constants/messages.constants';
import type { FoundationListItem } from '@/features/foundations/types/foundations.types';
import { FoundationStatusBadge } from '@/features/foundations/components/FoundationStatusBadge';

interface FoundationCardProps {
  foundation: FoundationListItem;
  detailPath?: string;
}

/**
 * Entrada: foundation: datos de listado; detailPath: ruta opcional de detalle.
 * Proceso: Renderiza tarjeta resumida de fundacion verificada para explorador publico.
 * Salida: Retorna el elemento JSX de la tarjeta.
 */
export function FoundationCard({ foundation, detailPath }: FoundationCardProps) {
  const targetPath = detailPath ?? `/foundations/${foundation.id}`;

  return (
    <Card glass={false} padding="none" hover className="overflow-hidden border border-border-default">
      <div className="flex h-28 items-center justify-center bg-vivid-50">
        {foundation.logoUrl ? (
          <AppImage src={foundation.logoUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <Icon name="organization" size="lg" className="text-vivid-600" decorative />
        )}
      </div>
      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-text-primary">{foundation.name}</h2>
            {foundation.acronym && (
              <p className="text-xs text-text-muted">{foundation.acronym}</p>
            )}
          </div>
          <FoundationStatusBadge status={foundation.status} />
        </div>
        <p className="line-clamp-3 text-sm text-text-secondary">
          {foundation.description || UI_MESSAGES.FOUNDATIONS_NO_DESCRIPTION}
        </p>
        <p className="text-xs text-text-muted">
          {[foundation.city, foundation.category].filter(Boolean).join(' · ')}
        </p>
        <p className="text-xs text-text-muted">
          {UI_MESSAGES.FOUNDATIONS_REPRESENTATIVE}: {foundation.representative.fullName}
        </p>
        <Link
          to={targetPath}
          className="block rounded-xl bg-vivid-700 py-3 text-center text-sm font-medium text-white"
        >
          {UI_MESSAGES.FOUNDATIONS_VIEW_DETAIL}
        </Link>
      </div>
    </Card>
  );
}
