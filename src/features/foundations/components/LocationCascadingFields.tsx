import { useCallback, useEffect, useState } from 'react';
import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { LocationSelector } from '@/features/location';
import {
  EMPTY_LOCATION_VALUE,
  type LocationValue,
} from '@/features/location';
import type { UpdateFoundationFormData } from '@/features/foundations/validations/foundations.validations';

interface LocationCascadingFieldsProps {
  watch: UseFormWatch<UpdateFoundationFormData>;
  setValue: UseFormSetValue<UpdateFoundationFormData>;
  register: UseFormRegister<UpdateFoundationFormData>;
  errors: FieldErrors<UpdateFoundationFormData>;
}

/**
 * Entrada: country/department/city: nombres persistidos en el formulario.
 * Proceso: Construye un LocationValue parcial (sin ISO) para hidratacion posterior.
 * Salida: Retorna LocationValue inicial.
 */
function buildLocationFromNames(
  countryName: string,
  departmentName: string,
  cityName: string,
): LocationValue {
  return {
    country: countryName
      ? {
          iso2: '',
          name: countryName,
          phonecode: null,
          emoji: null,
          flag: null,
        }
      : null,
    state: departmentName
      ? {
          iso2: '',
          name: departmentName,
          countryIso2: '',
        }
      : null,
    city: cityName
      ? {
          name: cityName,
          stateIso2: '',
          countryIso2: '',
        }
      : null,
  };
}

/**
 * Entrada: watch/setValue/register/errors del formulario de fundacion.
 * Proceso: Mantiene LocationValue local, sincroniza nombres al formulario y renderiza direccion.
 * Salida: Retorna el bloque JSX de ubicacion.
 */
export function LocationCascadingFields({
  watch,
  setValue,
  register,
  errors,
}: LocationCascadingFieldsProps) {
  const countryName = watch('country') ?? '';
  const departmentName = watch('department') ?? '';
  const cityName = watch('city') ?? '';

  const [location, setLocation] = useState<LocationValue>(() =>
    buildLocationFromNames(countryName, departmentName, cityName),
  );

  useEffect(() => {
    const currentCountry = location.country?.name ?? '';
    const currentState = location.state?.name ?? '';
    const currentCity = location.city?.name ?? '';

    if (
      currentCountry === countryName &&
      currentState === departmentName &&
      currentCity === cityName
    ) {
      return;
    }

    if (!location.country?.iso2 && (countryName || departmentName || cityName)) {
      setLocation(buildLocationFromNames(countryName, departmentName, cityName));
    }
  }, [cityName, countryName, departmentName, location]);

  /**
   * Entrada: next: valor de ubicacion emitido por LocationSelector.
   * Proceso: Actualiza estado local y persiste nombres en react-hook-form.
   * Salida: No retorna valor.
   */
  const handleLocationChange = useCallback(
    (next: LocationValue) => {
      setLocation(next.country || next.state || next.city ? next : EMPTY_LOCATION_VALUE);
      setValue('country', next.country?.name ?? '', {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue('department', next.state?.name ?? '', {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue('city', next.city?.name ?? '', {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [setValue],
  );

  return (
    <div className="space-y-4">
      <LocationSelector value={location} onChange={handleLocationChange} />
      <div>
        <Input
          label={UI_MESSAGES.FOUNDATIONS_FORM_ADDRESS}
          error={errors.address?.message}
          {...register('address')}
        />
      </div>
    </div>
  );
}
