import { DeliveryMap } from '@/components/ui/DeliveryMap';

interface LocationMapProps {
  latitude?: number | null;
  longitude?: number | null;
  editable?: boolean;
  onChange?: (coords: { latitude: number; longitude: number }) => void;
  className?: string;
}

/**
 * Entrada: latitude/longitude, editable y onChange con objeto coords.
 * Proceso: Adapta DeliveryMap (Google Maps) a la API LocationMap.
 * Salida: Retorna el elemento JSX del mapa.
 */
export function LocationMap({
  latitude,
  longitude,
  editable = false,
  onChange,
  className,
}: LocationMapProps) {
  return (
    <DeliveryMap
      latitude={latitude}
      longitude={longitude}
      editable={editable}
      className={className}
      height="16rem"
      onChange={(lat, lng) => onChange?.({ latitude: lat, longitude: lng })}
    />
  );
}
