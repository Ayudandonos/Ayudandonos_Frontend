import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Alert } from '@/components/ui/Alert';
import { Card } from '@/components/ui/Card';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { useAuth } from '@/context/useAuth';
import { FoundationDocumentManager } from '@/features/foundations/components/FoundationDocumentManager';
import { FoundationForm } from '@/features/foundations/components/FoundationForm';
import { FoundationLogoUploader } from '@/features/foundations/components/FoundationLogoUploader';
import { FoundationsLoadingSkeleton } from '@/features/foundations/components/FoundationsLoadingSkeleton';
import { FoundationObservationHistory } from '@/features/foundations/components/FoundationObservationHistory';
import { FoundationProfileChecklistCard } from '@/features/foundations/components/FoundationProfileChecklistCard';
import { FoundationStatusBadge } from '@/features/foundations/components/FoundationStatusBadge';
import { foundationsService } from '@/features/foundations/services/foundations.service';
import type {
  FoundationDetail,
  FoundationDocumentType,
} from '@/features/foundations/types/foundations.types';
import { buildFoundationProfileChecklist } from '@/features/foundations/utils/foundation-profile-checklist';
import type { UpdateFoundationFormData } from '@/features/foundations/validations/foundations.validations';
import { parseApiError } from '@/utils/api-error';
import { downloadBlob } from '@/utils/file-download';

type ProfileGateState = 'incomplete' | 'verification';
type FeedbackSource = 'logo' | 'form' | 'document';

/**
 * Entrada: foundation: detalle cargado desde la API.
 * Proceso: Normaliza campos nullable a valores por defecto del formulario de edicion.
 * Salida: Retorna UpdateFoundationFormData listo para react-hook-form.
 */
function buildDefaultValues(foundation: FoundationDetail): UpdateFoundationFormData {
  return {
    name: foundation.name,
    acronym: foundation.acronym ?? '',
    nit: foundation.nit ?? '',
    category: foundation.category ?? '',
    mission: foundation.mission ?? '',
    vision: foundation.vision ?? '',
    description: foundation.description ?? '',
    city: foundation.city ?? '',
    department: foundation.department ?? '',
    country: foundation.country ?? '',
    address: foundation.address ?? '',
    institutionalEmail: foundation.institutionalEmail ?? '',
    phone: foundation.phone ?? '',
    website: foundation.website ?? '',
    legalRepresentativeName: foundation.legalRepresentativeName ?? '',
    legalRepresentativeDocument: foundation.legalRepresentativeDocument ?? '',
    socialLinks: foundation.socialLinks,
  };
}

/**
 * Entrada: Ninguna (usuario autenticado con rol FOUNDATION).
 * Proceso: Carga y permite editar el perfil completo de fundacion via API.
 * Salida: Retorna el elemento JSX de la pagina de perfil de fundacion.
 */
export function FoundationProfilePage() {
  const { fetchMe } = useAuth();
  const location = useLocation();
  const gate = (location.state as { gate?: ProfileGateState } | null)?.gate;
  const [foundation, setFoundation] = useState<FoundationDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [feedback, setFeedback] = useState<{ source: FeedbackSource; message: string } | null>(
    null,
  );
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [uploadingDocumentType, setUploadingDocumentType] =
    useState<FoundationDocumentType | null>(null);

  const checklist = useMemo(
    () => (foundation ? buildFoundationProfileChecklist(foundation) : null),
    [foundation],
  );

  useEffect(() => {
    let cancelled = false;

    /**
     * Entrada: Ninguna (usa el servicio de fundaciones del usuario autenticado).
     * Proceso: Obtiene el perfil propio de fundacion y actualiza el estado local.
     * Salida: No retorna valor; actualiza foundation o error en el componente.
     */
    async function loadProfile() {
      setIsLoading(true);
      setApiError('');

      try {
        const data = await foundationsService.fetchMyFoundation();
        if (!cancelled) {
          setFoundation(data);
        }
      } catch (loadError) {
        if (!cancelled) {
          setApiError(parseApiError(loadError).message || UI_MESSAGES.FOUNDATIONS_LOAD_ERROR);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * Entrada: data: valores validados del formulario de perfil.
   * Proceso: Envía PATCH al backend, refresca perfil y sesion del usuario.
   * Salida: No retorna valor; actualiza estado de exito o error.
   */
  const handleSubmit = async (data: UpdateFoundationFormData) => {
    if (!foundation) {
      return;
    }

    setApiError('');
    setFeedback(null);

    try {
      const updated = await foundationsService.updateFoundation(foundation.id, data);
      setFoundation(updated);
      setFeedback({
        source: 'form',
        message: UI_MESSAGES.FOUNDATIONS_PROFILE_UPDATED,
      });
      await fetchMe();
    } catch (submitError) {
      setApiError(parseApiError(submitError).message || UI_MESSAGES.AUTH_GENERIC_ERROR);
    }
  };

  /**
   * Entrada: file: archivo de imagen seleccionado para el logo.
   * Proceso: Sube el logo via API multipart y sincroniza el perfil local.
   * Salida: No retorna valor; actualiza foundation o error en pantalla.
   */
  const handleUploadLogo = async (file: File) => {
    if (!foundation) {
      return;
    }

    setIsUploadingLogo(true);
    setApiError('');
    setFeedback(null);

    try {
      const updated = await foundationsService.uploadLogo(foundation.id, file);
      setFoundation(updated);
      setFeedback({
        source: 'logo',
        message: UI_MESSAGES.FOUNDATIONS_LOGO_UPLOADED,
      });
      await fetchMe();
    } catch (uploadError) {
      setApiError(parseApiError(uploadError).message || UI_MESSAGES.AUTH_GENERIC_ERROR);
    } finally {
      setIsUploadingLogo(false);
    }
  };

  /**
   * Entrada: type: tipo documental; file: archivo legal a cargar.
   * Proceso: Sube el documento via API y refresca la lista documental del perfil.
   * Salida: No retorna valor; actualiza foundation o error en pantalla.
   */
  const handleUploadDocument = async (type: FoundationDocumentType, file: File) => {
    if (!foundation) {
      return;
    }

    setUploadingDocumentType(type);
    setApiError('');
    setFeedback(null);

    try {
      const updated = await foundationsService.uploadDocument(foundation.id, type, file);
      setFoundation(updated);
      setFeedback({
        source: 'document',
        message: UI_MESSAGES.FOUNDATIONS_DOCUMENT_UPLOADED,
      });
      await fetchMe();
    } catch (uploadError) {
      setApiError(parseApiError(uploadError).message || UI_MESSAGES.AUTH_GENERIC_ERROR);
    } finally {
      setUploadingDocumentType(null);
    }
  };

  /**
   * Entrada: type: tipo documental a descargar.
   * Proceso: Obtiene blob autenticado del backend e inicia descarga en el navegador.
   * Salida: No retorna valor; dispara la descarga o registra error.
   */
  const handleDownloadDocument = async (type: FoundationDocumentType) => {
    if (!foundation) {
      return;
    }

    try {
      const { blob, fileName } = await foundationsService.downloadDocument(foundation.id, type);
      downloadBlob(blob, fileName);
    } catch (downloadError) {
      setApiError(parseApiError(downloadError).message || UI_MESSAGES.FOUNDATIONS_DOCUMENT_PREVIEW_ERROR);
    }
  };

  /**
   * Entrada: type: tipo documental a previsualizar.
   * Proceso: Descarga blob autenticado del documento para preview embebido.
   * Salida: Retorna el Blob del archivo solicitado.
   */
  const fetchDocumentBlob = async (type: FoundationDocumentType) => {
    if (!foundation) {
      throw new Error(UI_MESSAGES.FOUNDATIONS_NOT_FOUND);
    }

    const { blob } = await foundationsService.downloadDocument(foundation.id, type);
    return blob;
  };

  if (isLoading) {
    return <FoundationsLoadingSkeleton variant="profile" />;
  }

  if (!foundation || !checklist) {
    return (
      <Card glass={false} className="border border-border-default bg-white">
        <Alert variant="danger">{apiError || UI_MESSAGES.FOUNDATIONS_NOT_FOUND}</Alert>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">{UI_MESSAGES.FOUNDATIONS_PROFILE_TITLE}</h1>
          <p className="mt-2 text-text-secondary">{UI_MESSAGES.FOUNDATIONS_PROFILE_DESCRIPTION}</p>
        </div>
        <FoundationStatusBadge status={foundation.status} />
      </header>

      {gate === 'incomplete' && (
        <Alert variant="warning">{UI_MESSAGES.FOUNDATIONS_GATE_INCOMPLETE}</Alert>
      )}

      {gate === 'verification' && (
        <Alert variant="warning">{UI_MESSAGES.FOUNDATIONS_GATE_VERIFICATION}</Alert>
      )}

      {foundation.status === 'REJECTED' && foundation.rejectionReason && (
        <Alert variant="danger" title={UI_MESSAGES.FOUNDATIONS_REJECTION_REASON}>
          {foundation.rejectionReason}
        </Alert>
      )}

      <FoundationProfileChecklistCard checklist={checklist} status={foundation.status} />

      <Card glass={false} className="border border-border-default bg-white">
        <FoundationLogoUploader
          logoUrl={foundation.logoUrl}
          isUploading={isUploadingLogo}
          successMessage={feedback?.source === 'logo' ? feedback.message : undefined}
          onUpload={handleUploadLogo}
        />
      </Card>

      <Card glass={false} className="border border-border-default bg-white">
        <FoundationForm
          defaultValues={buildDefaultValues(foundation)}
          apiError={apiError}
          successMessage={feedback?.source === 'form' ? feedback.message : undefined}
          onSubmit={handleSubmit}
        />
      </Card>

      <Card glass={false} className="border border-border-default bg-white">
        <FoundationDocumentManager
          documents={foundation.documents}
          canManage
          isUploadingType={uploadingDocumentType}
          successMessage={feedback?.source === 'document' ? feedback.message : undefined}
          onUpload={handleUploadDocument}
          onDownload={handleDownloadDocument}
          fetchDocumentBlob={fetchDocumentBlob}
        />
      </Card>

      {foundation.observations.length > 0 && (
        <Card glass={false} className="border border-border-default bg-white">
          <FoundationObservationHistory observations={foundation.observations} />
        </Card>
      )}
    </div>
  );
}
