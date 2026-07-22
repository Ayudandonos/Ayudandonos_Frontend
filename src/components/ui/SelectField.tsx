import { forwardRef, useId, type SelectHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  placeholder?: string;
  options: Array<{ value: string; label: string }>;
}

/**
 * Entrada: label, error, placeholder, options y props nativas de select.
 * Proceso: Renderiza un select con estilo alineado a Input.
 * Salida: Retorna el elemento JSX del select.
 */
export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  function SelectField(
    {
      label,
      error,
      placeholder = 'Selecciona una opción',
      options,
      className,
      id,
      disabled,
      ...props
    },
    ref,
  ) {
    const generatedId = useId();
    const selectId = id || generatedId;
    const errorId = error ? `${selectId}-error` : undefined;

    return (
      <div className="flex w-full flex-col gap-1.5">
        <label htmlFor={selectId} className="text-label">
          {label}
        </label>
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={!!error}
            aria-describedby={errorId}
            disabled={disabled}
            className={cn(
              'h-11 w-full appearance-none rounded-[var(--radius-sm)] border text-base text-text-primary transition-smooth',
              'focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'glass-subtle border-border-default bg-white/60 px-4 pr-10',
              error && 'border-error-500 focus:border-error-500 focus:ring-error-500/20',
              className,
            )}
            {...props}
          >
            <option value="">{placeholder}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {error && (
          <span id={errorId} className="text-sm text-error-500" role="alert">
            {error}
          </span>
        )}
      </div>
    );
  },
);
