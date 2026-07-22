import { useCallback, useMemo } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { cn } from '@/utils/cn';

const DEFAULT_CENTER = { lat: 4.711, lng: -74.0721 };
const GOOGLE_MAPS_API_KEY = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '').trim();
const GOOGLE_MAPS_LIBRARIES: 'places'[] = ['places'];

interface DeliveryMapProps {
  latitude?: number | null;
  longitude?: number | null;
  address?: string | null;
  editable?: boolean;
  onChange?: (latitude: number, longitude: number) => void;
  height?: string;
  className?: string;
}

/**
 * Entrada: latitude, longitude, address: coordenadas y direccion de referencia.
 * Proceso: Renderiza alternativa textual cuando no hay API key o falla la carga.
 * Salida: Retorna el elemento JSX del fallback del mapa.
 */
function MapFallback({
  latitude,
  longitude,
  address,
  height,
  className,
}: Pick<DeliveryMapProps, 'latitude' | 'longitude' | 'address' | 'height' | 'className'>) {
  const hasCoords = latitude != null && longitude != null;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border-default bg-vivid-50 px-4 py-6 text-center',
        className,
      )}
      style={{ height: height ?? '16rem' }}
    >
      <p className="text-sm font-medium text-text-secondary">{UI_MESSAGES.MAP_UNAVAILABLE}</p>
      {address && <p className="text-sm text-text-primary">{address}</p>}
      {hasCoords && (
        <p className="text-xs text-text-muted">
          {UI_MESSAGES.MAP_COORDS(latitude as number, longitude as number)}
        </p>
      )}
    </div>
  );
}

/**
 * Entrada: props de DeliveryMap (solo se monta si hay API key).
 * Proceso: Carga el script de Google Maps y renderiza el mapa interactivo.
 * Salida: Retorna el mapa, loading o fallback ante error de carga.
 */
function DeliveryMapLoaded(props: DeliveryMapProps) {
  const {
    latitude,
    longitude,
    address,
    editable = false,
    onChange,
    height = '16rem',
    className,
  } = props;

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'ayudandonos-google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  const hasCoords = latitude != null && longitude != null;
  const center = useMemo(
    () => (hasCoords ? { lat: latitude as number, lng: longitude as number } : DEFAULT_CENTER),
    [hasCoords, latitude, longitude],
  );

  const handleMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (!editable || !onChange || !event.latLng) {
        return;
      }
      onChange(event.latLng.lat(), event.latLng.lng());
    },
    [editable, onChange],
  );

  const handleMarkerDragEnd = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (!editable || !onChange || !event.latLng) {
        return;
      }
      onChange(event.latLng.lat(), event.latLng.lng());
    },
    [editable, onChange],
  );

  if (loadError) {
    return (
      <MapFallback
        latitude={latitude}
        longitude={longitude}
        address={address}
        height={height}
        className={className}
      />
    );
  }

  if (!isLoaded) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-xl border border-border-default bg-vivid-50 text-sm text-text-muted',
          className,
        )}
        style={{ height }}
      >
        {UI_MESSAGES.LOADING}
      </div>
    );
  }

  return (
    <div
      className={cn('overflow-hidden rounded-xl border border-border-default', className)}
      style={{ height }}
    >
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={center}
        zoom={hasCoords ? 15 : 11}
        onClick={handleMapClick}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {hasCoords && (
          <Marker position={center} draggable={editable} onDragEnd={handleMarkerDragEnd} />
        )}
      </GoogleMap>
    </div>
  );
}

/**
 * Entrada: latitude/longitude/address: ubicacion; editable y onChange opcionales.
 * Proceso: Sin API key muestra fallback (no carga el script de Google); con key monta el mapa.
 * Salida: Retorna el elemento JSX del mapa o alternativa textual.
 */
export function DeliveryMap(props: DeliveryMapProps) {
  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <MapFallback
        latitude={props.latitude}
        longitude={props.longitude}
        address={props.address}
        height={props.height}
        className={props.className}
      />
    );
  }

  return <DeliveryMapLoaded {...props} />;
}
