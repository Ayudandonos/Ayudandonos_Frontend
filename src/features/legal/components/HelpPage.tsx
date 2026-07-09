import { Link } from 'react-router-dom';
import { buttonLinkClass } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { LegalPageLayout, LegalSection } from '@/features/legal/components/LegalPageLayout';

// Entrada:
// Ninguna.

// Proceso:
// Renderiza centro de ayuda con FAQ y contacto usando cards glass.

// Salida:
// Retorna el elemento JSX de la pagina de ayuda.
export function HelpPage() {
  return (
    <LegalPageLayout title={UI_MESSAGES.LEGAL_HELP_TITLE} subtitle={UI_MESSAGES.LEGAL_HELP_SUBTITLE}>
      {UI_MESSAGES.LEGAL_HELP_SECTIONS.map((section) => (
        <LegalSection key={section.title} title={section.title} paragraphs={section.paragraphs} />
      ))}
      <section>
        <h2 className="text-subheading">{UI_MESSAGES.LEGAL_HELP_FAQ_TITLE}</h2>
        <dl className="mt-4 space-y-4">
          {UI_MESSAGES.LEGAL_HELP_FAQ.map((item) => (
            <Card key={item.question} padding="md" hover={false} glass={false} className="bg-primary-50/60">
              <dt className="text-sm font-semibold text-text-primary">{item.question}</dt>
              <dd className="mt-2 text-caption leading-relaxed">{item.answer}</dd>
            </Card>
          ))}
        </dl>
      </section>
      <Card padding="lg" hover={false} className="border-primary-300 bg-primary-50/80">
        <h2 className="text-subheading">{UI_MESSAGES.LEGAL_HELP_CONTACT_TITLE}</h2>
        <p className="mt-2 text-caption leading-relaxed">{UI_MESSAGES.LEGAL_HELP_CONTACT_BODY}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/login" className={buttonLinkClass({ variant: 'primary', size: 'sm' })}>
            {UI_MESSAGES.NAV_LOGIN}
          </Link>
          <Link to="/register" className={buttonLinkClass({ variant: 'outline', size: 'sm' })}>
            {UI_MESSAGES.NAV_REGISTER}
          </Link>
        </div>
      </Card>
    </LegalPageLayout>
  );
}
