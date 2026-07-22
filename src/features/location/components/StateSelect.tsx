import { useMemo } from 'react';
import { SearchableSelect } from '@/features/location/components/SearchableSelect';
import { useStates } from '@/features/location/hooks/useStates';
import type { State } from '@/features/location/types/location.types';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { parseApiError } from '@/utils/api-error';

interface StateSelectProps {
  countryIso: string | null;
  value: State | null;
  onChange: (state: State | null) => void;
  fieldError?: string;
  requiredMark?: boolean;
  hideLabel?: boolean;
}

/**
 * Entrada: countryIso: ISO del pais; value/onChange; fieldError/requiredMark/hideLabel opcionales.
 * Proceso: Carga estados solo si hay pais; deshabilita en caso contrario.
 * Salida: Retorna el selector de estado/departamento.
 */
export function StateSelect({
  countryIso,
  value,
  onChange,
  fieldError,
  requiredMark = true,
  hideLabel = false,
}: StateSelectProps) {
  const enabled = Boolean(countryIso);
  const { data, isLoading, isError, error, refetch, isFetching } = useStates(countryIso);

  const options = useMemo(
    () =>
      (data ?? []).map((state) => ({
        value: state.iso2,
        label: state.name,
      })),
    [data],
  );

  /**
   * Entrada: iso2: codigo seleccionado o vacio.
   * Proceso: Resuelve el estado completo y notifica al padre.
   * Salida: No retorna valor.
   */
  const handleChange = (iso2: string) => {
    if (!iso2) {
      onChange(null);
      return;
    }
    const selected = (data ?? []).find((item) => item.iso2 === iso2) ?? null;
    onChange(selected);
  };

  return (
    <SearchableSelect
      label={UI_MESSAGES.LOCATION_STATE_LABEL}
      placeholder={UI_MESSAGES.LOCATION_STATE_PLACEHOLDER}
      ariaLabel={UI_MESSAGES.LOCATION_STATE_ARIA}
      options={options}
      value={value?.iso2 ?? ''}
      onChange={handleChange}
      disabled={!enabled}
      loading={enabled && (isLoading || (isFetching && !data))}
      fallbackLabel={value?.name}
      error={
        fieldError ||
        (enabled && isError
          ? parseApiError(error).message || UI_MESSAGES.LOCATION_LOAD_ERROR
          : undefined)
      }
      onRetry={enabled && isError ? () => void refetch() : undefined}
      requiredMark={requiredMark}
      hideLabel={hideLabel}
    />
  );
}
