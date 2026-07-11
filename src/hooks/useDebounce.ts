import { useState, useEffect } from 'react';

/**
 * Entrada: value: valor a debouncar; delay: tiempo de espera en milisegundos (por defecto 300).
 * Proceso: Retrasa la actualización del valor hasta que no haya cambios durante el intervalo indicado.
 * Salida: Retorna el valor debouncado.
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
