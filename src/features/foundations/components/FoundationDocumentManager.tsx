import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { useToast } from '@/context/useToast';
import type {
  FoundationDocument,
  FoundationDocumentType,
} from '@/features/foundations/types/foundations.types';
import { isRequiredFoundationDocument } from '@/features/foundations/utils/foundation-profile-checklist';
import { cn } from '@/utils/cn';

const DOCUMENT_LABELS: Record<FoundationDocumentType, string> = {
  RUT: UI_MESSAGES.FOUNDATIONS_DOCUMENT_RUT,
  LEGAL_EXISTENCE_CERTIFICATE: UI_MESSAGES.FOUNDATIONS_DOCUMENT_LEGAL_CERTIFICATE,
  LEGAL_REPRESENTATIVE_ID: UI_MESSAGES.FOUNDATIONS_DOCUMENT_REPRESENTATIVE_ID,
  BANK_CERTIFICATION: UI_MESSAGES.FOUNDATIONS_DOCUMENT_BANK_CERT,
};

const DOCUMENT_TYPES: FoundationDocumentType[] = [
  'RUT',
  'LEGAL_EXISTENCE_CERTIFICATE',
  'LEGAL_REPRESENTATIVE_ID',
  'BANK_CERTIFICATION',
];

interface FoundationDocumentManagerProps {
  documents: FoundationDocument[];
  canManage?: boolean;
  isUploadingType?: FoundationDocumentType | null;
  successMessage?: string;
  onUpload: (type: FoundationDocumentType, file: File) => Promise<void>;
  onDownload: (type: FoundationDocumentType) => Promise<void>;
  fetchDocumentBlob?: (type: FoundationDocumentType) => Promise<Blob>;
}

/**
 * Entrada: documents, permisos, successMessage y callbacks documentales.
 * Proceso: Lista documentos; feedback de carga/error via toast.
 * Salida: Retorna el elemento JSX del gestor documental.
 */
export function FoundationDocumentManager({
  documents,
  canManage = false,
  isUploadingType = null,
  successMessage,
  onUpload,
  onDownload,
  fetchDocumentBlob,
}: FoundationDocumentManagerProps) {
  const { pushToast } = useToast();
  const inputRefs = useRef<Partial<Record<FoundationDocumentType, HTMLInputElement | null>>>({});
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoadingType, setPreviewLoadingType] = useState<FoundationDocumentType | null>(null);

  const documentMap = new Map(documents.map((doc) => [doc.type, doc]));

  useEffect(() => {
    if (successMessage) {
      pushToast({ variant: 'success', message: successMessage });
    }
  }, [successMessage, pushToast]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  /**
   * Entrada: type: tipo documental; event: cambio del input file.
   * Proceso: Propaga archivo seleccionado al callback onUpload y limpia el input.
   * Salida: No retorna valor; dispara carga del documento.
   */
  const handleFileChange = async (
    type: FoundationDocumentType,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      await onUpload(type, file);
    } finally {
      if (inputRefs.current[type]) {
        inputRefs.current[type]!.value = '';
      }
    }
  };

  /**
   * Entrada: type: tipo documental a previsualizar.
   * Proceso: Obtiene blob autenticado y crea URL temporal para iframe o enlace.
   * Salida: No retorna valor; actualiza previewUrl o muestra toast de error.
   */
  const handlePreview = async (type: FoundationDocumentType) => {
    if (!fetchDocumentBlob) {
      return;
    }

    setPreviewLoadingType(type);

    try {
      const blob = await fetchDocumentBlob(type);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(URL.createObjectURL(blob));
    } catch {
      pushToast({
        variant: 'danger',
        message: UI_MESSAGES.FOUNDATIONS_DOCUMENT_PREVIEW_ERROR,
      });
    } finally {
      setPreviewLoadingType(null);
    }
  };

  /**
   * Entrada: Ninguna.
   * Proceso: Revoca URL de previsualizacion y limpia estado del modal de preview.
   * Salida: No retorna valor; restablece previewUrl.
   */
  const closePreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
  };

  return (
    <div id="foundation-profile-documents" className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-text-primary">
          {UI_MESSAGES.FOUNDATIONS_SECTION_DOCUMENTS}
        </p>
        <p className="mt-1 text-sm text-text-secondary">{UI_MESSAGES.FOUNDATIONS_DOCS_INTRO}</p>
      </div>

      <div className="space-y-3">
        {DOCUMENT_TYPES.map((type) => {
          const document = documentMap.get(type);
          const isUploading = isUploadingType === type;
          const isPreviewLoading = previewLoadingType === type;
          const required = isRequiredFoundationDocument(type);
          const missing = required && !document;

          return (
            <div
              key={type}
              className={cn(
                'rounded-lg border p-4',
                missing
                  ? 'border-warning-500/40 bg-warning-500/5'
                  : 'border-border-default bg-vivid-50/40',
              )}
            >
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-text-primary">{DOCUMENT_LABELS[type]}</p>
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-xs font-medium',
                        required
                          ? 'bg-error-500/10 text-error-600'
                          : 'bg-secondary-100 text-text-secondary',
                      )}
                    >
                      {required
                        ? UI_MESSAGES.FOUNDATIONS_BADGE_REQUIRED
                        : UI_MESSAGES.FOUNDATIONS_BADGE_OPTIONAL}
                    </span>
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-xs font-medium',
                        document
                          ? 'bg-success-500/10 text-success-600'
                          : 'bg-warning-500/15 text-warning-600',
                      )}
                    >
                      {document
                        ? UI_MESSAGES.FOUNDATIONS_BADGE_UPLOADED
                        : UI_MESSAGES.FOUNDATIONS_BADGE_MISSING}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted">
                    {document?.fileName ?? UI_MESSAGES.FOUNDATIONS_NO_DOCUMENT}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {document && fetchDocumentBlob && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      isLoading={isPreviewLoading}
                      onClick={() => void handlePreview(type)}
                    >
                      {UI_MESSAGES.FOUNDATIONS_VIEW_DOCUMENT}
                    </Button>
                  )}
                  {document && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => void onDownload(type)}
                    >
                      {UI_MESSAGES.FOUNDATIONS_DOWNLOAD_DOCUMENT}
                    </Button>
                  )}
                  {canManage && (
                    <>
                      <input
                        ref={(element) => {
                          inputRefs.current[type] = element;
                        }}
                        type="file"
                        accept="application/pdf,image/jpeg,image/png"
                        className="hidden"
                        onChange={(event) => void handleFileChange(type, event)}
                      />
                      <Button
                        type="button"
                        size="sm"
                        isLoading={isUploading}
                        onClick={() => inputRefs.current[type]?.click()}
                      >
                        {document
                          ? UI_MESSAGES.FOUNDATIONS_REPLACE_DOCUMENT
                          : UI_MESSAGES.FOUNDATIONS_UPLOAD_DOCUMENT}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={UI_MESSAGES.FOUNDATIONS_VIEW_DOCUMENT}
        >
          <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-xl bg-white">
            <div className="flex items-center justify-between border-b border-border-default px-4 py-3">
              <p className="text-sm font-semibold text-text-primary">
                {UI_MESSAGES.FOUNDATIONS_VIEW_DOCUMENT}
              </p>
              <Button type="button" variant="secondary" size="sm" onClick={closePreview}>
                {UI_MESSAGES.COMMON_CLOSE}
              </Button>
            </div>
            <iframe title="document-preview" src={previewUrl} className="h-[70vh] w-full" />
          </div>
        </div>
      )}
    </div>
  );
}
