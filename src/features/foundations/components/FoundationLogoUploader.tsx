import { useRef, useState } from 'react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { AppImage } from '@/components/ui/AppImage';
import { UI_MESSAGES } from '@/constants/messages.constants';

interface FoundationLogoUploaderProps {
  logoUrl: string | null;
  isUploading?: boolean;
  successMessage?: string;
  onUpload: (file: File) => Promise<void>;
}

/**
 * Entrada: logoUrl, isUploading, successMessage y onUpload.
 * Proceso: Permite previsualizar/subir logo y aclara que no guarda el formulario.
 * Salida: Retorna el elemento JSX del uploader de logo.
 */
export function FoundationLogoUploader({
  logoUrl,
  isUploading = false,
  successMessage,
  onUpload,
}: FoundationLogoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  /**
   * Entrada: event: cambio del input file con imagen de logo.
   * Proceso: Genera preview local y delega la subida al callback onUpload.
   * Salida: No retorna valor; actualiza preview y limpia el input.
   */
  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));

    try {
      await onUpload(file);
    } finally {
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const displayUrl = previewUrl ?? logoUrl;

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-semibold text-text-primary">
          {UI_MESSAGES.FOUNDATIONS_SECTION_LOGO}
          <span className="ms-2 text-xs font-normal text-text-muted">
            ({UI_MESSAGES.FOUNDATIONS_BADGE_OPTIONAL})
          </span>
        </p>
        <p className="mt-1 text-sm text-text-secondary">{UI_MESSAGES.FOUNDATIONS_LOGO_HINT}</p>
      </div>

      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <div className="flex items-center gap-4">
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl border border-border-default bg-vivid-50">
          {displayUrl ? (
            <AppImage src={displayUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs text-text-muted">{UI_MESSAGES.FOUNDATIONS_LOGO_PLACEHOLDER}</span>
          )}
        </div>
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(event) => void handleChange(event)}
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            isLoading={isUploading}
            onClick={() => inputRef.current?.click()}
          >
            {UI_MESSAGES.FOUNDATIONS_UPLOAD_LOGO}
          </Button>
        </div>
      </div>
    </div>
  );
}
