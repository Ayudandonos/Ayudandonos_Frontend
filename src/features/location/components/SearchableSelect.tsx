import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import { cn } from '@/utils/cn';
import { UI_MESSAGES } from '@/constants/messages.constants';

export interface SearchableSelectOption {
  value: string;
  label: string;
  prefix?: string;
  prefixImageUrl?: string;
  secondary?: string;
  searchText?: string;
}

interface SearchableSelectProps {
  label: string;
  placeholder: string;
  ariaLabel: string;
  options: SearchableSelectOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
  onRetry?: () => void;
  fallbackLabel?: string;
  requiredMark?: boolean;
}

/**
 * Entrada: option: opcion del selector.
 * Proceso: Construye el texto visible del input (solo etiqueta, sin emoji ni codigo).
 * Salida: Retorna la cadena para mostrar en el campo.
 */
function formatOptionDisplay(option: SearchableSelectOption): string {
  return option.label;
}

/**
 * Entrada: option: opcion del selector.
 * Proceso: Une campos utiles para filtrar por texto libre.
 * Salida: Retorna texto normalizado de busqueda.
 */
function getOptionSearchText(option: SearchableSelectOption): string {
  return (option.searchText ?? [option.prefix, option.label, option.secondary, option.value].filter(Boolean).join(' '))
    .toLocaleLowerCase('es');
}

/**
 * Entrada: props de select con busqueda, carga y reintento.
 * Proceso: Renderiza combobox filtrable con navegacion por teclado y opciones tipograficamente claras.
 * Salida: Retorna el elemento JSX del selector.
 */
export function SearchableSelect({
  label,
  placeholder,
  ariaLabel,
  options,
  value,
  onChange,
  disabled = false,
  loading = false,
  error,
  emptyMessage,
  onRetry,
  fallbackLabel,
  requiredMark = false,
}: SearchableSelectProps) {
  const generatedId = useId();
  const listboxId = `${generatedId}-listbox`;
  const inputId = `${generatedId}-input`;
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value],
  );

  const filteredOptions = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('es');
    if (!normalized) return options;
    return options.filter((option) => getOptionSearchText(option).includes(normalized));
  }, [options, query]);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setHighlightedIndex(0);
    }
  }, [open]);

  useEffect(() => {
    /**
     * Entrada: event: click del documento.
     * Proceso: Cierra el listado si el clic ocurre fuera del contenedor.
     * Salida: No retorna valor.
     */
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  /**
   * Entrada: optionValue: valor de la opcion elegida.
   * Proceso: Notifica onChange y cierra el listado.
   * Salida: No retorna valor.
   */
  const selectOption = useCallback(
    (optionValue: string) => {
      onChange(optionValue);
      setOpen(false);
    },
    [onChange],
  );

  /**
   * Entrada: event: tecla sobre el input.
   * Proceso: Maneja flechas, Enter y Escape para navegacion accesible.
   * Salida: No retorna valor.
   */
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
      setHighlightedIndex((current) =>
        filteredOptions.length === 0 ? 0 : Math.min(current + 1, filteredOptions.length - 1),
      );
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setOpen(true);
      setHighlightedIndex((current) => Math.max(current - 1, 0));
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      const option = filteredOptions[highlightedIndex];
      if (option) selectOption(option.value);
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
    }
  };

  const displayValue = open
    ? query
    : selectedOption
      ? formatOptionDisplay(selectedOption)
      : (fallbackLabel ?? '');

  return (
    <div ref={containerRef} className="relative flex w-full flex-col gap-1.5">
      <label htmlFor={inputId} className="text-label">
        {label}
        {requiredMark && (
          <span className="ms-1 text-error-500" aria-label="obligatorio">
            *
          </span>
        )}
      </label>

      <div className="relative">
        <input
          id={inputId}
          type="text"
          role="combobox"
          aria-label={ariaLabel}
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-invalid={Boolean(error)}
          disabled={disabled || loading}
          placeholder={loading ? UI_MESSAGES.LOCATION_LOADING : placeholder}
          value={displayValue}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            setHighlightedIndex(0);
          }}
          onFocus={() => {
            if (!disabled && !loading) setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className={cn(
            'h-11 w-full rounded-[var(--radius-sm)] border text-base text-text-primary transition-smooth',
            'focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'glass-subtle border-border-default bg-white/60 px-4',
            error && 'border-error-500 focus:border-error-500 focus:ring-error-500/20',
          )}
          autoComplete="off"
        />
      </div>

      {open && !disabled && !loading && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={ariaLabel}
          className="absolute left-0 right-0 top-full z-20 mt-1.5 max-h-64 w-full overflow-auto rounded-xl border border-border-default bg-white py-1.5 shadow-lg"
        >
          <li role="option" aria-selected={value === ''}>
            <button
              type="button"
              className="w-full px-3 py-2.5 text-left text-sm text-text-muted transition-colors hover:bg-primary-50"
              onClick={() => selectOption('')}
            >
              {placeholder}
            </button>
          </li>
          {filteredOptions.length === 0 ? (
            <li className="px-3 py-3 text-sm text-text-secondary">
              {emptyMessage ?? UI_MESSAGES.LOCATION_NO_RESULTS}
            </li>
          ) : (
            filteredOptions.map((option, index) => {
              const isHighlighted = index === highlightedIndex;
              const isSelected = option.value === value;

              return (
                <li key={option.value} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    className={cn(
                      'flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors',
                      'hover:bg-primary-50',
                      isHighlighted && 'bg-primary-50',
                      isSelected && 'bg-primary-100/70',
                    )}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onClick={() => selectOption(option.value)}
                  >
                    {option.prefixImageUrl || option.prefix ? (
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-vivid-50 text-base leading-none"
                        aria-hidden="true"
                      >
                        {option.prefixImageUrl ? (
                          <img
                            src={option.prefixImageUrl}
                            alt=""
                            width={20}
                            height={15}
                            className="h-4 w-5 object-cover"
                            loading="lazy"
                          />
                        ) : (
                          option.prefix
                        )}
                      </span>
                    ) : null}
                    <span className="min-w-0 flex-1">
                      <span
                        className={cn(
                          'block truncate text-sm text-text-primary',
                          isSelected ? 'font-semibold text-primary-700' : 'font-medium',
                        )}
                      >
                        {option.label}
                      </span>
                    </span>
                    {option.secondary ? (
                      <span className="shrink-0 rounded-md bg-secondary-100 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-secondary-700">
                        {option.secondary}
                      </span>
                    ) : null}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      )}

      {error && (
        <div className="flex items-center gap-2" role="alert">
          <span className="text-sm text-error-500">{error}</span>
          {onRetry && (
            <button
              type="button"
              className="text-sm font-medium text-primary-700 underline"
              onClick={onRetry}
            >
              {UI_MESSAGES.EMPTY_STATE_RETRY}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
