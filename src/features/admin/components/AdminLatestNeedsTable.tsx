import { UI_MESSAGES } from '@/constants/messages.constants';
import { AdminNeedPriorityBadge } from '@/features/admin/components/AdminNeedPriorityBadge';
import type { AdminLatestNeedItem } from '@/features/admin/types/admin.types';
import { formatDate } from '@/utils/date-format';

interface AdminLatestNeedsTableProps {
  items: AdminLatestNeedItem[];
}

/**
 * Entrada: items: filas de necesidades recientes del panel admin.
 * Proceso: Renderiza tabla responsiva con fundacion, prioridad y fecha.
 * Salida: Retorna el elemento JSX de la tabla.
 */
export function AdminLatestNeedsTable({ items }: AdminLatestNeedsTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border-default bg-white">
      <table className="min-w-full divide-y divide-border-default text-sm">
        <thead className="bg-vivid-50 text-left text-text-secondary">
          <tr>
            <th className="px-4 py-3 font-medium">{UI_MESSAGES.ADMIN_NEEDS_TABLE_ITEM}</th>
            <th className="px-4 py-3 font-medium">{UI_MESSAGES.ADMIN_NEEDS_TABLE_FOUNDATION}</th>
            <th className="px-4 py-3 font-medium">{UI_MESSAGES.ADMIN_NEEDS_TABLE_PRIORITY}</th>
            <th className="px-4 py-3 font-medium">{UI_MESSAGES.ADMIN_NEEDS_TABLE_DATE}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-default">
          {items.map((need) => (
            <tr key={need.id}>
              <td className="px-4 py-3 font-medium text-text-primary">{need.name}</td>
              <td className="px-4 py-3 text-text-secondary">{need.foundationName}</td>
              <td className="px-4 py-3">
                <AdminNeedPriorityBadge priority={need.priority} />
              </td>
              <td className="px-4 py-3 text-text-muted">{formatDate(need.publishedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
