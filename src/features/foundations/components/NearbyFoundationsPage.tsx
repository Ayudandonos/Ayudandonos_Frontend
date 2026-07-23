import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppImage } from '@/components/ui/AppImage';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { FoundationsLoadingSkeleton } from '@/features/foundations/components/FoundationsLoadingSkeleton';
import { NearbyFoundationsMap } from '@/features/foundations/components/NearbyFoundationsMap';
import { useNearbyFoundations } from '@/features/foundations/hooks/useNearbyFoundations';
import { useNearbyGeolocation } from '@/features/foundations/hooks/useNearbyGeolocation';
import { parseApiError } from '@/utils/api-error';
import { geocodeLocation } from '@/utils/geocode';
import { cn } from '@/utils/cn';

const DEFAULT_RADIUS_KM = 5;

/**
 * Entrada: Ninguna (usuario autenticado en dashboard).
 * Proceso: Geolocaliza o busca por ciudad/direccion; lista y mapa sincronizados.
 * Salida: Retorna el elemento JSX de fundaciones cercanas.
 */
export function NearbyFoundationsPage() {
  const [radiusKm, setRadiusKm] = useState(DEFAULT_RADIUS_KM);
  const [placeQuery, setPlaceQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [manualError, setManualError] = useState('');
  const [isGeocodingPlace, setIsGeocodingPlace] = useState(false);

  const { origin, geoHint, isLocating, setOrigin, requestBrowserLocation } = useNearbyGeolocation();

  const queryParams = origin
    ? { latitude: origin.latitude, longitude: origin.longitude, radiusKm }
    : null;

  const { data, isLoading, isFetching, error, isError } = useNearbyFoundations(queryParams);

  const items = useMemo(() => data?.items ?? [], [data?.items]);
  const categoriesFromApi = useMemo(() => data?.categories ?? [], [data?.categories]);
  const total = data?.total ?? items.length;
  const mapRadiusKm = data?.radiusKm ?? radiusKm;

  const categories = useMemo(() => {
    if (categoriesFromApi.length > 0) {
      return categoriesFromApi
        .map((entry) => entry.category)
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b, 'es'));
    }
    const set = new Set<string>();
    items.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'es'));
  }, [categoriesFromApi, items]);

  const filteredItems = useMemo(() => {
    if (!selectedCategory) return items;
    return items.filter((item) => item.category === selectedCategory);
  }, [items, selectedCategory]);

  useEffect(() => {
    setSelectedCategory(null);
    setSelectedId(null);
  }, [origin?.latitude, origin?.longitude, radiusKm]);

  useEffect(() => {
    if (selectedId && !filteredItems.some((item) => item.id === selectedId)) {
      setSelectedId(null);
    }
  }, [filteredItems, selectedId]);

  /**
   * Entrada: Ninguna.
   * Proceso: Geocodifica ciudad/direccion escrita y fija el origen de busqueda.
   * Salida: No retorna valor.
   */
  async function handlePlaceSearch() {
    const trimmed = placeQuery.trim();
    if (!trimmed) {
      setManualError(UI_MESSAGES.FOUNDATIONS_NEARBY_COORDS_INVALID);
      return;
    }

    setManualError('');
    setIsGeocodingPlace(true);
    try {
      const result = await geocodeLocation({
        address: trimmed,
        country: 'Colombia',
      });
      if (!result) {
        setManualError(UI_MESSAGES.MAP_GEOCODE_NOT_FOUND);
        return;
      }
      setOrigin({ latitude: result.latitude, longitude: result.longitude });
    } catch {
      setManualError(UI_MESSAGES.MAP_GEOCODE_ERROR);
    } finally {
      setIsGeocodingPlace(false);
    }
  }

  const loadError = isError
    ? parseApiError(error).message || UI_MESSAGES.FOUNDATIONS_NEARBY_LOAD_ERROR
    : '';
  const showLoading =
    Boolean(origin) &&
    (isLoading || isLocating || isGeocodingPlace || (isFetching && !data));
  const hasCoords = origin != null;

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
          <Button type="button" onClick={requestBrowserLocation} disabled={isLocating}>
            {isLocating ? UI_MESSAGES.LOADING : UI_MESSAGES.FOUNDATIONS_NEARBY_USE_LOCATION}
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
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1">
              <Input
                label={UI_MESSAGES.FOUNDATIONS_FORM_CITY}
                value={placeQuery}
                onChange={(event) => setPlaceQuery(event.target.value)}
                placeholder={UI_MESSAGES.FOUNDATIONS_NEARBY_PLACE_PLACEHOLDER}
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              isLoading={isGeocodingPlace}
              onClick={() => void handlePlaceSearch()}
            >
              {UI_MESSAGES.FOUNDATIONS_NEARBY_SEARCH}
            </Button>
          </div>
        </div>
      </Card>

      {(manualError || loadError) && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {manualError || loadError}
        </p>
      )}

      {showLoading && <FoundationsLoadingSkeleton variant="cards" />}

      {!showLoading && hasCoords && (
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            {UI_MESSAGES.FOUNDATIONS_NEARBY_RESULTS(total, mapRadiusKm)}
          </p>

          <div className="grid gap-6 lg:grid-cols-2">
            <NearbyFoundationsMap
              userLatitude={origin.latitude}
              userLongitude={origin.longitude}
              radiusKm={mapRadiusKm}
              foundations={filteredItems}
              selectedId={selectedId}
              onSelect={setSelectedId}
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
                      <button
                        type="button"
                        onClick={() => setSelectedId(item.id)}
                        className={cn(
                          'flex w-full items-center gap-4 rounded-xl border bg-white p-4 text-left transition-colors',
                          selectedId === item.id
                            ? 'border-primary-500 ring-2 ring-primary-100'
                            : 'border-border-default hover:border-primary-300',
                        )}
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
                            {[item.acronym, item.category, item.city].filter(Boolean).join(' · ')}
                          </p>
                          <Link
                            to={`/foundations/${item.id}`}
                            className="mt-1 inline-block text-xs font-medium text-primary-700 underline"
                            onClick={(event) => event.stopPropagation()}
                          >
                            {UI_MESSAGES.FOUNDATIONS_NEARBY_VIEW_PROFILE}
                          </Link>
                        </div>
                        <span className="text-sm font-medium text-primary-600">
                          {UI_MESSAGES.FOUNDATIONS_NEARBY_DISTANCE(item.distanceKm)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
