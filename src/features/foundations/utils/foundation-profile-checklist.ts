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

/** Unidades extra de progreso: logo + revision admin. */
const LOGO_PROGRESS_UNIT = 1;
const REVIEW_PROGRESS_UNIT = 1;

export type ProfileChecklistNextStep = 'save' | 'documents' | 'wait' | 'verified' | 'rejected';

export interface FoundationProfileChecklist {
  missingFields: string[];
  missingDocuments: string[];
  isProfileComplete: boolean;
  hasRequiredDocuments: boolean;
  completedSteps: number;
  totalSteps: number;
  progressValue: number;
  progressMax: number;
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
 * Proceso: Calcula campos/documentos faltantes, pasos macro y progreso granular de la barra.
 * Salida: Retorna checklist tipado para la UI de progreso.
 */
export function buildFoundationProfileChecklist(
  foundation: FoundationDetail,
): FoundationProfileChecklist {
  const filledFieldsCount = REQUIRED_PROFILE_FIELDS.filter((field) =>
    hasText(foundation[field.key]),
  ).length;
  const missingFields = REQUIRED_PROFILE_FIELDS.filter(
    (field) => !hasText(foundation[field.key]),
  ).map((field) => field.label);

  const uploadedTypes = new Set((foundation.documents ?? []).map((document) => document.type));
  const uploadedRequiredDocsCount = REQUIRED_FOUNDATION_DOCUMENT_TYPES.filter((type) =>
    uploadedTypes.has(type),
  ).length;
  const missingDocuments = REQUIRED_FOUNDATION_DOCUMENT_TYPES.filter(
    (type) => !uploadedTypes.has(type),
  ).map((type) => DOCUMENT_LABELS[type]);

  const hasLogo = Boolean(foundation.logoUrl?.trim());
  const isVerified = foundation.status === 'VERIFIED';
  const isProfileComplete = missingFields.length === 0;
  const hasRequiredDocuments = missingDocuments.length === 0;

  const progressMax =
    REQUIRED_PROFILE_FIELDS.length +
    LOGO_PROGRESS_UNIT +
    REQUIRED_FOUNDATION_DOCUMENT_TYPES.length +
    REVIEW_PROGRESS_UNIT;
  const progressValue =
    filledFieldsCount +
    Number(hasLogo) +
    uploadedRequiredDocsCount +
    Number(isVerified);

  let nextStep: ProfileChecklistNextStep = 'save';
  let nextStepMessage: string = UI_MESSAGES.FOUNDATIONS_CHECKLIST_NEXT_SAVE;

  if (isVerified) {
    nextStep = 'verified';
    nextStepMessage = UI_MESSAGES.FOUNDATIONS_CHECKLIST_VERIFIED;
  } else if (foundation.status === 'REJECTED') {
    nextStep = 'rejected';
    nextStepMessage = foundation.rejectionReason
      ? `${UI_MESSAGES.FOUNDATIONS_REJECTION_REASON}: ${foundation.rejectionReason}`
      : UI_MESSAGES.FOUNDATIONS_PROFILE_INCOMPLETE;
  } else if (!isProfileComplete) {
    nextStep = 'save';
    nextStepMessage = UI_MESSAGES.FOUNDATIONS_CHECKLIST_NEXT_SAVE;
  } else if (!hasRequiredDocuments) {
    nextStep = 'documents';
    nextStepMessage = UI_MESSAGES.FOUNDATIONS_CHECKLIST_NEXT_DOCS;
  } else {
    nextStep = 'wait';
    nextStepMessage = UI_MESSAGES.FOUNDATIONS_CHECKLIST_NEXT_WAIT;
  }

  const completedSteps =
    Number(isProfileComplete) + Number(hasRequiredDocuments) + Number(isVerified);

  return {
    missingFields,
    missingDocuments,
    isProfileComplete,
    hasRequiredDocuments,
    completedSteps,
    totalSteps: 3,
    progressValue,
    progressMax,
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
