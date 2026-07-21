import { UI_MESSAGES } from '@/constants/messages.constants';
import type { AdminNeedPriority } from '@/features/admin/types/admin.types';
import { cn } from '@/utils/cn';

interface AdminNeedPriorityBadgeProps {
  priority: AdminNeedPriority;
}

const PRIORITY_STYLES: Record<AdminNeedPriority, string> = {
  LOW: 'bg-vivid-100 text-text-secondary',
  MEDIUM: 'bg-amber-100 text-amber-800',
  HIGH: 'bg-red-100 text-red-700',
};

const PRIORITY_LABELS: Record<AdminNeedPriority, string> = {
  LOW: UI_MESSAGES.NEEDS_PRIORITY_LOW,
  MEDIUM: UI_MESSAGES.NEEDS_PRIORITY_MEDIUM,
  HIGH: UI_MESSAGES.NEEDS_PRIORITY_HIGH,
};

/**
 * Entrada: priority: nivel de prioridad de la necesidad.
 * Proceso: Renderiza badge semantico segun prioridad.
 * Salida: Retorna el elemento JSX del badge.
 */
export function AdminNeedPriorityBadge({ priority }: AdminNeedPriorityBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide',
        PRIORITY_STYLES[priority],
      )}
    >
      {PRIORITY_LABELS[priority]}
    </span>
  );
}
