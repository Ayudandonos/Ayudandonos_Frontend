import { cn } from '@/utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export const buttonVariantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-700 text-white shadow-[var(--shadow-button)] hover:bg-primary-600 focus-visible:ring-primary-600/40',
  secondary:
    'bg-secondary-700 text-white hover:bg-secondary-500 focus-visible:ring-secondary-500/40',
  outline:
    'border border-border-default bg-white/80 text-text-primary hover:border-primary-300 hover:bg-primary-50 focus-visible:ring-primary-600/30',
  ghost:
    'bg-transparent text-text-secondary hover:bg-primary-50 hover:text-primary-700 focus-visible:ring-primary-600/30',
  danger:
    'bg-error-500 text-white hover:bg-error-600 focus-visible:ring-error-500/40',
};

export const buttonSizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 gap-1.5 px-3 text-sm',
  md: 'h-11 gap-2 px-5 text-sm',
  lg: 'h-12 gap-2 px-6 text-base',
};

export interface ButtonLinkClassOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  pill?: boolean;
  className?: string;
}

// Entrada:
// Opciones visuales del boton para className en Link.

// Proceso:
// Genera clases CSS del sistema de botones.

// Salida:
// Retorna string de clases Tailwind.
export function buttonLinkClass({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  pill = false,
  className,
}: ButtonLinkClassOptions): string {
  return cn(
    'inline-flex items-center justify-center rounded-[var(--radius-md)] font-medium transition-smooth interactive-scale',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    buttonVariantStyles[variant],
    buttonSizeStyles[size],
    pill && 'rounded-[var(--radius-pill)]',
    fullWidth && 'w-full',
    className,
  );
}
