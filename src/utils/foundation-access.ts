import type { Foundation } from '@/types';
import type { FoundationDocumentType } from '@/features/foundations/types/foundations.types';

const REQUIRED_FOUNDATION_DOCUMENT_TYPES: FoundationDocumentType[] = [
  'RUT',
  'LEGAL_EXISTENCE_CERTIFICATE',
  'LEGAL_REPRESENTATIVE_ID',
];

/**
 * Entrada: documents: listado de documentos cargados de la fundacion.
 * Proceso: Verifica que existan los tipos documentales obligatorios para verificacion.
 * Salida: Retorna true si estan presentes RUT, certificado legal e ID del representante.
 */
export function hasRequiredFoundationDocuments(
  documents: Array<{ type: FoundationDocumentType }>,
): boolean {
  const uploadedTypes = new Set(documents.map((document) => document.type));
  return REQUIRED_FOUNDATION_DOCUMENT_TYPES.every((type) => uploadedTypes.has(type));
}

/**
 * Entrada: foundation: datos publicos de la fundacion en sesion o null.
 * Proceso: Verifica que el perfil y los documentos obligatorios esten completos.
 * Salida: Retorna true si la fundacion puede salir de la pantalla de perfil.
 */
export function isFoundationProfileReady(foundation: Foundation | null): boolean {
  if (!foundation) {
    return false;
  }

  return foundation.isProfileComplete && foundation.hasRequiredDocuments;
}

/**
 * Entrada: isProfileComplete: flag del perfil; documents: documentos cargados.
 * Proceso: Combina completitud de campos y presencia de documentos obligatorios del detalle.
 * Salida: Retorna true si el perfil de fundacion esta listo para solicitar verificacion.
 */
export function isFoundationDetailProfileReady(
  isProfileComplete: boolean,
  documents: Array<{ type: FoundationDocumentType }>,
): boolean {
  return isProfileComplete && hasRequiredFoundationDocuments(documents);
}

/**
 * Entrada: foundation: datos publicos de la fundacion en sesion o null.
 * Proceso: Verifica perfil completo, documentos cargados y estado VERIFIED.
 * Salida: Retorna true si la fundacion puede usar modulos operativos (campanas, solicitudes).
 */
export function canFoundationOperate(foundation: Foundation | null): boolean {
  if (!foundation) {
    return false;
  }

  return foundation.status === 'VERIFIED' && isFoundationProfileReady(foundation);
}

/**
 * Entrada: foundation: datos publicos de la fundacion en sesion o null.
 * Proceso: Determina si la ruta de perfil es la unica permitida en el dashboard.
 * Salida: Retorna true si debe restringirse el acceso al resto de rutas del dashboard.
 */
export function shouldRestrictFoundationDashboard(foundation: Foundation | null): boolean {
  return !canFoundationOperate(foundation);
}
