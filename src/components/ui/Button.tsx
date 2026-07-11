import { forwardRef, type ButtonHTMLAttributes } from 'react';
import {
  buttonSizeStyles,
  buttonVariantStyles,
  type ButtonSize,
  type ButtonVariant,
} from '@/components/ui/button-link-class';
import { Icon, type IconName } from '@/components/ui/Icon';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { cn } from '@/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  iconLeft?: IconName;
  iconRight?: IconName;
  pill?: boolean;
}

/**
 * Entrada: variant, size, isLoading, iconos y props nativas de button.
 * Proceso: Renderiza boton unificado del sistema de diseno con estados hover, focus y disabled.
 * Salida: Retorna el elemento JSX del boton.
 */
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
        buttonVariantStyles[variant],
        buttonSizeStyles[size],
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
