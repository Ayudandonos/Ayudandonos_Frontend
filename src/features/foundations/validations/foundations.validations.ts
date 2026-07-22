import { z } from 'zod';
import { UI_MESSAGES } from '@/constants/messages.constants';

/**
 * Entrada: max: longitud maxima permitida; message: mensaje de error de validacion.
 * Proceso: Construye esquema Zod de texto opcional nullable con limite de caracteres.
 * Salida: Retorna el esquema Zod configurado.
 */
const optionalNullableText = (max: number, message: string) =>
  z.string().trim().max(max, message).nullable().optional();

const optionalUrl = z
  .union([z.literal(''), z.string().trim().url(UI_MESSAGES.FOUNDATIONS_URL_INVALID)])
  .transform((value) => (value === '' ? null : value))
  .nullable()
  .optional();

const optionalAcronym = z
  .union([
    z.literal(''),
    z.string().trim().min(2, UI_MESSAGES.FOUNDATIONS_ACRONYM_MIN).max(20, UI_MESSAGES.FOUNDATIONS_ACRONYM_MAX),
  ])
  .transform((value) => (value === '' ? null : value))
  .nullable()
  .optional();

export const updateFoundationSchema = z.object({
  name: z.string().trim().min(2, UI_MESSAGES.FOUNDATIONS_NAME_MIN).optional(),
  acronym: optionalAcronym,
  nit: z.string().trim().min(5, UI_MESSAGES.FOUNDATIONS_NIT_MIN).max(20, UI_MESSAGES.FOUNDATIONS_NIT_MAX).optional(),
  category: z.string().trim().min(2, UI_MESSAGES.FOUNDATIONS_CATEGORY_MIN).optional(),
  mission: optionalNullableText(1000, UI_MESSAGES.FOUNDATIONS_MISSION_MAX),
  vision: optionalNullableText(1000, UI_MESSAGES.FOUNDATIONS_VISION_MAX),
  description: optionalNullableText(2000, UI_MESSAGES.FOUNDATIONS_DESCRIPTION_MAX),
  city: z.string().trim().min(2, UI_MESSAGES.FOUNDATIONS_CITY_MIN).optional(),
  department: z.string().trim().min(2, UI_MESSAGES.FOUNDATIONS_DEPARTMENT_MIN).optional(),
  country: z.string().trim().min(2, UI_MESSAGES.FOUNDATIONS_COUNTRY_MIN).optional(),
  address: z.string().trim().min(5, UI_MESSAGES.FOUNDATIONS_ADDRESS_MIN).optional(),
  institutionalEmail: z.string().trim().email(UI_MESSAGES.VALIDATION_EMAIL).optional(),
  phone: z
    .string()
    .trim()
    .min(7, UI_MESSAGES.FOUNDATIONS_PHONE_MIN)
    .max(20, UI_MESSAGES.FOUNDATIONS_PHONE_MAX)
    .optional(),
  website: optionalUrl,
  legalRepresentativeName: z.string().trim().min(2, UI_MESSAGES.VALIDATION_FULL_NAME).optional(),
  legalRepresentativeDocument: z
    .string()
    .trim()
    .min(5, UI_MESSAGES.FOUNDATIONS_REPRESENTATIVE_DOCUMENT_MIN)
    .optional(),
  socialLinks: z
    .array(
      z.object({
        network: z.enum(['FACEBOOK', 'INSTAGRAM', 'X', 'LINKEDIN', 'YOUTUBE', 'TIKTOK', 'OTHER']),
        url: z.string().trim().url(UI_MESSAGES.FOUNDATIONS_URL_INVALID),
      }),
    )
    .max(10)
    .optional(),
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
