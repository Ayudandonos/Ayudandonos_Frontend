/** Marca temporal de fin de backoff tras un 429 (ms epoch). */
let backoffUntilMs = 0;

/**
 * Entrada: durationMs: milisegundos de pausa (por defecto 60s).
 * Proceso: Activa un backoff global para evitar reintentos en bucle tras 429.
 * Salida: No retorna valor.
 */
export function activateRateLimitBackoff(durationMs = 60_000): void {
  backoffUntilMs = Math.max(backoffUntilMs, Date.now() + durationMs);
}

/**
 * Entrada: Ninguna.
 * Proceso: Indica si aun estamos dentro de la ventana de backoff por 429.
 * Salida: Retorna true si no se deben emitir nuevas peticiones de polling.
 */
export function isRateLimitBackoffActive(): boolean {
  return Date.now() < backoffUntilMs;
}

/**
 * Entrada: Ninguna.
 * Proceso: Calcula milisegundos restantes de backoff.
 * Salida: Retorna ms restantes (>= 0).
 */
export function getRateLimitBackoffRemainingMs(): number {
  return Math.max(0, backoffUntilMs - Date.now());
}
