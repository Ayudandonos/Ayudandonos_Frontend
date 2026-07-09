import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { Icon, type IconName } from '@/components/ui/Icon';
import { cn } from '@/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  iconLeft?: IconName;
  iconRight?: ReactNode;
  filled?: boolean;
}

// Entrada:
// label, error, hint, iconLeft, iconRight, filled y props nativas de input.

// Proceso:
// Renderiza campo de formulario unificado con glass sutil, foco y errores accesibles.

// Salida:
// Retorna el elemento JSX del input.
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, iconLeft, iconRight, filled = false, className, id, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = error ? `${inputId}-error` : undefined;
  const hintId = hint ? `${inputId}-hint` : undefined;

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-label">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={[errorId, hintId].filter(Boolean).join(' ') || undefined}
          className={cn(
            'h-11 w-full rounded-[var(--radius-sm)] border text-base text-text-primary transition-smooth',
            'placeholder:text-text-placeholder',
            'focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20',
            'disabled:cursor-not-allowed disabled:opacity-50',
            filled
              ? 'border-transparent bg-primary-50/80 py-3'
              : 'glass-subtle border-border-default bg-white/60',
            iconLeft ? 'pl-10 pr-4' : 'px-4',
            iconRight ? 'pr-10' : '',
            error && 'border-error-500 focus:border-error-500 focus:ring-error-500/20',
            className,
          )}
          {...props}
        />
        {iconLeft && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            <Icon name={iconLeft} size="sm" decorative />
          </span>
        )}
        {iconRight && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{iconRight}</div>
        )}
      </div>
      {hint && !error && (
        <span id={hintId} className="text-caption">
          {hint}
        </span>
      )}
      {error && (
        <span id={errorId} className="text-sm text-error-500" role="alert">
          {error}
        </span>
      )}
    </div>
  );
});
