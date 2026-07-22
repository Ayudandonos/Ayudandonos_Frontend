import { UI_MESSAGES } from '@/constants/messages.constants';
import type {
  FoundationDetail,
  FoundationDocumentType,
} from '@/features/foundations/types/foundations.types';

export const REQUIRED_FOUNDATION_DOCUMENT_TYPES: FoundationDocumentType[] = [
  'RUT',
  'LEGAL_EXISTENCE_CERTIFICATE',
  'LEGAL_REPRESENTATIVE_ID',
];

type RequiredProfileFieldKey =
  | 'name'
  | 'nit'
  | 'category'
  | 'country'
  | 'department'
  | 'city'
  | 'address'
  | 'mission'
  | 'vision'
  | 'description'
  | 'institutionalEmail'
  | 'phone'
  | 'legalRepresentativeName'
  | 'legalRepresentativeDocument';

const REQUIRED_PROFILE_FIELDS: Array<{
  key: RequiredProfileFieldKey;
  label: string;
}> = [
  { key: 'name', label: UI_MESSAGES.FOUNDATIONS_FORM_NAME },
  { key: 'nit', label: UI_MESSAGES.FOUNDATIONS_FORM_NIT },
  { key: 'category', label: UI_MESSAGES.FOUNDATIONS_FORM_CATEGORY },
  { key: 'country', label: UI_MESSAGES.FOUNDATIONS_FORM_COUNTRY },
  { key: 'department', label: UI_MESSAGES.FOUNDATIONS_FORM_DEPARTMENT },
  { key: 'city', label: UI_MESSAGES.FOUNDATIONS_FORM_CITY },
  { key: 'address', label: UI_MESSAGES.FOUNDATIONS_FORM_ADDRESS },
  { key: 'mission', label: UI_MESSAGES.FOUNDATIONS_FORM_MISSION },
  { key: 'vision', label: UI_MESSAGES.FOUNDATIONS_FORM_VISION },
  { key: 'description', label: UI_MESSAGES.FOUNDATIONS_FORM_DESCRIPTION },
  { key: 'institutionalEmail', label: UI_MESSAGES.FOUNDATIONS_FORM_INSTITUTIONAL_EMAIL },
  { key: 'phone', label: UI_MESSAGES.FOUNDATIONS_FORM_PHONE },
  { key: 'legalRepresentativeName', label: UI_MESSAGES.FOUNDATIONS_FORM_LEGAL_REP_NAME },
  {
    key: 'legalRepresentativeDocument',
    label: UI_MESSAGES.FOUNDATIONS_FORM_LEGAL_REP_DOCUMENT,
  },
];

const DOCUMENT_LABELS: Record<FoundationDocumentType, string> = {
  RUT: UI_MESSAGES.FOUNDATIONS_DOCUMENT_RUT,
  LEGAL_EXISTENCE_CERTIFICATE: UI_MESSAGES.FOUNDATIONS_DOCUMENT_LEGAL_CERTIFICATE,
  LEGAL_REPRESENTATIVE_ID: UI_MESSAGES.FOUNDATIONS_DOCUMENT_REPRESENTATIVE_ID,
  BANK_CERTIFICATION: UI_MESSAGES.FOUNDATIONS_DOCUMENT_BANK_CERT,
};

export type ProfileChecklistNextStep = 'save' | 'documents' | 'wait' | 'verified' | 'rejected';

export interface FoundationProfileChecklist {
  missingFields: string[];
  missingDocuments: string[];
  isProfileComplete: boolean;
  hasRequiredDocuments: boolean;
  completedSteps: number;
  totalSteps: number;
  nextStep: ProfileChecklistNextStep;
  nextStepMessage: string;
}

/**
 * Entrada: value: valor de campo de texto nullable.
 * Proceso: Determina si el valor tiene contenido util tras trim.
 * Salida: Retorna true si el campo esta completo.
 */
function hasText(value: string | null | undefined): boolean {
  return Boolean(value?.trim());
}

/**
 * Entrada: foundation: detalle de fundacion del perfil.
 * Proceso: Calcula campos/documentos faltantes y el siguiente paso UX.
 * Salida: Retorna checklist tipado para la UI de progreso.
 */
export function buildFoundationProfileChecklist(
  foundation: FoundationDetail,
): FoundationProfileChecklist {
  const missingFields = REQUIRED_PROFILE_FIELDS.filter(
    (field) => !hasText(foundation[field.key]),
  ).map((field) => field.label);

  const uploadedTypes = new Set(foundation.documents.map((document) => document.type));
  const missingDocuments = REQUIRED_FOUNDATION_DOCUMENT_TYPES.filter(
    (type) => !uploadedTypes.has(type),
  ).map((type) => DOCUMENT_LABELS[type]);

  const isProfileComplete = missingFields.length === 0;
  const hasRequiredDocuments = missingDocuments.length === 0;

  let nextStep: ProfileChecklistNextStep = 'save';
  let nextStepMessage: string = UI_MESSAGES.FOUNDATIONS_CHECKLIST_NEXT_SAVE;
  let completedSteps = 0;

  if (foundation.status === 'VERIFIED') {
    nextStep = 'verified';
    nextStepMessage = UI_MESSAGES.FOUNDATIONS_CHECKLIST_VERIFIED;
    completedSteps = 3;
  } else if (foundation.status === 'REJECTED') {
    nextStep = 'rejected';
    nextStepMessage = foundation.rejectionReason
      ? `${UI_MESSAGES.FOUNDATIONS_REJECTION_REASON}: ${foundation.rejectionReason}`
      : UI_MESSAGES.FOUNDATIONS_PROFILE_INCOMPLETE;
    completedSteps = Number(isProfileComplete) + Number(hasRequiredDocuments);
  } else if (!isProfileComplete) {
    nextStep = 'save';
    nextStepMessage = UI_MESSAGES.FOUNDATIONS_CHECKLIST_NEXT_SAVE;
    completedSteps = 0;
  } else if (!hasRequiredDocuments) {
    nextStep = 'documents';
    nextStepMessage = UI_MESSAGES.FOUNDATIONS_CHECKLIST_NEXT_DOCS;
    completedSteps = 1;
  } else {
    nextStep = 'wait';
    nextStepMessage = UI_MESSAGES.FOUNDATIONS_CHECKLIST_NEXT_WAIT;
    completedSteps = 2;
  }

  return {
    missingFields,
    missingDocuments,
    isProfileComplete,
    hasRequiredDocuments,
    completedSteps,
    totalSteps: 3,
    nextStep,
    nextStepMessage,
  };
}

/**
 * Entrada: type: tipo documental.
 * Proceso: Indica si el documento es obligatorio para verificacion.
 * Salida: Retorna true si es obligatorio.
 */
export function isRequiredFoundationDocument(type: FoundationDocumentType): boolean {
  return REQUIRED_FOUNDATION_DOCUMENT_TYPES.includes(type);
}
