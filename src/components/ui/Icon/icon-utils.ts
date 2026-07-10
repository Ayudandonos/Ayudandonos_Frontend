/**
 * Entrada: raw: contenido SVG importado como string.
 * Proceso: Limpia atributos fijos y prepara el SVG para heredar color via currentColor.
 * Salida: Retorna el string SVG listo para renderizar.
 */
export function prepareSvgContent(raw: string): string {
  return raw
    .replace(/<\?xml[^?]*\?>\s*/i, '')
    .replace(/\s(width|height)="[^"]*"/gi, '')
    .replace('<svg', '<svg focusable="false" fill="currentColor"');
}
