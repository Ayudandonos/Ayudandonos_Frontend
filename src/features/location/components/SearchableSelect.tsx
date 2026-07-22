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
}

/**
 * Entrada: props de select con busqueda, carga y reintento.
 * Proceso: Renderiza combobox filtrable con navegacion por teclado.
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
    return options.filter((option) =>
      option.label.toLocaleLowerCase('es').includes(normalized),
    );
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

  const displayValue = open ? query : (selectedOption?.label ?? fallbackLabel ?? '');

  return (
    <div ref={containerRef} className="relative flex w-full flex-col gap-1.5">
      <label htmlFor={inputId} className="text-label">
        {label}
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
          className="absolute left-0 right-0 top-full z-20 mt-1 max-h-56 w-full overflow-auto rounded-[var(--radius-sm)] border border-border-default bg-white shadow-md"
        >
          <li role="option" aria-selected={value === ''}>
            <button
              type="button"
              className="w-full px-4 py-2 text-left text-sm text-text-secondary hover:bg-primary-50"
              onClick={() => selectOption('')}
            >
              {placeholder}
            </button>
          </li>
          {filteredOptions.length === 0 ? (
            <li className="px-4 py-3 text-sm text-text-secondary">
              {emptyMessage ?? UI_MESSAGES.LOCATION_NO_RESULTS}
            </li>
          ) : (
            filteredOptions.map((option, index) => (
              <li key={option.value} role="option" aria-selected={option.value === value}>
                <button
                  type="button"
                  className={cn(
                    'w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-primary-50',
                    index === highlightedIndex && 'bg-primary-50',
                    option.value === value && 'font-medium text-primary-700',
                  )}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => selectOption(option.value)}
                >
                  {option.label}
                </button>
              </li>
            ))
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
