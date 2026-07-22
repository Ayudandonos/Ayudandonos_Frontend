import type { FoundationStatus } from '@/features/foundations/types/foundations.types';
import { Card } from '@/components/ui/Card';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { cn } from '@/utils/cn';

interface FoundationReadinessChecklistProps {
  foundation: {
    isProfileComplete: boolean;
    hasRequiredDocuments: boolean;
    status: FoundationStatus;
  };
}

interface ChecklistItem {
  label: string;
  done: boolean;
}

/**
 * Entrada: foundation: datos de sesion o detalle de la fundacion.
 * Proceso: Muestra checklist visual de requisitos operativos.
 * Salida: Retorna el elemento JSX del checklist.
 */
export function FoundationReadinessChecklist({ foundation }: FoundationReadinessChecklistProps) {
  const items: ChecklistItem[] = [
    {
      label: UI_MESSAGES.FOUNDATIONS_READINESS_PROFILE,
      done: foundation.isProfileComplete,
    },
    {
      label: UI_MESSAGES.FOUNDATIONS_READINESS_DOCUMENTS,
      done: foundation.hasRequiredDocuments,
    },
    {
      label: UI_MESSAGES.FOUNDATIONS_READINESS_VERIFIED,
      done: foundation.status === 'VERIFIED',
    },
  ];

  return (
    <Card glass={false} className="border border-border-default bg-white p-6">
      <h2 className="text-heading text-text-primary">{UI_MESSAGES.FOUNDATIONS_READINESS_TITLE}</h2>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-3 text-sm">
            <span
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold',
                item.done ? 'bg-success-500/15 text-success-600' : 'bg-amber-100 text-amber-800',
              )}
              aria-hidden
            >
              {item.done ? 'OK' : '—'}
            </span>
            <span className={item.done ? 'text-text-primary' : 'text-text-secondary'}>{item.label}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
