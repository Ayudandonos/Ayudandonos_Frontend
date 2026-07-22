import { CountrySelect } from '@/features/location/components/CountrySelect';
import { StateSelect } from '@/features/location/components/StateSelect';
import { CitySelect } from '@/features/location/components/CitySelect';
import type { City, Country, State } from '@/features/location/types/location.types';
import { cn } from '@/utils/cn';

interface LocationCascadingFiltersProps {
  country: Country | null;
  state: State | null;
  city: City | null;
  onCountryChange: (country: Country | null) => void;
  onStateChange: (state: State | null) => void;
  onCityChange: (city: City | null) => void;
  className?: string;
  countryClassName?: string;
  stateClassName?: string;
  cityClassName?: string;
}

/**
 * Entrada: seleccion country/state/city y callbacks; classNames opcionales.
 * Proceso: Renderiza selects en cascada compactos (sin labels) para filtros.
 * Salida: Retorna el bloque JSX de filtros de ubicacion.
 */
export function LocationCascadingFilters({
  country,
  state,
  city,
  onCountryChange,
  onStateChange,
  onCityChange,
  className,
  countryClassName,
  stateClassName,
  cityClassName,
}: LocationCascadingFiltersProps) {
  /**
   * Entrada: nextCountry: pais seleccionado o null.
   * Proceso: Notifica cambio de pais; el padre limpia estado/ciudad.
   * Salida: No retorna valor.
   */
  const handleCountryChange = (nextCountry: Country | null) => {
    onCountryChange(nextCountry);
  };

  /**
   * Entrada: nextState: departamento seleccionado o null.
   * Proceso: Notifica cambio de departamento; el padre limpia ciudad.
   * Salida: No retorna valor.
   */
  const handleStateChange = (nextState: State | null) => {
    onStateChange(nextState);
  };

  return (
    <div className={cn('contents', className)}>
      <div className={countryClassName}>
        <CountrySelect
          value={country}
          onChange={handleCountryChange}
          requiredMark={false}
          hideLabel
        />
      </div>
      <div className={stateClassName}>
        <StateSelect
          countryIso={country?.iso2 ?? null}
          value={state}
          onChange={handleStateChange}
          requiredMark={false}
          hideLabel
        />
      </div>
      <div className={cityClassName}>
        <CitySelect
          countryIso={country?.iso2 ?? null}
          stateIso={state?.iso2 ?? null}
          value={city}
          onChange={onCityChange}
          requiredMark={false}
          hideLabel
        />
      </div>
    </div>
  );
}
