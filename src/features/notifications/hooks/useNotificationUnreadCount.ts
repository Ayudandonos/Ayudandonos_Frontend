import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { notificationsService } from '@/features/notifications/services/notifications.service';
import { parseApiError } from '@/utils/api-error';
import {
  activateRateLimitBackoff,
  getRateLimitBackoffRemainingMs,
  isRateLimitBackoffActive,
} from '@/utils/rate-limit';

/** Intervalo base de polling (60s). Un solo poller compartido para toda la app. */
const POLL_INTERVAL_MS = 60_000;
/** Pausa tras 429 antes de volver a consultar unread-count. */
const RATE_LIMIT_BACKOFF_MS = 120_000;

interface UnreadCountState {
  count: number;
  isLoading: boolean;
}

let state: UnreadCountState = { count: 0, isLoading: false };
const listeners = new Set<() => void>();
let subscriberCount = 0;
let intervalId: number | null = null;
let inFlight: Promise<void> | null = null;
let pollingEnabled = false;

/**
 * Entrada: Ninguna.
 * Proceso: Notifica a los suscriptores del store compartido.
 * Salida: No retorna valor.
 */
function emit(): void {
  listeners.forEach((listener) => listener());
}

/**
 * Entrada: partial: cambios parciales del estado.
 * Proceso: Actualiza el snapshot del store y notifica.
 * Salida: No retorna valor.
 */
function setState(partial: Partial<UnreadCountState>): void {
  state = { ...state, ...partial };
  emit();
}

/**
 * Entrada: Ninguna.
 * Proceso: Consulta unread-count una sola vez; deduplica in-flight y respeta backoff 429.
 * Salida: Promesa vacia al completar.
 */
async function fetchUnreadCountOnce(): Promise<void> {
  if (!pollingEnabled) {
    return;
  }

  if (isRateLimitBackoffActive()) {
    setState({ isLoading: false });
    return;
  }

  if (inFlight) {
    return inFlight;
  }

  setState({ isLoading: true });

  inFlight = (async () => {
    try {
      const next = await notificationsService.fetchUnreadCount();
      setState({ count: next, isLoading: false });
    } catch (error) {
      const status = parseApiError(error).status;
      if (status === 429) {
        activateRateLimitBackoff(RATE_LIMIT_BACKOFF_MS);
      }
      setState({ isLoading: false });
    } finally {
      inFlight = null;
    }
  })();

  return inFlight;
}

/**
 * Entrada: Ninguna.
 * Proceso: Programa el siguiente tick respetando backoff activo.
 * Salida: No retorna valor.
 */
function scheduleTick(): void {
  if (!pollingEnabled || document.visibilityState !== 'visible') {
    return;
  }

  if (isRateLimitBackoffActive()) {
    const remaining = getRateLimitBackoffRemainingMs();
    window.setTimeout(() => {
      void fetchUnreadCountOnce();
    }, remaining + 50);
    return;
  }

  void fetchUnreadCountOnce();
}

/**
 * Entrada: Ninguna.
 * Proceso: Arranca el intervalo unico de polling si hay suscriptores activos.
 * Salida: No retorna valor.
 */
function startPolling(): void {
  if (intervalId != null) {
    return;
  }

  scheduleTick();
  intervalId = window.setInterval(() => {
    scheduleTick();
  }, POLL_INTERVAL_MS);

  /**
   * Entrada: Ninguna.
   * Proceso: Refresca al volver a la pestana, sin martillar si hay backoff.
   * Salida: No retorna valor.
   */
  function handleVisibility(): void {
    if (document.visibilityState === 'visible') {
      scheduleTick();
    }
  }

  document.addEventListener('visibilitychange', handleVisibility);
  visibilityHandler = handleVisibility;
}

let visibilityHandler: (() => void) | null = null;

/**
 * Entrada: Ninguna.
 * Proceso: Detiene el intervalo y el listener cuando no quedan suscriptores.
 * Salida: No retorna valor.
 */
function stopPolling(): void {
  if (intervalId != null) {
    window.clearInterval(intervalId);
    intervalId = null;
  }
  if (visibilityHandler) {
    document.removeEventListener('visibilitychange', visibilityHandler);
    visibilityHandler = null;
  }
}

/**
 * Entrada: listener: callback de cambio de estado.
 * Proceso: Suscribe al store compartido e inicia/detiene el poller segun ref-count.
 * Salida: Funcion de desuscripcion.
 */
function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  subscriberCount += 1;

  if (subscriberCount === 1 && pollingEnabled) {
    startPolling();
  }

  return () => {
    listeners.delete(listener);
    subscriberCount = Math.max(0, subscriberCount - 1);
    if (subscriberCount === 0) {
      stopPolling();
    }
  };
}

/**
 * Entrada: Ninguna.
 * Proceso: Snapshot sincronico del contador para useSyncExternalStore.
 * Salida: Estado actual del store.
 */
function getSnapshot(): UnreadCountState {
  return state;
}

interface UseNotificationUnreadCountResult {
  count: number;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

/**
 * Entrada: enabled: si el usuario autenticado debe recibir polling de no leidas.
 * Proceso: Usa un store compartido (un solo poller app-wide) cada 60s con backoff ante 429.
 * Salida: Retorna contador, carga y refresco manual.
 */
export function useNotificationUnreadCount(enabled: boolean): UseNotificationUnreadCountResult {
  useEffect(() => {
    pollingEnabled = enabled;

    if (!enabled) {
      stopPolling();
      setState({ count: 0, isLoading: false });
      return undefined;
    }

    if (subscriberCount > 0) {
      startPolling();
    }

    return () => {
      // El stop real ocurre cuando el ultimo suscriptor se desuscribe.
    };
  }, [enabled]);

  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const refresh = useCallback(async () => {
    if (!enabled) {
      setState({ count: 0, isLoading: false });
      return;
    }
    await fetchUnreadCountOnce();
  }, [enabled]);

  return {
    count: enabled ? snapshot.count : 0,
    isLoading: enabled ? snapshot.isLoading : false,
    refresh,
  };
}
