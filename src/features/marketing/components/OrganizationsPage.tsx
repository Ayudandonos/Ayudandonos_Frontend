import { Link } from 'react-router-dom';
import { buttonLinkClass } from '@/components/ui/button-link-class';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { PublicPageShell } from '@/features/marketing/components/PublicPageShell';

/**
 * Entrada: Ninguna.
 * Proceso: Renderiza pagina publica de organizaciones con cards glass.
 * Salida: Retorna el elemento JSX de la pagina de organizaciones.
 */
export function OrganizationsPage() {
  return (
    <PublicPageShell>
      <section className="mx-auto max-w-[1280px] px-6 py-16 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-600 shadow-[var(--shadow-button)]">
              <Icon name="organization" size="2xl" className="text-white" decorative />
            </div>
          </div>
          <h1 className="text-display">{UI_MESSAGES.ORGANIZATIONS_TITLE}</h1>
          <p className="mt-4 text-body">{UI_MESSAGES.ORGANIZATIONS_SUBTITLE}</p>
        </div>
        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {UI_MESSAGES.ORGANIZATIONS_SECTIONS.map((section) => (
            <Card key={section.title} hover padding="md">
              <h2 className="text-subheading">{section.title}</h2>
              <ul className="mt-4 space-y-2">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-2 text-caption leading-relaxed">
                    <Icon name="add" size="xs" className="mt-1 shrink-0 text-primary-600" decorative />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
        <Card padding="lg" className="mt-12 text-center" hover={false}>
          <h2 className="text-heading">{UI_MESSAGES.ORGANIZATIONS_CTA_TITLE}</h2>
          <p className="mx-auto mt-2 max-w-xl text-caption">{UI_MESSAGES.ORGANIZATIONS_CTA_BODY}</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/foundations"
              className={buttonLinkClass({ variant: 'outline', size: 'md' })}
            >
              {UI_MESSAGES.ORGANIZATIONS_BROWSE_LINK}
            </Link>
            <Link
              to="/register"
              className={buttonLinkClass({ variant: 'primary', size: 'md' })}
            >
              {UI_MESSAGES.ORGANIZATIONS_CTA_BUTTON}
            </Link>
          </div>
        </Card>
      </section>
    </PublicPageShell>
  );
}
