import { useEffect } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import type { LeafletMouseEvent } from 'leaflet';
import { setupLeafletDefaultIcons } from '@/utils/leaflet-icons';
import { cn } from '@/utils/cn';

setupLeafletDefaultIcons();

const DEFAULT_CENTER: [number, number] = [4.711, -74.0721];
const OSM_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

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
 * Entrada: center y zoom deseados.
 * Proceso: Sincroniza la vista del mapa cuando cambian las coordenadas externas.
 * Salida: null (efecto secundario sobre el mapa Leaflet).
 */
function MapViewSync({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);

  return null;
}

/**
 * Entrada: editable y onChange opcionales.
 * Proceso: Escucha clics en el mapa para actualizar coordenadas en modo edicion.
 * Salida: null.
 */
function MapClickHandler({
  editable,
  onChange,
}: {
  editable: boolean;
  onChange?: (latitude: number, longitude: number) => void;
}) {
  useMapEvents({
    click(event: LeafletMouseEvent) {
      if (!editable || !onChange) {
        return;
      }
      onChange(event.latlng.lat, event.latlng.lng);
    },
  });

  return null;
}

/**
 * Entrada: latitude/longitude/address: ubicacion; editable y onChange opcionales.
 * Proceso: Renderiza un mapa Leaflet (OSM) con marker fijo o editable (click/drag).
 * Salida: Retorna el elemento JSX del mapa.
 */
export function DeliveryMap({
  latitude,
  longitude,
  editable = false,
  onChange,
  height = '16rem',
  className,
}: DeliveryMapProps) {
  const hasCoords = latitude != null && longitude != null;
  const center: [number, number] = hasCoords
    ? [latitude as number, longitude as number]
    : DEFAULT_CENTER;
  const zoom = hasCoords ? 15 : 11;

  return (
    <div
      className={cn(
        'relative z-0 isolate overflow-hidden rounded-xl border border-border-default',
        className,
      )}
      style={{ height }}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ width: '100%', height: '100%' }}
        scrollWheelZoom
      >
        <TileLayer attribution={OSM_ATTRIBUTION} url={OSM_URL} />
        <MapViewSync center={center} zoom={zoom} />
        <MapClickHandler editable={editable} onChange={onChange} />
        {hasCoords && (
          <Marker
            position={center}
            draggable={editable}
            eventHandlers={{
              dragend: (event) => {
                if (!editable || !onChange) {
                  return;
                }
                const { lat, lng } = event.target.getLatLng();
                onChange(lat, lng);
              },
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
