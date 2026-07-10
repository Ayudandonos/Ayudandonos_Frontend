import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AuthFooter, AuthHeader } from '@/components/ui/AuthChrome';
import { Card } from '@/components/ui/Card';
import { UI_MESSAGES } from '@/constants/messages.constants';

interface LegalPageLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

/**
 * Entrada: title, subtitle opcional y children con el contenido legal.
 * Proceso: Renderiza layout legal con header glass, card de contenido y footer.
 * Salida: Retorna el elemento JSX del contenedor de pagina legal.
 */
export function LegalPageLayout({ title, subtitle, children }: LegalPageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <AuthHeader variant="login" />
      <main className="flex flex-1 animate-fade-in justify-center px-6 py-10 lg:px-10">
        <article className="w-full max-w-3xl">
          <Link
            to="/"
            className="mb-6 inline-flex text-sm font-medium text-primary-700 transition-smooth hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
          >
            {UI_MESSAGES.LEGAL_BACK}
          </Link>
          <Card padding="lg" hover={false}>
            <header className="mb-8 border-b border-border-default pb-6">
              <h1 className="text-display">{title}</h1>
              {subtitle && <p className="mt-3 text-body">{subtitle}</p>}
              <p className="mt-3 text-caption">{UI_MESSAGES.LEGAL_LAST_UPDATED}</p>
            </header>
            <div className="space-y-8">{children}</div>
          </Card>
        </article>
      </main>
      <AuthFooter variant="full" />
    </div>
  );
}

interface LegalSectionProps {
  title: string;
  paragraphs: readonly string[];
}

/**
 * Entrada: title y paragraphs de una seccion legal.
 * Proceso: Renderiza bloque de titulo y parrafos.
 * Salida: Retorna el elemento JSX de la seccion.
 */
export function LegalSection({ title, paragraphs }: LegalSectionProps) {
  return (
    <section>
      <h2 className="text-subheading">{title}</h2>
      <div className="mt-3 space-y-3">
        {paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 40)} className="text-caption leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
