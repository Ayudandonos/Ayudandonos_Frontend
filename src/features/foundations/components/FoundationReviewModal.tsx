import { Button } from '@/components/ui/Button';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { FoundationDetailPanel } from '@/features/foundations/components/FoundationDetailPanel';
import type { FoundationDetail, FoundationDocumentType } from '@/features/foundations/types/foundations.types';
import type { UpdateFoundationStatusFormData } from '@/features/foundations/validations/foundations.validations';

interface FoundationReviewModalProps {
  foundation: FoundationDetail;
  isProcessing?: boolean;
  onClose: () => void;
  onUpdateStatus: (payload: UpdateFoundationStatusFormData) => Promise<void>;
  onDownloadDocument: (type: FoundationDocumentType) => Promise<void>;
  fetchDocumentBlob: (type: FoundationDocumentType) => Promise<Blob>;
}

/**
 * Entrada: foundation: detalle seleccionado; callbacks de cierre, estado y descarga.
 * Proceso: Renderiza panel lateral/modal de revision segun prototipo admin.
 * Salida: Retorna el elemento JSX del modal de revision.
 */
export function FoundationReviewModal({
  foundation,
  isProcessing = false,
  onClose,
  onUpdateStatus,
  onDownloadDocument,
  fetchDocumentBlob,
}: FoundationReviewModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <button
        type="button"
        className="flex-1 cursor-default"
        aria-label={UI_MESSAGES.FOUNDATIONS_CLOSE_REVIEW}
        onClick={onClose}
      />
      <div className="flex h-full w-full max-w-lg flex-col border-l border-border-default bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-border-default px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-vivid-700">
              {UI_MESSAGES.FOUNDATIONS_REVIEW_SUBTITLE}
            </p>
            <h2 className="text-lg font-bold text-text-primary">{foundation.name}</h2>
          </div>
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            {UI_MESSAGES.COMMON_CLOSE}
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <FoundationDetailPanel
            foundation={foundation}
            isAdmin
            embedded
            isProcessing={isProcessing}
            onUpdateStatus={onUpdateStatus}
            onDownloadDocument={onDownloadDocument}
            fetchDocumentBlob={fetchDocumentBlob}
          />
        </div>
      </div>
    </div>
  );
}
