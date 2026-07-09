import { AppImage } from '@/components/ui/AppImage';
import { Icon } from '@/components/ui/Icon';
import { FIGMA_ASSETS } from '@/constants/figma-assets.constants';
import { UI_MESSAGES } from '@/constants/messages.constants';

// Entrada:
// Ninguna.

// Proceso:
// Renderiza botones de login social; Google usa asset de marca, SSO usa icono del sistema.

// Salida:
// Retorna el elemento JSX de los botones sociales.
export function SocialLoginButtons() {
  const socialClass =
    'flex h-11 flex-1 items-center justify-center gap-2 rounded-[var(--radius-md)] border border-border-default bg-white/70 text-sm font-medium text-text-primary transition-smooth hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/30 disabled:cursor-not-allowed disabled:opacity-60';

  return (
    <div className="grid grid-cols-2 gap-2">
      <button type="button" disabled aria-label={UI_MESSAGES.LOGIN_GOOGLE_ARIA} className={socialClass}>
        <AppImage src={FIGMA_ASSETS.ICON_GOOGLE} alt="" className="size-4" aria-hidden="true" />
        {UI_MESSAGES.LOGIN_GOOGLE}
      </button>
      <button type="button" disabled aria-label={UI_MESSAGES.LOGIN_SSO_ARIA} className={socialClass}>
        <Icon name="apps-add" size="sm" className="text-primary-600" decorative />
        {UI_MESSAGES.LOGIN_SSO}
      </button>
    </div>
  );
}
