import { Link } from 'react-router-dom';
import { AppImage } from '@/components/ui/AppImage';
import { buttonLinkClass } from '@/components/ui/button-link-class';
import { Card } from '@/components/ui/Card';
import { FIGMA_ASSETS } from '@/constants/figma-assets.constants';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { PublicPageShell } from '@/features/marketing/components/PublicPageShell';

// Entrada:
// Ninguna.

// Proceso:
// Renderiza pagina de inicio publica con sistema de diseno glass.

// Salida:
// Retorna el elemento JSX de la pagina de inicio.
export function HomePage() {
  return (
    <PublicPageShell>
      <section className="mx-auto flex max-w-[1280px] flex-col items-center gap-12 px-6 py-16 lg:flex-row lg:gap-16 lg:px-10 lg:py-20">
        <div className="flex flex-1 flex-col items-center gap-8 lg:items-start">
          <AppImage
            src={FIGMA_ASSETS.HERO_ILLUSTRATION}
            alt=""
            width={448}
            height={448}
            className="aspect-square w-full max-w-[448px]"
          />
          <div className="w-full max-w-lg space-y-4 text-center lg:text-left">
            <h1 className="text-display">
              {UI_MESSAGES.HOME_HERO_TITLE}{' '}
              <span className="text-primary-700">{UI_MESSAGES.HOME_HERO_HIGHLIGHT}</span>
            </h1>
            <p className="text-body">{UI_MESSAGES.HOME_HERO_DESCRIPTION}</p>
          </div>
        </div>
        <div className="w-full max-w-md">
          <Card padding="lg" hover={false}>
            <h2 className="text-heading">{UI_MESSAGES.HOME_CTA_CARD_TITLE}</h2>
            <p className="mt-2 text-caption">{UI_MESSAGES.HOME_CTA_CARD_SUBTITLE}</p>
            <div className="mt-6 space-y-3">
              <Link
                to="/register"
                className={buttonLinkClass({ variant: 'primary', size: 'md', fullWidth: true })}
              >
                {UI_MESSAGES.HOME_CTA_DONATE}
              </Link>
              <Link
                to="/register"
                className={buttonLinkClass({ variant: 'outline', size: 'md', fullWidth: true })}
              >
                {UI_MESSAGES.HOME_CTA_FOUNDATION}
              </Link>
              <p className="pt-2 text-center text-caption">
                {UI_MESSAGES.HOME_HAS_ACCOUNT}{' '}
                <Link to="/login" className="font-semibold text-primary-700 hover:text-primary-600">
                  {UI_MESSAGES.NAV_LOGIN}
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </section>
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-[1280px]">
          <h2 className="mb-10 text-center text-heading">{UI_MESSAGES.HOME_FEATURES_TITLE}</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {UI_MESSAGES.HOME_FEATURES.map((item) => (
              <Card key={item.title} hover padding="md">
                <h3 className="text-subheading">{item.title}</h3>
                <p className="mt-2 text-caption leading-relaxed">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}
