/**
 * Entrada: iso2: codigo ISO2 del pais (ej. CO, US).
 * Proceso: Construye URL SVG de bandera via jsDelivr (CORP cross-origin compatible).
 * Salida: Retorna la URL absoluta de la bandera.
 */
export function getCountryFlagUrl(iso2: string): string {
  const code = iso2.trim().toLowerCase();
  return `https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.2.3/flags/4x3/${code}.svg`;
}
