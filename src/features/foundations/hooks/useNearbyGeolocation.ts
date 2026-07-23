import { useCallback, useState } from 'react';
import { UI_MESSAGES } from '@/constants/messages.constants';
import type { NearbyOrigin } from '@/features/foundations/types/foundations.types';

interface UseNearbyGeolocationResult {
  origin: NearbyOrigin | null;
  geoHint: string;
  isLocating: boolean;
  setOrigin: (origin: NearbyOrigin) => void;
  requestBrowserLocation: () => void;
}

/**
 * Entrada: Ninguna.
 * Proceso: Gestiona origen de busqueda (GPS o coords manuales) y mensajes de permiso.
 * Salida: Retorna origen, hints y handlers de geolocalizacion.
 */
export function useNearbyGeolocation(): UseNearbyGeolocationResult {
  const [origin, setOriginState] = useState<NearbyOrigin | null>(null);
  const [geoHint, setGeoHint] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  /**
   * Entrada: origin: coordenadas de busqueda.
   * Proceso: Guarda el origen y limpia el hint de geolocalizacion.
   * Salida: No retorna valor.
   */
  const setOrigin = useCallback((next: NearbyOrigin) => {
    setOriginState(next);
    setGeoHint('');
  }, []);

  /**
   * Entrada: Ninguna.
   * Proceso: Solicita la ubicacion del navegador y actualiza el origen.
   * Salida: No retorna valor.
   */
  const requestBrowserLocation = useCallback(() => {
    setGeoHint('');
    if (!navigator.geolocation) {
      setGeoHint(UI_MESSAGES.FOUNDATIONS_NEARBY_GEO_DENIED);
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setOriginState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLocating(false);
      },
      () => {
        setGeoHint(UI_MESSAGES.FOUNDATIONS_NEARBY_GEO_DENIED);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 12_000 },
    );
  }, []);

  return {
    origin,
    geoHint,
    isLocating,
    setOrigin,
    requestBrowserLocation,
  };
}
