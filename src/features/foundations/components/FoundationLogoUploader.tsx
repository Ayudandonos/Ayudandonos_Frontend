import { useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { AppImage } from '@/components/ui/AppImage';
import { UI_MESSAGES } from '@/constants/messages.constants';

interface FoundationLogoUploaderProps {
  logoUrl: string | null;
  isUploading?: boolean;
  onUpload: (file: File) => Promise<void>;
}

/**
 * Entrada: logoUrl: URL actual; isUploading: estado de carga; onUpload: callback async.
 * Proceso: Permite previsualizar y reemplazar el logo de la fundacion.
 * Salida: Retorna el elemento JSX del uploader de logo.
 */
export function FoundationLogoUploader({
  logoUrl,
  isUploading = false,
  onUpload,
}: FoundationLogoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
      <p className="text-sm font-semibold text-text-primary">{UI_MESSAGES.FOUNDATIONS_SECTION_LOGO}</p>
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
