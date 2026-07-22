import { buttonLinkClass } from '@/components/ui/button-link-class';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { UI_MESSAGES } from '@/constants/messages.constants';
import type { FoundationProfileChecklist } from '@/features/foundations/utils/foundation-profile-checklist';
import { cn } from '@/utils/cn';

interface FoundationProfileChecklistCardProps {
  checklist: FoundationProfileChecklist;
  status: string;
}

/**
 * Entrada: checklist: progreso calculado; status: estado de la fundacion.
 * Proceso: Muestra guia de onboarding con pasos clicables y pendientes como chips, sin alertas de error.
 * Salida: Retorna el bloque JSX de guia UX del perfil.
 */
export function FoundationProfileChecklistCard({
  checklist,
  status,
}: FoundationProfileChecklistCardProps) {
  const steps = [
    {
      id: 'data',
      label: UI_MESSAGES.FOUNDATIONS_CHECKLIST_STEP_DATA,
      done: checklist.isProfileComplete,
      href: '#foundation-profile-form',
    },
    {
      id: 'docs',
      label: UI_MESSAGES.FOUNDATIONS_CHECKLIST_STEP_DOCS,
      done: checklist.hasRequiredDocuments,
      href: '#foundation-profile-documents',
    },
    {
      id: 'review',
      label: UI_MESSAGES.FOUNDATIONS_CHECKLIST_STEP_REVIEW,
      done: status === 'VERIFIED',
      href: undefined,
    },
  ];

  const statusAlert =
    checklist.nextStep === 'verified' ||
    checklist.nextStep === 'rejected' ||
    checklist.nextStep === 'wait' ? (
      <div
        className={cn(
          'rounded-xl border p-4',
          checklist.nextStep === 'verified'
            ? 'border-success-500/20 bg-success-500/5'
            : 'border-primary-100 bg-primary-50/60',
        )}
      >
        <p
          className={cn(
            'text-sm font-medium',
            checklist.nextStep === 'verified' ? 'text-success-600' : 'text-primary-800',
          )}
        >
          {UI_MESSAGES.FOUNDATIONS_CHECKLIST_WELCOME_TITLE}
        </p>
        <p
          className={cn(
            'mt-1 text-sm',
            checklist.nextStep === 'verified' ? 'text-success-600/90' : 'text-primary-700/90',
          )}
        >
          {checklist.nextStepMessage}
        </p>
      </div>
    ) : null;

  return (
    <Card glass={false} className="space-y-5 border border-border-default bg-white">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">
          {UI_MESSAGES.FOUNDATIONS_CHECKLIST_TITLE}
        </h2>
        <p className="mt-1 text-sm text-text-secondary">{UI_MESSAGES.FOUNDATIONS_CHECKLIST_INTRO}</p>
      </div>

      <ProgressBar
        value={checklist.progressValue}
        max={checklist.progressMax}
        label={`${checklist.progressValue}/${checklist.progressMax}`}
      />

      <ol className="grid gap-3 sm:grid-cols-3">
        {steps.map((step, index) => {
          const content = (
            <>
              <span
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold',
                  step.done
                    ? 'bg-success-500/15 text-success-600'
                    : 'bg-primary-100 text-primary-700',
                )}
              >
                {index + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-text-primary">{step.label}</span>
                <span className="text-xs text-text-secondary">
                  {step.done
                    ? UI_MESSAGES.FOUNDATIONS_CHECKLIST_DONE
                    : UI_MESSAGES.FOUNDATIONS_CHECKLIST_PENDING}
                </span>
              </span>
            </>
          );

          return (
            <li key={step.id}>
              {step.href ? (
                <a
                  href={step.href}
                  className={cn(
                    'flex items-start gap-3 rounded-xl border p-3 transition-smooth',
                    step.done
                      ? 'border-success-500/20 bg-success-500/5'
                      : 'border-border-default hover:border-primary-300 hover:bg-primary-50/50',
                  )}
                >
                  {content}
                </a>
              ) : (
                <div
                  className={cn(
                    'flex items-start gap-3 rounded-xl border p-3',
                    step.done
                      ? 'border-success-500/20 bg-success-500/5'
                      : 'border-border-default bg-vivid-50/40',
                  )}
                >
                  {content}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {statusAlert}

      {(checklist.nextStep === 'save' || checklist.nextStep === 'documents') && (
        <div className="rounded-xl border border-primary-100 bg-primary-50/60 p-4">
          <p className="text-sm font-medium text-primary-800">
            {UI_MESSAGES.FOUNDATIONS_CHECKLIST_WELCOME_TITLE}
          </p>
          <p className="mt-1 text-sm text-primary-700/90">{checklist.nextStepMessage}</p>

          {checklist.missingFields.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary-700">
                {UI_MESSAGES.FOUNDATIONS_CHECKLIST_PENDING_FIELDS}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {checklist.missingFields.map((field) => (
                  <a
                    key={field}
                    href="#foundation-profile-form"
                    className="rounded-full border border-primary-200 bg-white px-3 py-1 text-xs font-medium text-primary-700 transition-smooth hover:border-primary-400 hover:bg-primary-50"
                  >
                    {field}
                  </a>
                ))}
              </div>
              <a
                href="#foundation-profile-form"
                className={cn(buttonLinkClass({ variant: 'primary', size: 'sm' }), 'mt-3')}
              >
                {UI_MESSAGES.FOUNDATIONS_CHECKLIST_GO_TO_FORM}
              </a>
            </div>
          )}

          {checklist.isProfileComplete && checklist.missingDocuments.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary-700">
                {UI_MESSAGES.FOUNDATIONS_CHECKLIST_PENDING_DOCS}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {checklist.missingDocuments.map((document) => (
                  <a
                    key={document}
                    href="#foundation-profile-documents"
                    className="rounded-full border border-primary-200 bg-white px-3 py-1 text-xs font-medium text-primary-700 transition-smooth hover:border-primary-400 hover:bg-primary-50"
                  >
                    {document}
                  </a>
                ))}
              </div>
              <a
                href="#foundation-profile-documents"
                className={cn(buttonLinkClass({ variant: 'primary', size: 'sm' }), 'mt-3')}
              >
                {UI_MESSAGES.FOUNDATIONS_CHECKLIST_GO_TO_DOCS}
              </a>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
