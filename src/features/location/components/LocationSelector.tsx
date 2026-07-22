import { memo, useCallback, useEffect, useRef } from 'react';
import { CountrySelect } from '@/features/location/components/CountrySelect';
import { StateSelect } from '@/features/location/components/StateSelect';
import { CitySelect } from '@/features/location/components/CitySelect';
import { useCountries } from '@/features/location/hooks/useCountries';
import { useDetectedCountry } from '@/features/location/hooks/useDetectedCountry';
import { useStates } from '@/features/location/hooks/useStates';
import { useCities } from '@/features/location/hooks/useCities';
import type {
  City,
  Country,
  LocationValue,
  State,
} from '@/features/location/types/location.types';

interface LocationSelectorProps {
  value: LocationValue;
  onChange: (value: LocationValue) => void;
  className?: string;
  fieldErrors?: {
    country?: string;
    department?: string;
    city?: string;
  };
  /** Prefija el pais del visitante cuando aun no hay pais seleccionado. */
  autoDetectCountry?: boolean;
}

/**
 * Entrada: value: ubicacion actual; onChange; fieldErrors/autoDetectCountry opcionales.
 * Proceso: Coordina selects en cascada, hidrata ISO y opcionalmente detecta pais inicial.
 * Salida: Retorna el bloque reutilizable de seleccion de ubicacion.
 */
function LocationSelectorComponent({
  value,
  onChange,
  className,
  fieldErrors,
  autoDetectCountry = false,
}: LocationSelectorProps) {
  const countriesQuery = useCountries();
  const statesQuery = useStates(value.country?.iso2);
  const citiesQuery = useCities(value.country?.iso2, value.state?.iso2);
  const detected = useDetectedCountry();
  const hydratedRef = useRef(false);
  const autoDetectedRef = useRef(false);

  useEffect(() => {
    if (!autoDetectCountry || autoDetectedRef.current) {
      return;
    }
    if (value.country?.name || value.country?.iso2) {
      autoDetectedRef.current = true;
      return;
    }
    if (detected.isDetecting || !detected.country) {
      return;
    }

    autoDetectedRef.current = true;
    hydratedRef.current = true;
    onChange({ country: detected.country, state: null, city: null });
  }, [
    autoDetectCountry,
    detected.country,
    detected.isDetecting,
    onChange,
    value.country?.iso2,
    value.country?.name,
  ]);

  useEffect(() => {
    if (hydratedRef.current) return;

    const needsCountryHydration =
      Boolean(value.country?.name) && !value.country?.iso2 && countriesQuery.data;
    const needsStateHydration =
      Boolean(value.state?.name) && !value.state?.iso2 && statesQuery.data && value.country?.iso2;
    const needsCityHydration =
      Boolean(value.city?.name) &&
      !value.city?.stateIso2 &&
      citiesQuery.data &&
      value.state?.iso2;

    if (!needsCountryHydration && !needsStateHydration && !needsCityHydration) {
      if (value.country?.iso2 || (!value.country?.name && !value.state?.name && !value.city?.name)) {
        hydratedRef.current = true;
      }
      return;
    }

    let next: LocationValue = value;
    let changed = false;

    if (needsCountryHydration && countriesQuery.data) {
      const match = countriesQuery.data.find(
        (item) => item.name.toLocaleLowerCase('es') === value.country!.name.toLocaleLowerCase('es'),
      );
      if (match) {
        next = { ...next, country: match };
        changed = true;
      }
    }

    if (needsStateHydration && statesQuery.data && next.country?.iso2) {
      const match = statesQuery.data.find(
        (item) => item.name.toLocaleLowerCase('es') === value.state!.name.toLocaleLowerCase('es'),
      );
      if (match) {
        next = { ...next, state: match };
        changed = true;
      }
    }

    if (needsCityHydration && citiesQuery.data && next.state?.iso2 && next.country?.iso2) {
      const match = citiesQuery.data.find(
        (item) => item.name.toLocaleLowerCase('es') === value.city!.name.toLocaleLowerCase('es'),
      );
      if (match) {
        next = { ...next, city: match };
        changed = true;
      }
    }

    if (changed) {
      onChange(next);
    }

    if (
      next.country?.iso2 &&
      (!value.state?.name || next.state?.iso2) &&
      (!value.city?.name || next.city?.name)
    ) {
      hydratedRef.current = true;
    }
  }, [
    citiesQuery.data,
    countriesQuery.data,
    onChange,
    statesQuery.data,
    value,
  ]);

  /**
   * Entrada: country: pais seleccionado o null.
   * Proceso: Actualiza pais y limpia estado/ciudad dependientes.
   * Salida: No retorna valor.
   */
  const handleCountryChange = useCallback(
    (country: Country | null) => {
      hydratedRef.current = true;
      autoDetectedRef.current = true;
      onChange({ country, state: null, city: null });
    },
    [onChange],
  );

  /**
   * Entrada: state: estado seleccionado o null.
   * Proceso: Actualiza estado y limpia ciudad dependiente.
   * Salida: No retorna valor.
   */
  const handleStateChange = useCallback(
    (state: State | null) => {
      hydratedRef.current = true;
      onChange({ ...value, state, city: null });
    },
    [onChange, value],
  );

  /**
   * Entrada: city: ciudad seleccionada o null.
   * Proceso: Actualiza la ciudad en el valor de ubicacion.
   * Salida: No retorna valor.
   */
  const handleCityChange = useCallback(
    (city: City | null) => {
      hydratedRef.current = true;
      onChange({ ...value, city });
    },
    [onChange, value],
  );

  return (
    <div className={className ?? 'grid gap-4 md:grid-cols-2'}>
      <CountrySelect
        value={value.country}
        onChange={handleCountryChange}
        fieldError={fieldErrors?.country}
      />
      <StateSelect
        countryIso={value.country?.iso2 ?? null}
        value={value.state}
        onChange={handleStateChange}
        fieldError={fieldErrors?.department}
      />
      <CitySelect
        countryIso={value.country?.iso2 ?? null}
        stateIso={value.state?.iso2 ?? null}
        value={value.city}
        onChange={handleCityChange}
        fieldError={fieldErrors?.city}
      />
    </div>
  );
}

export const LocationSelector = memo(LocationSelectorComponent);
