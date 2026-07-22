import { z } from 'zod';
import { UI_MESSAGES } from '@/constants/messages.constants';

/**
 * Entrada: value: valor crudo del formulario.
 * Proceso: Normaliza cadena vacia o null a undefined para validacion opcional.
 * Salida: Retorna el valor listo para el esquema Zod.
 */
function emptyToUndefined(value: unknown): unknown {
  if (value === '' || value === null) {
    return undefined;
  }
  return value;
}

/**
 * Entrada: min/max/message de validacion de texto requerido.
 * Proceso: Construye esquema de texto obligatorio con trim y longitudes.
 * Salida: Retorna el esquema Zod.
 */
const requiredText = (min: number, message: string, max?: number) => {
  let schema = z.string().trim().min(min, message);
  if (typeof max === 'number') {
    schema = schema.max(max, message);
  }
  return schema;
};

const optionalUrl = z.preprocess(
  emptyToUndefined,
  z
    .string()
    .trim()
    .url(UI_MESSAGES.FOUNDATIONS_URL_INVALID)
    .nullable()
    .optional(),
);

const optionalAcronym = z.preprocess(
  emptyToUndefined,
  z
    .string()
    .trim()
    .min(2, UI_MESSAGES.FOUNDATIONS_ACRONYM_MIN)
    .max(20, UI_MESSAGES.FOUNDATIONS_ACRONYM_MAX)
    .nullable()
    .optional(),
);

export const updateFoundationSchema = z.object({
  name: requiredText(2, UI_MESSAGES.FOUNDATIONS_NAME_MIN),
  acronym: optionalAcronym,
  nit: requiredText(5, UI_MESSAGES.FOUNDATIONS_NIT_MIN, 20),
  category: requiredText(2, UI_MESSAGES.FOUNDATIONS_CATEGORY_MIN),
  mission: requiredText(1, UI_MESSAGES.FOUNDATIONS_FIELD_REQUIRED, 1000),
  vision: requiredText(1, UI_MESSAGES.FOUNDATIONS_FIELD_REQUIRED, 1000),
  description: requiredText(1, UI_MESSAGES.FOUNDATIONS_FIELD_REQUIRED, 2000),
  city: requiredText(2, UI_MESSAGES.FOUNDATIONS_CITY_MIN),
  department: requiredText(2, UI_MESSAGES.FOUNDATIONS_DEPARTMENT_MIN),
  country: requiredText(2, UI_MESSAGES.FOUNDATIONS_COUNTRY_MIN),
  address: requiredText(5, UI_MESSAGES.FOUNDATIONS_ADDRESS_MIN),
  institutionalEmail: z.string().trim().email(UI_MESSAGES.VALIDATION_EMAIL),
  phone: requiredText(7, UI_MESSAGES.FOUNDATIONS_PHONE_MIN, 20),
  website: optionalUrl,
  legalRepresentativeName: requiredText(2, UI_MESSAGES.VALIDATION_FULL_NAME),
  legalRepresentativeDocument: requiredText(5, UI_MESSAGES.FOUNDATIONS_REPRESENTATIVE_DOCUMENT_MIN),
  socialLinks: z.preprocess(
    (value) => {
      if (!Array.isArray(value)) {
        return [];
      }
      return value.filter(
        (item) =>
          item &&
          typeof item === 'object' &&
          'url' in item &&
          typeof (item as { url: unknown }).url === 'string' &&
          (item as { url: string }).url.trim() !== '',
      );
    },
    z
      .array(
        z.object({
          network: z.enum(['FACEBOOK', 'INSTAGRAM', 'X', 'LINKEDIN', 'YOUTUBE', 'TIKTOK', 'OTHER']),
          url: z.string().trim().url(UI_MESSAGES.FOUNDATIONS_URL_INVALID),
        }),
      )
      .max(10),
  ),
});

export const updateFoundationStatusSchema = z
  .object({
    status: z.enum(['PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED']),
    rejectionReason: z.string().trim().max(1000).nullable().optional(),
    adminNotes: z.string().trim().max(2000).nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.status === 'REJECTED' && !data.rejectionReason?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: UI_MESSAGES.FOUNDATIONS_REJECTION_REASON_REQUIRED,
        path: ['rejectionReason'],
      });
    }
  });

export type UpdateFoundationFormData = z.infer<typeof updateFoundationSchema>;
export type UpdateFoundationStatusFormData = z.infer<typeof updateFoundationStatusSchema>;
