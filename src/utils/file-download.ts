/**
 * Entrada: Recibe el contenido binario del archivo (blob) y el nombre sugerido para la descarga (fileName).
 * Proceso: Crea un enlace temporal, asigna el contenido del archivo y dispara automaticamente la descarga en el navegador.
 * Salida: No retorna ningun valor; inicia la descarga del archivo.
 */
export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}
