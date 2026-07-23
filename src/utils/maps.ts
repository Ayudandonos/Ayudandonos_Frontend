/**
 * Entrada: latitude, longitude: coordenadas del destino.
 * Proceso: Construye URL de OpenStreetMap centrada en el punto (navegacion externa).
 * Salida: Retorna la URL absoluta del mapa.
 */
export function buildOpenStreetMapUrl(latitude: number, longitude: number): string {
  return `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`;
}

/**
 * @deprecated Usar buildOpenStreetMapUrl. Se mantiene por compatibilidad de exports.
 * Entrada: latitude, longitude: coordenadas del destino.
 * Proceso: Delega a buildOpenStreetMapUrl.
 * Salida: Retorna la URL absoluta del mapa.
 */
export function buildGoogleMapsDirectionsUrl(latitude: number, longitude: number): string {
  return buildOpenStreetMapUrl(latitude, longitude);
}
