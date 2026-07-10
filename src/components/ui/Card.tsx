import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  glass?: boolean;
}

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

/**
 * Entrada: children, hover, padding, glass y props nativas de div.
 * Proceso: Renderiza tarjeta glass del sistema de diseno con sombra y borde translucido.
 * Salida: Retorna el elemento JSX de la tarjeta.
 */
export function Card({
  children,
  hover = false,
  padding = 'md',
  glass = true,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-lg)] transition-smooth',
        glass && 'glass',
        !glass && 'border border-border-default bg-white shadow-[var(--shadow-card)]',
        hover && 'interactive-lift cursor-default',
        paddingMap[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
