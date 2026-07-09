import { UI_MESSAGES } from '@/constants/messages.constants';
import { LegalPageLayout, LegalSection } from '@/features/legal/components/LegalPageLayout';

// Entrada:
// Ninguna.

// Proceso:
// Renderiza pagina informativa sobre seguridad y verificacion de la plataforma.

// Salida:
// Retorna el elemento JSX de la pagina de plataforma segura.
export function SecurePlatformPage() {
  return (
    <LegalPageLayout
      title={UI_MESSAGES.LEGAL_SECURE_TITLE}
      subtitle={UI_MESSAGES.LEGAL_SECURE_SUBTITLE}
    >
      {UI_MESSAGES.LEGAL_SECURE_SECTIONS.map((section) => (
        <LegalSection key={section.title} title={section.title} paragraphs={section.paragraphs} />
      ))}
    </LegalPageLayout>
  );
}
