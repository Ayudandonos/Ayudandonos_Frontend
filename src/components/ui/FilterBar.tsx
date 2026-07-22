import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/utils/cn';

export const filterFieldClassName = cn(
  'field-control h-11 w-full rounded-[var(--radius-sm)] border border-border-default bg-white/70 px-4 text-sm text-text-primary',
  'glass-subtle transition-smooth placeholder:text-text-placeholder',
  'focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20',
);

interface FilterBarProps {
  children: ReactNode;
  className?: string;
  gridClassName?: string;
}

/**
 * Entrada: children de filtros; className/gridClassName opcionales.
 * Proceso: Renderiza contenedor glass unificado para barras de filtros.
 * Salida: Retorna el elemento JSX del FilterBar.
 */
export function FilterBar({ children, className, gridClassName }: FilterBarProps) {
  return (
    <section
      className={cn(
        'glass-subtle rounded-2xl border border-border-default/80 bg-white/50 p-4 sm:p-5',
        className,
      )}
    >
      <div className={cn('grid items-start gap-3', gridClassName)}>{children}</div>
    </section>
  );
}

interface FilterSearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className'> {
  className?: string;
}

/**
 * Entrada: props de input controlado y className opcional.
 * Proceso: Renderiza campo de busqueda con icono alineado al FilterBar.
 * Salida: Retorna el elemento JSX del input de busqueda.
 */
export function FilterSearchInput({ className, ...props }: FilterSearchInputProps) {
  return (
    <div className={cn('relative', className)}>
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted">
        <Icon name="search" size="sm" decorative />
      </span>
      <input {...props} type="search" className={cn(filterFieldClassName, 'ps-10')} />
    </div>
  );
}

interface FilterSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
}

/**
 * Entrada: props de select nativo y className opcional.
 * Proceso: Aplica estilos del FilterBar al select.
 * Salida: Retorna el elemento JSX del select.
 */
export function FilterSelect({ className, children, ...props }: FilterSelectProps) {
  return (
    <select {...props} className={cn(filterFieldClassName, className)}>
      {children}
    </select>
  );
}
