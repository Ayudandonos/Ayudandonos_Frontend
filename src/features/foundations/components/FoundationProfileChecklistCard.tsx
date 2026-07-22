import { Alert } from '@/components/ui/Alert';
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
 * Proceso: Renderiza pasos, barra de progreso, faltantes y siguiente accion clara.
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

  const alertVariant =
    checklist.nextStep === 'verified'
      ? 'success'
      : checklist.nextStep === 'rejected'
        ? 'danger'
        : checklist.nextStep === 'wait'
          ? 'info'
          : 'warning';

  return (
    <Card glass={false} className="border border-border-default bg-white space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">
          {UI_MESSAGES.FOUNDATIONS_CHECKLIST_TITLE}
        </h2>
        <p className="mt-1 text-sm text-text-secondary">{UI_MESSAGES.FOUNDATIONS_CHECKLIST_INTRO}</p>
      </div>

      <ProgressBar
        value={checklist.completedSteps}
        max={checklist.totalSteps}
        label={`${checklist.completedSteps}/${checklist.totalSteps}`}
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
                    : 'bg-secondary-100 text-text-secondary',
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
                  className="flex items-start gap-3 rounded-lg border border-border-default p-3 transition-smooth hover:border-primary-300 hover:bg-primary-50/40"
                >
                  {content}
                </a>
              ) : (
                <div className="flex items-start gap-3 rounded-lg border border-border-default p-3">
                  {content}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <Alert variant={alertVariant} title={UI_MESSAGES.FOUNDATIONS_CHECKLIST_TITLE}>
        {checklist.nextStepMessage}
      </Alert>

      {checklist.missingFields.length > 0 && (
        <Alert
          variant="warning"
          title={UI_MESSAGES.FOUNDATIONS_CHECKLIST_MISSING_FIELDS}
          items={checklist.missingFields}
        />
      )}

      {checklist.missingDocuments.length > 0 && (
        <Alert
          variant="warning"
          title={UI_MESSAGES.FOUNDATIONS_CHECKLIST_MISSING_DOCS}
          items={checklist.missingDocuments}
        />
      )}
    </Card>
  );
}
