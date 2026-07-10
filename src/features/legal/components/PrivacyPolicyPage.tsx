import { UI_MESSAGES } from '@/constants/messages.constants';
import { LegalPageLayout, LegalSection } from '@/features/legal/components/LegalPageLayout';

/**
 * Entrada: Ninguna.
 * Proceso: Renderiza pagina de politica de privacidad de Ayudandonos.
 * Salida: Retorna el elemento JSX de la pagina de privacidad.
 */
export function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title={UI_MESSAGES.LEGAL_PRIVACY_TITLE}
      subtitle={UI_MESSAGES.LEGAL_PRIVACY_SUBTITLE}
    >
      {UI_MESSAGES.LEGAL_PRIVACY_SECTIONS.map((section) => (
        <LegalSection key={section.title} title={section.title} paragraphs={section.paragraphs} />
      ))}
    </LegalPageLayout>
  );
}
