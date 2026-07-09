import { UI_MESSAGES } from '@/constants/messages.constants';
import { LegalPageLayout, LegalSection } from '@/features/legal/components/LegalPageLayout';

// Entrada:
// Ninguna.

// Proceso:
// Renderiza pagina de terminos de servicio de Ayudandonos.

// Salida:
// Retorna el elemento JSX de la pagina de terminos.
export function TermsOfServicePage() {
  return (
    <LegalPageLayout
      title={UI_MESSAGES.LEGAL_TERMS_TITLE}
      subtitle={UI_MESSAGES.LEGAL_TERMS_SUBTITLE}
    >
      {UI_MESSAGES.LEGAL_TERMS_SECTIONS.map((section) => (
        <LegalSection key={section.title} title={section.title} paragraphs={section.paragraphs} />
      ))}
    </LegalPageLayout>
  );
}
