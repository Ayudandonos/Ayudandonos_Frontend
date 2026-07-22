import { useMemo } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { UI_MESSAGES } from '@/constants/messages.constants';
import type { NearbyFoundation } from '@/features/foundations/types/foundations.types';
import { cn } from '@/utils/cn';

const GOOGLE_MAPS_API_KEY = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '').trim();
const GOOGLE_MAPS_LIBRARIES: 'places'[] = ['places'];

interface NearbyFoundationsMapProps {
  userLatitude: number;
  userLongitude: number;
  foundations: NearbyFoundation[];
  className?: string;
  height?: string;
}

/**
 * Entrada: props del mapa nearby.
 * Proceso: Muestra mensaje cuando no hay API key o falla la carga.
 * Salida: Retorna el elemento JSX del fallback.
 */
function NearbyMapFallback({
  className,
  height,
}: Pick<NearbyFoundationsMapProps, 'className' | 'height'>) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-xl border border-dashed border-border-default bg-vivid-50 px-4 text-center text-sm text-text-secondary',
        className,
      )}
      style={{ height }}
    >
      {UI_MESSAGES.MAP_UNAVAILABLE}
    </div>
  );
}

/**
 * Entrada: coordenadas y fundaciones (solo se monta si hay API key).
 * Proceso: Carga Google Maps JS y dibuja marcadores.
 * Salida: Retorna el mapa interactivo o estados de carga/error.
 */
function NearbyFoundationsMapLoaded({
  userLatitude,
  userLongitude,
  foundations,
  className,
  height = '20rem',
}: NearbyFoundationsMapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'ayudandonos-google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  const center = useMemo(
    () => ({ lat: userLatitude, lng: userLongitude }),
    [userLatitude, userLongitude],
  );

  const markers = foundations.filter(
    (item) => item.latitude != null && item.longitude != null,
  ) as Array<NearbyFoundation & { latitude: number; longitude: number }>;

  if (loadError) {
    return <NearbyMapFallback className={className} height={height} />;
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
        zoom={12}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        <Marker position={center} title={UI_MESSAGES.FOUNDATIONS_NEARBY_USE_LOCATION} />
        {markers.map((item) => (
          <Marker
            key={item.id}
            position={{ lat: item.latitude, lng: item.longitude }}
            title={item.name}
          />
        ))}
      </GoogleMap>
    </div>
  );
}

/**
 * Entrada: coordenadas del usuario y fundaciones cercanas con lat/lng opcionales.
 * Proceso: Sin key no carga el script de Google (evita NoApiKeys); con key muestra el mapa.
 * Salida: Retorna el elemento JSX del mapa o fallback.
 */
export function NearbyFoundationsMap(props: NearbyFoundationsMapProps) {
  if (!GOOGLE_MAPS_API_KEY) {
    return <NearbyMapFallback className={props.className} height={props.height ?? '20rem'} />;
  }

  return <NearbyFoundationsMapLoaded {...props} />;
}
