import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { UI_MESSAGES } from '@/constants/messages.constants';
import type {
  FoundationDocument,
  FoundationDocumentType,
} from '@/features/foundations/types/foundations.types';

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
  onUpload: (type: FoundationDocumentType, file: File) => Promise<void>;
  onDownload: (type: FoundationDocumentType) => Promise<void>;
  fetchDocumentBlob?: (type: FoundationDocumentType) => Promise<Blob>;
}

/**
 * Entrada: documents, permisos y callbacks de carga, descarga y previsualizacion.
 * Proceso: Lista documentos legales con acciones de ver, descargar y reemplazar via API autenticada.
 * Salida: Retorna el elemento JSX del gestor documental.
 */
export function FoundationDocumentManager({
  documents,
  canManage = false,
  isUploadingType = null,
  onUpload,
  onDownload,
  fetchDocumentBlob,
}: FoundationDocumentManagerProps) {
  const inputRefs = useRef<Partial<Record<FoundationDocumentType, HTMLInputElement | null>>>({});
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState('');
  const [previewLoadingType, setPreviewLoadingType] = useState<FoundationDocumentType | null>(null);

  const documentMap = new Map(documents.map((doc) => [doc.type, doc]));

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
   * Salida: No retorna valor; actualiza previewUrl o previewError.
   */
  const handlePreview = async (type: FoundationDocumentType) => {
    if (!fetchDocumentBlob) {
      return;
    }

    setPreviewError('');
    setPreviewLoadingType(type);

    try {
      const blob = await fetchDocumentBlob(type);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(URL.createObjectURL(blob));
    } catch {
      setPreviewError(UI_MESSAGES.FOUNDATIONS_DOCUMENT_PREVIEW_ERROR);
    } finally {
      setPreviewLoadingType(null);
    }
  };

  /**
   * Entrada: Ninguna.
   * Proceso: Revoca URL de previsualizacion y limpia estado del modal de preview.
   * Salida: No retorna valor; restablece previewUrl y previewError.
   */
  const closePreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setPreviewError('');
  };

  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold text-text-primary">{UI_MESSAGES.FOUNDATIONS_SECTION_DOCUMENTS}</p>
      {previewError && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{previewError}</p>
      )}
      <div className="space-y-3">
        {DOCUMENT_TYPES.map((type) => {
          const document = documentMap.get(type);
          const isUploading = isUploadingType === type;
          const isPreviewLoading = previewLoadingType === type;

          return (
            <div
              key={type}
              className="rounded-lg border border-border-default bg-vivid-50/40 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-text-primary">{DOCUMENT_LABELS[type]}</p>
                  <p className="mt-1 text-xs text-text-muted">
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
