import { Link } from 'react-router-dom';
import { AppImage } from '@/components/ui/AppImage';
import { buttonLinkClass } from '@/components/ui/button-link-class';
import { Card } from '@/components/ui/Card';
import { DeliveryMap } from '@/components/ui/DeliveryMap';
import { Icon } from '@/components/ui/Icon';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { FoundationStatusBadge } from '@/features/foundations/components/FoundationStatusBadge';
import type { FoundationDetail } from '@/features/foundations/types/foundations.types';
import { buildOpenStreetMapUrl } from '@/utils/maps';

interface PublicFoundationProfileProps {
  foundation: FoundationDetail;
}

/**
 * Entrada: location parts de la fundacion.
 * Proceso: Une ciudad, departamento y pais en una etiqueta legible.
 * Salida: Retorna texto de ubicacion o cadena vacia.
 */
function formatLocationLabel(foundation: FoundationDetail): string {
  return [foundation.city, foundation.department, foundation.country]
    .filter(Boolean)
    .join(' · ');
}

/**
 * Entrada: foundation: detalle publico verificado.
 * Proceso: Renderiza perfil visual para donantes (sin panel admin).
 * Salida: Retorna el elemento JSX del perfil publico.
 */
export function PublicFoundationProfile({ foundation }: PublicFoundationProfileProps) {
  const locationLabel = formatLocationLabel(foundation);
  const hasCoords = foundation.latitude != null && foundation.longitude != null;
  const mapsUrl = hasCoords
    ? buildOpenStreetMapUrl(foundation.latitude!, foundation.longitude!)
    : null;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-border-default bg-white">
        <div className="h-28 bg-gradient-to-br from-primary-100 via-primary-50 to-vivid-50 sm:h-36" />
        <div className="relative px-5 pb-6 sm:px-8">
          <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-vivid-50 shadow-sm sm:h-28 sm:w-28">
                {foundation.logoUrl ? (
                  <AppImage
                    src={foundation.logoUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Icon name="building" size="lg" className="text-primary-600" />
                )}
              </div>
              <div className="min-w-0 pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-display text-text-primary">{foundation.name}</h1>
                  <FoundationStatusBadge status={foundation.status} />
                </div>
                {foundation.acronym && (
                  <p className="mt-1 text-subheading text-text-secondary">{foundation.acronym}</p>
                )}
                <div className="mt-2 flex flex-wrap gap-2 text-caption text-text-muted">
                  {foundation.category && (
                    <span className="rounded-full border border-border-default bg-vivid-50 px-3 py-1 text-text-secondary">
                      {foundation.category}
                    </span>
                  )}
                  {locationLabel && (
                    <span className="rounded-full border border-border-default bg-vivid-50 px-3 py-1 text-text-secondary">
                      {locationLabel}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/campaigns" className={buttonLinkClass({ variant: 'primary' })}>
                {UI_MESSAGES.FOUNDATIONS_PUBLIC_CAMPAIGNS_CTA}
              </Link>
              {mapsUrl && (
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonLinkClass({ variant: 'secondary' })}
                >
                  {UI_MESSAGES.CAMPAIGNS_HOW_TO_ARRIVE}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <Card glass={false} className="border border-border-default bg-white p-6">
            <h2 className="text-heading text-text-primary">{UI_MESSAGES.FOUNDATIONS_PUBLIC_ABOUT}</h2>
            <p className="mt-3 whitespace-pre-wrap text-body leading-relaxed text-text-secondary">
              {foundation.description || UI_MESSAGES.FOUNDATIONS_NO_DESCRIPTION}
            </p>
            {(foundation.mission || foundation.vision) && (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {foundation.mission && (
                  <div className="rounded-xl bg-vivid-50 p-4">
                    <p className="text-label text-text-primary">
                      {UI_MESSAGES.FOUNDATIONS_PUBLIC_MISSION}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                      {foundation.mission}
                    </p>
                  </div>
                )}
                {foundation.vision && (
                  <div className="rounded-xl bg-vivid-50 p-4">
                    <p className="text-label text-text-primary">
                      {UI_MESSAGES.FOUNDATIONS_PUBLIC_VISION}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                      {foundation.vision}
                    </p>
                  </div>
                )}
              </div>
            )}
            {foundation.verifiedAt && (
              <p className="mt-4 text-caption text-text-muted">
                {UI_MESSAGES.FOUNDATIONS_PUBLIC_VERIFIED_SINCE}{' '}
                {new Date(foundation.verifiedAt).toLocaleDateString('es-CO')}
              </p>
            )}
          </Card>

          <Card glass={false} className="border border-border-default bg-white p-6">
            <h2 className="text-heading text-text-primary">{UI_MESSAGES.FOUNDATIONS_PUBLIC_LOCATION}</h2>
            {foundation.address && (
              <p className="mt-2 text-body text-text-secondary">{foundation.address}</p>
            )}
            {locationLabel && (
              <p className="mt-1 text-caption text-text-muted">{locationLabel}</p>
            )}
            {hasCoords ? (
              <div className="mt-4">
                <DeliveryMap
                  latitude={foundation.latitude}
                  longitude={foundation.longitude}
                  address={foundation.address}
                  height="16rem"
                />
              </div>
            ) : (
              <p className="mt-3 text-sm text-text-muted">{UI_MESSAGES.FOUNDATIONS_PUBLIC_NO_LOCATION}</p>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card glass={false} className="border border-border-default bg-white p-6">
            <h2 className="text-heading text-text-primary">{UI_MESSAGES.FOUNDATIONS_PUBLIC_CONTACT}</h2>
            <ul className="mt-4 space-y-3 text-sm text-text-secondary">
              {foundation.institutionalEmail && (
                <li className="flex items-start gap-3">
                  <Icon name="envelope" size="sm" className="mt-0.5 text-primary-600" />
                  <a href={`mailto:${foundation.institutionalEmail}`} className="break-all underline">
                    {foundation.institutionalEmail}
                  </a>
                </li>
              )}
              {foundation.phone && (
                <li className="flex items-start gap-3">
                  <Icon name="phone" size="sm" className="mt-0.5 text-primary-600" />
                  <a href={`tel:${foundation.phone}`} className="underline">
                    {foundation.phone}
                  </a>
                </li>
              )}
              {foundation.website && (
                <li className="flex items-start gap-3">
                  <Icon name="browsers" size="sm" className="mt-0.5 text-primary-600" />
                  <div>
                    <p className="text-caption text-text-muted">
                      {UI_MESSAGES.FOUNDATIONS_PUBLIC_WEBSITE}
                    </p>
                    <a
                      href={foundation.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all underline"
                    >
                      {foundation.website}
                    </a>
                  </div>
                </li>
              )}
              {foundation.nit && (
                <li className="flex items-start gap-3">
                  <Icon name="id-badge" size="sm" className="mt-0.5 text-primary-600" />
                  <span>
                    {UI_MESSAGES.FOUNDATIONS_FORM_NIT}: {foundation.nit}
                  </span>
                </li>
              )}
            </ul>
          </Card>

          {foundation.socialLinks.length > 0 && (
            <Card glass={false} className="border border-border-default bg-white p-6">
              <h2 className="text-heading text-text-primary">
                {UI_MESSAGES.FOUNDATIONS_SECTION_SOCIAL}
              </h2>
              <ul className="mt-4 space-y-2">
                {foundation.socialLinks.map((link) => (
                  <li key={link.network}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-primary-700 underline"
                    >
                      {link.network}
                    </a>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
