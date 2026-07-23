import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import { UI_MESSAGES } from '@/constants/messages.constants';
import type { NearbyFoundation } from '@/features/foundations/types/foundations.types';
import { createUserLocationIcon, setupLeafletDefaultIcons } from '@/utils/leaflet-icons';
import { cn } from '@/utils/cn';

setupLeafletDefaultIcons();

const OSM_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

interface NearbyFoundationsMapProps {
  userLatitude: number;
  userLongitude: number;
  radiusKm: number;
  foundations: NearbyFoundation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  className?: string;
  height?: string;
}

/**
 * Entrada: positions: coordenadas a encuadrar; selectedId opcional para enfocar.
 * Proceso: Ajusta bounds al radio/items o vuela al marcador seleccionado.
 * Salida: null.
 */
function MapBoundsController({
  userLatitude,
  userLongitude,
  radiusKm,
  foundations,
  selectedId,
}: {
  userLatitude: number;
  userLongitude: number;
  radiusKm: number;
  foundations: NearbyFoundation[];
  selectedId: string | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedId) {
      const selected = foundations.find((item) => item.id === selectedId);
      if (selected) {
        map.flyTo([selected.latitude, selected.longitude], 15, { duration: 0.4 });
        return;
      }
    }

    const points: L.LatLngExpression[] = [
      [userLatitude, userLongitude],
      ...foundations.map((item) => [item.latitude, item.longitude] as [number, number]),
    ];

    if (points.length === 1) {
      const paddingDegrees = radiusKm / 111;
      map.fitBounds(
        [
          [userLatitude - paddingDegrees, userLongitude - paddingDegrees],
          [userLatitude + paddingDegrees, userLongitude + paddingDegrees],
        ],
        { padding: [28, 28], maxZoom: 14 },
      );
      return;
    }

    map.fitBounds(L.latLngBounds(points), { padding: [36, 36], maxZoom: 14 });
  }, [map, userLatitude, userLongitude, radiusKm, foundations, selectedId]);

  return null;
}

/**
 * Entrada: coordenadas del usuario, radio, fundaciones y seleccion activa.
 * Proceso: Mapa Leaflet con tiles OSM, circulo de radio, marcadores y popups.
 * Salida: Retorna el elemento JSX del mapa.
 */
export function NearbyFoundationsMap({
  userLatitude,
  userLongitude,
  radiusKm,
  foundations,
  selectedId,
  onSelect,
  className,
  height = '22rem',
}: NearbyFoundationsMapProps) {
  const userIcon = useMemo(() => createUserLocationIcon(), []);
  const center: [number, number] = [userLatitude, userLongitude];

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
        zoom={12}
        style={{ width: '100%', height: '100%' }}
        scrollWheelZoom
      >
        <TileLayer attribution={OSM_ATTRIBUTION} url={OSM_URL} />
        <MapBoundsController
          userLatitude={userLatitude}
          userLongitude={userLongitude}
          radiusKm={radiusKm}
          foundations={foundations}
          selectedId={selectedId}
        />
        <Circle
          center={center}
          radius={radiusKm * 1000}
          pathOptions={{
            color: '#6646ff',
            weight: 1,
            fillColor: '#6646ff',
            fillOpacity: 0.08,
          }}
        />
        <Marker
          position={center}
          icon={userIcon}
          title={UI_MESSAGES.FOUNDATIONS_NEARBY_YOUR_LOCATION}
        >
          <Popup>{UI_MESSAGES.FOUNDATIONS_NEARBY_YOUR_LOCATION}</Popup>
        </Marker>
        {foundations.map((item) => (
          <Marker
            key={item.id}
            position={[item.latitude, item.longitude]}
            opacity={selectedId && selectedId !== item.id ? 0.65 : 1}
            eventHandlers={{
              click: () => onSelect(item.id),
            }}
          >
            <Popup>
              <div className="space-y-1 text-sm">
                <p className="font-semibold text-text-primary">{item.name}</p>
                {item.acronym && <p className="text-text-muted">{item.acronym}</p>}
                <p className="text-text-secondary">
                  {[item.category, item.city].filter(Boolean).join(' · ')}
                </p>
                <p className="font-medium text-primary-600">
                  {UI_MESSAGES.FOUNDATIONS_NEARBY_DISTANCE(item.distanceKm)}
                </p>
                <Link
                  to={`/foundations/${item.id}`}
                  className="inline-block text-primary-700 underline"
                >
                  {UI_MESSAGES.FOUNDATIONS_NEARBY_VIEW_PROFILE}
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
