/**
 * Entrada: isoDate: fecha ISO o null/undefined.
 * Proceso: Formatea fecha corta en locale es-CO.
 * Salida: Retorna cadena legible o guion.
 */
export function formatDate(isoDate?: string | null): string {
  if (!isoDate) {
    return '—';
  }

  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

/**
 * Entrada: value: valor de input date o datetime-local.
 * Proceso: Convierte a ISO datetime si hay valor; vacio a null.
 * Salida: Retorna string ISO o null.
 */
export function toIsoDateTime(value?: string | null): string | null {
  if (!value || !value.trim()) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

/**
 * Entrada: isoDate: fecha ISO.
 * Proceso: Convierte a valor compatible con input datetime-local.
 * Salida: Retorna string YYYY-MM-DDTHH:mm o vacio.
 */
export function toDateTimeLocalValue(isoDate?: string | null): string {
  if (!isoDate) {
    return '';
  }

  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/**
 * Entrada: fulfilled, required: cantidades de necesidad.
 * Proceso: Calcula porcentaje de avance acotado a 100.
 * Salida: Retorna porcentaje entero.
 */
export function needProgressPercent(fulfilled: number, required: number): number {
  if (required <= 0) {
    return 0;
  }
  return Math.min(100, Math.round((fulfilled / required) * 100));
}
