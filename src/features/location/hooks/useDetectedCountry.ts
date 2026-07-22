import { useEffect, useState } from 'react';
import { useCountries } from '@/features/location/hooks/useCountries';
import type { Country } from '@/features/location/types/location.types';
import { resolveViewerCountryIso2 } from '@/features/location/utils/detect-country';

/**
 * Entrada: Ninguna.
 * Proceso: Detecta el pais del visitante (IP/locale) y lo resuelve contra el catalogo CSC.
 * Salida: Retorna country detectado, loading y posible error de carga.
 */
export function useDetectedCountry() {
  const countriesQuery = useCountries();
  const [country, setCountry] = useState<Country | null>(null);
  const [isDetecting, setIsDetecting] = useState(true);

  useEffect(() => {
    let cancelled = false;

    /**
     * Entrada: Ninguna.
     * Proceso: Resuelve ISO2 del visitante y busca el pais en el listado CSC.
     * Salida: No retorna valor; actualiza country/isDetecting.
     */
    async function detect() {
      if (!countriesQuery.data?.length) {
        return;
      }

      setIsDetecting(true);
      try {
        const iso2 = await resolveViewerCountryIso2();
        if (cancelled) {
          return;
        }
        const match =
          countriesQuery.data.find((item) => item.iso2.toUpperCase() === iso2.toUpperCase()) ??
          countriesQuery.data.find((item) => item.iso2.toUpperCase() === 'CO') ??
          null;
        setCountry(match);
      } finally {
        if (!cancelled) {
          setIsDetecting(false);
        }
      }
    }

    void detect();

    return () => {
      cancelled = true;
    };
  }, [countriesQuery.data]);

  return {
    country,
    isDetecting: isDetecting || countriesQuery.isLoading,
    isError: countriesQuery.isError,
  };
}
