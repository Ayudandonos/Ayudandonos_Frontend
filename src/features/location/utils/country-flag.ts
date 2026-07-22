/**
 * Entrada: iso2: codigo ISO2 del pais (ej. CO, US).
 * Proceso: Construye URL de bandera PNG via flagcdn (evita emoji no soportados en Windows).
 * Salida: Retorna la URL absoluta de la bandera.
 */
export function getCountryFlagUrl(iso2: string): string {
  return `https://flagcdn.com/w40/${iso2.trim().toLowerCase()}.png`;
}
