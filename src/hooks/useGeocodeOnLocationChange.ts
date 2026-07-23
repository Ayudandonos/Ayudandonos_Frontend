import { useEffect, useRef, useState } from 'react';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { geocodeLocation, type GeocodeQuery } from '@/utils/geocode';

interface UseGeocodeOnLocationChangeOptions {
  query: GeocodeQuery;
  enabled?: boolean;
  debounceMs?: number;
  onCoords: (latitude: number, longitude: number) => void;
}

interface UseGeocodeOnLocationChangeResult {
  isGeocoding: boolean;
  geocodeError: string;
}

/**
 * Entrada: query de ubicacion, callback onCoords y debounce opcional.
 * Proceso: Cuando ciudad (o direccion) cambia, geocodifica y actualiza coordenadas.
 * Salida: Retorna estado de carga y error de geocodificacion.
 */
export function useGeocodeOnLocationChange({
  query,
  enabled = true,
  debounceMs = 700,
  onCoords,
}: UseGeocodeOnLocationChangeOptions): UseGeocodeOnLocationChangeResult {
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState('');
  const onCoordsRef = useRef(onCoords);
  onCoordsRef.current = onCoords;

  const searchKey = [query.address, query.city, query.department, query.country]
    .map((part) => part?.trim() ?? '')
    .join('|');
  const isFirstRunRef = useRef(true);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    // Evita sobrescribir coordenadas guardadas al montar el formulario.
    if (isFirstRunRef.current) {
      isFirstRunRef.current = false;
      return;
    }

    // Requiere ciudad/departamento, o direccion con pais (flujos sin cascada).
    const hasCity = Boolean(query.city?.trim());
    const hasDepartment = Boolean(query.department?.trim());
    const hasAddress = Boolean(query.address?.trim());
    const hasCountry = Boolean(query.country?.trim());
    if (!hasCity && !hasDepartment && !(hasAddress && hasCountry)) {
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(() => {
      /**
       * Entrada: Ninguna (usa query del efecto).
       * Proceso: Llama al geocoder y propaga lat/lng al formulario.
       * Salida: No retorna valor.
       */
      async function runGeocode() {
        setIsGeocoding(true);
        setGeocodeError('');
        try {
          const result = await geocodeLocation(query);
          if (cancelled) {
            return;
          }
          if (!result) {
            setGeocodeError(UI_MESSAGES.MAP_GEOCODE_NOT_FOUND);
            return;
          }
          onCoordsRef.current(result.latitude, result.longitude);
        } catch {
          if (!cancelled) {
            setGeocodeError(UI_MESSAGES.MAP_GEOCODE_ERROR);
          }
        } finally {
          if (!cancelled) {
            setIsGeocoding(false);
          }
        }
      }

      void runGeocode();
    }, debounceMs);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
    // query se serializa en searchKey; se evita dependencia por identidad de objeto.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- searchKey captura los campos relevantes
  }, [enabled, debounceMs, searchKey]);

  return { isGeocoding, geocodeError };
}
