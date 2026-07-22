import type { ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { cn } from '@/utils/cn';

export type AlertVariant = 'info' | 'danger' | 'success' | 'warning' | 'neutral';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children?: ReactNode;
  items?: string[];
  className?: string;
}

const VARIANT_STYLES: Record<AlertVariant, string> = {
  info: 'border-primary-200 bg-primary-50 text-primary-800',
  danger: 'border-error-500/25 bg-error-500/10 text-error-600',
  success: 'border-success-500/25 bg-success-500/10 text-success-600',
  warning: 'border-warning-500/30 bg-warning-500/10 text-warning-600',
  neutral: 'border-border-default bg-secondary-100 text-text-primary',
};

const VARIANT_LABELS: Record<AlertVariant, string> = {
  info: UI_MESSAGES.ALERT_INFO,
  danger: UI_MESSAGES.ALERT_DANGER,
  success: UI_MESSAGES.ALERT_SUCCESS,
  warning: UI_MESSAGES.ALERT_WARNING,
  neutral: UI_MESSAGES.ALERT_NEUTRAL,
};

/**
 * Entrada: variant, title, children/items y className opcionales.
 * Proceso: Renderiza alerta semantica con icono; usa lista si hay items o mensaje compacto si no.
 * Salida: Retorna el elemento JSX de la alerta.
 */
export function Alert({
  variant = 'info',
  title,
  children,
  items,
  className,
}: AlertProps) {
  const hasList = Boolean(items && items.length > 0);
  const hasBody = Boolean(children) || hasList;

  if (!title && !hasBody) {
    return null;
  }

  return (
    <div
      className={cn(
        'mb-4 flex rounded-[var(--radius-md)] border p-4 text-sm',
        hasList ? 'items-start' : 'items-start sm:items-center',
        VARIANT_STYLES[variant],
        className,
      )}
      role="alert"
    >
      <Icon
        name="info"
        size="sm"
        className={cn('me-2 shrink-0', hasList ? 'mt-0.5' : 'mt-0.5 sm:mt-0')}
        decorative
      />
      <span className="sr-only">{VARIANT_LABELS[variant]}</span>
      {hasList ? (
        <div className="min-w-0 flex-1">
          {title && <span className="font-medium">{title}</span>}
          <ul className="mt-2 list-outside list-disc space-y-1 ps-2.5">
            {items!.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {children ? <div className="mt-2">{children}</div> : null}
        </div>
      ) : (
        <p className="min-w-0 flex-1">
          {title ? <span className="me-1 font-medium">{title}</span> : null}
          {children}
        </p>
      )}
    </div>
  );
}
