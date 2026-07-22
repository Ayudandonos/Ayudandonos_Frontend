import { Link } from 'react-router-dom';
import { buttonLinkClass } from '@/components/ui/button-link-class';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { PublicPageShell } from '@/features/marketing/components/PublicPageShell';

/**
 * Entrada: Ninguna.
 * Proceso: Renderiza landing publica minimal con un unico hero full-bleed.
 * Salida: Retorna el elemento JSX de la pagina de inicio.
 */
export function HomePage() {
  return (
    <PublicPageShell withIllustration>
      <section className="relative flex min-h-[calc(100dvh-8rem)] flex-col justify-end lg:justify-center">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 px-6 py-16 sm:py-20 lg:px-10 lg:py-24">
          <div className="max-w-xl space-y-5">
            <p className="animate-scale-in text-4xl font-bold tracking-tight text-primary-700 sm:text-5xl lg:text-6xl">
              {UI_MESSAGES.APP_NAME}
            </p>
            <div className="animate-slide-in space-y-3 [animation-delay:80ms]">
              <h1 className="text-display text-text-primary">
                {UI_MESSAGES.HOME_HERO_TITLE}{' '}
                <span className="text-primary-700">{UI_MESSAGES.HOME_HERO_HIGHLIGHT}</span>
              </h1>
              <p className="max-w-md text-body">{UI_MESSAGES.HOME_HERO_DESCRIPTION}</p>
            </div>
          </div>

          <div className="animate-slide-in flex max-w-xl flex-col gap-4 [animation-delay:160ms]">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                to="/register"
                className={buttonLinkClass({ variant: 'primary', size: 'md' })}
              >
                {UI_MESSAGES.HOME_CTA_DONATE}
              </Link>
              <Link
                to="/register"
                className={buttonLinkClass({ variant: 'outline', size: 'md' })}
              >
                {UI_MESSAGES.HOME_CTA_FOUNDATION}
              </Link>
            </div>
            <p className="text-caption">
              {UI_MESSAGES.HOME_HAS_ACCOUNT}{' '}
              <Link to="/login" className="font-semibold text-primary-700 hover:text-primary-600">
                {UI_MESSAGES.NAV_LOGIN}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}
