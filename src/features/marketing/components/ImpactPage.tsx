import { Link } from 'react-router-dom';
import { Alert } from '@/components/ui/Alert';
import { buttonLinkClass } from '@/components/ui/button-link-class';
import { Card } from '@/components/ui/Card';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { useImpactStats } from '@/features/marketing/hooks/useImpactStats';
import { PublicPageShell } from '@/features/marketing/components/PublicPageShell';
import type { ImpactStats } from '@/features/marketing/types/impact.types';

/**
 * Entrada: value: numero a formatear.
 * Proceso: Formatea el valor con separador de miles en espanol.
 * Salida: Retorna la cadena numerica legible.
 */
function formatCount(value: number): string {
  return new Intl.NumberFormat('es-CO').format(value);
}

/**
 * Entrada: stats: contadores reales de impacto.
 * Proceso: Construye las tarjetas de KPI con etiquetas de UI_MESSAGES.
 * Salida: Retorna la lista de valor y etiqueta para render.
 */
function buildImpactStatCards(stats: ImpactStats) {
  return [
    {
      value: formatCount(stats.verifiedFoundations),
      label: UI_MESSAGES.IMPACT_STAT_VERIFIED_FOUNDATIONS,
    },
    {
      value: formatCount(stats.activeDonors),
      label: UI_MESSAGES.IMPACT_STAT_ACTIVE_DONORS,
    },
    {
      value: formatCount(stats.registeredDonations),
      label: UI_MESSAGES.IMPACT_STAT_REGISTERED_DONATIONS,
    },
    {
      value: `${formatCount(stats.confirmedDeliveryRatePercent)}%`,
      label: UI_MESSAGES.IMPACT_STAT_CONFIRMED_RATE,
    },
  ];
}

/**
 * Entrada: Ninguna.
 * Proceso: Renderiza pagina publica de impacto con fondo ilustrado y cifras reales.
 * Salida: Retorna el elemento JSX de la pagina de impacto.
 */
export function ImpactPage() {
  const { stats, isLoading, error } = useImpactStats();
  const statCards = stats ? buildImpactStatCards(stats) : [];

  return (
    <PublicPageShell withIllustration illustrationTone="soft">
      <section className="relative mx-auto max-w-[1280px] px-6 py-16 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-display text-text-primary">{UI_MESSAGES.IMPACT_TITLE}</h1>
          <p className="mt-4 text-body text-text-primary/90">{UI_MESSAGES.IMPACT_SUBTITLE}</p>
        </div>

        {error ? (
          <div className="mx-auto mt-10 max-w-xl">
            <Alert variant="danger">{error}</Alert>
          </div>
        ) : null}

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <Card key={`impact-skeleton-${index}`} hover={false} padding="md" className="text-center">
                  <div className="mx-auto h-9 w-20 animate-pulse rounded-md bg-primary-100/80" />
                  <div className="mx-auto mt-3 h-4 w-36 animate-pulse rounded-md bg-primary-50" />
                </Card>
              ))
            : statCards.map((stat) => (
                <Card key={stat.label} hover padding="md" className="text-center">
                  <p className="text-3xl font-bold text-primary-700">{stat.value}</p>
                  <p className="mt-2 text-sm font-medium text-text-primary/80">{stat.label}</p>
                </Card>
              ))}
        </div>

        <div className="mt-14 space-y-6">
          {UI_MESSAGES.IMPACT_SECTIONS.map((section) => (
            <Card key={section.title} padding="lg" hover={false}>
              <h2 className="text-subheading text-text-primary">{section.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-text-primary/85">{section.body}</p>
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
