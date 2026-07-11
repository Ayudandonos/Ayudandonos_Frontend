import { forwardRef, type InputHTMLAttributes } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { AppImage } from '@/components/ui/AppImage';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { FIGMA_ASSETS } from '@/constants/figma-assets.constants';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { cn } from '@/utils/cn';

const PUBLIC_NAV = [
  { path: '/', label: UI_MESSAGES.NAV_HOME },
  { path: '/organizaciones', label: UI_MESSAGES.NAV_ORGANIZATIONS },
  { path: '/impacto', label: UI_MESSAGES.NAV_IMPACT },
] as const;

interface AuthHeaderProps {
  variant?: 'login' | 'register';
}

/**
 * Entrada: variant: variante visual del header.
 * Proceso: Renderiza header glass con logo y navegacion publica.
 * Salida: Retorna el elemento JSX del header.
 */
export function AuthHeader({ variant = 'login' }: AuthHeaderProps) {
  const location = useLocation();

  /**
   * Entrada: path: ruta de navegacion a evaluar.
   * Proceso: Calcula clases Tailwind segun coincidencia con la ruta activa.
   * Salida: Retorna cadena de clases CSS para el enlace.
   */
  const navLinkClass = (path: string) =>
    cn(
      'rounded-lg px-3 py-1.5 text-sm font-medium transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/40',
      location.pathname === path
        ? 'bg-primary-50 font-semibold text-primary-700'
        : 'text-text-secondary hover:bg-white/60 hover:text-primary-700',
    );

  if (variant === 'register') {
    return (
      <header className="glass-header sticky top-0 z-50 flex h-16 items-center justify-between px-6">
        <Link
          to="/login"
          className="flex items-center gap-2 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
          aria-label={UI_MESSAGES.REGISTER_BACK_ARIA}
        >
          <AppImage src={FIGMA_ASSETS.LOGO_REGISTER} alt="" className="h-[26px] w-[26px]" />
          <span className="text-2xl font-bold text-primary-700">{UI_MESSAGES.APP_NAME}</span>
        </Link>
        <p className="hidden text-sm font-medium text-text-secondary sm:block">{UI_MESSAGES.APP_TAGLINE}</p>
      </header>
    );
  }

  return (
    <header className="glass-header sticky top-0 z-50 flex h-16 items-center justify-between px-6">
      <Link
        to="/"
        className="flex items-center gap-2 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
      >
        <AppImage src={FIGMA_ASSETS.LOGO} alt="" className="h-[26px] w-[26px]" />
        <span className="text-2xl font-bold text-primary-700">{UI_MESSAGES.APP_NAME}</span>
      </Link>
      <nav className="hidden items-center gap-1 sm:flex" aria-label="Navegacion principal">
        {PUBLIC_NAV.map((item) => (
          <Link key={item.path} to={item.path} className={navLinkClass(item.path)}>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

interface AuthFooterProps {
  variant?: 'full' | 'simple';
}

/**
 * Entrada: variant: pie de pagina completo o simplificado.
 * Proceso: Renderiza footer glass con enlaces legales.
 * Salida: Retorna el elemento JSX del footer.
 */
export function AuthFooter({ variant = 'full' }: AuthFooterProps) {
  const year = new Date().getFullYear();
  const linkClass =
    'text-xs font-semibold tracking-wide text-text-muted transition-smooth hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600';

  if (variant === 'simple') {
    return (
      <footer className="py-6 text-center">
        <p className="text-caption">{UI_MESSAGES.APP_FOOTER(year)}</p>
      </footer>
    );
  }

  return (
    <footer className="glass-header mt-auto px-6 py-6">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4">
        <Link to="/legal/secure-platform" className={cn(linkClass, 'flex items-center gap-2')}>
          <Icon name="browsers" size="sm" className="text-primary-600" decorative />
          <span className="text-text-secondary">{UI_MESSAGES.FOOTER_SECURE}</span>
        </Link>
        <nav className="flex flex-wrap gap-6" aria-label="Enlaces legales">
          <Link to="/legal/terms" className={linkClass}>
            {UI_MESSAGES.FOOTER_TERMS}
          </Link>
          <Link to="/legal/privacy" className={linkClass}>
            {UI_MESSAGES.FOOTER_PRIVACY}
          </Link>
          <Link to="/legal/help" className={linkClass}>
            {UI_MESSAGES.FOOTER_HELP}
          </Link>
        </nav>
        <p className={linkClass}>{UI_MESSAGES.APP_FOOTER(year)}</p>
      </div>
    </footer>
  );
}

interface AuthPasswordFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  showPassword: boolean;
  onToggle: () => void;
  filled?: boolean;
}

export const AuthPasswordField = forwardRef<HTMLInputElement, AuthPasswordFieldProps>(
  /**
   * Entrada: showPassword, onToggle y props de Input excepto type; ref: referencia al input nativo.
   * Proceso: Renderiza campo de contraseña con toggle accesible mediante forwardRef.
   * Salida: Retorna el elemento JSX del campo de contraseña.
   */
  function AuthPasswordField({ showPassword, onToggle, label, filled, ...props }, ref) {
    return (
      <Input
        ref={ref}
        label={label}
        type={showPassword ? 'text' : 'password'}
        filled={filled}
        iconRight={
          <button
            type="button"
            onClick={onToggle}
            className="rounded-md px-1 text-xs font-semibold text-primary-700 transition-smooth hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
            aria-label={showPassword ? UI_MESSAGES.LOGIN_HIDE_PASSWORD : UI_MESSAGES.LOGIN_SHOW_PASSWORD}
            aria-pressed={showPassword}
          >
            {showPassword ? UI_MESSAGES.LOGIN_PASSWORD_TOGGLE_HIDE : UI_MESSAGES.LOGIN_PASSWORD_TOGGLE_SHOW}
          </button>
        }
        {...props}
      />
    );
  },
);

export { Input as FigmaInput };

interface AuthSubmitButtonProps {
  isLoading?: boolean;
  label: string;
  iconRight?: IconName;
  variant?: 'login' | 'register';
  disabled?: boolean;
  className?: string;
}

/**
 * Entrada: Props del boton de envio de formularios auth.
 * Proceso: Renderiza Button primario del sistema con icono opcional.
 * Salida: Retorna el elemento JSX del boton de envio.
 */
export function AuthSubmitButton({
  isLoading = false,
  label,
  iconRight,
  variant = 'login',
  disabled,
  className,
}: AuthSubmitButtonProps) {
  return (
    <Button
      type="submit"
      variant="primary"
      size={variant === 'register' ? 'lg' : 'md'}
      fullWidth
      isLoading={isLoading}
      disabled={disabled}
      iconRight={isLoading ? undefined : iconRight}
      pill={variant === 'register'}
      className={className}
    >
      {label}
    </Button>
  );
}
