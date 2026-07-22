const TIMEZONE_TO_ISO2: Record<string, string> = {
  'America/Bogota': 'CO',
  'America/Mexico_City': 'MX',
  'America/Lima': 'PE',
  'America/Guayaquil': 'EC',
  'America/Santiago': 'CL',
  'America/Argentina/Buenos_Aires': 'AR',
  'America/Caracas': 'VE',
  'America/La_Paz': 'BO',
  'America/Asuncion': 'PY',
  'America/Montevideo': 'UY',
  'America/Sao_Paulo': 'BR',
  'America/Panama': 'PA',
  'America/Costa_Rica': 'CR',
  'America/Guatemala': 'GT',
  'America/New_York': 'US',
  'America/Los_Angeles': 'US',
  'Europe/Madrid': 'ES',
};

/**
 * Entrada: Ninguna.
 * Proceso: Infiere ISO2 desde locale y zona horaria del navegador.
 * Salida: Retorna codigo ISO2 de dos letras.
 */
export function detectViewerCountryIso2(): string {
  const locale =
    Intl.DateTimeFormat().resolvedOptions().locale ||
    (typeof navigator !== 'undefined' ? navigator.language : 'es-CO');
  const regionMatch = locale.match(/[-_]([A-Za-z]{2})\b/);
  const region = regionMatch?.[1]?.toUpperCase();
  if (region) {
    return region;
  }

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (timeZone && TIMEZONE_TO_ISO2[timeZone]) {
    return TIMEZONE_TO_ISO2[timeZone];
  }

  return 'CO';
}

/**
 * Entrada: Ninguna.
 * Proceso: Consulta IP publica (country.is) con timeout corto para obtener ISO2.
 * Salida: Retorna ISO2 o null si falla la deteccion remota.
 */
export async function detectCountryIso2FromIp(): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2500);

  try {
    const response = await fetch('https://api.country.is/', {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) {
      return null;
    }
    const payload = (await response.json()) as { country?: unknown };
    const code =
      typeof payload.country === 'string' ? payload.country.trim().toUpperCase() : '';
    return /^[A-Z]{2}$/.test(code) ? code : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Entrada: Ninguna.
 * Proceso: Intenta IP y cae a locale/timezone; por defecto CO.
 * Salida: Retorna ISO2 del pais del visitante.
 */
export async function resolveViewerCountryIso2(): Promise<string> {
  const fromIp = await detectCountryIso2FromIp();
  if (fromIp) {
    return fromIp;
  }
  return detectViewerCountryIso2();
}
