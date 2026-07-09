import { Link } from 'react-router-dom';
import { buttonLinkClass } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { PublicPageShell } from '@/features/marketing/components/PublicPageShell';

// Entrada:
// Ninguna.

// Proceso:
// Renderiza pagina publica de impacto con estadisticas y cards glass.

// Salida:
// Retorna el elemento JSX de la pagina de impacto.
export function ImpactPage() {
  return (
    <PublicPageShell>
      <section className="mx-auto max-w-[1280px] px-6 py-16 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-display">{UI_MESSAGES.IMPACT_TITLE}</h1>
          <p className="mt-4 text-body">{UI_MESSAGES.IMPACT_SUBTITLE}</p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {UI_MESSAGES.IMPACT_STATS.map((stat) => (
            <Card key={stat.label} hover padding="md" className="text-center">
              <p className="text-3xl font-bold text-primary-700">{stat.value}</p>
              <p className="mt-2 text-caption font-medium">{stat.label}</p>
            </Card>
          ))}
        </div>
        <div className="mt-14 space-y-6">
          {UI_MESSAGES.IMPACT_SECTIONS.map((section) => (
            <Card key={section.title} padding="lg" hover={false}>
              <h2 className="text-subheading">{section.title}</h2>
              <p className="mt-3 text-caption leading-relaxed">{section.body}</p>
            </Card>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link to="/register" className={buttonLinkClass({ variant: 'primary', size: 'md' })}>
            {UI_MESSAGES.IMPACT_CTA}
          </Link>
        </div>
      </section>
    </PublicPageShell>
  );
}
