/**
 * Entrada: latitude, longitude: coordenadas del destino.
 * Proceso: Construye URL de Google Maps para navegacion externa.
 * Salida: Retorna la URL absoluta de direcciones.
 */
export function buildGoogleMapsDirectionsUrl(latitude: number, longitude: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
}
