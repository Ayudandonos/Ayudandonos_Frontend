/**
 * Entrada: classes: lista de clases CSS, booleanos u otros valores que se filtrarán.
 * Proceso: Filtra valores falsy y une las clases restantes con un espacio.
 * Salida: Retorna la cadena de clases CSS concatenada.
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
