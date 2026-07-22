import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppImage } from '@/components/ui/AppImage';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { FoundationsLoadingSkeleton } from '@/features/foundations/components/FoundationsLoadingSkeleton';
import { NearbyFoundationsMap } from '@/features/foundations/components/NearbyFoundationsMap';
import { foundationsService } from '@/features/foundations/services/foundations.service';
import type { NearbyFoundation } from '@/features/foundations/types/foundations.types';
import { parseApiError } from '@/utils/api-error';
import { cn } from '@/utils/cn';

const DEFAULT_RADIUS_KM = 5;

/**
 * Entrada: Ninguna (usuario autenticado o visitante en dashboard).
 * Proceso: Geolocaliza o usa coordenadas manuales y lista fundaciones en radio.
 * Salida: Retorna el elemento JSX de fundaciones cercanas.
 */
export function NearbyFoundationsPage() {
  const [radiusKm, setRadiusKm] = useState(DEFAULT_RADIUS_KM);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');
  const [items, setItems] = useState<NearbyFoundation[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [geoHint, setGeoHint] = useState('');

  /**
   * Entrada: lat y lng: coordenadas de busqueda.
   * Proceso: Solicita GET /foundations/nearby con radio configurado.
   * Salida: No retorna valor.
   */
  const searchNearby = useCallback(
    async (lat: number, lng: number) => {
      setIsLoading(true);
      setError('');
      setLatitude(lat);
      setLongitude(lng);
      try {
        const result = await foundationsService.fetchNearbyFoundations({
          latitude: lat,
          longitude: lng,
          radiusKm,
        });
        setItems(result);
      } catch (loadError) {
        setItems([]);
        setError(parseApiError(loadError).message || UI_MESSAGES.FOUNDATIONS_NEARBY_LOAD_ERROR);
      } finally {
        setIsLoading(false);
      }
    },
    [radiusKm],
  );

  /**
   * Entrada: Ninguna.
   * Proceso: Pide permiso de geolocalizacion del navegador.
   * Salida: No retorna valor.
   */
  function handleUseLocation() {
    setGeoHint('');
    if (!navigator.geolocation) {
      setGeoHint(UI_MESSAGES.FOUNDATIONS_NEARBY_GEO_DENIED);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        void searchNearby(position.coords.latitude, position.coords.longitude);
      },
      () => {
        setGeoHint(UI_MESSAGES.FOUNDATIONS_NEARBY_GEO_DENIED);
      },
      { enableHighAccuracy: true, timeout: 12_000 },
    );
  }

  /**
   * Entrada: Ninguna.
   * Proceso: Parsea lat/lng manuales y ejecuta busqueda.
   * Salida: No retorna valor.
   */
  function handleManualSearch() {
    const lat = Number.parseFloat(manualLat);
    const lng = Number.parseFloat(manualLng);
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      setError(UI_MESSAGES.FOUNDATIONS_NEARBY_LOAD_ERROR);
      return;
    }
    void searchNearby(lat, lng);
  }

  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'es'));
  }, [items]);

  const filteredItems = useMemo(() => {
    if (!selectedCategory) return items;
    return items.filter((item) => item.category === selectedCategory);
  }, [items, selectedCategory]);

  const hasCoords = latitude != null && longitude != null;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header>
        <h1 className="text-display text-text-primary">{UI_MESSAGES.FOUNDATIONS_NEARBY_TITLE}</h1>
        <p className="mt-2 text-body text-text-secondary">{UI_MESSAGES.FOUNDATIONS_NEARBY_DESCRIPTION}</p>
      </header>

      <Card glass={false} className="border border-border-default bg-white p-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-[12rem] flex-1">
            <label htmlFor="radius-km" className="mb-1 block text-sm font-medium text-text-primary">
              {UI_MESSAGES.FOUNDATIONS_NEARBY_RADIUS}
            </label>
            <input
              id="radius-km"
              type="range"
              min={1}
              max={10}
              step={1}
              value={radiusKm}
              onChange={(event) => setRadiusKm(Number(event.target.value))}
              className="w-full"
            />
            <p className="text-xs text-text-muted">{radiusKm} km</p>
          </div>
          <Button type="button" onClick={handleUseLocation}>
            {UI_MESSAGES.FOUNDATIONS_NEARBY_USE_LOCATION}
          </Button>
        </div>

        {geoHint && (
          <p className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800" role="alert">
            {geoHint}
          </p>
        )}

        <div className="mt-6 border-t border-border-default pt-6">
          <p className="text-sm font-medium text-text-primary">
            {UI_MESSAGES.FOUNDATIONS_NEARBY_MANUAL_COORDS}
          </p>
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            <Input
              label={UI_MESSAGES.FOUNDATIONS_NEARBY_LATITUDE}
              value={manualLat}
              onChange={(event) => setManualLat(event.target.value)}
              inputMode="decimal"
            />
            <Input
              label={UI_MESSAGES.FOUNDATIONS_NEARBY_LONGITUDE}
              value={manualLng}
              onChange={(event) => setManualLng(event.target.value)}
              inputMode="decimal"
            />
            <div className="flex items-end">
              <Button type="button" variant="secondary" className="w-full" onClick={handleManualSearch}>
                {UI_MESSAGES.FOUNDATIONS_NEARBY_SEARCH}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      {isLoading && <FoundationsLoadingSkeleton variant="cards" />}

      {!isLoading && hasCoords && (
        <div className="grid gap-6 lg:grid-cols-2">
          <NearbyFoundationsMap
            userLatitude={latitude}
            userLongitude={longitude}
            foundations={filteredItems}
            height="22rem"
          />

          <div className="space-y-4">
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className={cn(
                    'rounded-full border px-3 py-1 text-xs font-medium',
                    selectedCategory === null
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-border-default text-text-secondary',
                  )}
                >
                  {UI_MESSAGES.FOUNDATIONS_NEARBY_ALL_CATEGORIES}
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      'rounded-full border px-3 py-1 text-xs font-medium',
                      selectedCategory === category
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-border-default text-text-secondary',
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}

            {filteredItems.length === 0 ? (
              <EmptyState title={UI_MESSAGES.FOUNDATIONS_NEARBY_EMPTY} />
            ) : (
              <ul className="space-y-3">
                {filteredItems.map((item) => (
                  <li key={item.id}>
                    <Link
                      to={`/foundations/${item.id}`}
                      className="flex items-center gap-4 rounded-xl border border-border-default bg-white p-4 transition-colors hover:border-primary-300"
                    >
                      {item.logoUrl ? (
                        <AppImage
                          src={item.logoUrl}
                          alt=""
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-vivid-100 text-sm font-semibold text-vivid-700">
                          {item.name.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-text-primary">{item.name}</p>
                        <p className="text-sm text-text-secondary">
                          {[item.category, item.city].filter(Boolean).join(' · ')}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-primary-600">
                        {UI_MESSAGES.FOUNDATIONS_NEARBY_DISTANCE(item.distanceKm)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
