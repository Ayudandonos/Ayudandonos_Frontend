import { Card } from '@/components/ui/Card';
import { AppImage } from '@/components/ui/AppImage';
import { UI_MESSAGES } from '@/constants/messages.constants';
import type { FoundationDetail } from '@/features/foundations/types/foundations.types';
import { FoundationStatusBadge } from '@/features/foundations/components/FoundationStatusBadge';
import { FoundationDocumentManager } from '@/features/foundations/components/FoundationDocumentManager';
import { FoundationAdminReviewPanel } from '@/features/foundations/components/FoundationAdminReviewPanel';
import type { UpdateFoundationStatusFormData } from '@/features/foundations/validations/foundations.validations';
import type { FoundationDocumentType } from '@/features/foundations/types/foundations.types';

interface FoundationDetailPanelProps {
  foundation: FoundationDetail;
  isAdmin?: boolean;
  isProcessing?: boolean;
  embedded?: boolean;
  canManageDocuments?: boolean;
  onUpdateStatus?: (payload: UpdateFoundationStatusFormData) => Promise<void>;
  onDownloadDocument?: (type: FoundationDocumentType) => Promise<void>;
  fetchDocumentBlob?: (type: FoundationDocumentType) => Promise<Blob>;
}

/**
 * Entrada: foundation: detalle; flags admin/gestion; callbacks opcionales.
 * Proceso: Renderiza panel de detalle completo segun prototipo de verificacion.
 * Salida: Retorna el elemento JSX del panel de detalle.
 */
export function FoundationDetailPanel({
  foundation,
  isAdmin = false,
  isProcessing = false,
  embedded = false,
  canManageDocuments = false,
  onUpdateStatus,
  onDownloadDocument,
  fetchDocumentBlob,
}: FoundationDetailPanelProps) {
  const content = (
    <>
      <div className="mb-4 flex items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-vivid-50">
          {foundation.logoUrl ? (
            <AppImage src={foundation.logoUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs text-text-muted">{UI_MESSAGES.FOUNDATIONS_LOGO_PLACEHOLDER}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-text-primary">{foundation.name}</h2>
              {foundation.acronym && (
                <p className="text-sm text-text-secondary">{foundation.acronym}</p>
              )}
            </div>
            <FoundationStatusBadge status={foundation.status} />
          </div>
          <p className="mt-1 text-sm text-text-secondary">
            {UI_MESSAGES.FOUNDATIONS_REGISTERED_AT}:{' '}
            {new Date(foundation.createdAt).toLocaleDateString('es-CO')}
          </p>
        </div>
      </div>

      <div className="space-y-4 text-sm">
        <div className="grid gap-3 sm:grid-cols-2">
          {foundation.nit && (
            <p>
              <span className="font-semibold text-text-primary">{UI_MESSAGES.FOUNDATIONS_FORM_NIT}:</span>{' '}
              {foundation.nit}
            </p>
          )}
          {foundation.category && (
            <p>
              <span className="font-semibold text-text-primary">{UI_MESSAGES.FOUNDATIONS_FORM_CATEGORY}:</span>{' '}
              {foundation.category}
            </p>
          )}
          {foundation.city && (
            <p>
              <span className="font-semibold text-text-primary">{UI_MESSAGES.FOUNDATIONS_FORM_CITY}:</span>{' '}
              {foundation.city}
            </p>
          )}
          {foundation.department && (
            <p>
              <span className="font-semibold text-text-primary">{UI_MESSAGES.FOUNDATIONS_FORM_DEPARTMENT}:</span>{' '}
              {foundation.department}
            </p>
          )}
        </div>

        {foundation.address && (
          <p>
            <span className="font-semibold text-text-primary">{UI_MESSAGES.FOUNDATIONS_FORM_ADDRESS}:</span>{' '}
            {foundation.address}
          </p>
        )}

        <div>
          <p className="font-semibold text-text-primary">{UI_MESSAGES.FOUNDATIONS_SECTION_NARRATIVE}</p>
          {foundation.mission && (
            <p className="mt-1 text-text-secondary">
              <span className="font-medium">{UI_MESSAGES.FOUNDATIONS_FORM_MISSION}:</span> {foundation.mission}
            </p>
          )}
          {foundation.vision && (
            <p className="mt-1 text-text-secondary">
              <span className="font-medium">{UI_MESSAGES.FOUNDATIONS_FORM_VISION}:</span> {foundation.vision}
            </p>
          )}
          <p className="mt-1 text-text-secondary">
            {foundation.description || UI_MESSAGES.FOUNDATIONS_NO_DESCRIPTION}
          </p>
        </div>

        <div>
          <p className="font-semibold text-text-primary">{UI_MESSAGES.FOUNDATIONS_SECTION_CONTACT}</p>
          <p className="mt-1 text-text-secondary">{foundation.representative.fullName}</p>
          <p className="text-text-secondary">{foundation.representative.email}</p>
          {foundation.institutionalEmail && (
            <p className="text-text-secondary">{foundation.institutionalEmail}</p>
          )}
          {foundation.phone && <p className="text-text-secondary">{foundation.phone}</p>}
          {foundation.website && (
            <a href={foundation.website} className="text-vivid-700 underline" target="_blank" rel="noreferrer">
              {foundation.website}
            </a>
          )}
        </div>

        {foundation.socialLinks.length > 0 && (
          <div>
            <p className="font-semibold text-text-primary">{UI_MESSAGES.FOUNDATIONS_SECTION_SOCIAL}</p>
            <ul className="mt-1 space-y-1">
              {foundation.socialLinks.map((link) => (
                <li key={link.network}>
                  <a href={link.url} className="text-vivid-700 underline" target="_blank" rel="noreferrer">
                    {link.network}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {foundation.verifiedAt && (
          <p className="text-text-secondary">
            {UI_MESSAGES.FOUNDATIONS_VERIFIED_AT}:{' '}
            {new Date(foundation.verifiedAt).toLocaleDateString('es-CO')}
          </p>
        )}

        {foundation.rejectedAt && (
          <p className="text-text-secondary">
            {UI_MESSAGES.FOUNDATIONS_REJECTED_AT}:{' '}
            {new Date(foundation.rejectedAt).toLocaleDateString('es-CO')}
          </p>
        )}
      </div>

      {onDownloadDocument && (
        <div className="mt-6">
          <FoundationDocumentManager
            documents={foundation.documents}
            canManage={canManageDocuments}
            onUpload={async () => undefined}
            onDownload={onDownloadDocument}
            fetchDocumentBlob={fetchDocumentBlob}
          />
        </div>
      )}

      {isAdmin && onUpdateStatus && (
        <FoundationAdminReviewPanel
          foundation={foundation}
          isProcessing={isProcessing}
          onUpdateStatus={onUpdateStatus}
        />
      )}
    </>
  );

  if (embedded) {
    return <div className="space-y-4">{content}</div>;
  }

  return (
    <Card glass={false} className="sticky top-6 border border-border-default bg-white p-6">
      {content}
    </Card>
  );
}
