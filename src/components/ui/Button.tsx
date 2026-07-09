import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Icon, type IconName } from '@/components/ui/Icon';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { cn } from '@/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  iconLeft?: IconName;
  iconRight?: IconName;
  pill?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
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

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 gap-1.5 px-3 text-sm',
  md: 'h-11 gap-2 px-5 text-sm',
  lg: 'h-12 gap-2 px-6 text-base',
};

// Entrada:
// variant, size, isLoading, iconos y props nativas de button.

// Proceso:
// Renderiza boton unificado del sistema de diseno con estados hover, focus y disabled.

// Salida:
// Retorna el elemento JSX del boton.
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    isLoading = false,
    fullWidth = false,
    iconLeft,
    iconRight,
    pill = false,
    disabled,
    className,
    children,
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center rounded-[var(--radius-md)] font-medium transition-smooth interactive-scale',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none',
        variantStyles[variant],
        sizeStyles[size],
        pill && 'rounded-[var(--radius-pill)]',
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <span
            className="size-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
          <span>{UI_MESSAGES.LOADING}</span>
        </>
      ) : (
        <>
          {iconLeft && <Icon name={iconLeft} size="sm" decorative />}
          {children}
          {iconRight && <Icon name={iconRight} size="sm" decorative />}
        </>
      )}
    </button>
  );
});

interface ButtonLinkClassOptions {
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
    variantStyles[variant],
    sizeStyles[size],
    pill && 'rounded-[var(--radius-pill)]',
    fullWidth && 'w-full',
    className,
  );
}
