import { Link } from 'react-router-dom';
import { FIGMA_ASSETS } from '@/constants/figma-assets.constants';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { cn } from '@/utils/cn';

interface AuthHeaderProps {
  variant?: 'login' | 'register';
}

// Entrada:
// variant: variante visual del header de autenticacion.

// Proceso:
// Renderiza barra superior con logo ConectaAyuda segun prototipo Figma.

// Salida:
// Retorna el elemento JSX del header.
export function AuthHeader({ variant = 'login' }: AuthHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border-default bg-surface-page px-6 shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
      <Link to="/" className="flex items-center gap-2">
        <img src={FIGMA_ASSETS.LOGO} alt="" className="h-[26px] w-[26px]" />
        <span className="text-2xl font-bold text-vivid-700">{UI_MESSAGES.APP_NAME}</span>
      </Link>
      {variant === 'login' ? (
        <nav className="flex items-center gap-4">
          <span className="text-sm font-medium text-text-secondary">{UI_MESSAGES.NAV_HOME}</span>
          <span className="text-sm font-medium text-text-secondary">
            {UI_MESSAGES.NAV_ORGANIZATIONS}
          </span>
          <span className="text-sm font-medium text-text-secondary">{UI_MESSAGES.NAV_IMPACT}</span>
        </nav>
      ) : (
        <p className="text-sm font-medium text-text-secondary">{UI_MESSAGES.APP_TAGLINE}</p>
      )}
    </header>
  );
}

interface AuthFooterProps {
  variant?: 'full' | 'simple';
}

// Entrada:
// variant: pie de pagina completo o simplificado.

// Proceso:
// Renderiza footer de autenticacion segun Figma.

// Salida:
// Retorna el elemento JSX del footer.
export function AuthFooter({ variant = 'full' }: AuthFooterProps) {
  if (variant === 'simple') {
    return (
      <footer className="py-4 text-center">
        <p className="text-xs font-medium text-text-muted">
          {UI_MESSAGES.APP_FOOTER(new Date().getFullYear())}
        </p>
      </footer>
    );
  }

  return (
    <footer className="border-t border-border-default bg-white px-6 pb-6 pt-6">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img src={FIGMA_ASSETS.LOGO} alt="" className="h-5 w-4" />
          <span className="text-xs font-semibold tracking-wide text-text-secondary">
            {UI_MESSAGES.FOOTER_SECURE}
          </span>
        </div>
        <div className="flex gap-6">
          <span className="text-xs font-semibold tracking-wide text-text-muted">
            {UI_MESSAGES.FOOTER_TERMS}
          </span>
          <span className="text-xs font-semibold tracking-wide text-text-muted">
            {UI_MESSAGES.FOOTER_PRIVACY}
          </span>
          <span className="text-xs font-semibold tracking-wide text-text-muted">
            {UI_MESSAGES.FOOTER_HELP}
          </span>
        </div>
        <p className="text-xs font-semibold tracking-wide text-text-muted">
          {UI_MESSAGES.APP_FOOTER(2024)}
        </p>
      </div>
    </footer>
  );
}

interface FigmaInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  iconSrc?: string;
  rightElement?: React.ReactNode;
  variant?: 'default' | 'auth';
}

// Entrada:
// label, error, iconSrc, rightElement, variant y props nativas de input.

// Proceso:
// Renderiza input estilizado segun diseno Figma con icono opcional.

// Salida:
// Retorna el elemento JSX del campo de entrada.
export function FigmaInput({
  label,
  error,
  iconSrc,
  rightElement,
  variant = 'default',
  className,
  id,
  ...props
}: FigmaInputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex w-full flex-col gap-1">
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            'text-sm font-medium text-text-secondary',
            variant === 'auth' && 'font-semibold text-text-primary',
          )}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          className={cn(
            'h-10 w-full rounded-lg border border-border-default bg-white py-2.5 text-base text-text-primary placeholder:text-text-placeholder focus:border-vivid-600 focus:outline-none focus:ring-2 focus:ring-vivid-600/20',
            iconSrc ? 'pl-10 pr-3' : 'px-4',
            rightElement ? 'pr-10' : '',
            variant === 'default' && 'bg-vivid-50 py-[15px] h-auto',
            error && 'border-red-500',
            className,
          )}
          {...props}
        />
        {iconSrc && (
          <img src={iconSrc} alt="" className="absolute left-3 top-1/2 h-4 w-5 -translate-y-1/2" />
        )}
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}
