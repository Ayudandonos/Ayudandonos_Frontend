export interface GeocodeQuery {
  country?: string | null;
  department?: string | null;
  city?: string | null;
  address?: string | null;
}

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  displayName: string;
}

interface NominatimItem {
  lat?: string;
  lon?: string;
  display_name?: string;
  address?: {
    city?: string;
    town?: string;
    municipality?: string;
    village?: string;
    county?: string;
    state?: string;
    country?: string;
  };
}

/**
 * Entrada: value: texto opcional.
 * Proceso: Normaliza espacios y minusculas para comparar ubicaciones.
 * Salida: Retorna cadena normalizada o vacia.
 */
function normalizePlace(value?: string | null): string {
  return (value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

/**
 * Entrada: item de Nominatim y query original.
 * Proceso: Comprueba que el resultado coincida con ciudad/depto/pais cuando existen.
 * Salida: Retorna true si el match es coherente con el contexto.
 */
function matchesLocationContext(item: NominatimItem, query: GeocodeQuery): boolean {
  const expectedCity = normalizePlace(query.city);
  const expectedDepartment = normalizePlace(query.department);
  const expectedCountry = normalizePlace(query.country);
  const display = normalizePlace(item.display_name);
  const addr = item.address;

  const placeNames = [
    addr?.city,
    addr?.town,
    addr?.municipality,
    addr?.village,
    addr?.county,
  ]
    .map((part) => normalizePlace(part))
    .filter(Boolean);

  if (expectedCity) {
    const cityOk =
      placeNames.some((name) => name.includes(expectedCity) || expectedCity.includes(name)) ||
      display.includes(expectedCity);
    if (!cityOk) {
      return false;
    }
  }

  if (expectedDepartment) {
    const stateName = normalizePlace(addr?.state);
    const departmentOk =
      (stateName &&
        (stateName.includes(expectedDepartment) || expectedDepartment.includes(stateName))) ||
      display.includes(expectedDepartment);
    if (!departmentOk) {
      return false;
    }
  }

  if (expectedCountry) {
    const countryName = normalizePlace(addr?.country);
    const countryOk =
      (countryName &&
        (countryName.includes(expectedCountry) || expectedCountry.includes(countryName))) ||
      display.includes(expectedCountry);
    if (!countryOk) {
      return false;
    }
  }

  return true;
}

/**
 * Entrada: item crudo de Nominatim.
 * Proceso: Parsea lat/lng y nombre visible.
 * Salida: Retorna GeocodeResult o null.
 */
function toGeocodeResult(item: NominatimItem): GeocodeResult | null {
  if (!item.lat || !item.lon) {
    return null;
  }
  const latitude = Number.parseFloat(item.lat);
  const longitude = Number.parseFloat(item.lon);
  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return null;
  }
  return {
    latitude,
    longitude,
    displayName: item.display_name ?? '',
  };
}

/**
 * Entrada: params de busqueda Nominatim.
 * Proceso: Ejecuta GET a Nominatim con addressdetails.
 * Salida: Retorna lista de resultados o arreglo vacio.
 */
async function fetchNominatim(params: Record<string, string>): Promise<NominatimItem[]> {
  const url = new URL('https://nominatim.openstreetmap.org/search');
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  url.searchParams.set('format', 'json');
  url.searchParams.set('addressdetails', '1');
  url.searchParams.set('limit', '5');

  const response = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    return [];
  }
  return (await response.json()) as NominatimItem[];
}

/**
 * Entrada: items y query de contexto.
 * Proceso: Elige el primer resultado coherente con ciudad/depto/pais.
 * Salida: Retorna GeocodeResult o null.
 */
function pickBestResult(items: NominatimItem[], query: GeocodeQuery): GeocodeResult | null {
  const contextual = items.find((item) => matchesLocationContext(item, query));
  if (contextual) {
    return toGeocodeResult(contextual);
  }
  // Sin ciudad/depto no hay forma fiable de filtrar; evita default a Bogota con calle suelta.
  if (!query.city?.trim() && !query.department?.trim()) {
    return null;
  }
  return null;
}

/**
 * Entrada: query: pais/departamento/ciudad/direccion.
 * Proceso: Geocodifica con busqueda estructurada Nominatim y valida el contexto.
 * Salida: Retorna coordenadas o null si no hay match fiable.
 */
export async function geocodeLocation(query: GeocodeQuery): Promise<GeocodeResult | null> {
  const street = query.address?.trim() ?? '';
  const city = query.city?.trim() ?? '';
  const department = query.department?.trim() ?? '';
  const country = query.country?.trim() ?? '';

  if (!city && !department && !street) {
    return null;
  }

  // Calle sola sin ciudad/depto suele caer en Bogota u otra capital: se rechaza,
  // salvo que haya pais (ej. campanas) donde se busca texto libre acotado.
  if (street && !city && !department && !country) {
    return null;
  }

  const structured: Record<string, string> = {};
  if (street) structured.street = street;
  if (city) structured.city = city;
  if (department) structured.state = department;
  if (country) structured.country = country;
  if (normalizePlace(country).includes('colombia') || (!country && (city || department))) {
    structured.countrycodes = 'co';
  }

  if (city || department) {
    const structuredResults = await fetchNominatim(structured);
    const structuredMatch = pickBestResult(structuredResults, query);
    if (structuredMatch) {
      return structuredMatch;
    }
  }

  // Fallback: texto libre siempre con ciudad/depto/pais cuando existan.
  const freeTextParts = [street, city, department, country || 'Colombia'].filter(Boolean);
  const freeTextResults = await fetchNominatim({
    q: freeTextParts.join(', '),
    countrycodes: 'co',
  });

  if (city || department) {
    return pickBestResult(freeTextResults, query);
  }

  // Campanas u otros flujos sin cascada: primer resultado en Colombia.
  return toGeocodeResult(freeTextResults[0] ?? {});
}
