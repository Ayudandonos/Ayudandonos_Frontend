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
 * Entrada: url: texto de enlace.
 * Proceso: Agrega https:// si el usuario omite el protocolo.
 * Salida: Retorna URL normalizada o cadena vacia.
 */
function normalizeOptionalUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) {
    return '';
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
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

const optionalUrl = z.preprocess((value) => {
  if (value === '' || value === null || value === undefined) {
    return undefined;
  }
  if (typeof value === 'string') {
    const normalized = normalizeOptionalUrl(value);
    return normalized === '' ? undefined : normalized;
  }
  return emptyToUndefined(value);
}, z.string().trim().url(UI_MESSAGES.FOUNDATIONS_URL_INVALID).nullable().optional());

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

const socialNetworkEnum = z.enum([
  'FACEBOOK',
  'INSTAGRAM',
  'X',
  'LINKEDIN',
  'YOUTUBE',
  'TIKTOK',
  'OTHER',
]);

export const updateFoundationSchema = z
  .object({
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
    latitude: z.number().min(-90).max(90).nullable().optional(),
    longitude: z.number().min(-180).max(180).nullable().optional(),
    socialLinks: z.preprocess(
      (value) => {
        if (!Array.isArray(value)) {
          return [];
        }

        return value
          .map((item) => {
            if (!item || typeof item !== 'object') {
              return null;
            }
            const network = (item as { network?: unknown }).network;
            const rawUrl = (item as { url?: unknown }).url;
            if (typeof network !== 'string' || typeof rawUrl !== 'string') {
              return null;
            }
            const url = normalizeOptionalUrl(rawUrl);
            if (!url) {
              return null;
            }
            return { network, url };
          })
          .filter((item): item is { network: string; url: string } => item !== null);
      },
      z
        .array(
          z.object({
            network: socialNetworkEnum,
            url: z.string().trim().url(UI_MESSAGES.FOUNDATIONS_FORM_SOCIAL_URL_INVALID),
          }),
        )
        .max(10)
        .default([]),
    ),
  })
  .superRefine((data, ctx) => {
    const hasLat = data.latitude !== undefined && data.latitude !== null;
    const hasLng = data.longitude !== undefined && data.longitude !== null;
    if (hasLat !== hasLng) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: UI_MESSAGES.FOUNDATIONS_COORDS_INCOMPLETE,
        path: ['latitude'],
      });
    }
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

export { normalizeOptionalUrl };
